import { Router } from "express";

import { muestraPermisosRol } from '../controllers/permisosController.js';

export const permisosRouter = Router();

permisosRouter.get("/:rol_id", muestraPermisosRol);
