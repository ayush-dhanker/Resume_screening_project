import './About.css';
import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import ProfileCard from '../components/ProfileCard';

{/* <ProfileCard
  name="Javi A. Torres"
  title="Software Engineer"
  handle="javicodes"
  status="Online"
  contactText="Contact Me"
  avatarUrl="/path/to/avatar.jpg"
  showUserInfo={true}
  enableTilt={true}
  onContactClick={() => console.log('Contact clicked')}
/> */}

const teamMembers = [
    {
        name: "Alice Smith",
        role: "Frontend Developer",
        photo: "https://via.placeholder.com/120", // Replace with actual photo URL
        linkedin: "https://linkedin.com/in/alicesmith",
        github: "https://github.com/alicesmith",
    },
    {
        name: "Bob Johnson",
        role: "Backend Developer",
        photo: "https://via.placeholder.com/120",
        linkedin: "https://linkedin.com/in/bobjohnson",
        github: "https://github.com/bobjohnson",
    },
    {
        name: "Carol Lee",
        role: "UI/UX Designer",
        photo: "https://via.placeholder.com/120",
        linkedin: "https://linkedin.com/in/carollee",
        github: "https://github.com/carollee",
    },
];

function About() {
    return (
        <section className="about-section" id="about">
            <h2>About This Project</h2>
            <p>
                This project was created as part of our coursework for HCAI (Human-Centered AI). Our goal was
                to build a user-friendly and accessible web application.
            </p>

            <div className="team-container">
                {teamMembers.map((member, index) => (

                    <ProfileCard key={index}
                        name="Javi A. Torres"
                        title="Software Engineer"
                        handle="javicodes"
                        status="Online"
                        contactText="Contact Me"
                        avatarUrl="/path/to/avatar.jpg"
                        showUserInfo={true}
                        enableTilt={true}
                        onContactClick={() => console.log('Contact clicked')}
                    />

                ))}
            </div>
        </section>
    );
}

export default About;



