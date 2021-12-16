import express, { NextFunction, Request, Response } from 'express';
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const User = require('../models/User')
const Travel = require('../models/Travel')





const registerUser = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { displayName, email, password, password2 } = req.body;
  try {
    if (!displayName || !email || !password || !password2) {
      return res.status(404).json({ message: 'failure'})
    }

    if (password !== password2) {
      return res.render('register', {
        error: 'Password do not Match',
      });
    }

    if (password.length < 6) {
      return res.render('register', {
        error: 'Password must be greater than 6 characters',
      });
    }

    let user = await User.findOne(req.body)

    if (!user) {
     User.create(req.body)
     res.sendStatus(200)
    }
  } catch (err) {
    console.error(err);
    res.render('error/404');
  }
};
// @desc    Login/Landing page
// @route   GET /

// router.get('/', ensureGuest, (req, res) => {
//   res.redirect('/travels')})

router.get('/login', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

router.post('/register', registerUser)


router.get('/', ensureGuest, async (req, res) => {
  try {
    const travels = await Travel.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('travels/homepage', {
      travels,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
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