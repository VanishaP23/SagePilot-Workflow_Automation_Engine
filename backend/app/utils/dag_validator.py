from collections import defaultdict, deque


def validate_dag(nodes: list, edges: list) -> tuple[bool, str]:
    """
    Kahn's algorithm for cycle detection using topological sort.
    Returns (is_valid, error_message)
    """
    if not nodes:
        return True, ""

    node_ids = {node.get("id") for node in nodes}
    
    graph = defaultdict(list)
    in_degree = defaultdict(int)
    
    for node_id in node_ids:
        in_degree[node_id] = 0
    
    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")
        
        if source in node_ids and target in node_ids:
            graph[source].append(target)
            in_degree[target] += 1
    
    queue = deque([n for n in node_ids if in_degree[n] == 0])
    count = 0
    
    while queue:
        node = queue.popleft()
        count += 1
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    if count != len(node_ids):
        return False, "Cycle detected in workflow"
    
    return True, ""
