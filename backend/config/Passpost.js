const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/Register");

const configurePassport = () => {
  const clientID = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const companySecret = process.env.COMPANY_SECRET;

  passport.use(
    new OAuth2Strategy(
      {
        clientID,
        clientSecret,
        callbackURL: "http://localhost:3000/auth/google/callback",
        scope: ["profile", "email"],
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ Email: profile.emails[0].value });

          if (!user) {
            user = new User({
              Name: profile.displayName,
              Email: profile.emails[0].value,
              Dob: null,
              Dp: profile.photos[0].value,
              isGoogleUser: true,
            });

            await user.save();
          }

          // Generate a JWT token
          const token = jwt.sign(
            { id: user._id, email: user.Email },
            companySecret,
            { expiresIn: "10h" }
          );

          // Attach token to user
          const userWithToken = { ...user.toObject(), token };

          return done(null, userWithToken);
        } catch (error) {
          console.error("Error in OAuth2 callback:", error);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};

module.exports = configurePassport;
