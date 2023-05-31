const mongoose = require("mongoose");
const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "vui long nhap ten cua ban"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "vui long nhap email cua ban"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "vui long nhap mat khau cua ban"],
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    role: { type: Number, default: 0 }, //  0 = user , 1 = admin
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/phuockaito/image/upload/v1617902959/user/1_gxwhfk.jpg",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("user", UserSchema);
module.exports = User;
