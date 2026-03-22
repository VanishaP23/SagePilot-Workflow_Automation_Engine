from temporalio import activity
from typing import Dict, Any
import httpx

@activity.defn
async def execute_http_request(config: Dict[str, Any]) -> Dict[str, Any]:
    url = config.get("url")
    method = config.get("method", "GET").upper()
    headers = config.get("headers", {})
    body = config.get("body")
    
    async with httpx.AsyncClient() as client:
        if method == "GET":
            response = await client.get(url, headers=headers)
        elif method == "POST":
            response = await client.post(url, headers=headers, json=body)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        return {
            "status": response.status_code,
            "body": response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text,
            "headers": dict(response.headers)
        }

@activity.defn
async def execute_transform(config: Dict[str, Any], payload: Dict[str, Any]) -> Dict[str, Any]:
    transformation_type = config.get("transformation_type")
    target_field = config.get("target_field")
    params = config.get("parameters", {})
    
    result = payload.copy()
    
    if transformation_type == "to_uppercase":
        if target_field in result:
            result[target_field] = str(result[target_field]).upper()
    elif transformation_type == "append_text":
        text = params.get("text", "")
        if target_field in result:
            result[target_field] = str(result[target_field]) + text
    elif transformation_type == "prepend_text":
        text = params.get("text", "")
        if target_field in result:
            result[target_field] = text + str(result[target_field])
    elif transformation_type == "multiply":
        factor = params.get("factor", 1)
        if target_field in result:
            result[target_field] = float(result[target_field]) * factor
    elif transformation_type == "rename_key":
        new_key = params.get("new_key")
        if target_field in result and new_key:
            result[new_key] = result.pop(target_field)
    
    return result

@activity.defn
async def execute_decision(config: Dict[str, Any], payload: Dict[str, Any]) -> Dict[str, bool]:
    target_field = config.get("target_field")
    operator = config.get("operator")
    value = config.get("value")
    
    field_value = payload.get(target_field)
    condition_met = False
    
    if operator == "equals":
        condition_met = str(field_value) == str(value)
    elif operator == "not_equals":
        condition_met = str(field_value) != str(value)
    elif operator == "greater_than":
        condition_met = float(field_value) > float(value)
    elif operator == "less_than":
        condition_met = float(field_value) < float(value)
    elif operator == "contains":
        condition_met = str(value) in str(field_value)
    elif operator == "is_empty":
        condition_met = field_value is None or field_value == "" or field_value == {}
    
    return {
        "condition_met": condition_met,
        "field": target_field,
        "operator": operator,
        "value": value,
        "actual_value": field_value
    }

@activity.defn
async def execute_end(final_payload: Dict[str, Any]) -> None:
    print(f"Workflow completed with payload: {final_payload}")
