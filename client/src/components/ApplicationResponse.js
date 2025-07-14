import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import './ApplicationResponse.css';



const ApplicationResponse = ({ modal, toggle, status, missingSkills, feedback }) => {

    const MESSAGES = {
        accepted: {
            title: 'Congratulations!',
            content: [
                "You've successfully passed our initial evaluation round!",
                "Our HR team will contact you within the next 3-5 business days regarding the next steps in the hiring process.",
                "Please keep an eye on your email for further updates and ensure timely responses.",
                "We appreciate your patience and look forward to continuing the process with you!"
            ],
            style: 'accepted'
        },
        rejected: {
            title: 'Thank You for Applying',
            content: [
                'Unfortunately, you were not selected at this time. We encourage you to apply again in the future.',
                'We appreciate the time and effort you invested in your application.'
            ],
            style: 'rejected',
            Missing_Skills: missingSkills
        }
    };

    const response = MESSAGES[status];
    console.log(feedback)

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
                            <p>{feedback[0]}</p>
                            <p><strong>Missing Skills:</strong></p>
                            {response.Missing_Skills.map((skill, idx) => (
                                <span key={idx} className='skillBadge'>{skill}</span>
                            ))}
                        </div>
                    )}
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