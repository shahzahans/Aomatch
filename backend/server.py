from fastapi import FastAPI, APIRouter, UploadFile, File
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


@api_router.get("/")
async def root():
    return {"message": "AoMatch backend is running"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check["timestamp"], str):
            check["timestamp"] = datetime.fromisoformat(check["timestamp"])
    return status_checks


def get_mock_grant_fields():
    return [
        {
            "id": "grant_title",
            "fieldLabel": "GRANT TITLE",
            "extractedValue": "GENERAL TERMS AND CONDITIONS FOR DOE SBIR AND STTR PHASE I AND PHASE II GRANTS",
            "sourceSentence": "GENERAL TERMS AND CONDITIONS FOR DOE SBIR AND STTR PHASE I AND PHASE II GRANTS",
            "matchedText": "GENERAL TERMS AND CONDITIONS FOR DOE SBIR AND STTR PHASE I AND PHASE II GRANTS",
            "page": 1,
            "confidence": 0.98,
        },
        {
            "id": "grantor_name",
            "fieldLabel": "GRANTOR NAME",
            "extractedValue": "U.S. Department of Energy",
            "sourceSentence": "U.S. Department of Energy",
            "matchedText": "U.S. Department of Energy",
            "page": 1,
            "confidence": 0.96,
        },
        {
            "id": "audit_threshold",
            "fieldLabel": "AUDIT THRESHOLD",
            "extractedValue": "$750,000.00",
            "sourceSentence": "Recipients that expend $750,000.00 or more in a year under DOE awards are subject to the audit requirements.",
            "matchedText": "$750,000.00",
            "page": 2,
            "confidence": 0.95,
        },
        {
            "id": "pre_award_cost_window",
            "fieldLabel": "PRE-AWARD COST WINDOW",
            "extractedValue": "90 calendar days",
            "sourceSentence": "Recipients may incur pre-award costs up to ninety (90) calendar days prior to the effective date of an award.",
            "matchedText": "ninety (90) calendar days",
            "page": 2,
            "confidence": 0.94,
        },
        {
            "id": "extension_notice_window",
            "fieldLabel": "EXTENSION NOTICE WINDOW",
            "extractedValue": "10 calendar days",
            "sourceSentence": "Recipient requests for extensions of time on the grant must be submitted for approval at least ten (10) calendar days prior.",
            "matchedText": "ten (10) calendar days",
            "page": 2,
            "confidence": 0.93,
        },
        {
            "id": "phase_i_threshold",
            "fieldLabel": "PHASE I THRESHOLD",
            "extractedValue": "$250,000.00",
            "sourceSentence": "If this award is less than or equal to $250,000.00, then this is a fixed amount award.",
            "matchedText": "$250,000.00",
            "page": 13,
            "confidence": 0.95,
        },
        {
            "id": "fast_track_timing",
            "fieldLabel": "FAST-TRACK TIMING",
            "extractedValue": "60 days prior to end of Phase I",
            "sourceSentence": "Recipient submitting a continuation application 60 days prior to the end of Phase I may be eligible for expedited review.",
            "matchedText": "60 days prior",
            "page": 13,
            "confidence": 0.92,
        },
        {
            "id": "document_type",
            "fieldLabel": "DOCUMENT TYPE",
            "extractedValue": "Terms / Compliance Document",
            "sourceSentence": "This PDF looks like a terms/compliance document, not a normal grant notice.",
            "matchedText": "terms/compliance document",
            "page": 1,
            "confidence": 0.97,
        },
    ]


def get_mock_invoice_fields():
    return [
        {
            "id": "total_amount",
            "fieldLabel": "TOTAL AMOUNT",
            "extractedValue": "$12,450.00",
            "sourceSentence": "Total Amount Due: $12,450.00 must be paid by December 31, 2026",
            "matchedText": "$12,450.00",
            "page": 2,
            "confidence": 0.95,
        },
        {
            "id": "invoice_date",
            "fieldLabel": "INVOICE DATE",
            "extractedValue": "2026-03-15",
            "sourceSentence": "Invoice Date: March 15, 2026",
            "matchedText": "March 15, 2026",
            "page": 1,
            "confidence": 0.93,
        },
        {
            "id": "customer_name",
            "fieldLabel": "CUSTOMER NAME",
            "extractedValue": "Acme Corporation",
            "sourceSentence": "Bill To: Acme Corporation, 123 Business Ave, San Francisco, CA 94102",
            "matchedText": "Acme Corporation",
            "page": 1,
            "confidence": 0.94,
        },
    ]


@api_router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    filename = file.filename or "uploaded_document.pdf"
    content = await file.read()
    file_size = len(content)

    name_lower = filename.lower()
    is_grant = any(
        k in name_lower
        for k in ["grant", "doe", "sbir", "sttr", "terms", "compliance", "award"]
    )

    mode = "grant" if is_grant else "invoice"
    fields = get_mock_grant_fields() if is_grant else get_mock_invoice_fields()

    return {
        "fileName": filename,
        "fileSizeBytes": file_size,
        "status": "processed",
        "mode": mode,
        "fieldsExtracted": len(fields),
        "avgConfidence": round(sum(f["confidence"] for f in fields) / len(fields) * 100),
        "message": f"Document '{filename}' processed successfully.",
        "fields": fields,
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()