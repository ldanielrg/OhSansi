import React from 'react';
import '../styles/RegistroForm.css';

const RegistroForm = ({ label, placeholder, name, type = 'text', options }) => {
    return (
        <div className="registro-form-field">
            <label className='nombre-registro'>{label}</label>

            

            {type === 'checkbox-multiple' ? (
                <div className="checkbox-group">
                    {options?.map((option, idx) => (
                        <label key={idx} className="checkbox-item">
                            <input
                            type="checkbox"
                            name={name}
                            value={option.value}
                            className="input-checkbox"
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            ) : type === 'checkbox' ? (
                <label className="checkbox-item">
                    <input type="checkbox" name={name} className="input-checkbox" />
                    {label}
                </label>
            ) : type === 'select' ? (
                <select className="input-registro" name={name} id={name}>
                    {options?.map((option, idx) => (
                        <option key={idx} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : type === 'radio' ? (
                <div className="radio-group">
                    {options?.map((option, idx) => (
                    <label key={idx} className="radio-item">
                        <input
                        type="radio"
                        name={name}
                        value={option.value}
                        className="input-radio"
                        />
                        {option.label}
                    </label>
                    ))}
                </div>
            ) : 

            (
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
