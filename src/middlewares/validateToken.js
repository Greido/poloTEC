import jwt from 'jsonwebtoken';
import { verifyToken } from '../libs/jwt.js';
import User from '../schemas/user.model.js';
import Enterprise from '../schemas/enterprise.model.js';


export const validateRequired = async (req, res, next) => {
  // Obtén el token desde cookies o headers
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No se ha proporcionado el token' });
  }

  try {
    // Verifica y decodifica el token
    const decoded = verifyToken(token);
    console.log('Decoded token:', decoded); // Verifica el contenido del token

    // Guarda el token decodificado en res.locals para su uso posterior
    res.cookies.decoded = decoded;

    // Lógica basada en el rol del usuario
    if (decoded.role === 'user') {
      console.log('Searching for user with ID:', decoded.id);
      const user = await User.findById(decoded.id);
      if (!user) {
        console.log('User not found in the database.');
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.local.user = user;
      console.log('User found:', user);
    } else if (decoded.role === 'enterprise') {
      console.log('Searching for enterprise with ID:', decoded.id);
      const enterprise = await Enterprise.findById(decoded.id);
      if (!enterprise) {
        console.log('Enterprise not found in the database.');
        return res.status(404).json({ message: 'Empresa no encontrada' });
      }
      res.local.enterprise = enterprise;
      console.log('Enterprise found:', enterprise);
    } else {
      console.log('Rol inválido:', decoded.role);
      return res.status(403).json({ message: 'Rol inválido' });
    }

    // Continúa con el siguiente middleware
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    } else {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
};
