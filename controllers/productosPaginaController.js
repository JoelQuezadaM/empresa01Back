import { pool } from "../config/db.js"

export const mostrarPagina = async(req,res)=>{

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
    const validColumns = ['id', 'nombre', 'codigo', 'existencias', 'precio'];
    if (!validColumns.includes(orderBy)) return res.status(400).send('Orden inválido');

    try{
        console.log('entrando a mostrar por pagina')

         // Paso 1: Contar el total
        const [registros]= await pool.query('SELECT COUNT(*) AS total FROM productos where nombre like ? or codigo like ? ',[searchCondition,searchCondition])

        if (registros[0].total>0){
            const total = registros[0].total;
            const totalPages = Math.ceil(total / limit);
            const [results]=  await pool.query(`SELECT * FROM productos WHERE nombre LIKE ?  ORDER By ${orderBy} ${orderDirection} LIMIT ? OFFSET ?`, [searchCondition,limit, offset] )
            res.json({
                currentPage: page,
                totalPages,
                totalItems: total,
                data: results
            });
        }
    }catch (error){
        console.log(error)
    }
}