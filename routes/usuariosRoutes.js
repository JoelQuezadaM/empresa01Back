import { Router } from "express";
import { registrarUsuario,confirmar,login, perfil,olvidePassword,comprobarToken, nuevoPassword, obtenerUsuarios, obtenerUsuariosPagina, actualizarUsuario, crearUsuario, eliminarUsuario } from "../controllers/usuariosController.js";
import { checkAuth } from '../middleware/authMiddleware.js';
import { subirFoto } from "../middleware/multerConfig.js";

export const usuariosRouter = Router();

//area publica
usuariosRouter.post("/",registrarUsuario)
usuariosRouter.get("/confirmar/:idConfirmar",confirmar)
usuariosRouter.post("/login",login)

usuariosRouter.post("/olvide-password",olvidePassword);
usuariosRouter.get("/olvide-password/:token",comprobarToken);
usuariosRouter.post("/olvide-password/:token",nuevoPassword);

//area privada
usuariosRouter.get('/perfil',checkAuth, perfil)
usuariosRouter.get('/',obtenerUsuariosPagina)

// usuariosRouter.put('/:id',actualizarUsuario)
usuariosRouter.put('/:id', subirFoto.single('foto'), actualizarUsuario);
usuariosRouter.post('/crear',subirFoto.single('foto'),crearUsuario)
usuariosRouter.delete('/:id',eliminarUsuario)