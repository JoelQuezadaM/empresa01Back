import express from 'express'
import { insertarProducto, mostrar, obtenerProductos,actualizarProducto, eliminarProducto } from '../controllers/productosController.js';

export const productosRouter = express.Router();

productosRouter.get("/mostrar",mostrar)
productosRouter.post("/",insertarProducto)
productosRouter.get("/",obtenerProductos)
productosRouter.put("/:id",actualizarProducto)
productosRouter.delete("/:id",eliminarProducto)
