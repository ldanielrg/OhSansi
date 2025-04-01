import React from 'react';
import '../styles/BotonForm.css';

const BotonForm = ({ texto, onClick, className = '' }) => {
  return (
    <button className={`boton-personalizado ${className}`} onClick={onClick}>
      {texto}
    </button>
  );
};

export default BotonForm;
