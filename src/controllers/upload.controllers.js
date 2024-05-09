import { File } from './file.model.js';
import multer from 'multer';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import FileType from 'file-type';

const pipelineAsync = promisify(pipeline);

const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // Limitar tamaño de archivo a 10 MB
    }
});

export const uploadMiddleware = upload.single('myFile');

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
        }

        // Verificar el tipo de archivo utilizando file-type
        const fileType = await FileType.fromBuffer(req.file.buffer);
        if (!fileType || !fileType.mime.startsWith('image/') && fileType.mime !== 'application/pdf') {
            return res.status(400).json({ error: 'Solo se permiten archivos de imagen o PDF' });
        }

        // Generar un nombre de archivo único
        const filename = `${uuidv4()}.${fileType.ext}`;

        // Crear una corriente de escritura y guardar el archivo
        const fileWriteStream = createWriteStream(`uploads/${filename}`);
        await pipelineAsync(req.file.stream, fileWriteStream);

        // Guardar la información del archivo en la base de datos
        const newFile = new File({
            filename: filename,
            filepath: `uploads/${filename}`
        });
        await newFile.save();

        res.status(200).json({ data: 'Archivo subido correctamente a MongoDB' });
    } catch (error) {
        console.error('Error al subir el archivo a MongoDB:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
