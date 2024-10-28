export const validateEnterprise = (req, res, next) => {
    const decoded = res.locals.decoded;
  
    // Verificamos si el rol es 'enterprise'
    if (decoded.role !== 'enterprise') {
      return res.status(403).json({ message: 'Acceso denegado. Solo disponible para empresas.' });
    }
  
    // Si el rol es 'enterprise', continuamos con el siguiente middleware o controlador
    next();
  };
  