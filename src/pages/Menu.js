import React from "react";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import Logo3erParcialBlanco from "../assets/img/Logo3erParcialBlanco.png";
import "../css/Menu.css";

const cookies = new Cookies();

export default function Menu() {
  const cerrarSesion = () => {
    cookies.remove("id", { path: "/" });
    cookies.remove("nombreCompleto", { path: "/" });
    cookies.remove("nombreUsuario", { path: "/" });
    window.location.href = "./";
  };

   /*   // Verificar si no hay cookies o una sesión iniciada
  if (!cookies.get('nombreUsuario')) {
    window.location.href = './';
    return null; // Evitar renderizado del componente antes de redireccionar
  } */
 
  console.log("Estamos en el menu");
  console.log("Id: " + cookies.get("id"));
  console.log("Nombre Completo: " + cookies.get("nombreCompleto"));
  console.log("Nombre Usuario: " + cookies.get("nombreUsuario"));
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark  navbar-custom fixed-top">
        <div className="container-fluid">
        <Link to="/Inicio" className="logo-link">
  <div className="logo-container">
    <img src={Logo3erParcialBlanco} alt="Logo" className="logo-image" />
    <span className="logo-text">CH-GESTOR</span>
  </div>
</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/editUser"
                >
                  Usuario
                </Link>
              </li>
              <li className="nav-item nav-item-spacing">
                <Link className="nav-link" to="editEquipoElectronico">
                Registros
                </Link>
              </li>
              <li className="nav-item nav-item-spacing">
                <Link className="nav-link" to="/editEntregas">
                  Salidas
                </Link>
              </li>
            </ul>
            <button className="btn btn-light ml-auto btn-custom" onClick={cerrarSesion}>Cerrar Sesión</button>
          </div>
        </div>
      </nav>
    </div>
  );
}
