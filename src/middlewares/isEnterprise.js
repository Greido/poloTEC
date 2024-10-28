// middleware/isEnterprise.js
export const isEnterprise = (req, res, next) => {
    const { decoded } = res.locals;
  
    if (decoded.role !== 'enterprise') {
      return res.status(403).json({ message: 'Acceso denegado. Solo las empresas pueden realizar esta acción.' });
    }
  
    next();
  };
  