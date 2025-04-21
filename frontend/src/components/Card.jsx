// Card.jsx
import React from 'react';
import '../styles/Card.css';


const Card = ({ image, description, buttonText, onClick }) => {
  return (
    <div className="custom-card card shadow-sm mb-4">
      <img src={image} className="card-img-top" alt="card" />
      <div className="card-body">
        {description && <p className="card-text">{description}</p>}
        <button className="btn btn-card" onClick={onClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Card;
