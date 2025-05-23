import React, { useState } from "react";
import Caja from "../components/Caja";
import "../styles/login.css";

import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import RegistroForm from "../components/RegistroForm";
import { MdEmail } from "react-icons/md";
import { GiPadlock } from "react-icons/gi";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login2 = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(email, password);

    if (res.success) {
      navigate("/", { state: { showWelcomeToast: true } });
    } else {
      const erroresTraducidos = {
        "Invalid credentials":
          "Credenciales inválidas. Verifica tu correo y contraseña.",
        Unauthorized: "No tienes autorización para ingresar.",
        "User not found": "Usuario no encontrado.",
      };

      const mensajeTraducido =
        erroresTraducidos[res.message] ||
        res.message ||
        "Ocurrió un error al iniciar sesión.";
      toast.error(mensajeTraducido);
    }
  };

  const renderContenidoPorRol = () => (
    <form onSubmit={handleLogin}>
      <div className="mb-3">
        <RegistroForm
          label="Correo electrónico"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icono={MdEmail}
          usarEvento={true}
        />
      </div>
      <div className="mb-3">
        <RegistroForm
          label="Contraseña"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icono={GiPadlock}
          usarEvento={true}
        />
      </div>
      <div className="d-grid mt-4">
        <button type="submit" className="btn btn-primary btn-lg">
          Ingresar
        </button>
      </div>
    </form>
  );

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <div className="login-page container d-flex align-items-center justify-content-center min-vh-100">
        <div className="row w-100 justify-content-center">
          <div className="col-lg-5 col-md-7 col-sm-9 col-11">
            <Caja titulo="Iniciar Sesión" width="100%">
              {renderContenidoPorRol()}
            </Caja>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login2;
