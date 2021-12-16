"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    }
};
