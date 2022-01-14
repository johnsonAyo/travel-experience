"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport = require("passport");
const router = express_1.default.Router();
const session = require('express-session');
// @desc    Auth with Google
// @route   GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    res.redirect("/dashboard");
});
// @desc    Logout user
// @route   /auth/logout
router.get("/logout", function (req, res) {
    res.clearCookie("refreshtoken");
    res.clearCookie("accessToken");
    req.logOut(); // <-- not req.logout();
    res.redirect("/");
});
exports.default = router;
