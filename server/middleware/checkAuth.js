const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

/**
 * @param {String} role can be "admin" or "author" or "nUser";
 */

const checkAuth =
  (role = "user") =>
  async (req, res, next) => {
    try {
      let token = req.headers.authorization || req.headers.Authorization;

      if (token) {
        if (token.startsWith("Bearer")) {
          token = token.split(" ")?.[1];
        }
      } else {
        return res
          .status(401)
          .json({ msg: "Token was not found", success: false });
      }

      const decode = jwt.verify(token, process.env.jwtSecret);
      const data = await User.findById(decode?.id).select("-bankDetails");
      if (!data) {
        /* We are checking Refresh Token */
        if (req?.originalUrl == "/api/user/auth/refreshToken") {
          const decode = jwt.verify(token, process.env.jwtRefreshSecret);
          const data = await User.findById(decode?.id).select("-bankDetails");
          req.user = data;
          next();
        }
        return res.status(403).json({ msg: "Invalid token", success: false });
      }

      /* Now we are checking the Role of User */
      if (role !== data.userType && data.userType == "admin") {
        return res
          .status(401)
          .json({ msg: "You don't have access", success: false });
      }
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
