import { useState } from 'react';
import './ApplicationForm.css';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import axios from 'axios';
import ApplicationResponse from './ApplicationResponse';
import { submitApplication } from '../services/api';

function ApplicationForm({ job }) {
    const [modal, setModal] = useState(false);
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        experience: '',
        resume: null,
        coverLetter: ''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await submitApplication(job, formData, job.id);

            if (response.success) {
                // Simulate ML review (replace with actual API response)
                const isAccepted = Math.random() > 0.5;
                setStatus(isAccepted ? 'accepted' : 'rejected');
                setModal(true);

                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    experience: '',
                    resume: null,
                    coverLetter: ''
                });
            }
        } catch (error) {
            setSubmitError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggle = () => setModal(!modal);

    return (
        <div className="application-container">
            <Form className='application-form' onSubmit={handleSubmit}>
                <h2 style={{ marginBottom: '22px', textDecoration: 'underline', color: 'rgba(33, 37, 41, 1)' }}>
                    Apply for: {job.title}
                </h2>

                {submitError && (
                    <Alert color="danger" className="mb-4">
                        {submitError}
                    </Alert>
                )}

                <FormGroup>
                    <Label for="your-name">Full Name</Label>
                    <Input
                        id="your-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="your-email">Email Address</Label>
                    <Input
                        id="your-email"
                        name="email"
                        placeholder="@example.com"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="your-exp">Years of Experience</Label>
                    <Input
                        id="your-exp"
                        name="experience"
                        placeholder="5"
                        type="number"
                        min="0"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                {/* <FormGroup>
                    <Label for="coverLetter">Cover Letter (Optional)</Label>
                    <Input
                        id="coverLetter"
                        name="coverLetter"
                        type="textarea"
                        value={formData.coverLetter}
                        onChange={handleChange}
                    />
                </FormGroup> */}

                <FormGroup>
                    <Label for="resumeFile">Upload Resume (PDF/DOCX)</Label>
                    <Input
                        id="resumeFile"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                        required
                    />
                </FormGroup>

                <Button
                    type="submit"
                    color="primary"
                    disabled={isSubmitting}
                    className="submit-btn"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
            </Form>

            <ApplicationResponse
                modal={modal}
                toggle={toggle}
                status={status}
                jobTitle={job.title}
            />
        </div>
    );
}

export default ApplicationForm;