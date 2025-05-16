const express = require("express");
const router = express.Router();
const passport = require("passport");
const authenticateToken = require('../middleware/verifytoken');


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login/Employee" }),
  (req, res) => {
    if (req.user && req.user.token) {
      // Redirect the user back to the frontend with the token in the query string
      return res.redirect(`http://localhost:5173/login/Employee?token=${req.user.token}`);
    } else {
      return res.status(401).json({ success: false, error: "Token generation failed" });
    }
  }
);






router.get("/Datafetch", authenticateToken, (req, res) => {
  const user = req.user;

  if (user) {
    res.status(200).json({
      success: true,
      user: user,
      
      token: req.headers.authorization.split(" ")[1], // Assuming `token` is attached to `req.user`
    });
  } else {
    res.status(401).json({ message: "Not authorized" });
  }
});

module.exports = router;






