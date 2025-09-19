import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener __dirname global relativo a este archivo de configuración
const __filename = fileURLToPath(import.meta.url);
const __dirnameGlobal = dirname(__filename);

// Ruta absoluta al directorio raíz del proyecto
const rutaProyecto = path.join(__dirnameGlobal, '..');

export const rutas = {
  uploads: path.join(rutaProyecto, 'uploads'),
  rutaFoto: (nombreArchivo) => path.join(rutaProyecto, 'uploads', nombreArchivo)

};
