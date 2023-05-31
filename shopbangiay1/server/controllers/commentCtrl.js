const Comments = require("../models/Comment");
const Product = require("../models/Product");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  sorting() {
    this.query = this.query.sort("-createdAt");
    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const commentCtrl = {
  getAllComments: async (req, res) => {
    try {
      const features = new APIfeatures(
        Comments.find()
          .populate("id_user")
          .populate("reply.id_user")
          .populate("id_product"),
        req.query
      )
        .sorting()
        .paginating();

      const comments = await features.query;
      res.json({
        status: "success",
        result: comments.length,
        comments,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getComments: async (req, res) => {
    try {
      const features = new APIfeatures(
        Comments.find({ id_product: req.params.id, status: true })
          .populate("id_user")
          .populate("reply.id_user"),
        req.query
      )
        .sorting()
        .paginating();

      const comments = await features.query;

      res.json({
        status: "success",
        result: comments.length,
        comments,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateStatus: async (req, res) => {
    try {
      const features = await Comments.findOne({ _id: req.params.id });
      let active = features.status;
      const resa = await Comments.findByIdAndUpdate(req.params.id, {
        status: !active,
      });
      console.log(!active);
      console.log(resa);
      res.json({
        status: "success",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getStarComment: async (req, res) => {
    const oneStarsResult = await Comments.find({
      id_product: req.params.id,
      rating: 1,
    });
    const twoStarsResult = await Comments.find({
      id_product: req.params.id,
      rating: 2,
    });
    const threeStarsResult = await Comments.find({
      id_product: req.params.id,
      rating: 3,
    });
    const fourStarsResult = await Comments.find({
      id_product: req.params.id,
      rating: 4,
    });
    const fiveStarsResult = await Comments.find({
      id_product: req.params.id,
      rating: 5,
    });
    const sumStarRating =
      oneStarsResult.length +
      twoStarsResult.length +
      threeStarsResult.length +
      fourStarsResult.length +
      fiveStarsResult.length;
    const tba = await Product.findOne({
      _id: req.params.id,
    });

    const m = Math.ceil(tba.ratings / tba.numOfReviews);

    const starRating = {
      oneStars: oneStarsResult.length,
      twoStars: twoStarsResult.length,
      threeStars: threeStarsResult.length,
      fourStars: fourStarsResult.length,
      fiveStart: fiveStarsResult.length,
      tb: m,
      sum: sumStarRating,
    };
    res.status(200).json({ msg: starRating });
  },
  deleteComment: async (req, res) => {
    try {
      const comment = await Comments.findById(req.params.id);
      const product = await Product.findById(comment.id_product);
      let num = product.numOfReviews;
      let rate = product.ratings;
      let id = product._id;
      await Product.findOneAndUpdate(
        { _id: id },
        {
          ratings: Number.parseInt(rate) - Number.parseInt(comment.rating),
          numOfReviews: num - 1,
        }
      );
      const commentDeleteCondition = { _id: req.params.id };
      const deletedComment = await Comments.findOneAndDelete(
        commentDeleteCondition
      );

      if (!deletedComment) {
        return res.status(401).json({
          success: false,
          message: "Comment not found",
        });
      }
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};

module.exports = commentCtrl;
