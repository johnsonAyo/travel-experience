import express, { NextFunction, Request as any, Response } from 'express';
import { Secret ,verify } from 'jsonwebtoken';



module.exports = {
    ensureAuth: function (req:any, res:Response,next:NextFunction) {
      if (req.isAuthenticated()) {
        return next()
      } else {
        res.redirect('/')
      }
    },
    ensureGuest: function (req:any, res: Response, next: NextFunction) {
      if (!req.isAuthenticated()) {
        return next();
      } else {
        res.redirect('/dashboard');
      }
    }
  }