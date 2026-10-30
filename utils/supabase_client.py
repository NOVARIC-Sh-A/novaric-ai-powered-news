import os
import logging
from typing import Dict, Any, List, Optional, Union
try:
    from supabase import create_client, Client
except ImportError:
    create_client = None
    Client = Any

logger = logging.getLogger("novaric.supabase")

# Configuration via Service Role Key (Option A: Backend Only)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def init_supabase_client() -> Optional[Any]:
    if not create_client or not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        if not create_client:
            logger.debug("supabase-py not installed; operating in local/offline mode.")
        else:
            logger.error("Supabase Admin configuration missing. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.")
        return None
    try:
        return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    except Exception as e:
        logger.error(f"Failed to initialize Supabase Admin Client: {str(e)}")
        return None

# Authoritative Client Instance
supabase: Optional[Any] = init_supabase_client()

def _get(table: str, row_id: Union[str, int], id_col: str = "id") -> Optional[Dict[str, Any]]:
    """Safe read for single records using maybe_single()."""
    if not supabase:
        return None
    try:
        res = supabase.table(table).select("*").eq(id_col, row_id).maybe_single().execute()
        return res.data
    except Exception as e:
        logger.warning(f"Supabase safe GET failed on {table} for {row_id}: {str(e)}")
        return None

def _patch(table: str, row_id: Union[str, int], data: Dict[str, Any], id_col: str = "id"):
    """Safe update helper."""
    if not supabase:
        return
    try:
        supabase.table(table).update(data).eq(id_col, row_id).execute()
    except Exception as e:
        logger.error(f"Supabase PATCH failed on {table} for {row_id}: {str(e)}")

def supabase_upsert(table: str, data: Dict[str, Any], on_conflict: str = "id"):
    """
    Authoritative upsert for ETL and services.
    Enforces mirroring rule for paragon_scores table.
    """
    if not supabase:
        return
    try:
        # Strict Mirroring Rule for paragon_scores
        if table == "paragon_scores":
            if "dimension_scores" in data and "dimensions_json" not in data:
                data["dimensions_json"] = data["dimension_scores"]
            elif "dimensions_json" in data and "dimension_scores" not in data:
                data["dimension_scores"] = data["dimensions_json"]

        supabase.table(table).upsert(data, on_conflict=on_conflict).execute()
    except Exception as e:
        logger.error(f"Supabase UPSERT failed on {table}: {str(e)}")
