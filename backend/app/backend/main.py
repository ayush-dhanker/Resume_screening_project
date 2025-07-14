import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
import spacy
from transformers import BertTokenizer, BertModel
import torch
import PyPDF2
import docx
import re
from sklearn.metrics.pairwise import cosine_similarity
from resumeClass import ResumeProcessor
from resumeScoring import ResumeScorer
from responseGenration import reportGenerator


def evaluate_resume(resume_path, job_description):
    processor = ResumeProcessor()
    scorer = ResumeScorer(job_description)
    report_generator = reportGenerator()

    try:
        resume_content = processor.text_extract(resume_path)
        features = processor.feature_extract(resume_content)
        scores = scorer.calculate_scores(features, resume_content)

        candidate = {
            "name": os.path.basename(resume_path),
            "file": resume_path,
            **scores,
            "job_desc": job_description
        }

        if scores["total_score"] >= 0.7:
            return {
                "status": "accepted",
                "scores": {
                    "total": scores["total_score"],
                    "skills": scores["skill_score"],
                    "education": scores["edu_score"],
                    "experience": scores["exp_score"]
                }
            }
        else:
            feedback = report_generator.generate_rejection_feedback(
                candidate,
                min_accept_score=0.7
            )
            return {
                "status": "rejected",
                "feedback": feedback,
                "missing_skills": list(set(job_description["required_skills"]) -
                                       set(features["skills"]))
            }

    except Exception as e:
        return {
            "status": "error",
            "message": f"Processing failed: {str(e)}"
        }
