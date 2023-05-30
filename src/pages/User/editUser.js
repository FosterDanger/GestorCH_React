import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";
import swal from "sweetalert";

const baseUrl = "https://localhost:7139/api/User";

export default class editUser extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: "",
      nombreCompleto: "",
      nombreUsuario: "",
      contrasenaUsuario: "",
      tipoModal: "",
    },
    usuarioSeleccionadoId: null,
  };

  
  peticionGet = () => {
    delete this.state.form.id;
    axios
      .get(baseUrl)
      .then((response) => {
        this.setState({ data: response.data.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionPost = async () => {
    const { form } = this.state;
    if (!form || Object.keys(form).length === 0) {
      swal("Formulario vacío", "Por favor completa todos los campos", "warning");
      return;
    }

    const { nombreCompleto, nombreUsuario, contrasenaUsuario } =
      this.state.form;
    if (!nombreCompleto || !nombreUsuario || !contrasenaUsuario) {
      swal("Campos vacíos", "Por favor completa todos los campos", "warning");
      return;
    }
    await axios
      .post(baseUrl, this.state.form)
      .then((response) => {
        swal({
          title: "Ejecución Correcta",
          text: "Se agregó un nuevo usuario correctamente",
          icon: "success",
          timer: 2000,
          buttons: false,
        });

        setTimeout(() => {
        }, 2000);
        this.modalInsertar();
        this.peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionPut = (idUser) => {
    const { nombreCompleto, nombreUsuario, contrasenaUsuario } =
      this.state.form;
    const newData = {
      id: idUser,
      nombreCompleto,
      nombreUsuario,
      contrasenaUsuario,
    };
    if (!nombreCompleto || !nombreUsuario || !contrasenaUsuario) {
      swal("Campos vacíos", "Por favor completa todos los campos", "warning");
      return;
    }

    axios
      .put(`${baseUrl}/${idUser}`, newData)
      .then((response) => {
        swal({
          title: "Ejecución Correcta",
          text: "Se editó un usuario correctamente",
          icon: "success",
          timer: 2000,
          buttons: false,
        });

        setTimeout(() => {
        }, 2000);
        this.peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        this.modalInsertar();
      });
  };

  peticionDelete = (idUser) => {
    axios.delete(`${baseUrl}/${idUser}`).then((response) => {
      swal({
        title: "Ejecución Correcta",
        text: "Se eliminó un usuario correctamente",
        icon: "success",
        timer: 2000,
        buttons: false,
      });

      setTimeout(() => {
      }, 2000);
      this.peticionGet();
      this.setState({ modalEliminar: false });
      this.peticionGet();
    });
  };

  modalInsertar = () => {
    /* this.setState({
      form: {
        nombreCompleto: '',
        nombreUsuario: '',
        contrasenaUsuario: ''
      },
      modalInsertar: true
    }); */
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarUsuario = (usuario) => {
    this.setState({
      tipoModal: "actualizar",
      form: {
        id: usuario.id,
        nombreCompleto: usuario.nombreCompleto,
        nombreUsuario: usuario.nombreUsuario,
        contrasenaUsuario: usuario.contrasenaUsuario,
      },
      usuarioSeleccionadoId: usuario.id,
    });
  };

  handleChange = async (e) => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <br /> <br />
        <div className="button-container">
          <button
            className="btn btn-success button-small"
            onClick={() => {
              this.setState({ form: null, tipoModal: "insertar" });
              this.modalInsertar();
            }}
          >
            Agregar Usuario
          </button>
        </div>
        <div className="table-container">
          <br />
          <br />
          <table className="table">
            <thead>
              <tr>
                <th className="table-heading">Id</th>
                <th className="table-heading">Nombre Completo</th>
                <th className="table-heading">Nombre de Usuario</th>
                <th className="table-heading">Contraseña</th>
                <th className="small-cell"></th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((usuario) => {
                return (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nombreCompleto}</td>
                    <td>{usuario.nombreUsuario}</td>
                    <td style={{ fontSize: "1.5em" }}>
                      {"*".repeat(usuario.contrasenaUsuario.length)}
                    </td>
                    <td>
                      <div className="button-group">
                        <button
                          className="btn btn-primary button-smallDispositivo1"
                          onClick={() => {
                            this.seleccionarUsuario(usuario);
                            this.modalInsertar();
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        {"   "}
                        <button
                          className="btn btn-danger button-smallDispositivo1"
                          onClick={() => {
                            this.seleccionarUsuario(usuario);
                            this.setState({ modalEliminar: true });
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Modal isOpen={this.state.modalInsertar}>
            <ModalHeader style={{ display: "block" }}>
              <span style={{ float: "left" }}>
                {this.state.tipoModal === "insertar"
                  ? "Nuevo Usuario"
                  : "Editar Usuario"}
              </span>
              <span
                style={{ float: "right", cursor: "pointer" }}
                onClick={() => this.modalInsertar()}
              >
                x
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="form-group">
                <label htmlFor="id">Nombre Completo:</label>
                <input
                  className="form-control"
                  type="text"
                  name="nombreCompleto"
                  id="nombreCompleto"
                  onChange={this.handleChange}
                  value={form ? form.nombreCompleto : ""}
                />
                <br />
                <label htmlFor="nombre">Nombre de Usuario:</label>
                <input
                  className="form-control"
                  type="text"
                  name="nombreUsuario"
                  id="nombreUsuario"
                  onChange={this.handleChange}
                  value={form ? form.nombreUsuario : ""}
                />
                <br />
                <label htmlFor="nombre">Contraseña:</label>
                <input
                  className="form-control"
                  type="text"
                  name="contrasenaUsuario"
                  id="contrasenaUsuario"
                  onChange={this.handleChange}
                  value={form ? form.contrasenaUsuario : ""}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <div className="button-group">
                {this.state.tipoModal === "insertar" ? (
                  <button
                    className="btn btn-success button-small-modal"
                    onClick={() => this.peticionPost()}
                  >
                    Insertar
                  </button>
                ) : (
                  <button
                    className="btn btn-primary button-small-modal"
                    onClick={() =>
                      this.peticionPut(
                        form.id,
                        form.nombreCompleto,
                        form.nombreUsuario,
                        form.contrasenaUsuario
                      )
                    }
                  >
                    Actualizar
                  </button>
                )}
                <button
                  className="btn btn-danger button-small-modal"
                  onClick={() => this.modalInsertar()}
                >
                  Cancelar
                </button>
              </div>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
              Estás seguro de eliminar al Usuario{" "}
              <strong>{form && form.nombreCompleto}</strong> con Id{" "}
              <strong>{form && form.id}</strong>
            </ModalBody>
            <ModalFooter>
              <button
                className="btn btn-danger button-small-modal-Error-1"
                onClick={() => this.peticionDelete(form.id)}
              >
                Sí
              </button>
              <button
                className="btn btn-secundary button-small-modal-Error-2"
                onClick={() => this.setState({ modalEliminar: false })}
              >
                No
              </button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}
