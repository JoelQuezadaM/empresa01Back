import { pool} from "../config/db.js"


export const mostrar = async(req,res)=>{
    //res.json({msg:"Mostrando los clientes"})
    try{
        const [respuesta] = await pool.query('select * from clientes')
        console.log(respuesta)
        res.json(respuesta)
    }catch (error){
        console.log(error)
    }
}

export const agregarCliente = async(req,res)=>{
    const {nombre,correo,saldo}= req.body;
    
    //primero debemos verificar que no exista un cliente con ese correo
    const [respuesta] = await pool.query('select * from clientes where correo =?',[correo]);
    if (respuesta.length>0){//si regresa mas de 0 es que existe un cliente con ese correo
        const error = new Error("cliente ya registrado");
        return res.status(400).json({msg:error.message})
    }

    try {
        await pool.query('insert into clientes (nombre,correo,saldo) values (?,?,?)',[nombre,correo,saldo])
       
        res.json(req.body)  
    } catch (error) {
        console.log(error)
    }
};

export const actualizarCliente = async(req,res)=>{
        const {idCliente} = req.params;
        const [cliente]= await pool.query('select * from clientes where id =? ',[idCliente]);
        console.log('dentro del back')
        if (cliente.length>0){
            let nombrecliente = req.body.nombre ;
            let correocliente = req.body.correo ;
            let fechaNacimientoCliente = req.body.fechaNacimiento;
    
            const [modificado] =await pool.query('update clientes set nombre =?,correo =?, fechaNacimiento =? where id =?',[nombrecliente,correocliente,fechaNacimientoCliente,idCliente])
            res.json(modificado)
        }else{
            res.status(404).json({msg:"No encontrado"})
        }
}

export const eliminarCliente = async(req,res)=>{
    const {idCliente} = req.params;
    console.log(idCliente)
    const [cliente]= await pool.query('select * from clientes where id =?',[idCliente]);
    if (cliente.length>0){
        await pool.query('delete from clientes  where id =? ',[idCliente])
        res.json({msg:'Cliente eliminado'})
    }else{
        res.status(404).json({msg:"No encontrado"})
    }
}


export const perfil = (req,res)=>{
    res.json({msg:"Mostrando perfil"})
}