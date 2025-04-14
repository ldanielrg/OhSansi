// Card.jsx
import React from 'react';
import '../styles/Card.css';


const Card = ({ image, description, buttonText }) => {
  return (
    <div className="custom-card card shadow-sm mb-4">
      <img src={image} className="card-img-top" alt="card-img" />
      <div className="card-body">
        <button className="btn btn-card">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Card;
