const authorization = (string) => {
  return (req, res, next) => {

    if (!req.token || !req.token.role) {
      return res.status(401).json({ 
        success: false, 
        message: 'unauthorized - no role found' 
      });
    }

    const permissions = req.token.role.permissions || [];
     

    
      if (permissions.includes(string)) {
      res.status(403);
      next();
    } else {
      res.status(401).json({ success: false, message: "unauthorized" });
    }
};
}

module.exports = authorization;









