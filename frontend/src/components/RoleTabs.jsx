import React from 'react';
import '../styles/RoleTabs.css';

const RoleTabs = ({ roles, activeRole, onSelect }) => {
    return (
        <div className="role-tabs-wrapper">
            <div className="role-tabs">
                {roles.map((rol) => (
                    <button
                        key={rol.clave}
                        className={`role-tab ${activeRole === rol.clave ? 'active' : ''}`}
                        onClick={() => onSelect(rol.clave)}
                    >
                        {rol.nombre}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RoleTabs;
