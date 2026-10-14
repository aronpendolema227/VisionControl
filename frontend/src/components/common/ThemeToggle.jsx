import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import "../../styles/themeToggle.css";

const obtenerTemaClaroActual = () => {
  return document.body.classList.contains("theme-light");
};

function ThemeToggle({ className = "" }) {
  const [temaClaro, setTemaClaro] = useState(obtenerTemaClaroActual);

  useEffect(() => {
    const sincronizarTema = () => {
      setTemaClaro(obtenerTemaClaroActual());
    };

    sincronizarTema();

    const observadorTema = new MutationObserver(sincronizarTema);

    observadorTema.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observadorTema.disconnect();
    };
  }, []);

  const cambiarTema = () => {
    const nuevoTemaClaro = !temaClaro;

    document.body.classList.toggle("theme-light", nuevoTemaClaro);
    localStorage.setItem("theme", nuevoTemaClaro ? "light" : "dark");

    setTemaClaro(nuevoTemaClaro);
  };

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      onClick={cambiarTema}
      title={temaClaro ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      aria-label={temaClaro ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
    >
      {temaClaro ? <FaMoon /> : <FaSun />}
    </button>
  );
}

export default ThemeToggle;