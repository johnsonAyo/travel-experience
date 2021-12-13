"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Travel = require('../models/Travel');
// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    });
});
// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const travels = await Travel.find({ user: req.user.id }).lean();
        res.render('dashboard', {
            name: req.user.firstName,
            travels
        });
    }
    catch (err) {
        console.error(err);
        res.render('error/500');
    }
});
exports.default = router;
