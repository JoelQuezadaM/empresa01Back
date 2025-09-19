import { pool } from "../config/db.js";


export const muestraPermisosRol = async(req,res)=>{
    try{
       const {rol_id} = req.params;
        
        console.log('mostrando roles')
        console.log(rol_id)
        const [respuesta] = await pool.query('select rol_permiso.rol_id,rol_permiso.permiso_id,permisos.nombre from rol_permiso left join permisos on permisos.id=rol_permiso.permiso_id where rol_permiso.rol_id = ?',rol_id)
        console.log(respuesta)
        res.json(respuesta)
    }catch(error){
        console.log(error)
    }
}
