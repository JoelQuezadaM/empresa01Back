import express from 'express'
import { actualizarPedidoDetalle, eliminarPedidoDetalles, insertarPedidoDetalles, mostrarPedidoDetalles } from '../controllers/pedidoDetallesController.js'


export const pedidoDetallesRouter = express.Router()

pedidoDetallesRouter.get("/mostrar/:id_pedido",mostrarPedidoDetalles)
pedidoDetallesRouter.post("/:id",insertarPedidoDetalles)
pedidoDetallesRouter.delete("/:id_pedido_detalle",eliminarPedidoDetalles)

pedidoDetallesRouter.put('/:id_pedido_detalle',actualizarPedidoDetalle)