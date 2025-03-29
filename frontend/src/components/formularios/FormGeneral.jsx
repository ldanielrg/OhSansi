import React from 'react';

const FormGeneral = () => {
    return (
        <form>
            <div>
                <label>Usuario</label>
                <input type="text" name="Usuario" />
            </div>
            <div>
                <label>Contraseña</label>
                <input type="password" name="password" />
            </div>
            <button type="submit">Ingresar</button>
        </form>
    );
};

export default FormGeneral;
