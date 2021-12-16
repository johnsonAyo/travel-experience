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

// @desc    Show all stories
// @route   GET /stories


// @desc    Show single travel
// @route   GET /travels/:id

router.get('/:id', ensureAuth, async (req:any, res) => {
  try {
    let travel = await Travel.findById(req.params.id).populate('user').lean()

    if (!travel) {
      return res.render('error/404')
    }

    if (travel.user._id != req.user.id && travel.status == 'private') {
      res.render('error/404')
    } else {
      res.render('travels/show', {
        travel,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req:any, res) => {
  try {
    const travel = await Travel.findOne({
      _id: req.params.id,
    }).lean()

    if (!travel) {
      return res.render('error/404')
    }

    if (travel.user != req.user.id) {
      res.redirect('/travels')
    } else {
      res.render('travels/edit', {
        travel,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req:any, res) => {
  try {
    let travel = await Travel.findById(req.params.id).lean()

    if (!travel) {
      return res.render('error/404')
    }

    if (travel.user != req.user.id) {
      res.redirect('/travels')
    } else {
      travel = await Travel.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req:any, res) => {
  try {
    let travel = await Travel.findById(req.params.id).lean()

    if (!travel) {
      return res.render('error/404')
    }

    if (travel.user != req.user.id) {
      res.redirect('/travels')
    } else {
      await Travel.deleteOne({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})


// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const travels = await Travel.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('travels/index', {
      travels,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

export default router