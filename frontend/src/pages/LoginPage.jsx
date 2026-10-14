import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import logoDark from "../assets/logo.png";
import logoLight from "../assets/logo_light.png";
import ThemeToggle from "../components/common/ThemeToggle";
import {
  FaUserCog,
  FaLock,
  FaShieldAlt,
  FaLaptopCode,
  FaHandshake,
  FaFlag,
} from "react-icons/fa";
import "../styles/login.css";


function LoginPage() {
  const navigate = useNavigate();

  const [temaClaro, setTemaClaro] = useState(
    document.body.classList.contains("theme-light")
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const guardarSesion = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem(
      "nombre_completo",
      data.nombreCompleto || data.nombre_completo || ""
    );
    localStorage.setItem("rol", data.rol);
    localStorage.setItem(
      "idAnalista",
      data.idAnalista !== null && data.idAnalista !== undefined
        ? String(data.idAnalista)
        : ""
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(username, password);
      guardarSesion(data);
      navigate("/dashboard");
    } catch {
      setError("Usuario o contraseña incorrectos");
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError("");

    try {
      const data = await login(adminUsername, adminPassword);

      if (data.rol !== "SUPER_ADMIN") {
        setAdminError("Acceso exclusivo para Super Admin");
        return;
      }

      guardarSesion(data);
      navigate("/usuarios");
    } catch {
      setAdminError("Usuario o contraseña incorrectos");
    }
  };

  useEffect(() => {
    const verificarTema = () => {
      setTemaClaro(document.body.classList.contains("theme-light"));
    };

    verificarTema();

    const observadorTema = new MutationObserver(verificarTema);

    observadorTema.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observadorTema.disconnect();
    };
  }, []);

  return (
    <div className="login-page">
      <div className="brand">
        <img
          src={temaClaro ? logoLight : logoDark}
          alt="VisionControl"
          className="brand-logo"
        />
        
      </div>

      <ThemeToggle className="login-theme-toggle" />

      <div
        className="top-admin"
        title="Acceso Super Admin"
        onClick={() => setShowAdminLogin(true)}
      >
        <span className="admin-icon">
          <FaUserCog />
        </span>
      </div>

      <div className="hero-text">
        <h2>Gestión y control de cámaras de videovigilancia a nivel nacional</h2>
      </div>

      <div className="login-card">
        <div className="lock-icon">
          <FaLock />
        </div>

        <h2>Iniciar Sesión</h2>
        <p className="subtitle">
          Ingrese sus credenciales para acceder al sistema
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Ingresar</button>
        </form>
      </div>

      {showAdminLogin && (
        <div className="admin-modal">
          <div className="admin-modal-card">
            <button
              className="close-modal"
              onClick={() => setShowAdminLogin(false)}
            >
              ×
            </button>

            <h2>Acceso Super Admin</h2>
            <p>Ingrese sus credenciales administrativas</p>

            <form onSubmit={handleAdminLogin}>
              <input
                type="text"
                placeholder="Usuario Super Admin"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />

              {adminError && <p className="error">{adminError}</p>}

              <button type="submit">Entrar</button>
            </form>
          </div>
        </div>
      )}

      <div className="footer-login">
        <span>
          <FaShieldAlt className="footer-icon" />
          Seguridad
        </span>
        <span>
          <FaLaptopCode className="footer-icon" />
          Tecnología
        </span>
        <span>
          <FaHandshake className="footer-icon" />
          Confianza
        </span>
        <span>
          <FaFlag className="footer-icon" />
          Ecuador
        </span>
      </div>
    </div>
  );
}

export default LoginPage;