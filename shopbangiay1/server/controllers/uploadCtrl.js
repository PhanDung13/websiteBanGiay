const cloudinary = require("cloudinary");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const uploadCtrl = {
  uploadAvatar: async (req, res) => {
    try {
      console.log("vao");
      const file = req.body.avatar;
      // const file = "";
      // console.log(req.body.avatar);
      // // if (typeof req.body.avatar === "string") {
      // //   file.push(req.body.avatar);
      // // } else {
      // //   file = req.body.avatar;
      // // }

      cloudinary.v2.uploader.upload(
        file,
        {
          folder: "avatar",
        },
        async (err, result) => {
          if (err) {
            console.log(err.message);
          }
          console.log({ url: result.secure_url });
          res.json({ url: result.secure_url });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

module.exports = uploadCtrl;
