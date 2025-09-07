const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expect "Bearer <token>"

  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

function checkAdmin(req, res, next) {
  if (req.user && req.user.admin) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
}

module.exports = { authenticateToken, checkAdmin };
