const Orders = require("../models/Order");
const Products = require("../models/Product");
const Users = require("../models/userModel");
const Category = require("../models/Category");
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
    const limit = this.queryString.limit * 1 || 1000000;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
const orderCtrl = {
  getAllOrder: async (req, res) => {
    console.log(req.query);

    console.log("?");
    try {
      const features = new APIfeatures(
        Orders.find().populate("id_user"),
        req.query
      )
        .filtering()
        .sorting()
        .paginating();
      const oders = await features.query;
      return res.status(200).json(oders);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getAllOrderbyId: async (req, res) => {
    try {
      const features = new APIfeatures(
        Orders.find({ id_user: req.params.id }),
        req.query
      )
        .filtering()
        .sorting()
        .paginating();
      const oders = await features.query;
      return res.status(200).json(oders);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createOrder: async (req, res) => {
    try {
      // if user have role = 1 ---> admin
      // only admin can create , delete and update category
      const {
        id_user,
        status_order,
        address,
        phone,
        totalSum,
        order_detail,
        payment,
        note,
      } = req.body;

      const neworder = new Orders({
        id_user,
        address,
        phone,
        totalSum,
        order_detail,
        payment,
        note,
        status_order,
      });

      const products = await Products.find();
      for (let i = 0; i < order_detail.length; i++) {
        //
        let {
          product: { _id, size },
          quantity,
        } = order_detail[i];
        console.log(_id);
        let pos = products
          .map((item) => {
            return item._id.toString();
          })
          .indexOf(_id);
        const newArray = [...products[pos].sizeQuantity];
        let posSize = newArray
          .map((item) => {
            return item.size;
          })
          .indexOf(size);
        console.log(newArray[posSize]);
        if (newArray[posSize].quantity >= quantity) {
          newArray[posSize].quantity = newArray[posSize].quantity - quantity;
          await Products.findOneAndUpdate(
            { _id },
            {
              sizeQuantity: newArray,
            }
          );
          await neworder.save();
          res.json({ msg: "Tạo thành công đơn hàng", type: "success" });
        } else {
          res.json({
            msg: "Tạo đơn hàng thất bại số lượng đã được bán hết !",
            type: "error",
          });
        }
      }
      // await neworder.save();
      // res.json({ msg: "Tạo thành công đơn hàng" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateAdress: async (req, res) => {
    try {
      const { id, address, phone } = req.body;
      await Orders.findOneAndUpdate({ _id: id }, { address, phone });

      return res.status(200).json({ msg: "Updated a category" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateStatus: async (req, res) => {
    try {
      const { id, status } = req.body;
      const order = await Orders.findById(id);
      const products = await Products.find();
      if (status === -1) {
        for (let i = 0; i < order.order_detail.length; i++) {
          //
          let {
            product: { _id, size },
            quantity,
          } = order.order_detail[i];
          let pos = products
            .map((item) => {
              return item._id.toString();
            })
            .indexOf(_id);
          const newArray = [...products[pos].sizeQuantity];
          let posSize = newArray
            .map((item) => {
              return item.size;
            })
            .indexOf(size);
          console.log(newArray[posSize]);

          newArray[posSize].quantity = newArray[posSize].quantity + quantity;
          await Products.findOneAndUpdate(
            { _id },
            {
              sizeQuantity: newArray,
            }
          );
          await Orders.findOneAndUpdate({ _id: id }, { status_order: status });
          return res.status(200).json({ msg: "Cập nhật thành công" });
        }
        await Orders.findOneAndUpdate({ _id: id }, { status_order: status });
        return res.status(200).json({ msg: "Cập nhập thành công" });
      }
      if (status === 0) {
        for (let i = 0; i < order.order_detail.length; i++) {
          //
          let {
            product: { _id, size },
            quantity,
          } = order.order_detail[i];
          let pos = products
            .map((item) => {
              return item._id.toString();
            })
            .indexOf(_id);
          const newArray = [...products[pos].sizeQuantity];
          let posSize = newArray
            .map((item) => {
              return item.size;
            })
            .indexOf(size);
          console.log(newArray[posSize]);

          newArray[posSize].quantity = newArray[posSize].quantity - quantity;
          await Products.findOneAndUpdate(
            { _id },
            {
              sizeQuantity: newArray,
            }
          );
          await Orders.findOneAndUpdate({ _id: id }, { status_order: status });
          return res.status(200).json({ msg: "Cập nhật thành công" });
        }
        await Orders.findOneAndUpdate({ _id: id }, { status_order: status });
        return res.status(200).json({ msg: "Cập nhập thành công" });
      }
      await Orders.findOneAndUpdate({ _id: id }, { status_order: status });
      return res.status(200).json({ msg: "Cập nhập thành công" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateMessage: async (req, res) => {
    try {
      const { id, message } = req.body;
      await Orders.findOneAndUpdate({ _id: id }, { message: message });

      return res.status(200).json({ msg: "Cập nhập thành công" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteOrder: async (req, res) => {
    try {
      const order = await Orders.findById(req.params.id);
      const products = await Products.find();
      for (let i = 0; i < order.order_detail.length; i++) {
        //
        let {
          product: { _id, size },
          quantity,
        } = order.order_detail[i];
        let pos = products
          .map((item) => {
            return item._id.toString();
          })
          .indexOf(_id);
        const newArray = [...products[pos].sizeQuantity];
        let posSize = newArray
          .map((item) => {
            return item.size;
          })
          .indexOf(size);
        console.log(newArray[posSize]);

        newArray[posSize].quantity = newArray[posSize].quantity + quantity;
        await Products.findOneAndUpdate(
          { _id },
          {
            sizeQuantity: newArray,
          }
        );
        await Orders.findByIdAndDelete(req.params.id);
        res.json({ msg: "Xóa thành công" });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getOrderTT: async (req, res) => {
    try {
      console.log(req.body.dateStart);
      console.log(req.body.dateEnd);
      const orders = await Orders.find({
        status_order: 2,
        createdAt: {
          $gte: new Date(req.body.dateStart),
          $lte: new Date(req.body.dateEnd),
        },
      });
      console.log(orders);

      let totalAmount = 0;

      orders.forEach((order) => {
        totalAmount += order.totalSum;
      });

      res.status(200).json({
        success: true,
        totalAmount,
        orders,
      });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = orderCtrl;
