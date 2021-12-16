"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        else {
            res.redirect('/');
        }
    },
    ensureGuest: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        else {
            res.redirect('/dashboard');
        }
    },
    auth: function (req, res, next) {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.redirect('/users/login');
        }
        // Based on 'Bearer ksfljrewori384328289398432'
        try {
            (0, jsonwebtoken_1.verify)(accessToken, process.env.ACCESS_TOKEN_SECRET);
            return next();
        }
        catch (error) {
            // console.log('auth error', error);
            res.redirect('/users/login');
        }
    }
};
