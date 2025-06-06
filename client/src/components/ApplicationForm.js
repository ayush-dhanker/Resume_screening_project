import { useState } from 'react';
import './ApplicationForm.css';
import { Form, FormGroup, FormText, Input, Label, Button } from 'reactstrap';

function ApplicationForm({ job }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
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
        // Here you would typically send the data to your backend
        console.log('Submitting application for:', job.title, formData);
        alert(`Application submitted for ${job.title}!`);
    };

    return (
        // submitting feature remaining
        <Form className='application-form' >
            <h2 style={{ 'marginBottom': '22px', 'textDecoration': 'underline', color: 'rgba(33, 37, 41, 1)' }}>Apply for: {job.title}</h2>
            <FormGroup>
                <Label for="your-name">
                    Name
                </Label>
                <Input
                    id="your-name"
                    name="name"
                    placeholder="..."
                    type="string"
                />
            </FormGroup>
            <FormGroup>
                <Label for="your-exp">
                    Experience
                </Label>
                <Input
                    id="your-exp"
                    name="experience"
                    placeholder="..."
                    type="number"
                />
            </FormGroup>
            <FormGroup>
                <Label for="your-email">
                    Email
                </Label>
                <Input
                    id="your-email"
                    name="email"
                    placeholder="..."
                    type="email"
                />
            </FormGroup>
            {/* <FormGroup>
                <Label for="exampleText">
                    CoverLetter
                </Label>
                <Input
                    id="exampleText"
                    name="text"
                    type="textarea"
                />
            </FormGroup> */}
            <FormGroup>
                <Label for="exampleFile">
                    Upload Resume (PDF/Docs)
                </Label>
                <Input
                    id="exampleFile"
                    name="file"
                    type="file"
                />
            </FormGroup>
            <Button>
                Submit
            </Button>
        </Form>
        // <div className="application-form">
        //     <h2>Apply for: {job.title}</h2>
        //     <form c>
        //         <div className="form-group">
        //             <label>Full Name:</label>
        //             <input
        //                 type="text"
        //                 name="name"
        //                 value={formData.name}
        //                 onChange={handleChange}
        //                 required
        //             />
        //         </div>
        //         <div className="form-group">
        //             <label>Email:</label>
        //             <input
        //                 type="email"
        //                 name="email"
        //                 value={formData.email}
        //                 onChange={handleChange}
        //                 required
        //             />
        //         </div>
        //         <div className="form-group">
        //             <label>Resume (PDF):</label>
        //             <input
        //                 type="file"
        //                 name="resume"
        //                 onChange={handleChange}
        //                 accept=".pdf"
        //                 required
        //             />
        //         </div>
        //         <div className="form-group">
        //             <label>Cover Letter:</label>
        //             <textarea
        //                 name="coverLetter"
        //                 value={formData.coverLetter}
        //                 onChange={handleChange}
        //                 rows="5"
        //             />
        //         </div>
        //         <button type="submit" className="submit-button">Submit Application</button>
        //     </form>
        // </div>
    );
}

export default ApplicationForm;