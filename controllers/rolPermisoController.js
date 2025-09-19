import { pool } from "../config/db.js";


export const muestraRolPermiso = async(req,res)=>{
    try{
       const {rol_id} = req.params;
        
        console.log('mostrando roles')
        console.log(rol_id)
        const [respuesta] = await pool.query('select rol_permiso.rol_id,rol_permiso.modulo_id, rol_permiso.permiso_id,modulos.nombre nombreModulo,permisos.nombre permiso from rol_permiso left join permisos on permisos.permiso_id=rol_permiso.permiso_id left join modulos on modulos.modulo_id = rol_permiso.modulo_id where rol_permiso.rol_id= ?',rol_id)
        console.log(respuesta)
        res.json(respuesta)
    }catch(error){
        console.log(error)
    }
}
