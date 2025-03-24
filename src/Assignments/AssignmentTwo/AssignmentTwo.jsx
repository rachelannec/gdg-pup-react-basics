import React from "react";
import "./AssignmentTwo.css";

// Box Component that receives title and content as props
function Box({ title, content }) {
  return (
    <div className="box">
      <h2 className="box-title">{title}</h2>
      <p className="box-content">{content}</p>
    </div>
  );
}

function AssignmentTwo() {
  const data = [
    {
      id: 1,
      title: "Portfolio Website",
      content:
        "A personal website to showcase my projects, skills, and experience. It will include an interactive UI, blog section, and a contact form.",
    },
    {
      id: 2,
      title: "Chess Learning Website",
      content:
        "An interactive 3D chess website built with Three.js that teaches users how to play chess through tutorials, challenges, and AI-driven practice games.",
    },
    {
      id: 3,
      title: "Startup Website",
      content:
        "A professional website for my team and I to showcase our freelance work, services, and completed projects. It will include a portfolio section and a client contact form.",
    },
  ];

  return (
    <div className="title-container">
      <h1>Top 3 Major Projects for 2025</h1>
      <p>
        Learn how to pass and manage data between parent and child components
        using props. This exercise focuses on modular, reusable components by
        dynamically rendering project details inside child components.
      </p>
      <div className="box-container">
        {/* kinda change this part para madaling basahin - sana lang tama ang mga pinaggagagawa ko ;-; */}
        {data.map(({id, title, content}) => (
          <Box key={id} title={title} content={content} />
        ))}
      </div>
    </div>
  );
}

export default AssignmentTwo;
