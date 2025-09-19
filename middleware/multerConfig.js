import multer from 'multer';
import path from 'path';
import { rutas } from '../config/rutas.js';

// Multer usará almacenamiento temporal dentro de uploads/
// Luego en el controlador se renombra a id.jpg
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, rutas.uploads);
  },
  filename: (req, file, cb) => {
    // Nombre temporal; el controlador luego lo cambia a id.jpg
    cb(null, 'temp_' + Date.now() + path.extname(file.originalname));
  }
});

export const subirFoto = multer({ storage });
