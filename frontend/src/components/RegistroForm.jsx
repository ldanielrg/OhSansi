import React from 'react';
import '../styles/RegistroForm.css';

const RegistroForm = ({ label, placeholder, name, type = 'text', options }) => {
    return (
        <div className="registro-form-field">
            <label htmlFor={name} className='nombre-registro'>{label}</label>

            {type === 'select' ? (
                <select className="input-registro" name={name} id={name}>
                    {options?.map((option, idx) => (
                        <option key={idx} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    className="input-registro"
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    id={name}
                />
            )}
        </div>
    );
};

export default RegistroForm;
