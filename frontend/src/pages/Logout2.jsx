import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BallTriangle } from "react-loader-spinner";

const Logout2 = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cerrarSesion = async () => {
      await logout();
      setCargando(false);
      navigate("/login", { replace: true });
    };

    cerrarSesion();
  }, [logout, navigate]);

  return (
    <>
      {cargando && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255,255,255,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#003366"
            ariaLabel="loading"
            visible={true}
          />
        </div>
      )}
      {/* Opcionalmente podrías mostrar algo cuando no está cargando, 
          pero normalmente aquí ya navegamos a login */}
    </>
  );
};

export default Logout2;
