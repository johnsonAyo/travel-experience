import { NextFunction, Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import { createAccessToken, createRefreshToken } from '../middleware/token';
const auth = require('../middleware/auth');
const User = require('../models/User')

const register = (req: Request, res: Response, next: NextFunction) =>
  res.render('register', { error: '' });

const login = (req:any, res: Response, next: NextFunction) =>
  res.render('login', { error: '' });

