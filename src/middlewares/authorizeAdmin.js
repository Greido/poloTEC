export const authorizeAdmin = (req, res, next) => {
    const user = res.locals.user;
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Unauthorized' });
    }
  };
  