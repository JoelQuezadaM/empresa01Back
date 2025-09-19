import express from 'express'
import { muestraRolPermiso } from '../controllers/rolPermisoController.js'

export const rolPermisoRoutes = express.Router()

rolPermisoRoutes.get('/mostrar/:rol_id',muestraRolPermiso)
