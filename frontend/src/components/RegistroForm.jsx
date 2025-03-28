import React from 'react';
import '../styles/RegistroForm.css';

const RegistroForm = ({ label, placeholder, name }) => {
    return (
        <div className="registro-form-field">
            <label htmlFor={name} className='nombre-registro'>{label}</label>
            <input className='input-registro' type="text" name={name} placeholder={placeholder} />
        </div>
    );
};

export default RegistroForm;
