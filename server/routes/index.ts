import express, { NextFunction, Request, Response } from 'express';
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Travel = require('../models/Travel')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req:any, res) => {
  try {
    const travels = await Travel.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.firstName,
      travels
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

export default router