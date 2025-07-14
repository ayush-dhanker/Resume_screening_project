class reportGenerator:
    def __init__(self):
        self.colors = {
            'good': '#4CAF50',
            'medium': '#FFC107',
            'bad': '#F44336'
        }

    def generate_rejection_feedback(self, candidate, min_accept_score):
        """Generate feedback for rejected candidates"""
        feedback = []

        feedback.append(
            f"Your overall score ({candidate['total_score']:.2f}) was below the threshold ({min_accept_score:.2f})."
        )

        required_skills = set(skill.lower()
                              for skill in candidate['job_desc']['required_skills'])
        candidate_skills = set(skill.lower()
                               for skill in candidate['matched_skills'])

        missing_skills = required_skills - candidate_skills
        if missing_skills:
            feedback.append(
                f"Missing key skills: {', '.join(missing_skills)}"
            )

        if candidate['edu_score'] < 0.5:
            feedback.append(
                "Education qualifications didn't meet our preferred criteria."
            )

        if candidate['exp_score'] < 0.4:
            feedback.append(
                "Work experience didn't sufficiently match the job requirements."
            )

        if candidate['skill_score'] > 0.6:
            feedback.append(
                f"Your skills in {', '.join(candidate['matched_skills'][:3])} were impressive."
            )

        return "\n\n".join(feedback)
