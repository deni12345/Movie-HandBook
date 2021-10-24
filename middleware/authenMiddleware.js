const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (token == null) {
        res.redirect("/user/login");
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (error, decodedToken) => {
            if (error) {
                res.redirect("/user/login");
            } else {
                req.user = decodedToken;
                next();
            }
        });
    }
};

module.exports = { authenticateToken };