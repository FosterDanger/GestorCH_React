import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Registros.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";
import swal from "sweetalert";
import QRCode from "react-qr-code";

const baseUrlAparato = "https://localhost:7139/api/Apparatus";
const baseUrlCliente = "https://localhost:7139/api/Customer";
const baseURLDireccion = "https://localhost:7139/api/CustomerAddress";



export default class editEquipoElectronico extends Component {
  state = {
    dataAparato: [],
    dataCliente: [],
    dataDireccionCliente: [],
    modalInsertarDireccionCliente: false,
    modalInsertarCliente: false,
    modalInsertarAparato: false,
    modalQR: false,
    modalEliminar: false,
    form: {
      id: "",
      fKIdCliente: "",
      fechaRecepcion: "",
      tipoAparato: "",
      marca: "",
      descripcionProblematica: "",
      descripcionAdicional: "",
      ubicacionEstante: "",
      tipoModalAparato: "",
    },
    formArray: [],
    formDireccion: {
      id: "",
      calle: "",
      colonia: "",
      numeroExterior: "",
      numeroInterior: "",
      tipoModalDireccion: "",
    },
    formDireccionArray: [],
    formCliente: {
      id: "",
      fkidDireccionCliente: "",
      nombre: "",
      telefono: "",
      tipoModalCliente: "",
    },
    formClienteArray: [],
  };

  peticionGetAparato = () => {
    delete this.state.form.id;
    axios
      .get(baseUrlAparato)
      .then((response) => {
        this.setState({ dataAparato: response.data.data });
        // Obtener los datos del cliente para cada aparato
        const promises = response.data.data.map((aparato) =>
          this.peticionGetByIdCliente(aparato.fKIdCliente)
        );
        Promise.all(promises)
          .then((clientes) => {
            this.setState({ dataCliente: clientes });
          })
          .catch((error) => {
            console.log(error.message);
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionGetDireccion = (callback) => {
    delete this.state.formDireccion.id;
    axios
      .get(baseURLDireccion)
      .then((response) => {
        this.setState({ dataDireccionCliente: response.data.data }, callback);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionGetCliente = (callback) => {
    delete this.state.formCliente.id;
    axios
      .get(baseUrlCliente)
      .then((response) => {
        this.setState({ dataCliente: response.data.data }, callback);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  /* peticionGetCliente = () => {
    axios
      .get(baseUrlCliente)
      .then((response) => {
        console.log(response.data.data);
        this.setState({ dataCliente: response.data.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  }; */

  peticionGetByIdCliente = (idCliente) => {
    return axios
      .get(`${baseUrlCliente}/${idCliente}`)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.log(error.message);
        return Promise.reject(error); // Devuelve una promesa rechazada
      });
  };

  peticionGetByIdAparato = (idAparato) => {
    return axios
      .get(`${baseUrlAparato}/${idAparato}`)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.log(error.message);
        return Promise.reject(error); // Devuelve una promesa rechazada
      });
  };

  peticionGetDireccionbyIdAparato = (idAparato) => {
    return axios
      .get(`${baseURLDireccion}/customer/${idAparato}`)
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.log(error.message);
        return Promise.reject(error); // Devuelve una promesa rechazada
      });
  }

  peticionPostDireccion = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(baseURLDireccion, this.state.formDireccion)
        .then((response) => {
          /* swal({
            title: "Ejecución Correcta",
            text: "Se agregó un nuevo usuario correctamente",
            icon: "success",
            timer: 2000,
            buttons: false,
          }); */

          /* setTimeout(() => {
          }, 2000);
          this.modalInsertar();
          this.peticionGet(); */

          resolve(); // Resolver la promesa sin devolver ningún valor adicional
        })
        .catch((error) => {
          console.log(error.message);
          reject(error); // Rechazar la promesa con el error correspondiente
        });
    });
  };

  peticionPostCliente = (formClientwithfkDireccion) => {
    return new Promise((resolve, reject) => {
      axios
        .post(baseUrlCliente, formClientwithfkDireccion)
        .then((response) => {
          /* swal({
            title: "Ejecución Correcta",
            text: "Se agregó un nuevo usuario correctamente",
            icon: "success",
            timer: 2000,
            buttons: false,
          }); */

          /* setTimeout(() => {
          }, 2000);
          this.modalInsertar();
          this.peticionGet(); */

          resolve(); // Resolver la promesa sin devolver ningún valor adicional
        })
        .catch((error) => {
          console.log(error.message);
          reject(error); // Rechazar la promesa con el error correspondiente
        });
    });
  };

  peticionPostAparato = (formClientwithfKIdCliente) => {
    return new Promise((resolve, reject) => {
      axios
        .post(baseUrlAparato, formClientwithfKIdCliente)
        .then((response) => {
           swal({
            title: "Ejecución Correcta",
            text: "Se agregó un nuevo Dispositivo correctamente",
            icon: "success",
            timer: 2300,
            buttons: false,
          }); 

           setTimeout(() => {
          }, 2300);
          this.modalInsertarAparato();
          this.peticionGetAparato(); 

          resolve(); // Resolver la promesa sin devolver ningún valor adicional
        })
        .catch((error) => {
          console.log(error.message);
          reject(error); // Rechazar la promesa con el error correspondiente
        });
    });
  };

  peticionPutDireccionCliente = (idDireccionCliente) => {
    const { calle, colonia, numeroExterior, numeroInterior } =
      this.state.formDireccion;
    const newData = {
      id: idDireccionCliente,
      calle,
      colonia,
      numeroExterior,
      numeroInterior,
    };

    /* if (!nombreCompleto || !nombreUsuario || !contrasenaUsuario) {
      swal("Campos vacíos", "Por favor completa todos los campos", "warning");
      return;
    } */

    axios
      .put(`${baseURLDireccion}/${idDireccionCliente}`, newData)
      .then((response) => {
       /*  swal({
          title: "Ejecución Correcta",
          text: "Se editó un usuario correctamente",
          icon: "success",
          timer: 2000,
          buttons: false,
        });

        setTimeout(() => {
        }, 2000);
        this.peticionGetDireccion();*/
      }) 
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        //this.modalInsertarDireccionCliente();
      });
  };

