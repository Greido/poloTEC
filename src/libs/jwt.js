// Importa la constante TOKEN_SECRET desde el archivo "../config.js"
import { TOKEN_SECRET } from "../config.js";

// Importa el módulo jwt (JSON Web Tokens) para generar tokens de acceso
import jwt from "jsonwebtoken";

// Función para crear un token de acceso
export function createAccessToken(payload) {
  // Retorna una nueva promesa
  return new Promise((resolve, reject) => {
    // Genera un token firmado
    jwt.sign(
      // Payload (datos) que se incluirán en el token
      payload,
      // Clave secreta utilizada para firmar el token
      TOKEN_SECRET,
      {
        // Opciones del token, aquí se especifica la expiración en 1 día
        expiresIn: "1d",
      },
      // Callback que se ejecuta después de generar el token
      (err, token) => {
        // Si hay un error, se rechaza la promesa con el error
        if (err) reject(err);
        // Si no hay errores, se resuelve la promesa con el token generado
        resolve(token);
      }
    );
  });
}
