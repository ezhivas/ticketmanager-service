module.exports = (requiredRole = 'admin') => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;
      console.log(`User role: ${userRole}, Required role: ${requiredRole}`);
      if (!userRole || userRole !== requiredRole) {
        return res.status(403).json({ error: `Access denied. Required role: ${requiredRole}` });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};
