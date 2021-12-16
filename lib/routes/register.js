"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth = require('../middleware/auth');
const User = require('../models/User');
const register = (req, res, next) => res.render('register', { error: '' });
const login = (req, res, next) => res.render('login', { error: '' });
