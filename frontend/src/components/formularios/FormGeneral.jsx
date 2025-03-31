import React from 'react';

const FormGeneral = ({ onSubmit }) => {
    return (
        <form className="formulario-login" onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
        }}>
            <div>
                <label>Usuario</label>
                <input type="text" name="Usuario" />
            </div>
            <div>
                <label>Contraseña</label>
                <input type="password" name="password" />
            </div>
            <div className="boton-login-wrapper">
                <button type="submit">Ingresar</button>
            </div> 
            
        </form>
    );
};

export default FormGeneral;
