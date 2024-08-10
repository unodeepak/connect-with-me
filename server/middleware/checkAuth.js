const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

/**
 * @param {String} role can be "admin" or "author" or "nUser";
 */

const checkAuth =
  (role = "nUser") =>
  async (req, res, next) => {
    try {
      let token;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")?.[1];
      } else {
        return res
          .status(403)
          .json({ msg: "Token was not found", success: false });
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const data = await User.findById(decode?.id);

      if (!data) {
        return res.status(403).json({ msg: "Invalid token", success: false });
      }

      /* Now we are checking the Role of User */
      req.user = data;
      // const userRole = data?.role;
      // if (role === "admin") {
      //   if (userRole !== 0) {
      //     return res.status(403).json({ msg: "Access denied", success: false });
      //   }

      //   next();
      // } else if (role == "author") {
      //   if (userRole !== 0 && userRole !== 1) {
      //     return res.status(403).json({ msg: "Access denied", success: false });
      //   }

      //   next();
      // } else {
      //   if (userRole !== 0 && userRole !== 1 && userRole !== 2) {
      //     return res.status(403).json({ msg: "Access denied", success: false });
      //   }

      //   next();
      // }

      next();
    } catch (err) {
      return res.status(500).json({ msg: err.message, success: false });
    }
  };

module.exports = checkAuth;
