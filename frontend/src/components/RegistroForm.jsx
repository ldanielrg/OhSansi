import React, { useState } from 'react';
import '../styles/RegistroForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importamos los iconos del ojo

const RegistroForm = ({
    label,
    placeholder = '',
    name,
    type = 'text',
    options = [],
    value = '',
    onChange,
    icono: Icono
}) => {
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const handleChange = (e) => {
        const val = e.target.value;
        onChange((prev) => ({
            ...prev,
            [name]: val
        }));
    };

    const toggleMostrarPassword = () => {
        setMostrarPassword((prev) => !prev);
    };

    const esPassword = type === 'password';
    const inputType = esPassword ? (mostrarPassword ? 'text' : 'password') : type;

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
                <div className="input-wrapper">
                    {Icono && <span className="input-icon-wrapper"><Icono className="input-icono" /></span>}
                    
                    <input
                        className="input-con-icono-real"
                        type={inputType}
                        name={name}
                        id={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                        autoComplete={type === 'password' ? 'new-password' : 'off'}
                    />

                    {esPassword && (
                        <span className="input-password-toggle" onClick={toggleMostrarPassword}>
                            {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default RegistroForm;
