import express from 'express'
import { muestraRoles } from '../controllers/rolesController.js';

const rolesRouter = express.Router();

rolesRouter.get("/",muestraRoles);

export default rolesRouter;