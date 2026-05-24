import os
from pathlib import Path
from dotenv import load_dotenv

# Automatically load environment variables from parent project root or current working directory
load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")
load_dotenv()

from .main import process_voice_session
from .program_planner import ProgramPlanner
from .coaching_engine import CoachingEngine

__all__ = [
    "CoachingEngine",
    "ProgramPlanner",
    "process_voice_session",
]
