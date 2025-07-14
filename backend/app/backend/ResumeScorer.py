

from transformers import BertTokenizer, BertModel
import torch
import PyPDF2
import docx
import re
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from backend.ResumeProcessor import ResumeProcessor


class ResumeScorer:
    def __init__(self, job_description):
        self.job_desc = job_description
        self.processor = ResumeProcessor()

        self.job_desc_embedding = self.processor.get_embedding(
            job_description["text"]
        )

    def calculate_scores(self, resume_features, resume_text):
        skill_score = self.calc_skill(resume_features["skills"])
        edu_score = self.calc_edu(resume_features["education"])
        exp_score = self.exp_marks(resume_text)

        total_score = (0.5 * skill_score) + \
            (0.2 * edu_score) + (0.3 * exp_score)

        return {
            "total_score": total_score,
            "skill_score": skill_score,
            "edu_score": edu_score,
            "exp_score": exp_score,
            "matched_skills": resume_features["skills"]
        }

    def calc_skill(self, candidate_skills):
        required_skills = set(skill.lower()
                              for skill in self.job_desc["required_skills"])
        candidate_skills = set(skill.lower() for skill in candidate_skills)

        required_expanded = self.processor.transferable_work(required_skills)
        candidate_expanded = self.processor.transferable_work(candidate_skills)

        matches = required_skills.intersection(candidate_skills)
        transferable_matches = set(required_expanded).intersection(
            set(candidate_expanded)) - matches

        score = len(matches)

        score += 0.5 * len(transferable_matches)

        if len(required_skills) > 0:
            score = score / len(required_skills)

        return min(score, 1.0)

    def calc_skill(self, candidate_skills):

        required = set(skill.lower()
                       for skill in self.job_desc.get("required_skills", []))
        candidate = set(skill.lower() for skill in candidate_skills)

        expanded_required = self.processor.transferable_work(required)
        expanded_candidate = self.processor.transferable_work(candidate)

        exact_matches = required & candidate

        fuzzy_matches = (set(expanded_required) & set(
            expanded_candidate)) - exact_matches


        match_score = len(exact_matches) + 0.5 * len(fuzzy_matches)

        if required:
            match_score /= len(required)

        return round(min(match_score, 1.0), 3)

    def exp_marks(self, experience_sections):
        if not experience_sections:
            return 0

        embeddings = []
        for section in experience_sections[:3]:
            embedding = self.processor.get_embedding(section)
            embeddings.append(embedding)

        similarities = cosine_similarity(
            np.array(embeddings),
            self.job_desc_embedding.reshape(1, -1)
        )

        max_similarity = max(similarities)
        return float(max_similarity)

    def calc_edu(self, candidate_education):
        required_edu = self.job_desc["education"]
        score = 0

        for edu in candidate_education:
            edu_lower = edu.lower()

            if any(word in edu_lower for word in ["phd", "ph.d", "doctor"]):
                level_score = 1.0
            elif any(word in edu_lower for word in ["master", "ms", "m.s", "mba", "m.sc"]):
                level_score = 0.8
            elif any(word in edu_lower for word in ["bachelor", "bs", "b.s", "ba", "b.a", "b.sc"]):
                level_score = 0.6
            elif any(word in edu_lower for word in ["associate", "a.a", "a.s"]):
                level_score = 0.4
            else:
                level_score = 0.2

            field_score = 0
            for field in required_edu["fields"]:
                if field.lower() in edu_lower:
                    field_score = 1
                    break

            current_score = (0.6 * level_score) + (0.4 * field_score)
            if current_score > score:
                score = current_score

        return score
