import React from 'react';
import '../styles/BotonForm.css';

const BotonForm = ({ texto, onClick }) => {
    return (
        <button className="boton-personalizado" onClick={onClick}>
            {texto}
        </button>
    );
};

export default BotonForm;
