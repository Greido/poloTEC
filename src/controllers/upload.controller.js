import { File } from '../schemas/file.model.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // Limitar tamaño de archivo a 10 MB
    },
    fileFilter: (req, file, cb) => {
        // Validar el tipo de archivo
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true); // Permitir la carga del archivo
        } else {
            cb(new Error('Tipo de archivo no permitido'));
        }
    }
});

export const uploadMiddleware = upload.single('myFile');

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
        }

        // Crear un nuevo documento de archivo
        const newFile = new File({
            filename: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            data: req.file.buffer // Almacenar los datos binarios del archivo
        });

        // Guardar el documento en la base de datos
        await newFile.save();

        res.status(200).json({ data: 'Archivo subido correctamente a MongoDB' });
    } catch (error) {
        console.error('Error al subir el archivo a MongoDB:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};