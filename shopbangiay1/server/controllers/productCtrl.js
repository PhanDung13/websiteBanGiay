const Products = require("../models/Product");
const Orders = require("../models/Order");
const Users = require("../models/userModel");
const Category = require("../models/Category");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
const productCtrl = {
  getAllProduct: async (req, res) => {
    try {
      const productLength = new APIfeatures(
        Products.find(),
        req.query
      ).filtering();
      const lengthProduct = await productLength.query;

      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();
      const products = await features.query;
      res.status(200).json({
        count: lengthProduct.length,
        success: true,
        products,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  detailProduct: async (req, res) => {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
    res.status(200).json({
      success: true,
      product,
    });
  },
  reviews: async (req, res) => {
    try {
      const { ratings } = req.body;
      console.log(ratings);
      console.log(req.params.id);
      if (ratings && ratings !== 0) {
        const product = await Products.findById(req.params.id);
        if (!product)
          return res.status(400).json({ msg: "Product does not exist." });

        let num = product.numOfReviews;
        let rate = product.ratings;

        await Products.findOneAndUpdate(
          { _id: req.params.id },
          {
            ratings: rate + ratings,
            numOfReviews: num + 1,
          }
        );

        res.json({ msg: "Update success" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateProduct: async (req, res) => {
    const {
      name,
      description,
      price,
      gender,
      color,
      sizeQuantity,
      category,
      discount,
      isdiscount,
    } = req.body;
    let product = await Products.findById(req.params.id);
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
    if (req.body.images.length === 0) {
      product = await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          name,
          description,
          price,
          gender,
          color,
          sizeQuantity,
          category,
          discount,
          isdiscount,
        }
      );
      res.status(200).json({
        success: true,
        product,
      });
    } else {
      let images = [];

      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }

      if (images !== undefined) {
        // Deleting Images From Cloudinary
        // for (let i = 0; i < product.images.length; i++) {
        //   await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        // }
        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        req.body.images = imagesLinks;
      }

      product = await Products.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      res.status(200).json({
        success: true,
        product,
      });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: "Xóa thành công" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        gender,
        color,
        sizeQuantity,
        category,
      } = req.body;
      let images = [];
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }
      const imagesLinks = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      const newProduct = new Products({
        name,
        description,
        price,
        gender,
        color,
        sizeQuantity,
        category,
        images: imagesLinks,
      });
      await newProduct.save();
      return res.status(200).json({
        success: true,
        product: newProduct,
      });
    } catch (error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  },
  thongketsoluong: async (req, res) => {
    try {
      const product = await Products.find();
      const user = await Users.find();
      const category = await Category.find();
      const order = await Orders.find({ status_order: 2 });
      res.json({
        product: product.length,
        user: user.length,
        category: category.length,
        order: order.length,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productCtrl;
