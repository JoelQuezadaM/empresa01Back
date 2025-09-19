import express from 'express'
import { actualizarPedido, agregarPedido, eliminarPedido, mostrarPedidos, mostrarUnPedido } from '../controllers/pedidosController.js'


export const pedidosRouter = express.Router()

pedidosRouter.get("/mostrar",mostrarPedidos)
pedidosRouter.get("/mostrar/:id_pedido",mostrarUnPedido)


pedidosRouter.post("/",agregarPedido)
pedidosRouter.put("/:id_pedido",actualizarPedido)
pedidosRouter.delete("/:id_pedido",eliminarPedido)