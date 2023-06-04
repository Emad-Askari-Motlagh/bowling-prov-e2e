const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(
      token,
      "kishan sheth super secret key",
      async (err, decodedToken) => {
        if (err) {
          res.json({ status: false });
          next();
        } else {
          const user = await User.findById(decodedToken.id);
          if (user)
            res.json({
              status: true,
              email: user.email,
              id: user._id,
              currentCard: user?.currentCard,
            });
          else res.json(null);
          next();
        }
      }
    );
  } else {
    res.json(null);
    next();
  }
};
