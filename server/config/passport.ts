const GoogleStrategy = require("passport-google-oauth20").Strategy;
import User from "../models/User";

module.exports = function (passport: {
  use: (arg0: any) => void;
  serializeUser: (arg0: (user: any, done: any) => void) => void;
  deserializeUser: (arg0: (id: any, done: any) => void) => void;
}) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: {
          id: string;
          displayName: string;
          name: { givenName: string; familyName: string };
          photos: { value: string }[];
        },
        done: (arg0: null, arg1: string) => void
      ) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err: any, user: any) => done(err, user));
  });
};
