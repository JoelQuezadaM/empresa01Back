import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import clientesRouter from "./routes/clientesRoutes.js";
import { productosRouter } from "./routes/productosRoutes.js";
import { usuariosRouter } from "./routes/usuariosRoutes.js";
import { pedidosRouter } from "./routes/pedidosRoutes.js"
import { pedidoDetallesRouter } from "./routes/pedidoDetallesRoutes.js";
import { productosPaginaRoutes } from "./routes/productosPaginaRoutes.js";
import rolesRouter from "./routes/rolesRoutes.js";
import { permisosRouter } from "./routes/permisosRoutes.js";


import { fileURLToPath } from 'url';
import { dirname } from 'path';


import path from 'path';
import { rolPermisoRoutes } from "./routes/rolPermisoRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json())
dotenv.config();

 const dominiosPermitidos = [process.env.FRONTEND_URL1,process.env.FRONTEND_URL2]

    const corsOptions = {
        origin : function(origin, callback){
            if(dominiosPermitidos.indexOf(origin) !== -1){
                //el origen del request esta permitido
                callback(null, true)
            }else {
                callback(new Error('No permitido por CORS'))
            }

        }
    }
    
    //    app.use(cors(corsOptions));
app.use(cors());
    

// Servir imágenes públicas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/clientes',clientesRouter)
app.use('/api/productos',productosRouter)
app.use('/api/usuarios',usuariosRouter)
app.use('/api/pedidos',pedidosRouter)
app.use('/api/pedidodetalles',pedidoDetallesRouter)
app.use('/api/roles',rolesRouter)
app.use('/api/rolpermiso',rolPermisoRoutes)

app.use('/api/permisos',permisosRouter)//quitar este

app.use('/api/productospag',productosPaginaRoutes)

const PORT = process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Servidor funcionando en el puerto ${PORT}`)
});