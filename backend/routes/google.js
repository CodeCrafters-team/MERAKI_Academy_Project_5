const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const { user, token } = req.user;
    const FRONTEND_URL =  "http://localhost:3000" ;

    const qs = new URLSearchParams({
      token,
      userId: user.id.toString(),
      avatar: user.avatarUrl || "",
    }).toString();

    return res.redirect(`${FRONTEND_URL}/oauth-success?${qs}`);
  }
);

module.exports = router;
