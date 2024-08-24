const User = require("../../models/user.model");
const createAdmin = async () => {
  try {
    const isExist = await User.findOne({ userType: "admin" });
    if (!isExist) {
      let body = {
        firstName: "admin",
        lastName: "admin",
        email: "admin@gmail.com",
        password: "admin",
        userType: "admin",
        isVerifiedEmail: true
      };
      const newUser = await new User(body);
      await newUser.save();
    }
  } catch (err) {
    console.log("Error is : ", err);
  }
};

createAdmin();
