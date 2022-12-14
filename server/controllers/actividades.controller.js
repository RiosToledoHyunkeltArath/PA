import { pool } from "../DB/pool.js";
import { NODE_ENV, SECRET_KEY } from "../config.js";
import jwt from "jsonwebtoken";

export const createTestActivity = async (req, res) => {
  const { numero, preguntaAbierta, siono } = req.body;
  if (!numero) {
    return res.json({ message: "faltan datos", status: 400 });
  }
  const token = req.session?.token;
  if (!token) {
    return res.json({ message: "no estas logueado", status: 401 });
  }
  const { id } = jwt.verify(token, SECRET_KEY);
  const [rows3] = await pool.query(
    "insert into actividades(tipoAct, respuestaAct, numeroAct, idUsu) values (?, ?, ?, ?);",
    ["test", preguntaAbierta || siono, numero, id]
  );
  if (rows3.length === 0) {
    return res.json({ message: "no se pudo crear la actividad", status: 400 });
  }
  return res.redirect("/app/ejercicios/test");
};
export const getTestsActivity = async (req, res) => {
  const token = req.session?.token;
  if (!token) {
    return res.json({ message: "no estas logueado", status: 401 });
  }
  const { id } = jwt.verify(token, SECRET_KEY);
  const [rows] = await pool.query(
    "select * from actividades where idUsu = ? and tipoAct = ?;",
    [id, "test"]
  );
  if (rows.length === 0) {
    return res.json({ message: "no hay actividades", status: 400 });
  }
  return res.json({ message: "ok", status: 200, data: rows });
};
export const createVocabularyActivity = async (req, res) => {
  const { numero, respuesta } = req.body;
  if (!numero || !respuesta) {
    return res.json({ message: "faltan datos", status: 400 });
  }
  const token = req.session?.token;
  if (!token) {
    return res.json({ message: "no estas logueado", status: 401 });
  }
  const { id } = jwt.verify(token, SECRET_KEY);
  const [rows3] = await pool.query(
    "insert into actividades(tipoAct, respuestaAct, numeroAct, idUsu) values (?, ?, ?, ?);",
    ["vocabulary", respuesta, numero, id]
  );
  if (rows3.length === 0) {
    return res.json({ message: "no se pudo crear la actividad", status: 400 });
  }
  return res.redirect("/app/ejercicios/vocabulario");
};
export const getVocabularyActivity = async (req, res) => {
  const token = req.session?.token;
  if (!token) {
    return res.json({ message: "no estas logueado", status: 401 });
  }
  const { id } = jwt.verify(token, SECRET_KEY);
  const [rows] = await pool.query(
    "select * from actividades where idUsu = ? and tipoAct = ?;",
    [id, "vocabulary"]
  );
  if (rows.length === 0) {
    return res.json({ message: "no hay actividades", status: 400 });
  }
  return res.json({ message: "ok", status: 200, data: rows });
}