"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = exports.createRefreshToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
require("dotenv/config");
const createAccessToken = (user) => {
    return (0, jsonwebtoken_1.sign)({ ...user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (user) => {
    return (0, jsonwebtoken_1.sign)({ ...user }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};
exports.createRefreshToken = createRefreshToken;
