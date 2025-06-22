import './About.css';
import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import ProfileCard from '../components/ProfileCard';
import SplitText from '../Animation/SplitText';
import DecryptedText from '../Animation/DecryptedText';

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
            <h1>
                <SplitText
                    text="Hello, there!"
                    className="text-2xl font-semibold text-center"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                // onLetterAnimationComplete={handleAnimationComplete}
                />
            </h1>
            <p>
                This project was created as part of our coursework for HCAI (Human-Centered AI). Our goal was
                to build a user-friendly and accessible web application.
            </p>

            <h2>
                <DecryptedText
                    text="Meet the team"
                    speed={160}
                    maxIterations={20}
                    characters="ABCD1234!?"
                    className="revealed"
                    parentClassName="all-letters"
                    encryptedClassName="encrypted"
                    animateOn="view"
                    revealDirection="start"
                    sequential="True"
                />
            </h2>
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


