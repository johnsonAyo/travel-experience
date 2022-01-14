"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const authenticate = (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return false;
        }
        const jwtObj = (0, jsonwebtoken_1.verify)(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = jwtObj._doc;
        req.user.id = req.user._id;
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else if (authenticate(req, res)) {
            return next();
        }
        else {
            return res.redirect("/");
        }
    },
    ensureGuest: function (req, res, next) {
        authenticate(req, res);
        if (!req.isAuthenticated()) {
            return next();
        }
        else if (!authenticate(req, res)) {
            return next();
        }
        else {
            res.redirect("/dashboard");
        }
    },
};
