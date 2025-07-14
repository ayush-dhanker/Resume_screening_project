

import pandas as pd
import numpy as np
import os

import spacy
from transformers import BertTokenizer, BertModel
import torch
import PyPDF2
import docx
import re
from sklearn.metrics.pairwise import cosine_similarity

from IPython.display import display, Markdown


class ResumeProcessor:
    def __init__(self):
        """Initialize the resume processor with NLP models and configurations"""
        # Load BERT model for semantic understanding
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.bert = BertModel.from_pretrained('bert-base-uncased')

        # Load spaCy model for NLP processing
        self.nlp = spacy.load("en_core_web_lg")

        # Configure pattern matchers
        self._initialize_matchers()

        # Define transferable skills mapping
        self.transferable_skills = {
            'powerbi': ['tableau', 'looker', 'qlik', 'microstrategy'],
            'tableau': ['powerbi', 'looker', 'qlik', 'sisense'],
            'seaborn': ['matplotlib', 'plotly', 'ggplot', 'bokeh'],
            'matplotlib': ['seaborn', 'plotly', 'ggplot', 'altair'],
            'python': ['r', 'julia', 'scala'],
            'excel': ['google sheets', 'libreoffice calc', 'numbers'],
            'aws': ['azure', 'gcp', 'oracle cloud'],
            'pandas': ['dplyr', 'data.table', 'polars'],
            'tensorflow': ['pytorch', 'keras', 'mxnet'],
            'spark': ['hadoop', 'flink', 'beam']
        }

    def _initialize_matchers(self):
        """Initialize spaCy matchers with comprehensive patterns"""
        from spacy.matcher import Matcher, PhraseMatcher

        # Main matcher for skills and education
        self.matcher = Matcher(self.nlp.vocab)

        # Phrase matcher for exact skill matching
        self.phrase_matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")

        # Configure all patterns
        self._configure_skill_patterns()
        self._configure_education_patterns()

        # Experience section headers
        self.exp_section_headers = [
            "work experience", "professional experience",
            "employment history", "career history",
            "experience", "professional background",
            "work history", "relevant experience"
        ]

    def _configure_skill_patterns(self):
        """Configure patterns for skill extraction"""
        # Technical skills
        tech_skills = [
            "python", "java", "sql", "r", "c++", "c#", "javascript", "typescript",
            "html", "css", "react", "angular", "vue", "django", "flask", "node.js",
            "pandas", "numpy", "tensorflow", "pytorch", "scikit-learn", "keras",
            "spark", "hadoop", "aws", "azure", "gcp", "docker", "kubernetes",
            "tableau", "powerbi", "looker", "matplotlib", "seaborn", "plotly",
            "git", "jenkins", "ansible", "terraform", "snowflake", "redshift"
        ]

        # Add patterns for each skill
        for skill in tech_skills:
            self.matcher.add("SKILL", [[{"LOWER": skill}]])

        # Add phrase patterns for multi-word skills
        skill_phrases = [self.nlp.make_doc(skill) for skill in tech_skills]
        self.phrase_matcher.add("SKILL_PHRASE", skill_phrases)

    def _configure_education_patterns(self):
        """Configure comprehensive education patterns"""
        # Degree types with variations
        degree_patterns = [
            # Bachelor degrees
            [{"LOWER": {"IN": ["bachelor", "bachelors", "baccalaureate"]}}],
            [{"TEXT": {"REGEX": "^B\.?[A-Z]?\.?$"}}],  # B.S., B.A, B.Sc
            [{"LOWER": "bs"}, {"IS_PUNCT": True, "OP": "?"},
                {"LOWER": "c", "OP": "?"}],
            [{"LOWER": "ba"}, {"IS_PUNCT": True, "OP": "?"}],
            [{"LOWER": "bsc"}],
            [{"LOWER": "undergraduate"}],

            # Master degrees
            [{"LOWER": {"IN": ["master", "masters"]}}],
            [{"TEXT": {"REGEX": "^M\.?[A-Z]?\.?$"}}],  # M.S., M.A, M.Sc
            [{"LOWER": "ms"}, {"IS_PUNCT": True, "OP": "?"}],
            [{"LOWER": "ma"}, {"IS_PUNCT": True, "OP": "?"}],
            [{"LOWER": "msc"}],
            [{"LOWER": "graduate"}],

            # Doctoral degrees
            [{"LOWER": {"IN": ["phd", "ph.d", "doctorate", "doctoral"]}}],
            [{"TEXT": {"REGEX": "^Ph\.?D\.?$"}}],

            # Professional degrees
            [{"LOWER": "mba"}],
            [{"LOWER": "jd"}],
            [{"LOWER": "md"}],

            # Associate degrees
            [{"LOWER": "associate"}],
            [{"LOWER": "aas"}]
        ]

        # Field of study patterns
        field_patterns = [
            [{"LOWER": "in"}, {"LOWER": {"IN": [
                "computer", "data", "information", "software", "electrical",
                "mechanical", "business", "economics", "mathematics",
                "statistics", "physics", "chemistry", "biology"
            ]}}],
            [{"LOWER": "of"}, {"LOWER": {"IN": ["science", "arts", "engineering"]}}]
        ]

        # Add all education patterns
        for pattern in degree_patterns + field_patterns:
            self.matcher.add("EDUCATION", [pattern])

    def extract_text(self, file_path):
        """Extract text from resume files (PDF/DOCX) with error handling"""
        text = ""

        try:
            if file_path.lower().endswith('.pdf'):
                with open(file_path, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    text = " ".join([
                        page.extract_text() or ""  # Handle None returns
                        for page in reader.pages
                    ])
            elif file_path.lower().endswith('.docx'):
                doc = docx.Document(file_path)
                text = " ".join([
                    para.text
                    for para in doc.paragraphs
                    if para.text.strip()
                ])
            else:
                raise ValueError(
                    f"Unsupported file format: {file_path.split('.')[-1]}")
        except Exception as e:
            print(f"Error processing {file_path}: {str(e)}")
            return ""

        # Clean extracted text
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def get_bert_embedding(self, text):
        """Get BERT embedding for text with error handling"""
        try:
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding='max_length'
            )
            with torch.no_grad():
                outputs = self.bert(**inputs)
            return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()
        except Exception as e:
            print(f"Error generating BERT embedding: {str(e)}")
            return np.zeros(768)  # Return zero vector if error occurs

    def extract_features(self, resume_text):
        """Extract skills, education, and experience with enhanced logic"""
        if not resume_text.strip():
            return {
                "skills": [],
                "education": [],
                "experience": []
            }

        doc = self.nlp(resume_text)
        features = {
            "skills": set(),
            "education": [],
            "experience": []
        }

        # Extract using both matchers
        self._extract_with_matchers(doc, features)

        # Enhanced experience extraction
        features["experience"] = self._extract_experience_sections(resume_text)

        # Convert skills to sorted list
        features["skills"] = sorted(features["skills"])

        return features

    def _extract_with_matchers(self, doc, features):
        """Extract features using both matchers"""
        # Standard matcher matches
        matches = self.matcher(doc)
        for match_id, start, end in matches:
            label = self.nlp.vocab.strings[match_id]
            span = doc[start:end].text.lower()

            if label == "SKILL":
                features["skills"].add(span)
            elif label == "EDUCATION":
                # Get context around the education match
                context_start = max(0, start - 5)
                context_end = min(len(doc), end + 10)
                education_entry = doc[context_start:context_end].text.strip()
                features["education"].append(education_entry)

        # Phrase matcher matches
        phrase_matches = self.phrase_matcher(doc)
        for match_id, start, end in phrase_matches:
            features["skills"].add(doc[start:end].text.lower())

    def _extract_experience_sections(self, text):
        """Robust experience section extraction with multiple fallbacks"""
        sections = []

        # Try with section headers first
        for header in self.exp_section_headers:
            header_pattern = re.compile(
                rf'({header}).*?(?=({"|".join(self.exp_section_headers + ["education", "skills"])}|$))',
                re.IGNORECASE | re.DOTALL
            )
            matches = header_pattern.finditer(text)
            for match in matches:
                sections.append(match.group(0).strip())

        # Fallback to timeline pattern if no sections found
        if not sections:
            timeline_pattern = re.compile(
                r'(\d{4}\s*[-–]\s*(present|\d{4})).*?(?=(\d{4}\s*[-–]\s*(present|\d{4})|$))',
                re.IGNORECASE | re.DOTALL
            )
            sections = [match.group(0).strip()
                        for match in timeline_pattern.finditer(text)]

        return sections

    def expand_transferable_skills(self, skills):
        """Expand skills with transferable equivalents and related technologies"""
        expanded_skills = set(skill.lower() for skill in skills)

        for skill in skills:
            skill_lower = skill.lower()
            # Add direct transferable skills
            if skill_lower in self.transferable_skills:
                for related in self.transferable_skills[skill_lower]:
                    expanded_skills.add(related)

            # Add common variations (e.g., "js" for "javascript")
            if skill_lower == "javascript":
                expanded_skills.add("js")
            elif skill_lower == "python":
                expanded_skills.update(["py", "python3"])
            elif skill_lower == "c++":
                expanded_skills.add("cpp")

        return sorted(expanded_skills)

