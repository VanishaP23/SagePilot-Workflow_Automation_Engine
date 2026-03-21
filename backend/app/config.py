import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SUPABASE_URL = os.getenv("SUPABASE_URL", "https://wglojqkqycsibloronjx.supabase.co")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_secret_p6saOleMdmVvjele_UGr2g_hOaNUsZK")
    TEMPORAL_HOST = os.getenv("TEMPORAL_HOST", "quickstart-pathakvan-4da80dcc.pj6yk.tmprl.cloud:7233")
    TEMPORAL_NAMESPACE = os.getenv("TEMPORAL_NAMESPACE", "quickstart-pathakvan-4da80dcc")
    TEMPORAL_API_KEY = os.getenv("TEMPORAL_API_KEY", "eyJhbGciOiJFUzI1NiIsImtpZCI6Ild2dHdhQSJ9.eyJhY2NvdW50X2lkIjoicGo2eWsiLCJhdWQiOlsidGVtcG9yYWwuaW8iXSwiZXhwIjoxNzg0NDgyMDM1LCJpc3MiOiJ0ZW1wb3JhbC5pbyIsImp0aSI6Imc3NHNYRzU4NDhSajJnT1NhbGFsaGNlakpwdEVvOU90Iiwia2V5X2lkIjoiZzc0c1hHNTg0OFJqMmdPU2FsYWxoY2VqSnB0RW85T3QiLCJzdWIiOiIxNmYxNTY4NDlhZjY0ODMwOTBkMGI2ZjU1ODQ2ZTA5OCJ9.lFWPWqrNnfY2pdV3-92VK0kBP6Zx9HBV4HJBdXDYaTAyhzIaPY-GFk46WRs8jvhurwIzokJVOSPBBvsYV2P7rA")
    APP_NAME = "SagePilot Workflow Engine"
    DEBUG = True

settings = Settings()
