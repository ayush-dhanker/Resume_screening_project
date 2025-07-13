import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import './ApplicationResponse.css';

const MESSAGES = {
    accepted: {
        title: 'Congratulations!',
        content: [
            "You've successfully passed our initial evaluation round!",
            "Our HR team will contact you within the next 3-5 business days regarding the next steps in the hiring process.",
            "Please keep an eye on your email for further updates and ensure timely responses.",
            "We appreciate your patience and look forward to continuing the process with you!"
        ],
        // surveyMessage: 'Please take a moment to complete our onboarding survey:',
        // surveyLink: 'https://docs.google.com/forms/d/e/YOUR_ACCEPTANCE_FORM_ID/viewform',
        // surveyButtonText: 'Complete Onboarding Survey',
        style: 'accepted'
    },
    rejected: {
        title: 'Thank You for Applying',
        content: [
            'Unfortunately, you were not selected at this time. We encourage you to apply again in the future.',
            'We appreciate the time and effort you invested in your application.'
        ],
        // surveyMessage: 'Help us improve by completing our candidate experience survey:',
        // surveyLink: 'https://docs.google.com/forms/d/e/YOUR_REJECTION_FORM_ID/viewform',
        // surveyButtonText: 'Share Your Feedback',
        style: 'rejected',
        Missing_Skills: ['HuggingFace', 'Spark NLP', 'Knowledge Graphs', 'LLM Fine-tuning']
    }
};

const ApplicationResponse = ({ modal, toggle, status }) => {
    const response = MESSAGES[status];

    if (!response) return null;

    return (
        <Modal isOpen={modal} toggle={toggle} size="lg" centered>
            <ModalBody>
                <div className={`response-box ${response.style}`}>
                    <h2 className="response-title"><strong>{response.title}</strong></h2>

                    {response.content.map((paragraph, index) => (
                        <p key={index} className="response-message">
                            {paragraph}
                        </p>

                    ))}
                    {status === 'rejected' && response.Missing_Skills?.length > 0 && (
                        <div style={{ marginTop: "15px", marginBottom: '15px' }}>
                            <p>Your overall score <strong>(0.68)</strong> was below the threshold <strong>(0.91).</strong></p>
                            <p><strong>Missing Skills:</strong></p>
                            {response.Missing_Skills.map((skill, idx) => (
                                <span key={idx} className='skillBadge'>{skill}</span>
                            ))}
                        </div>
                    )}
                    {/* <div className="survey-section">
                        <p className="survey-message">{response.surveyMessage}</p>
                    </div> */}
                    <p><u><strong>Please take a moment to complete our survey</strong></u></p>
                    <Button color="info" className="mt-3" target="_blank" href="https://docs.google.com/forms/d/e/YOUR_ACCEPTANCE_FORM_ID/viewform">
                        Complete Survey
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
};

ApplicationResponse.propTypes = {
    modal: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    status: PropTypes.oneOf(['accepted', 'rejected'])
};

export default ApplicationResponse;