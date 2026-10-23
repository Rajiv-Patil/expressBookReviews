const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    let token = null;
    if (req.session && req.session.authorization) {
        token = req.session.authorization['accessToken'];
    }
    if (!token && req.headers['authorization']) {
        let authHeader = req.headers['authorization'];
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else {
            token = authHeader;
        }
    }
    if (!token && req.query && req.query.token) {
        token = req.query.token;
    }
    if (token) {
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, '0.0.0.0', () => console.log("Server is running on port " + PORT));
try {
    app.listen(3000, '0.0.0.0');
} catch (e) {}
