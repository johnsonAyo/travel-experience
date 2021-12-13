import express, { NextFunction, Request, Response } from 'express';
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Travel = require('../models/Travel')

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('travels/add')
})

// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req:any, res) => {
  try {
    req.body.user = req.user.id
    await Travel.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
  try {
    const travels = await Travel.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('travels/index', {
      travels,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

router.get('/:id', ensureAuth, async (req:any, res) => {
  try {
    let travels = await Travel.findById(req.params.id).populate('user').lean()

    if (!travels) {
      return res.render('error/404')
    }

    if (travels.user._id != req.user.id && travels.status == 'private') {
      res.render('error/404')
    } else {
      res.render('stories/show', {
        travels,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

export default router