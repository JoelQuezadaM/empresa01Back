import jwt  from "jsonwebtoken"
import { pool } from "../config/db.js";
import { config } from "dotenv";
import { obtenerDerechos } from "../models/usuarioModel.js";


export const checkAuth = async(req,res,next)=>{
    console.log('entrando al checAuth')
    console.log(req.headers.authorization)
    let token;
    if( req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")){
            try{
                console.log('entro al try en checkAut')
                token = req.headers.authorization.split(" ")[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                const [usuario] = await pool.query('select id,nombre,rol_id from usuarios where id = ?',decoded.id)
                console.log('usuario')
                console.log(usuario[0])
                req.usuario=usuario[0]
                //agregamos lo de derechos
                console.log('obteniendo derechos')
                console.log(obtenerDerechos(usuario[0].rol_id))
                const derechos=await obtenerDerechos(usuario[0].rol_id)
                req.derechos=derechos
                return next();
            }catch(error){
                console.log('token no valido')
                const e = new Error("Token no valido");
                res.status(403).json({msg: e.message});
            }
    }
    if (!token){
        const error = new Error("Token no valido o inexistente")
        res.status(403).json({msg:error.message})
    }
    next();
}