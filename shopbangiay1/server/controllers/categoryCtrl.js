const Category = require("../models/Category");
const Products = require("../models/Product");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      // if user have role = 1 ---> admin
      // only admin can create , delete and update category
      const { name, image, description } = req.body;
      const category = await Category.findOne({ name });
      if (category)
        return res.status(400).json({ msg: "Tên thương hiệu đã tồn tại" });
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: "category",
      });
      const newCategory = new Category({
        name,
        description,
        image: result.url,
      });

      await newCategory.save();
      res.json({ msg: "Created a category" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const products = await Products.findOne({ category: req.params.id });
      if (products)
        return res.status(400).json({
          msg: "Please delete all products with a relationship.",
        });

      await Category.findByIdAndDelete(req.params.id);
      res.json({ msg: "Xóa thành công" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name, description, image } = req.body;
      if (image)
        await Category.findOneAndUpdate(
          { _id: req.params.id },
          { name, description, image }
        );
      else {
        await Category.findOneAndUpdate(
          { _id: req.params.id },
          { name, description }
        );
      }
      res.json({ msg: "Updated a category" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoryCtrl;
