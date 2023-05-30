import React, { useState, useEffect } from "react";
import {BrowserRouter ,Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Menu from "../pages/Menu";
import EditUser from "../pages/User/editUser";
import Inicio from "../pages/Inicio";
import EditEquipoElectronico from "../pages/EquiposElectronicos/editEquipoElectronico";
import EditEntregas from "../pages/Entregas/editEntregas";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function Router() {
  const [isLoggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    // Verificar si el usuario está autenticado (puedes usar cookies, almacenamiento local, etc.)
    const nombreUsuario = cookies.get("nombreUsuario");
    const isUserLoggedIn = !!nombreUsuario; // Convierte el valor en un booleano

    setLoggedIn(isUserLoggedIn);
  }, []);

  return (
    <BrowserRouter>
    {isLoggedIn ? <Menu /> : <Login setMenuVisible={setLoggedIn} />}
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/editUser" element={<EditUser />} />
          <Route
            path="/editEquipoElectronico"
            element={<EditEquipoElectronico />}
          />
          <Route path="/editEntregas" element={<EditEntregas />} />
          {/* Agrega aquí más rutas de acuerdo a tu aplicación */}
        </>
      ) : (
        <Route path="/*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  </BrowserRouter>
  );
}

export default Router;
