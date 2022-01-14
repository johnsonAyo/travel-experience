"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Travel = require("../models/Travel");
const User2 = require("../models/User2");
const service_1 = require("./service");
// @desc    Login/Landing page
// @route   GET /
router.route("/register").get(service_1.register).post(service_1.registerUser);
router.route("/signin").get(service_1.signin).post(service_1.loginUser);
router.get("/travels", ensureAuth, async (req, res) => {
    try {
        const travels = await Travel.find({ status: "public" })
            .populate("user")
            .sort({ createdAt: "desc" })
            .lean();
        travels.forEach((travel) => travel.user._id);
        res.render("travels/index", {
            user: req.user,
            travels,
        });
    }
    catch (err) {
        console.error(err);
        res.render("error/500");
    }
});
router.get("/dashboard", ensureAuth, async (req, res) => {
    try {
        const travels = await Travel.find({ user: req.user.id }).lean();
        res.render("dashboard", {
            name: req.user.firstName,
            travels,
        });
    }
    catch (err) {
        console.error(err);
        res.render("error/500");
    }
});
// router.get('/', ensureGuest, (req, res) => {
//   res.redirect('/travels')})
router.get("/login", ensureGuest, (req, res) => {
    res.render("login", {
        layout: "login",
    });
});
// router.get('/', ensureGuest, (req, res) => {
//   res.redirect('/travels')})
router.get("/login", ensureGuest, (req, res) => {
    res.render("login", {
        layout: "login",
    });
});
router.get("/", ensureGuest, async (req, res) => {
    try {
        const travels = await Travel.find({ status: "public" })
            .populate("user")
            .sort({ createdAt: "desc" })
            .lean();
        res.render("travels/homepage", {
            travels,
            layout: "login",
        });
    }
    catch (err) {
        console.error(err);
        res.render("error/500");
    }
});
router.get("/:id", async (req, res) => {
    try {
        let travel = await Travel.findById(req.params.id).populate("user").lean();
        if (!travel) {
            return res.render("error/404");
        }
        if (travel.status == "private") {
            res.render("error/404");
        }
        else {
            res.render("travels/show2", {
                travel,
                layout: "login",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.render("error/404");
    }
});
router.get("/user/:userId", async (req, res) => {
    try {
        const travels = await Travel.find({
            user: req.params.userId,
            status: "public",
        })
            .populate("user")
            .lean();
        res.render("travels/homepage", {
            travels,
            layout: "login",
        });
    }
    catch (err) {
        console.error(err);
        res.render("error/500");
    }
});
// @desc    Dashboard
// @route   GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
    try {
        const travels = await Travel.find({ user: req.user.id }).lean();
        res.render("dashboard", {
            name: req.user.firstName,
            travels,
        });
    }
    catch (err) {
        console.error(err);
        res.render("error/500");
    }
});
exports.default = router;
