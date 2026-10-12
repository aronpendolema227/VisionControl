import { FaUserAlt, FaBell } from "react-icons/fa";

function UserHeaderActions({ username, rol, onCerrarSesion }) {
  return (
    <div className="user-header-actions">
      <button
        type="button"
        className="btn-notificaciones"
        title="Notificaciones"
      >
        <FaBell />
      </button>

      <div className="dashboard-user">
        <div className="user-avatar">
          <FaUserAlt />
        </div>

        <div>
          <strong>{username}</strong>
          <p>{rol}</p>
        </div>

        <button className="btn-salir" onClick={onCerrarSesion}>
          Salir
        </button>
      </div>
    </div>
  );
}

export default UserHeaderActions;