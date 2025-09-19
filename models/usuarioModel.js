import { pool} from "../config/db.js"

export const obtenerDerechos = async(rol_id)=>{
    try{
        // const [respuesta] = await pool.query(' select * from usuarios where id =?',[id])
        const [respuesta] = await pool.query('select modulos.nombre nombreModulo,permisos.nombre permiso from rol_permiso left join permisos on permisos.permiso_id=rol_permiso.permiso_id left join modulos on modulos.modulo_id = rol_permiso.modulo_id where rol_permiso.rol_id= ?',rol_id)
        return respuesta
    }catch(error){
       console.error('Error al obtener los derechos del usuario:', error); 

    }
}