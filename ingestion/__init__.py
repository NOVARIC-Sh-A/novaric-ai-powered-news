"""
NOVARIC® Ingestion Workers Module
"""

from ingestion.base import BaseWorker, IngestionResult, IngestionContext
from ingestion.identity_resolution import (
    IdentityResolver,
    generate_stable_numeric_id,
    normalize_albanian_text,
    compute_similarity
)
from ingestion.kuvendi_odata import KuvendiODataWorker, parse_kuvendi_mp
from ingestion.kuvendi_transcripts import (
    KuvendiTranscriptsWorker,
    tag_albanian_topics,
    compute_albanian_sentiment,
    parse_transcript_speeches
)
from ingestion.ildkpki import IldkpkiWorker, parse_asset_declaration_payload, check_filing_deadline
from ingestion.kqz import KqzWorker, parse_candidate_cv
from ingestion.oda_worker import OdaWorker, evaluate_contract_link
from ingestion.rss_worker import RssWorker, parse_media_article, hash_url
