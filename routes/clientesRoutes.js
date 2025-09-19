import express from 'express'
import { mostrar,actualizarCliente,perfil, agregarCliente,eliminarCliente } from '../controllers/clientesController.js';

const clientesRouter = express.Router();

clientesRouter.get("/mostrar",mostrar)
clientesRouter.post("/",agregarCliente)
clientesRouter.get("/perfil",perfil)

clientesRouter.route('/:idCliente')
.put(actualizarCliente)
.delete(eliminarCliente)
// .get(autenticarUsuario,obtenerPedido)

export default clientesRouter;