  peticionPutCliente = (idCliente) => {
    const { nombre, telefono } = this.state.formCliente;
    const { id } = this.state.formDireccion;
    const fK_idDireccionCliente = id;
    const newData = {
      id: idCliente,
      fK_idDireccionCliente,
      nombre,
      telefono,
    };
   /*  if (!fkidDireccionCliente || !nombre || !telefono) {
      swal("Campos vacíos", "Por favor completa todos los campos", "warning");
      return;
    } */
  
    axios
      .put(`${baseUrlCliente}/${idCliente}`, newData)
      .then((response) => {
        /* swal({
          title: "Ejecución Correcta",
          text: "Se editó un cliente correctamente",
          icon: "success",
          timer: 2000,
          buttons: false,
        });
  
        setTimeout(() => {
          this.peticionGetCliente();
        }, 2000); */
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
       // this.modalInsertarCliente();
      });
  };

  imprimirQR = () =>{
     swal({
          title: "Operacion Fallida",
          text: "No hay Impresoras vinculadas...",
          icon: "error",
          timer: 2000,
          buttons: false,
        });
  
        setTimeout(() => {
          this.peticionGetCliente();
        }, 2000); 
      
  }

  peticionPutAparato = (idAparato) => {
    const {
      fKIdCliente,
      fechaRecepcion,
      tipoAparato,
      marca,
      descripcionProblematica,
      descripcionAdicional,
      ubicacionEstante,
    } = this.state.form;
    const newData = {
      id: idAparato,
      fKIdCliente,
      fechaRecepcion,
      tipoAparato,
      marca,
      descripcionProblematica,
      descripcionAdicional,
      ubicacionEstante,
    };
    if (
      !fKIdCliente ||
      !fechaRecepcion ||
      !tipoAparato ||
      !marca ||
      !descripcionProblematica ||
      !descripcionAdicional ||
      !ubicacionEstante
    ) {
      swal("Campos vacíos", "Por favor completa todos los campos", "warning");
      return;
    }
  
    axios
      .put(`${baseUrlAparato}/${idAparato}`, newData)
      .then((response) => {
        swal({
          title: "Ejecución Correcta",
          text: "Se editó un Dispositivo correctamente",
          icon: "success",
          timer: 2000,
          buttons: false,
        });
  
        setTimeout(() => {
          this.peticionGetAparato();
        }, 2000);
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        this.modalInsertarAparato();
      });
  };

