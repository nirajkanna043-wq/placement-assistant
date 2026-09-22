"""
Minimal AI/LLM layer for the Placement Preparation Assistant.

This is the backend piece referenced by the execution plan's Phase 2
architecture ("Backend API: Business logic and skill-gap engine" +
"AI/LLM layer: Personalized plans, explanations, and resource curation")
and Phase 5 ("Integrate LLM for plan generation").

The frontend's src/utils/llmClient.js calls POST /api/generate-plan on
this server. The skill-gap math itself stays in the frontend
(src/utils/skillGapEngine.js) so it's easy to demo without a backend
running; this service is only responsible for turning a structured plan
into natural-language coaching copy, and could later host the skill-gap
logic too once you move to a real database (see README "Next steps").

Run:
    pip install -r requirements.txt
    export ANTHROPIC_API_KEY=sk-ant-...
    uvicorn main:app --reload --port 8000
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic

app = FastAPI(title="Placement Assistant AI Layer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your deployed frontend origin in production
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))


class PlanItem(BaseModel):
    skill: str
    status: str
    explanation: str


class Week(BaseModel):
    week: int
    items: list[PlanItem]


class GeneratePlanRequest(BaseModel):
    studentName: str
    role: str
    plan: list[Week]


@app.post("/api/generate-plan")
def generate_plan(req: GeneratePlanRequest):
    plan_summary = "\n".join(
        f"Week {w.week}: " + ", ".join(f"{i.skill} ({i.status})" for i in w.items)
        for w in req.plan
    )

    prompt = f"""You are a supportive placement-prep coach. A student named
{req.studentName or "the student"} is preparing for a {req.role} role.
Their rule-based skill-gap plan is:

{plan_summary}

Write a short, encouraging weekly roadmap (under 180 words) in plain
language. Reference the weeks and skills above, explain briefly why the
early weeks matter most, and end with one motivating sentence. Do not
invent skills that aren't listed."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=400,
        messages=[{"role": "user", "content": prompt}],
    )

    narrative = "".join(block.text for block in message.content if block.type == "text")
    return {"narrative": narrative}


@app.get("/health")
def health():
    return {"status": "ok"}
