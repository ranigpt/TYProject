const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Access denied! No token provided." });
    }

    try {
        const secretKey = process.env.COMPANY_SECRET || "default_secret";
        const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
        req.user = decoded; // Attach user payload to request object
        console.log(req.user);
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token!" });
    }
};

module.exports = authenticateToken;
