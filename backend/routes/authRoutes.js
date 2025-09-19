const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

 
    res.redirect(`http://localhost:3000/home?token=${token}`);
  }
);

module.exports = router;