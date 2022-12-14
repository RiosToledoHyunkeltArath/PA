import React, { useState, useEffect } from "react";
import { NavLeft } from "../Ejercicios";
import { userAPI as api } from "../../API/userAPI";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const ReadingDoc = () => {
  const [ejercicios, setEjercicios] = useState([
    [1, {}],
    [2, {}],
    [3, {}],
    [4, {}],
    [5, {}],
    [6, {}],
    [7, {}],
    [8, {}],
    [9, {}],
    [10, {}],
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.getLeccionesReading();
        if (res.data.status === 200) {
          res.data.data.forEach((item) => {
            setEjercicios((prev) => {
              const newEjercicios = [...prev];
              newEjercicios[item.numeroLec - 1][1] = item;
              return newEjercicios;
            });
          });
        }
        console.log(res.data?.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const numbers = [1, 2, 3, 4];

  const [contadorPreguntas, setContadorPreguntas] = useState(2);

  return (
    <div>
      <div className="container">
        <div className="row">
          <NavLeft />
          <div
            className="col-md-6 flex-fill"
            style={{ marginTop: 83, paddingLeft: 52 }}
          >
            <div>
              <ul
                className="nav nav-tabs flex-column"
                role="tablist"
                style={{ width: "20%!important", float: "left" }}
              >
                {ejercicios.map((ejercicio, index) => (
                  <li key={index} className="nav-item" role="presentation">
                    <a
                      className="nav-link fw-bolder link-secondary"
                      role="tab"
                      data-bs-toggle="tab"
                      href={`#tab-${ejercicio[0]}`}
                    >
                      Lección Reading {ejercicio[0]}
                    </a>
                  </li>
                ))}
              </ul>
              <div
                className="tab-content"
                style={{ width: "80%!important", float: "right" }}
              >
                {ejercicios.map((ejercicio, index) => (
                  <div
                    className="tab-pane"
                    role="tabpanel"
                    id={`tab-${ejercicio[0]}`}
                    key={index}
                  >
                    {ejercicio[1].idLec ? (
                      <>
                        <div className="card mb-3">
                          <img
                            src={`../../public/uploads/${ejercicio[1].urlLec}`}
                            className="card-img-top"
                            alt="..."
                          />
                          <div className="card-body">
                            {numbers.map((number, index) => {
                              const [respuesta, ...rest] =
                                ejercicio[1]?.respuestaLec?.split(":::");
                              const bool = (respuesta - 1) === index;
                              if (rest[index]) {
                                return (
                                  <div className="form-check" key={index}>
                                    <input
                                      disabled
                                      className="form-check-input"
                                      type="checkbox"
                                      id="flexCheckDefault"
                                      checked={bool}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor="flexCheckDefault"
                                    >
                                      {rest[index]}
                                    </label>
                                  </div>
                                );
                              }
                            })}
                            <br />
                          </div>
                        </div>
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={async () => {
                              const res = await api.deleteLeccionReading(
                                ejercicio[1].idLec
                              );
                              console.log(res);
                              if (res.data.status) {
                                MySwal.fire({
                                  icon: "success",
                                  title: "Lección eliminada",
                                  text: res.data.message,
                                  showConfirmButton: false,
                                  timer: 1500,
                                }).then(() => {
                                  window.location.reload();
                                });
                              } else {
                                MySwal.fire({
                                  icon: "error",
                                  title: "Error al eliminar",
                                  text: res.data.message,
                                  showConfirmButton: false,
                                  timer: 1500,
                                });
                              }
                            }}
                          >
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Borrar
                            lección&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </button>
                        </div>
                        <br />
                      </>
                    ) : (
                      <>
                        <h2>Leccion {ejercicio[0]}</h2>
                        <form
                          encType="multipart/form-data"
                          method="POST"
                          action="/api/v1/lecciones/crearLeccionReading"
                        >
                          <input
                            type="hidden"
                            name="numero"
                            value={ejercicio[0]}
                          />
                          <div className="mb-3">
                            <label htmlFor="formFileSm" className="form-label">
                              Elige una imagen de lectura
                            </label>
                            <input
                              className="form-control form-control-sm"
                              id={`formFileSm-${ejercicio[0]}`}
                              type="file"
                              name="fileImg"
                            />
                          </div>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            defaultValue={2}
                            onChange={(e) => {
                              console.log(e.target.value);
                              setContadorPreguntas(e.target.value);
                            }}
                            placeholder="Selecciona el número de preguntas"
                          >
                            <option value={2}>Dos</option>
                            <option value={3}>Tres</option>
                            <option value={4}>Cuatro</option>
                          </select>
                          <br />
                          <hr />
                          {numbers.map((number, index) => {
                            if (contadorPreguntas >= number) {
                              return (
                                <div className="form-floating mb-3" key={index}>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id={`floatingInput-${ejercicio[0]}-${number}`}
                                    placeholder="Pregunta"
                                    name="opciones"
                                  />
                                  <label
                                    htmlFor={`floatingInput-${ejercicio[0]}-${number}`}
                                  >
                                    Ingresa la opcion {number}
                                  </label>
                                </div>
                              );
                            } else {
                              return null;
                            }
                          })}
                          <div className="form-floating">
                            <input
                              type="number"
                              min={1}
                              max={contadorPreguntas}
                              className="form-control"
                              id={`floatingPassword-${ejercicio[0]}`}
                              placeholder="Opciones"
                              name="respuesta"
                            />
                            <label htmlFor={`floatingPassword-${ejercicio[0]}`}>
                              Ingresa la opción correcta
                            </label>
                          </div>
                          <br />
                          <div className="col-auto">
                            <button
                              type="submit"
                              className="btn btn-primary mb-3"
                            >
                              Enviar
                            </button>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingDoc;
