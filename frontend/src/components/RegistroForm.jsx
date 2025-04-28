import React from 'react';
import '../styles/RegistroForm.css';

const RegistroForm = ({
    label,
    placeholder = '',
    name,
    type = 'text',
    options = [],
    value = '',
    onChange
}) => {
    const handleChange = (e) => {
        const val = e.target.value;
        onChange((prev) => ({
            ...prev,
            [name]: val
        }));
    };

    return (
        <div className="registro-form-field">
            <label className="nombre-registro">{label}</label>

            {type === 'select' ? (
                <select
                    className="input-registro"
                    name={name}
                    id={name}
                    value={value}
                    onChange={handleChange}
                >
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : type === 'radio' ? (
                <div className="radio-group">
                    {options.map((opt, idx) => (
                        <label key={idx} className="radio-item">
                            <input
                                type="radio"
                                name={name}
                                value={opt.value}
                                checked={value === opt.value}
                                onChange={handleChange}
                                className="input-radio"
                            />
                            {opt.label}
                        </label>
                    ))}
                </div>
            ) : (
                <input
                    className="input-registro"
                    type={type}
                    name={name}
                    id={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    autoComplete={type === 'password' ? 'new-password' : 'off'} //AGREGUE YO
                />
            )}
        </div>
    );
};

export default RegistroForm;
