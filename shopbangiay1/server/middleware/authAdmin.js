const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 1)
      return res.status(500).json({ msg: "Khong co quyen truy cap" });
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = { authAdmin };
