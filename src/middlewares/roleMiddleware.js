import jwt from 'jsonwebtoken';

const verifyRole = (role) => (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== role) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(403).json({ message: 'Token inválido' });
  }
};

export default verifyRole;