  peticionDeleteAparatoYLLavesForaneas = (idAparato) => {
    axios.delete(`${baseUrlAparato}/deleteLLaves/${idAparato}`).then((response) => {
      swal({
        title: "Ejecución Correcta",
        text: "Se eliminó un Dispositivo correctamente",
        icon: "success",
        timer: 2000,
        buttons: false,
      });

      setTimeout(() => {
      }, 2000);
      this.setState({ modalEliminar: false });
      this.peticionGetAparato();
      this.limpiarFormularios();
    });
  }
  



  modalInsertarDireccionCliente = () => {
    /* this.setState({
      form: {
        nombreCompleto: '',
        nombreUsuario: '',
        contrasenaUsuario: ''
      },
      modalInsertar: true
    }); */
    this.setState({
      modalInsertarDireccionCliente: !this.state.modalInsertarDireccionCliente,
    });
  };

  modalInsertarCliente = () => {
    this.setState({ modalInsertarCliente: !this.state.modalInsertarCliente });
  };

  modalQR = () => {
    this.setState({ modalQR: !this.state.modalQR });
  };


  modalInsertarAparato = () => {
    this.setState({ modalInsertarAparato: !this.state.modalInsertarAparato });
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

  handleChangeDireccionCliente = async (e) => {
    e.persist();
    await this.setState({
      formDireccion: {
        ...this.state.formDireccion,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleChangeCliente = async (e) => {
    e.persist();
    await this.setState({
      formCliente: {
        ...this.state.formCliente,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleModalSubmitAparato = async () => {

    const { tipoAparato, marca, descripcionProblematica, descripcionAdicional, ubicacionEstante} =
      this.state.form;
    if (!tipoAparato || !marca || !descripcionProblematica || !descripcionAdicional || !ubicacionEstante) {
      swal("Campos vacíos", "Por favor completa todos los campos", "warning");
      return;
    }
    
    this.setState(
      (prevState) => ({
        formArray: [...prevState.formArray, this.state.form],
      }),
      async () => {

        await this.peticionPostDireccion();
        await this.peticionGetDireccion( async () => {
       
          const lastRow = this.state.dataDireccionCliente[this.state.dataDireccionCliente.length - 1];
          const lastColumn = Object.values(lastRow)[Object.values(lastRow).length - 1];
          
          const formClienteWithFk = {
            ...this.state.formCliente,
            fK_idDireccionCliente: lastColumn, // Agregar el valor de lastColumn al atributo fkidDireccionCliente
          };
          
          
         await this.peticionPostCliente(formClienteWithFk);
         await this.peticionGetCliente(async()  => {

          const lastRow = this.state.dataCliente[this.state.dataCliente.length - 1];
          const lastColumn = Object.values(lastRow)[Object.values(lastRow).length - 1];
            
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const seconds = String(currentDate.getSeconds()).padStart(2, '0');
            
            const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
           
            const formAparatoWithFk = {
              ...this.state.form,
              fKIdCliente: lastColumn, // Agregar el valor de lastColumn al atributo fkidDireccionCliente
              fechaRecepcion: formattedDate,
            };
            await this.peticionPostAparato(formAparatoWithFk);
            this.limpiarFormularios();
        });

        });
      }
    );
  };

  handleModalSubmitAparatoEdit = async () => {
    const {
      tipoAparato,
      marca,
      descripcionProblematica,
      descripcionAdicional,
      ubicacionEstante,
    } = this.state.form;
  
    if (
      !tipoAparato ||
      !marca ||
      !descripcionProblematica ||
      !descripcionAdicional ||
      !ubicacionEstante
    ) {
      swal("Campos vacíos", "Por favor completa todos los campos", "warning");
      return;
    }
  
    this.setState(
      (prevState) => ({
        formArray: [...prevState.formArray, this.state.form],
      }),
      async () => {
        await this.peticionPutDireccionCliente(this.state.formDireccion.id,
          this.state.formDireccion.calle,
          this.state.formDireccion.colonia,
          this.state.formDireccion.numeroExterior,
          this.state.formDireccion.numeroInterior,
          );
        await this.peticionPutCliente(this.state.formCliente.id,
          this.state.formDireccion.id,
          this.state.formCliente.nombre,
          this.state.formCliente.telefono); // Editar el cliente existente
  
        
            await this.peticionPutAparato(this.state.form.id,
              this.state.form.fKIdCliente,
              this.state.form.fechaRecepcion,
              this.state.form.tipoAparato,
              this.state.form.marca,
              this.state.form.descripcionProblematica,
              this.state.form.descripcionAdicional,
              this.state.form.ubicacionEstante); // Editar el aparato existente
              this.limpiarFormularios();
          });

  }
  

  limpiarFormularios = () => {
    this.setState({
      form: {
        nombre: '',
        telefono: '',
      },
      formCliente: {
        nombre: '',
        telefono: '',
      },
      formDireccion: {
        calle: '',
        colonia: '',
        numeroExterior: '',
        numeroInterior: '',
      },
    });
  };

  handleModalSubmitDireccionCliente = () => {
    const { calle, colonia, numeroExterior, numeroInterior} =
      this.state.formDireccion;
    if (!calle || !colonia || !numeroExterior || !numeroInterior) {
      swal("Campos vacíos", "Por favor completa todos los campos", "warning");
      return;
    }
    
    this.setState(
      (prevState) => ({
        formDireccionArray: [
          ...prevState.formDireccionArray,
          this.state.formDireccion,
        ],
        tipoModalCliente: Object.values(this.state.formCliente).every(value => !value) ? "insertar" : "actualizar",
      }),
      () => {
        this.modalInsertarDireccionCliente();
        this.modalInsertarCliente();
      }
    );
  };

  handleModalSubmitCliente= () => {
    
     const { nombre, telefono} =
      this.state.formCliente;
    if (!nombre || !telefono) {
      swal("Campos vacíos", "Por favor completa todos los campos", "warning");
      return;
    }
    
    this.setState(
      (prevState) => ({
        formClienteArray: [
          ...prevState.formClienteArray,
          this.state.formCliente,
        ],
        tipoModalAparato: Object.values(this.state.form).every(value => !value) ? "insertar" : "actualizar",
      }),
      () => {
        this.modalInsertarCliente();
        this.modalInsertarAparato();
      }
    );
  };

  seleccionarAparato=(aparato)=>{
    
    this.peticionGetByIdAparato(aparato.id)
  .then(aparato => {
    this.setState({
      tipoModalAparato: 'actualizar',
      tipoModalDireccion: 'actualizar',
      tipoModalCliente: 'actualizar',
      form: {
        id: aparato.id,
        fKIdCliente: aparato.fKIdCliente,
        fechaRecepcion: aparato.fechaRecepcion,
        tipoAparato: aparato.tipoAparato,
        marca: aparato.marca,
        descripcionProblematica: aparato.descripcionProblematica,
        descripcionAdicional: aparato.descripcionAdicional,
        ubicacionEstante: aparato.ubicacionEstante,
        tipoModalAparato: aparato.tipoModalAparato,
      }
    });

    // Realizar la petición para obtener los datos del cliente
    this.peticionGetByIdCliente(aparato.fKIdCliente)
      .then(cliente => {
        this.setState({
          formCliente: {
            id: cliente.id,
            fkidDireccionCliente: cliente.fkidDireccionCliente,
            nombre: cliente.nombre,
            telefono: cliente.telefono,
            tipoModalCliente: cliente.tipoModalCliente,
          }
        });

        // Realizar la petición para obtener los datos de la dirección
        this.peticionGetDireccionbyIdAparato(aparato.id)
          .then(direccion => {
            this.setState({
              formDireccion: {
                id: direccion.id,
                calle: direccion.calle,
                colonia: direccion.colonia,
                numeroExterior: direccion.numeroExterior,
                numeroInterior: direccion.numeroInterior,
                tipoModalDireccion: direccion.tipoModalDireccion,
              }
            });
          })
          .catch(error => {
            // Manejo de errores de la petición de la dirección
          });
      })
      .catch(error => {
        // Manejo de errores de la petición del cliente
      });
  })
  .catch(error => {
    // Manejo de errores de la petición del aparato
  });
  }

  updateFormId = (id) => {
    this.setState({
      form: {
        ...this.state.form,
        id: id
      }
    });
  }

  limpiarid(){
    this.setState({
      form: {
        ...this.state.form,
        id: ''
      }
    });
  }

  componentDidMount() {
    this.peticionGetAparato();
    this.peticionGetDireccion();
    this.peticionGetCliente();
  }

  render() {
    const {formDireccion}=this.state;
    const {form}=this.state;
    const {formCliente}=this.state;
    
    return (
      <div className="App" >
        <br /> <br />
        <div className="button-container">
          <button
            className="btn btn-success button-small"
            onClick={() => {
              this.setState({
                //formDireccion: null,
                tipoModalDireccion: "insertar",
              });
              this.modalInsertarDireccionCliente();
            }}
          >
            Agregar Registro
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
                <th className="table-heading">Fecha de Recepción</th>
                <th className="table-heading">Tipo de Dispositivo</th>
                <th className="table-heading">Marca</th>
                <th className="table-heading">Descripción</th>
                <th className="table-heading">Ubicación Estante</th>
                <th className="small-cell"></th>
              </tr>
            </thead>
            <tbody>
              {this.state.dataAparato.map((aparato) => {
                // Buscar el cliente correspondiente en el estado dataCliente
                const cliente = this.state.dataCliente.find(
                  (cliente) => cliente.id === aparato.fKIdCliente
                );

                return (
                  <tr key={aparato.id}>
                    <td>{aparato.id}</td>
                    <td>{cliente ? cliente.nombre : ""}</td>
                    <td>{aparato.fechaRecepcion}</td>
                    <td>{aparato.tipoAparato}</td>
                    <td>{aparato.marca}</td>
                    <td>{aparato.descripcionProblematica}</td>
                    <td>{aparato.ubicacionEstante}</td>
                    <td style={{ fontSize: "1.5em" }}></td>
                    <td>
                      <div className="button-group">
                        <button className="btn btn-primary button-smallDispositivo" onClick={() => {this.seleccionarAparato(aparato); this.modalInsertarDireccionCliente();}}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        {"   "}
                        <button className="btn btn-danger button-smallDispositivo"
                          onClick={() => {
                            this.seleccionarAparato(aparato);
                            this.setState({ modalEliminar: true });
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                        {"   "}
                        <button className="btn btn-primary button-smallDispositivo button-gray"
                           onClick={() => {
                            this.updateFormId(aparato.id);
                            this.setState({ modalQR: true });
                          }}
                        >
                          <FontAwesomeIcon icon={faQrcode} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/*  Modal DireccionCliente */}

          <Modal isOpen={this.state.modalInsertarDireccionCliente}
         >
            <ModalHeader style={{ display: "block" }}
            >
              <span style={{ float: "left" }}
              >
                {this.state.tipoModalDireccion === "insertar"
                  ? "Nueva Direccion"
                  : "Editar Direccion"}
                  
              </span>
              <span
                style={{ float: "right", cursor: "pointer" }}
                onClick={() => {this.modalInsertarDireccionCliente(); this.limpiarFormularios();}}
              >
                x
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="form-group">
                <label htmlFor="id">Calle:</label>
                <input
                  className="form-control"
                  type="text"
                  name="calle"
                  id="calle"
                  onChange={this.handleChangeDireccionCliente}
                  /* onChange={this.handleChange}*/
                  value={formDireccion ? formDireccion.calle : ""}
                />
                <br />
                <label htmlFor="nombre">Ciudad y Colonia:</label>
                <input
                  className="form-control"
                  type="text"
                  name="colonia"
                  id="colonia"
                  onChange={this.handleChangeDireccionCliente}
                  /* onChange={this.handleChange}*/
                  value={formDireccion ? formDireccion.colonia : ""} 
                />
                <br />
                <label htmlFor="nombre">Numero exterior:</label>
                <input
                  className="form-control"
                  type="text"
                  name="numeroExterior"
                  id="numeroExterior"
                  onChange={this.handleChangeDireccionCliente}
                  /* onChange={this.handleChange}*/
                  value={formDireccion ? formDireccion.numeroExterior : ""} 
                />
                <br />
                <label htmlFor="nombre">Numero Interior:</label>
                <input
                  className="form-control"
                  type="text"
                  name="numeroInterior"
                  id="numeroInterior"
                  onChange={this.handleChangeDireccionCliente}
                  /* value={form ? form.nombreUsuario : ""}  */
                  value={formDireccion ? formDireccion.numeroInterior : ""} 
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <div className="button-group">
                {this.state.tipoModalDireccion === "insertar" ? (
                  <button
                    className="btn btn-success button-small-modal"
                    onClick={() => {
                      this.handleModalSubmitDireccionCliente();
                    }}
                    
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    className="btn btn-primary button-small-modal"
                    onClick={() => {this.handleModalSubmitDireccionCliente(); }}
                   
                    /*  onClick={() =>
                      this.peticionPut(
                        form.id,
                        form.nombreCompleto,
                        form.nombreUsuario,
                        form.contrasenaUsuario
                      )
                    } */
                  >
                    Siguiente
                  </button>
                )}
                <button
                  className="btn btn-danger button-small-modal"
                  onClick={() => {this.modalInsertarDireccionCliente(); this.limpiarFormularios();}}
                >
                  Cancelar
                </button>
              </div>
            </ModalFooter>
          </Modal>

           {/*  Modal QR */}

           <Modal isOpen={this.state.modalQR}
         >
            <ModalHeader style={{ display: "block" }}
            >
              <span style={{ float: "left" }}
              >
                Generar Codigo
                  
              </span>
              <span
                style={{ float: "right", cursor: "pointer" }}
                onClick={() => {this.modalQR(); this.limpiarid();}}
              >
                x
              </span>
            </ModalHeader>
            <ModalBody>
            <div className="form-group" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <QRCode value={String(this.state.form.id)} /> 
           
</div>
            </ModalBody>

            <ModalFooter>
              <div className=" centered-button-group">
               
                  <button
                    className="btn btn-success button-small-modalQR"
                    
                    onClick={() => {this.modalQR(); this.limpiarid(); this.imprimirQR();}}
                  >
                    Imprimir
                  </button>
                
                <button
                  className="btn btn-danger button-small-modalQR"
                  onClick={() => {this.modalQR(); this.limpiarid();;}}
                >
                  Cancelar
                </button>
              </div>
            </ModalFooter>
          </Modal>

          {/*  Modal Cliente */}
<div >
          <Modal isOpen={this.state.modalInsertarCliente} autoFocus >
            <ModalHeader style={{ display: "block" }}>
              <span style={{ float: "left" }}>
                {this.state.tipoModalCliente === "insertar"
                  ? "Nuevo Cliente"
                  : "Editar Cliente"}
              </span>
              <span
                style={{ float: "right", cursor: "pointer" }}
                onClick={() => {this.modalInsertarCliente(); this.limpiarFormularios();}}
              >
                x
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  className="form-control"
                  type="text"
                  name="nombre"
                  id="nombre"
                  onChange={this.handleChangeCliente}
                  /* onChange={this.handleChange}*/
                  value={formCliente ? formCliente.nombre : ""} 
                />
                <br />
                <label htmlFor="telefono">Telefono:</label>
                <input
                  className="form-control"
                  type="text"
                  name="telefono"
                  id="telefono"
                  onChange={this.handleChangeCliente}
                  /* onChange={this.handleChange}*/
                  value={formCliente ? formCliente.telefono : ""}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <div className="button-group">
                {this.state.tipoModalCliente === "insertar" ? (
                  <button
                    className="btn btn-success button-small-modal"
                    /*   onClick={() => this.peticionPost()} */
                   
                      onClick={() => {this.handleModalSubmitCliente(); }}
                  
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    className="btn btn-primary button-small-modal"
                    onClick={() => {this.handleModalSubmitCliente(); }}
                    /*  onClick={() =>
                      this.peticionPut(
                        form.id,
                        form.nombreCompleto,
                        form.nombreUsuario,
                        form.contrasenaUsuario
                      )
                    } */
                  >
                    Siguiente
                  </button>
                )}
                <button
                  className="btn btn-danger button-small-modal"
                  onClick={() => {this.modalInsertarCliente(); this.limpiarFormularios();}}
                >
                  Cancelar
                </button>
              </div>
            </ModalFooter>
          </Modal>
          </div>

          {/* Modal Aparato */}

          <Modal isOpen={this.state.modalInsertarAparato} className="Modal-no">
            <ModalHeader style={{ display: "block" }}>
              <span style={{ float: "left" }}>
                {this.state.tipoModalAparato === "insertar"
                  ? "Nuevo Dispositivo"
                  : "Editar Dispositivo"}
              </span>
              <span
                style={{ float: "right", cursor: "pointer" }}
                onClick={() => {this.modalInsertarAparato(); this.limpiarFormularios();}}
              >
                x
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="form-group">
                <label htmlFor="tipoAparato">Tipo de Aparato:</label>
                <input
                  className="form-control"
                  type="text"
                  name="tipoAparato"
                  id="tipoAparato"
                  onChange={this.handleChange}
                  /* onChange={this.handleChange}*/
                  value={form ? form.tipoAparato : ""} 
                />
                <br />
                <label htmlFor="marca">Marca:</label>
                <input
                  className="form-control"
                  type="text"
                  name="marca"
                  id="marca"
                  onChange={this.handleChange}
                  /* onChange={this.handleChange}*/
                  value={form ? form.marca : ""} 
                />
                <br />
                <label htmlFor="descripcionProblematica">Descripción:</label>
                <input
                  className="form-control"
                  type="text"
                  name="descripcionProblematica"
                  id="descripcionProblematica"
                  onChange={this.handleChange}
                  /* onChange={this.handleChange}*/
                  value={form ? form.descripcionProblematica : ""} 
                />
                <br />
                <label htmlFor="descripcionAdicional">
                  Descripción Adicional:
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="descripcionAdicional"
                  id="descripcionAdicional"
                  onChange={this.handleChange}
                  /* onChange={this.handleChange}*/
                  value={form ? form.descripcionAdicional : ""} 
                />
                <br />
                <label htmlFor="ubicacionEstante">
                  Ubicacion en el Estante:
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="ubicacionEstante"
                  id="ubicacionEstante"
                  onChange={this.handleChange}
                  /* onChange={this.handleChange}*/
                  value={form ? form.ubicacionEstante : ""} 
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <div className="button-group">
                {this.state.tipoModalAparato === "insertar" ? (
                  <button
                    className="btn btn-success button-small-modal"
                    onClick={() => this.handleModalSubmitAparato()}
                  >
                    Registrar
                  </button>
                ) : (
                  <button
                    className="btn btn-primary button-small-modal"
                    onClick={() => this.handleModalSubmitAparatoEdit()}
                    /*  onClick={() =>
                      this.peticionPut(
                        form.id,
                        form.nombreCompleto,
                        form.nombreUsuario,
                        form.contrasenaUsuario
                      )
                    } */
                  >
                    Actualizar
                  </button>
                )}
                <button
                  className="btn btn-danger button-small-modal"
                  onClick={() => {this.modalInsertarAparato(); this.limpiarFormularios();}}
                >
                  Cancelar
                </button>
              </div>
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
              Estás seguro de eliminar al Dispositivo{" "}
              <strong>{form && form.tipoAparato}</strong> {" "}  <strong>{form && form.marca}</strong> {" "}  con Id{" "}
              <strong>{form && form.id}</strong>
            </ModalBody>
            <ModalFooter>
              <button
                className="btn btn-danger button-small-modal-Error-1"
                onClick={() => this.peticionDeleteAparatoYLLavesForaneas(form.id)}
              >
                Sí
              </button>
              <button
                className="btn btn-secundary button-small-modal-Error-2"
                onClick={() => {this.setState({ modalEliminar: false }); this.limpiarFormularios();}}
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