# Resume scoring


class ResumeScorer:
    def __init__(self, job_description):
        self.job_desc = job_description
        self.processor = ResumeProcessor()

        # Precompute job description embeddings
        self.job_desc_embedding = self.processor.get_bert_embedding(
            job_description["text"]
        )

    def calculate_scores(self, resume_features, resume_text):  # Added resume_text parameter
        """Calculate skill, education, and experience scores"""
        skill_score = self._calculate_skill_score(resume_features["skills"])
        edu_score = self._calculate_education_score(
            resume_features["education"])
        # Pass the full resume text to the updated experience scoring method
        exp_score = self.experience_marks(resume_text)

        # Weighted total score
        total_score = (0.5 * skill_score) + \
            (0.2 * edu_score) + (0.3 * exp_score)

        return {
            "total_score": total_score,
            "skill_score": skill_score,
            "edu_score": edu_score,
            "exp_score": exp_score,
            "matched_skills": resume_features["skills"]
        }

    def _calculate_skill_score(self, candidate_skills):
        """Calculate skill matching score"""
        required_skills = set(skill.lower()
                              for skill in self.job_desc["required_skills"])
        candidate_skills = set(skill.lower() for skill in candidate_skills)

        # Expand with transferable skills
        required_expanded = self.processor.expand_transferable_skills(
            required_skills)
        candidate_expanded = self.processor.expand_transferable_skills(
            candidate_skills)

        # Calculate matches
        matches = required_skills.intersection(candidate_skills)
        transferable_matches = set(required_expanded).intersection(
            set(candidate_expanded)) - matches

        # Base score for direct matches
        score = len(matches)

        # Partial credit for transferable matches
        score += 0.5 * len(transferable_matches)

        # Normalize by required skills count
        if len(required_skills) > 0:
            score = score / len(required_skills)

        return min(score, 1.0)  # Cap at 1.0

    def experience_marks(self, experience_sections):
        """Calculate experience score using BERT embeddings"""
        if not experience_sections:
            return 0

        # Get embeddings for each experience section
        embeddings = []
        for section in experience_sections[:3]:  # Limit to first 3 sections
            embedding = self.processor.get_bert_embedding(section)
            embeddings.append(embedding)

        # Calculate similarity with job description
        similarities = cosine_similarity(
            np.array(embeddings),
            self.job_desc_embedding.reshape(1, -1)
        )

        # Take max similarity as score
        max_similarity = max(similarities)
        return float(max_similarity)

    # Updated Education Scoring Method
    def _calculate_education_score(self, candidate_education):
        """Calculate education matching score with more flexible matching"""
        required_edu = self.job_desc["education"]
        score = 0

        for edu in candidate_education:
            edu_lower = edu.lower()

            # More flexible degree level detection
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

            # More flexible field detection
            field_score = 0
            for field in required_edu["fields"]:
                if field.lower() in edu_lower:
                    field_score = 1
                    break

            current_score = (0.6 * level_score) + (0.4 * field_score)
            if current_score > score:
                score = current_score

        return score


def evaluate_resume(resume_path, job_description):

    processor = ResumeProcessor()
    scorer = ResumeScorer(job_description)
    report_generator = HRReportGenerator()

    try:
        # Step 1: Process resume
        raw_text = processor.extract_text(resume_path)
        features = processor.extract_features(raw_text)
        scores = scorer.calculate_scores(features, raw_text)

        # Create candidate record
        candidate = {
            "name": os.path.basename(resume_path),
            "file": resume_path,
            **scores,
            "job_desc": job_description
        }

        # Step 2: Determine acceptance (using median score as threshold)
        if scores["total_score"] >= 0.7:  # Adjust threshold as needed
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
            # Generate rejection feedback
            feedback = report_generator.generate_rejection_feedback(
                candidate,
                min_accept_score=0.7  # Same threshold
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
