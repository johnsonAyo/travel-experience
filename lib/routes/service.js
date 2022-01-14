"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.signin = exports.register = exports.registerUser = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const bcryptjs_1 = require("bcryptjs");
const User = require("../models/User");
const token_1 = require("../config/token");
const registerUser = async function (req, res, next) {
    const { firstName, lastName, email, password, password2 } = req.body;
    try {
        if (!firstName || !lastName || !email || !password || !password2) {
            return res.status(400).json({
                message: "Please Input all fields",
            });
        }
        if (password !== password2) {
            return res.status(400).json({
                message: "Password does not match",
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be more tha 5 character",
            });
        }
        const hashedPassword = await (0, bcryptjs_1.hash)(password, 10);
        let user = await User.findOne({ googleId: email });
        if (user) {
            return res.status(404).json({ message: "user already exist" });
        }
        user = await User.create({
            googleId: email,
            displayName: firstName + " " + lastName,
            firstName: firstName,
            lastName: lastName,
            hashedPassword: hashedPassword,
        });
        const accessToken = (0, token_1.createAccessToken)(user);
        const refreshToken = (0, token_1.createRefreshToken)(user);
        res.cookie("refreshToken", refreshToken);
        res.cookie("accessToken", accessToken);
        res.redirect("/dashboard");
    }
    catch (err) {
        console.error(err);
        res.render("error/500");
    }
};
exports.registerUser = registerUser;
const loginUser = async function (req, res, next) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "Please Input all fields",
            });
        }
        let user = await User.findOne({ googleId: email });
        if (!user) {
            return res.status(404).json({ message: "invalid input" });
        }
        /* do your hashing here */
        const valid = await (0, bcryptjs_1.compare)(password, user.hashedPassword);
        if (!valid) {
            return res.render("signin", {
                error: "Username or Password incorrect",
            });
        }
        const accessToken = (0, token_1.createAccessToken)(user);
        const refreshToken = (0, token_1.createRefreshToken)(user);
        res.cookie("refreshToken", refreshToken);
        res.cookie("accessToken", accessToken);
        return res.redirect("/dashboard");
    }
    catch (err) {
        console.error(err);
        res.render("error/500");
    }
};
exports.loginUser = loginUser;
const register = (req, res, next) => res.render("travels/register", {
    layout: "login",
});
exports.register = register;
const signin = (req, res, next) => res.render("travels/signin", {
    layout: "login",
});
exports.signin = signin;
