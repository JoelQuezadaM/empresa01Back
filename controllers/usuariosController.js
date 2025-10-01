import { pool} from "../config/db.js"
import emailOlvidePassword from "../helpers/emailOlvidePassword.js"
import emailRegistro from "../helpers/emailRegistro.js"
import { generarJWT } from "../helpers/generarJWT.js"
import { generaIdConfirmaCuenta } from "../helpers/idConfirmaCuenta.js"
import bcrypt from "bcrypt"

import fs from 'fs';
import path from 'path';
import { rutas } from "../config/rutas.js" // Ajusta la ruta según tu estructura

export const registrarUsuario = async(req, res)=>{
    const {nombre,password,email}=req.body

    try{
        const [respuesta] = await pool.query(' select * from usuarios where email =?',[email])
        // res.json({msg:"Registgrando usuario..."})
        if (respuesta.length>0){
            const error = new Error("El usuario ya esta registrado")
            return res.status(400).json({msg:error.message})
        }
        const salt = await bcrypt.genSalt(10);
        const encriptado = await bcrypt.hash(password,salt);
        
        const token =generaIdConfirmaCuenta()

        const [result]= await pool.query('insert into usuarios (nombre,email,password,token) values (?,?,?,?)',[nombre,email,encriptado,token])
        
        //enviar correo
        emailRegistro({
            email,nombre,token
        })

        res.json(result.insertId)
    }catch(error){
        console.log(error)
    }
}

export const confirmar = async(req,res)=>{
    const {idConfirmar} = req.params
    
    const [result] = await pool.query('select * from usuarios where token =?',[idConfirmar])
    if (result.length>0){
        try{
            await pool.query('update usuarios set confirmado = ?, token=? where token = ?',[1,null,idConfirmar])
            res.json({msg:"Cuenta confirmada"})
        }catch (error){
            console.log(error)
        }

    }else{
        const error = new Error('Token no valido')
        return res.status(404).json({msg: error.message}) 
    }
}

export const login = async(req,res) =>{
    //autenticar
    //primero checamos si existe
    console.log(req.body)
    const {email,password} = req.body
    const [usuario] = await pool.query('select * from usuarios where email = ?',email)
    // console.log(`usuario ${usuario}`)
    // console.log(usuario[0].password)
    if (usuario.length<=0){
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg:error.message})
    }
    //comprobar si el usuario esta confirmado
    //0=no confirmad 1=confirmada
    if (usuario.confirmado==0){
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({msg:error.message})
    }
    const usuarioPassword = usuario[0].password
    console.log('antes del await')
    console.log(usuario[0].password)
    const iguales=await bcrypt.compare(password,usuarioPassword)
    //comprobamos si el password es valido 
    if (iguales){
        console.log('password correcto')
        console.log(usuario[0])
        //los derechos
         const [respuesta] = await pool.query('select modulos.nombre nombreModulo,permisos.nombre permiso from rol_permiso left join permisos on permisos.permiso_id=rol_permiso.permiso_id left join modulos on modulos.modulo_id = rol_permiso.modulo_id where rol_permiso.rol_id= ?',usuario[0].rol_id)
         console.log(respuesta)


        // res.json({token:generarJWT(usuario[0].id)}) ;
         res.json({
             id:usuario[0].id,
             nombre:usuario[0].nombre,
             email:usuario[0].email,
             token:generarJWT(usuario[0].id),
             derechos:respuesta
         })
    }else{
        const error = new Error('El password es incorecto')
        return res.status(403).json({msg:error.message})
    }
}

export const perfil = (req,res)=>{
    console.log('entrando a perfil')
    console.log('derechos')
    console.log(req.derechos)
    const {usuario} = req
    res.json({usuario,derechos:req.derechos})
}

export const olvidePassword=async(req,res)=>{
    const {email} = req.body

    const [usuario] = await pool.query('select * from usuarios where email = ?',email)
    if (usuario.length>0){
        try{
            const token=generaIdConfirmaCuenta()
            await pool.query('update usuarios set token = ? where id=?',[token,usuario[0].id])
            
            //enviar email con instrucciones
            emailOlvidePassword({
                email,
                nombre:usuario[0].nombre,
                token
            })

            res.json({msg:"Hemos enviado un email con las intrucciones."})
        }catch(error){
            console.log(error)
        }

    }else{
        const error = new Error("El usuario no existe")
        return res.status(400).json({msg:error.message})
    }
}

