/* import React, { Component } from 'react'
import '../css/Login.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import Cookies from 'universal-cookie'

const baseUrl = "https://localhost:7139/api/User";
const cookies = new Cookies();

export default class Login extends Component {
state ={
  form:{
    username: '',
    password: ''
  }
}

iniciarSesion= async() =>{
  const username = this.state.form.username;
  console.log(username)
  const password = this.state.form.password;
  console.log(password)

  await axios.get(baseUrl).then(response=>{
    const data = response.data.data;

    const nombresUsuario = data.map(item => item.nombreUsuario);
    console.log(nombresUsuario);

    const  contraseñaUsuario= data.map(item => item.contrasenaUsuario);
    console.log(contraseñaUsuario);

    // Verificar si el username y password coinciden en la misma posición
  const index = nombresUsuario.indexOf(username);
  if (index !== -1 && contraseñaUsuario[index] === password) {
    const id = data[index].id;
    const nombreCompleto = data[index].nombreCompleto;
    const contrasenaUsuario = data[index].contrasenaUsuario;
    const nombreUsuario = data[index].nombreUsuario;
    console.log("ID correspondiente:", id);
    console.log("Nombre Completo:", nombreCompleto);
    console.log("Contraseña Usuario:", contrasenaUsuario);
    console.log("Nombre Usuario:", nombreUsuario);
    cookies.set('id', id, {path: "/"});
    cookies.set('nombreCompleto', nombreCompleto, {path: "/"});
    cookies.set('nombreUsuario', nombreUsuario, {path: "/"});
    alert(`Bienvenido: ${nombreCompleto}`);
    window.location.href="./menu";
  } else {
    alert("Nombre de usuario o contraseña incorrectos");
  }

  })
  .catch(error =>{
    console.log(error);
  })
}

handleChange =async e=>{
  await this.setState({
    form:{
      ...this.state.form,
      [e.target.name]: e.target.value
    }
  });
  console.log(this.state.form);
}

componentDidMount(){
  if(cookies.get('nombreCompleto')){
    window.location.href='./menu'
  }
}

  render() {
    return (
    <div id="container">   
      <div className='containerPrincipal '>
      <label>Bienvenido</label>
        <div className='containerSecundario'>
            <div className='form-group'>
                <label>Usuario:</label>
                <br />
                <input 
                type="text"
                className='form-control input-long' 
                name="username"
                onChange={this.handleChange}
                />
                <br />
                <label>Constraseña: </label>
                <br />
                <input 
                type="password"
                className='form-control input-long' 
                name="password"
                onChange={this.handleChange}
                />
                <br />
                <button className='btn btn-primary' onClick={()=> this.iniciarSesion()}>Iniciar sesión</button>
            </div>
        </div>
     </div>
     </div>
    )
  }
}
 */

import React, { useState } from "react";
import "../css/Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Cookies from "universal-cookie";
import LogoWeb from "../assets/img/LogoWeb.png";
import swal from "sweetalert";

const baseUrl = "http://localhost:83/api/user";
const cookies = new Cookies();

export default function Login(props) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const iniciarSesion = async () => {
    const username = form.username;
    const password = form.password;

    if (!username) {
      swal("Campo vacío", "Por favor, ingresa una Usuario", "warning");
      return;
    } else if (!password) {
      swal("Campo vacío", "Por favor, ingresa una Contraseña", "warning");
      return;
    }

    try {
      const response = await axios.get(baseUrl);
      const data = response.data.data;

      const nombresUsuario = data.map((item) => item.nombreUsuario);
      const contraseñaUsuario = data.map((item) => item.contrasenaUsuario);

      const index = nombresUsuario.indexOf(username);
      if (index !== -1 && contraseñaUsuario[index] === password) {
        const id = data[index].id;
        const nombreCompleto = data[index].nombreCompleto;
        const nombreUsuario = data[index].nombreUsuario;

        cookies.set("id", id, { path: "/" });
        cookies.set("nombreCompleto", nombreCompleto, { path: "/" });
        cookies.set("nombreUsuario", nombreUsuario, { path: "/" });

        swal({
          title: "Credenciales Correctas",
          text: "Bienvenido " + nombreCompleto,
          icon: "success",
          timer: 2000,
          buttons: false,
        });

        setTimeout(() => {
          props.setMenuVisible(false);
          window.location.href = "./";
        }, 2000);
      } else {
        swal(
          "Datos Incorrectos",
          "Por favor, ingresa un Usuario o Contraseña válidos",
          "error"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* useEffect(() => {
    if (cookies.get('nombreUsuario')) {
        window.location.href = "./";
    }
  
  }, []);  */

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      // Verificar si la tecla presionada es "Enter" (código de tecla 13)
      iniciarSesion();
    }
  };

  return (
    <div id="container" onKeyDown={handleKeyDown}>
      <div className="containerPrincipal ">
        <div>
          <img src={LogoWeb} alt="Logo" className="image-logo" />
        </div>
        <div className="title">
          <label className="title2">¡BIENVENIDO A CH-GESTOR!</label>
        </div>
        <div className="containerSecundario">
          <div className="form-group">
            <label>Usuario</label>
            <br />
            <input
              type="text"
              className="form-control input-long"
              name="username"
              placeholder="Escribe un usuario"
              value={form.username}
              onChange={handleChange}
            />
            <br />
            <label>Contraseña</label>
            <br />
            <input
              type="password"
              className="form-control input-long"
              name="password"
              placeholder="Escribe una contraseña"
              value={form.password}
              onChange={handleChange}
            />
            <br />
            <button className="btn btn-primary" onClick={iniciarSesion} >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
