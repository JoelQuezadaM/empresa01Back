import { Router } from "express";
import { mostrarPagina } from "../controllers/productosPaginaController.js";

export const productosPaginaRoutes = Router()


productosPaginaRoutes.get("/",mostrarPagina)