export const comprobarToken=async(req,res)=>{
    const {token} = req.params;

    const [tokenValido] = await pool.query('select * from usuarios where token = ?',token)
    if (tokenValido.length>0){
        res.json({msg:'El token es valido y el usuario existe'})

    }else{
        const error = new Error("Token no valido");
        return res.status(400).json({msg:error.message})
    }
};


export const nuevoPassword = async(req,res) => {
    const { token } = req.params;
    const { password } = req.body;
    console.log('token')
    console.log(token)
    console.log(`password ${password}`)
    const [usuario] = await pool.query('select * from usuarios where token = ?',token);
    console.log(usuario)
    if (usuario.length<=0){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg:error.message})
    }

    const salt = await bcrypt.genSalt(10);
    const nuevoPassword = await bcrypt.hash(password,salt);
    console.log(usuario[0].id)
    console.log(nuevoPassword)
    try{
        await pool.query('update usuarios set token=?, password = ? where id=?',[null,nuevoPassword,usuario[0].id])
        res.json({msg:'Password modificado correctamente'})

    }catch(error){
        console.log(error)
    }
}

export const obtenerUsuarios = async (req,res)=>{
   try{
        const [respuesta] = await pool.query('select * from usuarios')
        console.log(respuesta)
        res.json(respuesta)
   } catch(error){
        console.error('Error en obtenerUsuarios:', error);
        res.status(500).json({
            msg: 'Error al consultar usuarios. Intenta de nuevo más tarde.',
            error: error.code || error.message
        });
   }
}

export const obtenerUsuariosPagina = async(req,res)=>{

    console.log('req.query.orderDirection')
    console.log(req.query.orderDirection)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    const orderBy = req.query.orderBy || 'id';
    const orderDirection = req.query.orderDirection === 'desc' ? 'DESC' : 'ASC'
    
    const offset = (page - 1) * limit;
    const searchCondition = `%${search}%`;

     // Validación básica para evitar SQL Injection en columnas
    const validColumns = ['id', 'nombre', 'email', 'confirmado', 'token'];
    if (!validColumns.includes(orderBy)) return res.status(400).send('Orden inválido');

    try{
        console.log('entrando a mostrar por pagina')

         // Paso 1: Contar el total
        const [registros]= await pool.query('SELECT COUNT(*) AS total FROM usuarios where nombre like ? ',[searchCondition,searchCondition])

        if (registros[0].total>0){
            const total = registros[0].total;
            const totalPages = Math.ceil(total / limit);
            const [usuarios]=  await pool.query(`SELECT usuarios.id, usuarios.nombre,email,confirmado,usuarios.rol_id,foto,updated_at,roles.nombre as nombreRol FROM usuarios left join roles on roles.rol_id = usuarios.rol_id WHERE usuarios.nombre  LIKE ?  ORDER By ${orderBy} ${orderDirection} LIMIT ? OFFSET ?`, [searchCondition,limit, offset] )


            //verificando que exista la foto, si no existe fisicamente
            //en el campo foto se le pone null
            console.log(usuarios)
            const usuariosConFotoValida = usuarios.map(usuario => {
                if (usuario.foto) {
                    const rutaFoto = path.join(rutas.uploads, usuario.foto);
                    if (!fs.existsSync(rutaFoto)) {
                        usuario.foto = null;
                    }
                }
                return usuario;
            });

            res.json({
                currentPage: page,
                totalPages,
                totalItems: total,
                data: usuariosConFotoValida
            });
        }
    }catch (error){
        console.log(error)
    }
}

