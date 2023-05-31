const User = require("../models/userModel");
const Comments = require("../models/Comment");
const sendEmail = require("./sendMail");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");

const { OAuth2 } = google.auth;
let refreshtokens = [];
const userCtrl = {
  register: async (req, res) => {
    try {
      const { email, name, password } = req.body;
      const doseExists = await User.findOne({ email: email });
      if (doseExists)
        return res.status(400).json({
          message: "Email này đã được sử dụng !",
        });
      if (!password)
        return res.status(400).json({ message: "vui lòng điền mật khẩu" });
      const passwordHash = await bcrypt.hash(password, 12);
      const newUser = { name, email, password: passwordHash };
      const accessToken = createActivationToken(newUser);
      const url = `${process.env.CLIENT_URL}/auth/active-email/${accessToken}`;
      sendEmail(email, url, "Click xác nhận địa chỉ email của bạn");
      return res.status(200).json({
        message: "Xác minh địa chỉ email của bạn",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error,
      });
    }
  },
  activeEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      console.log(activation_token);
      const user = await jwt.verify(
        activation_token,
        process.env.ACTIVATION_TOKEN_SECRET
      );
      console.log(user);
      const { email, password, name } = user;
      const checkEmail = await User.findOne({ email: email });
      if (checkEmail)
        return res.status(400).json({ message: "tài khoản này tồn tại" });
      const newUser = new User({
        name,
        email,
        password,
      });
      await newUser.save();
      return res.json({
        msg: "Tài khoản của bạn đã được kích hoạt thành công",
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ msg: "Tài khoản hoặc mật khẩu không chính xác" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ msg: "Tài khoản hoặc mật khẩu không chính xác" });
      const refreshtoken = createRefreshToken({ id: user._id });
      const accesstoken = createAccessToken({ id: user._id });
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      refreshtokens.push(refreshtoken);
      res.status(200).json({ user, accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refeshToken: async (req, res) => {
    const refreshtoken = req.cookies.refreshtoken;
    console.log(refreshtoken);
    if (!refreshtoken) return res.status(401).json("you're not authenticated");
    if (!refreshtokens.includes(refreshtoken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshtokens = refreshtokens.filter((token) => token != refreshtoken);
      const newAccesstoken = createAccessToken({ id: user._id });
      const newRefreshtoken = createRefreshToken({ id: user._id });
      res.cookie("refreshtoken", newRefreshtoken, {
        httpOnlycookie: true,
        path: "/",
        sameSite: "strict",
      });
      refreshtokens.push(newRefreshtoken);
      res.status(200).json({ accesstoken: newAccesstoken });
    });
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "Tài khoản không tồn tại" });
      const accessToken = createAccessToken({ id: user._id });
      const url = `${process.env.CLIENT_URL}/user/reset/${accessToken}`;
      sendEmail(email, url, "Đặt lại mật khẩu của bạn");
      return res.status(200).json({
        message: "Xác minh địa chỉ email của bạn",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      console.log(password);
      const passwordHash = await bcrypt.hash(password, 12);
      await User.findOneAndUpdate(
        { _id: req.user.id },
        { password: passwordHash }
      );
      res.json({ msg: "Đặt lại mật khẩu thành công !" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getInforUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getInforChat: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserAllInfor: async (req, res) => {
    try {
      const user = await User.find().select("-password");
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    res.clearCookie("refreshtoken");
    refreshtokens = refreshtokens.filter(
      (token) => token != req.cookies.refreshtoken
    );
    res.json("logout susscessfully");
  },
  updateUser: async (req, res) => {
    try {
      const { name, avatar, address, phone } = req.body;
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          name,
          avatar,
          address,
          phone,
        }
      );
      res.json({ msg: "Updated Successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updatePassword: async (req, res) => {
    try {
      const { password, newPassword } = req.body;
      const user = await User.findById(req.user.id);

      const check = await bcrypt.compare(password, user.password);
      if (check) {
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await User.findOneAndUpdate(
          { _id: req.user.id },
          {
            password: passwordHash,
          }
        );
        return res.status(200).json({
          msg: "Mật khẩu đã được thay đổi thành công",
          status: "success",
        });
      } else {
        return res
          .status(200)
          .json({ msg: "Mật khẩu cũ không chính xác", success: "error" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUsersRole: async (req, res) => {
    try {
      const { role } = req.body;
      await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          role,
        }
      );
      res.json({ msg: "Updated Successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await Comments.find({ id_user: req.params.id }).remove().exec();
      await User.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted Successfully" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
};
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "10h",
  });
};
const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: "10h",
  });
};
module.exports = userCtrl;
