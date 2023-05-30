import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Salidas.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faCheck } from "@fortawesome/free-solid-svg-icons";
//import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";
import swal from "sweetalert";


const baseUrl = "https://localhost:7139/api/Warranty";

export default class editEntregas extends Component {
  state = {
    data: [],
    modalEliminar: false,
    form: {
      id: "",
      nombre: "",
      tipoAparato: "",
      marca: "",
      descripcionReparacion: "",
      aplicacionGarantia: "",
      monto: "",
    },
    usuarioSeleccionadoId: null,
  };

  peticionGetAll = () => {
    delete this.state.form.id;
    axios
      .get(`${baseUrl}/getAllSalidas`)
      .then((response) => {
        this.setState({ data: response.data.data });
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionGetbyNombre = (nombre) => {
    delete this.state.form.id;
    axios
      .get(`${baseUrl}/${nombre}`)
      .then((response) => {
        this.setState({ data: response.data.data });
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionPut = (idWarranty) => {
    this.peticionGetByIdWarranty(idWarranty)
      .then((data) => {
        if (data.aplicacionGarantia) {
          swal("Dispositivo ya entregado", "Este dispositivo ya ha sido entregado", "warning");
          return Promise.reject(); // Rechazar la promesa para detener la ejecución
        } else {
          return swal({
            title: "¿Estás seguro?",
            text: "Se entregara este dispositivo. Esta acción no se puede deshacer.",
            icon: "warning",
            buttons: ["Cancelar", {
              text: "Entregar",
              className: "swal-button swal-button--danger", // Clase CSS personalizada para el botón
            }],
            dangerMode: true,
          }).then((confirm) => {
            if (confirm) {
              const newData = {
                ...data,
                aplicacionGarantia: true,
              };
  
              return axios.put(`${baseUrl}/${idWarranty}`, newData);
            } else {
              return Promise.reject(); // Rechazar la promesa para detener la ejecución
            }
          });
        }
      })
      .then((response) => {
        if (response) {
          swal({
            title: "Ejecución Correcta",
            text: "Se Entregó el dispositivo correctamente",
            icon: "success",
            timer: 2000,
            buttons: false,
          });
  
          setTimeout(() => {
            this.peticionGetAll();
          }, 2000);
        }
      })
      .catch(() => {
        // No se proporciona ningún error específico, ya que solo se quiere evitar el mensaje de error anterior
      });
  };
  
  
  
  


  peticionGetByIdWarranty = (idWarranty) => {
    return axios
      .get(`${baseUrl}/${idWarranty}`)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.log(error.message);
        return Promise.reject(error); // Devuelve una promesa rechazada
      });
  };


  handleChangeSearch = (event) => {
    const nombre = event.target.value;
    this.setState({ form: { ...this.state.form, nombre } });
  
    if (nombre === "") {
      this.peticionGetAll();
    } else {
      this.peticionGetbyNombre(nombre);
    }
  };

  handleClickActualizar = () => {
    this.peticionGetAll();
    this.setState({ form: { ...this.state.form, nombre: "" } });
  };

  handleClickEntregar = (id) => {
    this.peticionPut(id);
  };

  /* seleccionarWarranty = (Warranty) => {
    this.setState({
      modalEliminar: true,
      form: {
        id: Warranty.id,
        nombre: Warranty.nombre,
        tipoAparato: Warranty.tipoAparato,
        marca: Warranty.marca,
        descripcionReparacion: Warranty.descripcionReparacion,
        aplicacionGarantia: Warranty.aplicacionGarantia,
        monto: Warranty.monto,
      },
    });
  }; */


  componentDidMount() {
    this.peticionGetAll();
    //this.peticionGetbyNombre();
  }

  render() {
    return (
      <div className="App">
        <br /> <br />
        <div className="container">
          {/* <button
            className="btn btn-success button-small"
          >
            Agregar Usuario
          </button> */}
          <input type="text" placeholder="Buscar" className="search-input" 
             value={this.state.form.nombre}
             onChange={this.handleChangeSearch}
          />
             <button className="btn btn-primary buttonContainer"  onClick={this.handleClickActualizar}>
             <FontAwesomeIcon icon={faArrowsRotate} />
             </button>

        </div>
        <div className="table-container">
          <br />
          <br />
          <table className="table">
            <thead>
              <tr>
                <th className="table-heading">Id</th>
                <th className="table-heading">Cliente</th>
                <th className="table-heading">Dispositivo</th>
                <th className="table-heading">Marca</th>
                <th className="table-heading">Reparacion</th>
                <th className="table-heading">Monto</th>
                <th className="table-heading">Entregado</th>
                <th className="small-cell"></th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((salida) => {
                return (
                  <tr key={salida.id}>
                    <td>{salida.id}</td>
                    <td>{salida.nombre}</td>
                    <td>{salida.tipoAparato}</td>
                    <td>{salida.marca}</td>
                    <td>{salida.descripcionReparacion}</td>
                    <td>{'$'}{salida.monto}</td>
                    <td>{salida.aplicacionGarantia ? 'Si' : 'No'}</td>
                    <td style={{ fontSize: "1.5em" }}>
                    </td>
                    <td>
                      <div className="button-group">
                        <button className="btn btn-primary btnEntregar"
                          onClick={() => this.handleClickEntregar(salida.id)}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        {"   "}
                       {/*  <button className="btn btn-danger button-small2">
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