export const actualizarUsuario = async (req, res) => {
    console.log('entro a actualizar');
    const { id } = req.params;
    const { nombre, email, rol_id } = req.body;
    const archivo = req.file;

    try {
        // 1. Actualizar datos básicos
        await pool.query(
            'UPDATE usuarios SET nombre = ?, email = ?, rol_id = ? WHERE id = ?',
            [nombre, email, rol_id, id]
        );

        // 2. Procesar foto si viene nueva
        if (archivo) {
            console.log('si entro al archivo');
            const extension = path.extname(archivo.originalname).toLowerCase();
            const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.webp'];

            if (!extensionesPermitidas.includes(extension)) {
                fs.unlinkSync(archivo.path);
                return res.status(400).json({ error: 'Formato de imagen no permitido' });
            }

            const nombreFotoFinal = `${id}${extension}`;
            const rutaTemporal = archivo.path;
            const rutaFinal = path.join(rutas.uploads, nombreFotoFinal);

            // Eliminar imagen anterior (cualquier extensión)
            const archivosEnCarpeta = fs.readdirSync(rutas.uploads);
            archivosEnCarpeta.forEach((file) => {
                if (file.startsWith(id + '.')) {
                    fs.unlinkSync(path.join(rutas.uploads, file));
                }
            });

            fs.renameSync(rutaTemporal, rutaFinal);

            await pool.query('UPDATE usuarios SET foto = ? WHERE id = ?', [nombreFotoFinal, id]);
        }

        // 3. Recuperar registro actualizado
        const [filas] = await pool.query(
            `SELECT usuarios.id, usuarios.nombre, email, rol_id, foto, confirmado, token, updated_at,
                    roles.nombre AS nombreRol
             FROM usuarios
             LEFT JOIN roles ON roles.id = usuarios.rol_id
             WHERE usuarios.id = ?`,
            [id]
        );

        const usuarioActualizado = filas[0];

        // 🔹 Evitar caché de imagen
        if (usuarioActualizado.foto) {
            usuarioActualizado.foto = `${usuarioActualizado.foto}?v=${Date.now()}`;
        }

        res.json(usuarioActualizado);
    } catch (error) {
        console.error('→ Error al actualizar:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};


export const crearUsuario = async (req, res) => {
    const { nombre, email, rol_id } = req.body;
    const archivo = req.file;
    console.log('crear usuario')
    try {
        // 1️⃣ Insertar usuario inicialmente sin foto
        const [resultado] = await pool.query(
            'INSERT INTO usuarios (nombre, email, rol_id) VALUES (?, ?, ?)',
            [nombre, email, rol_id]
        );

        const nuevoId = resultado.insertId;

        // 2️⃣ Si hay foto, procesarla
        if (archivo) {
            const extension = path.extname(archivo.originalname).toLowerCase();
            const extensionesPermitidas = ['.jpg', '.jpeg', '.png', '.webp'];

            if (!extensionesPermitidas.includes(extension)) {
                fs.unlinkSync(archivo.path);
                return res.status(400).json({ error: 'Formato de imagen no permitido' });
            }

            const nombreFotoFinal = `${nuevoId}${extension}`;
            const rutaTemporal = archivo.path;
            const rutaFinal = path.join(rutas.uploads, nombreFotoFinal);

            // Guardar la foto con el nombre final
            fs.renameSync(rutaTemporal, rutaFinal);

            // Actualizar el campo foto en la BD
            await pool.query('UPDATE usuarios SET foto = ? WHERE id = ?', [nombreFotoFinal, nuevoId]);
        }

        // 3️⃣ Recuperar y devolver el registro completo (incluyendo rol)
        const [filas] = await pool.query(`
            SELECT usuarios.id, usuarios.nombre, email, rol_id, foto, confirmado, token, updated_at,
                   roles.nombre as nombreRol
            FROM usuarios
            LEFT JOIN roles ON roles.id = usuarios.rol_id
            WHERE usuarios.id = ?
        `, [nuevoId]);

        res.status(201).json(filas[0]);

    } catch (error) {
        console.error('→ Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

export const eliminarUsuario = async(req,res)=>{
    try {
        console.log('entrando a eliminar')
        const { id } = req.params;
        // Ejecuta la eliminación directamente y obtiene el número de filas afectadas
        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        // Verifica si se eliminó al menos una fila
        if (result.affectedRows > 0) {
            res.json({ msg: 'Usuario eliminado' });
        } else {
            res.status(404).json({ msg: 'No encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
}