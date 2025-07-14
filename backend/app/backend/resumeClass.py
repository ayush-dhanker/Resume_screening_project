class ResumeProcessor:
    def __init__(self):

        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.bert = BertModel.from_pretrained('bert-base-uncased')

        self.nlp = spacy.load("en_core_web_lg")

        self.initialize_match()

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

    def initialize_match(self):
        from spacy.matcher import Matcher, PhraseMatcher

        self.matcher = Matcher(self.nlp.vocab)

        self.phrase_matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")

        self.conf_skill()
        self.conf_edu()

        self.exp_section_headers = [
            "work experience", "professional experience",
            "employment history", "career history",
            "experience", "professional background",
            "work history", "relevant experience"
        ]

    def conf_skill(self):

        tech_skills = [
            "python", "java", "sql", "r", "c++", "c#", "javascript", "typescript",
            "html", "css", "react", "angular", "vue", "django", "flask", "node.js",
            "pandas", "numpy", "tensorflow", "pytorch", "scikit-learn", "keras",
            "spark", "hadoop", "aws", "azure", "gcp", "docker", "kubernetes",
            "tableau", "powerbi", "looker", "matplotlib", "seaborn", "plotly",
            "git", "jenkins", "ansible", "terraform", "snowflake", "redshift"
        ]

        for skill in tech_skills:
            self.matcher.add("SKILL", [[{"LOWER": skill}]])

        skill_phrases = [self.nlp.make_doc(skill) for skill in tech_skills]
        self.phrase_matcher.add("SKILL_PHRASE", skill_phrases)

    def conf_edu(self):
        degree_patterns = [

            [{"LOWER": {"IN": ["bachelor", "bachelors", "baccalaureate"]}}],
            [{"TEXT": {"REGEX": "^B\.?[A-Z]?\.?$"}}],
            [{"LOWER": "bs"}, {"IS_PUNCT": True, "OP": "?"},
                {"LOWER": "c", "OP": "?"}],
            [{"LOWER": "ba"}, {"IS_PUNCT": True, "OP": "?"}],
            [{"LOWER": "bsc"}],
            [{"LOWER": "undergraduate"}],


            [{"LOWER": {"IN": ["master", "masters"]}}],
            [{"TEXT": {"REGEX": "^M\.?[A-Z]?\.?$"}}],
            [{"LOWER": "ms"}, {"IS_PUNCT": True, "OP": "?"}],
            [{"LOWER": "ma"}, {"IS_PUNCT": True, "OP": "?"}],
            [{"LOWER": "msc"}],
            [{"LOWER": "graduate"}],


            [{"LOWER": {"IN": ["phd", "ph.d", "doctorate", "doctoral"]}}],
            [{"TEXT": {"REGEX": "^Ph\.?D\.?$"}}],


            [{"LOWER": "mba"}],
            [{"LOWER": "jd"}],
            [{"LOWER": "md"}],


            [{"LOWER": "associate"}],
            [{"LOWER": "aas"}]
        ]

        domain_patrn = [
            [{"LOWER": "in"}, {"LOWER": {"IN": [
                "computer", "data", "information", "software", "electrical",
                "mechanical", "business", "economics", "mathematics",
                "statistics", "physics", "chemistry", "biology"
            ]}}],
            [{"LOWER": "of"}, {"LOWER": {"IN": ["science", "arts", "engineering"]}}]
        ]

        for pattern in degree_patterns + domain_patrn:
            self.matcher.add("EDUCATION", [pattern])

    def text_extract(self, file_path):
        text = ""

        try:
            if file_path.lower().endswith('.pdf'):
                with open(file_path, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    text = " ".join([
                        page.text_extract() or ""
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

    def get_embedding(self, text):
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

    def feature_extract(self, resume_text):
        if not resume_text.strip():
            return {
                "skills": [],
                "education": [],
                "experience": []
            }

        doc = self.nlp(resume_text)
        features = {}
        features["skills"] = set()
        features["education"] = []
        features["experience"] = []

        self._extract_with_matchers(doc, features)

        features["experience"] = self.extract_exp_sec(resume_text)

        features["skills"] = sorted(features["skills"])

        return features

    def _extract_with_matchers(self, doc, features):
        matches = self.matcher(doc)
        for match_id, start, end in matches:
            label = self.nlp.vocab.strings[match_id]
            span = doc[start:end].text.lower()

            if label == "SKILL":
                features["skills"].add(span)
            elif label == "EDUCATION":
                context_start = max(0, start - 5)
                context_end = min(len(doc), end + 10)
                education_entry = doc[context_start:context_end].text.strip()
                features["education"].append(education_entry)

        phrase_matches = self.phrase_matcher(doc)
        for match_id, start, end in phrase_matches:
            features["skills"].add(doc[start:end].text.lower())

    def extract_exp_sec(self, text):
        sections = []

        for header in self.exp_section_headers:
            header_pattern = re.compile(
                rf'({header}).*?(?=({"|".join(self.exp_section_headers + ["education", "skills"])}|$))',
                re.IGNORECASE | re.DOTALL
            )
            matches = header_pattern.finditer(text)
            for match in matches:
                sections.append(match.group(0).strip())

        if not sections:
            timeline_pattern = re.compile(
                r'(\d{4}\s*[-–]\s*(present|\d{4})).*?(?=(\d{4}\s*[-–]\s*(present|\d{4})|$))',
                re.IGNORECASE | re.DOTALL
            )
            sections = [match.group(0).strip()
                        for match in timeline_pattern.finditer(text)]

        return sections

    def transferable_work(self, skills):
        expanded_skills = set(skill.lower() for skill in skills)

        for skill in skills:
            skill_lower = skill.lower()
            if skill_lower in self.transferable_skills:
                for related in self.transferable_skills[skill_lower]:
                    expanded_skills.add(related)

            if skill_lower == "javascript":
                expanded_skills.add("js")
            elif skill_lower == "python":
                expanded_skills.update(["py", "python3"])
            elif skill_lower == "c++":
                expanded_skills.add("cpp")

        return sorted(expanded_skills)
