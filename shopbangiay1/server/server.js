require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const Comments = require("./models/Comment");
var bodyParser = require("body-parser");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const { use } = require("./routes/conversations");
const app = express();
require("./helpers/init_mongoose");
app.use(express.json({ limit: "16mb" }));
app.use(
  express.urlencoded({ limit: "16mb", extended: true, parameterLimit: 50000 })
);
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
let users = [];
let usersChat = [];

const addUser = (userId, socketId) => {
  !usersChat.some((user) => user.userId === userId) &&
    usersChat.push({ userId, socketId });
};

const removeUser = (socketId) => {
  usersChat = usersChat.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return usersChat.find((user) => user.userId === userId);
};
const http = require("http").createServer(app);
const io = require("socket.io")(http);
io.on("connection", (socket) => {
  console.log(socket.id, "connected");
  socket.on("joinRoom", (id) => {
    const user = { userId: socket.id, room: id };

    const check = users.every((user) => user.userId !== socket.id);

    if (check) {
      users.push(user);
      socket.join(user.room);
    } else {
      users.map((user) => {
        if (user.userId === socket.id) {
          if (user.room !== id) {
            socket.leave(user.room);
            socket.join(id);
            user.room = id;
          }
        }
      });
    }

    // console.log(users)
    // console.log(socket.adapter.rooms)
  });

  socket.on("createComment", async (msg) => {
    const { id_user, content, id_product, createdAt, rating, send, _id } = msg;
    const newComment = new Comments({
      id_user,
      content,
      id_product,
      createdAt,
      rating,
    });
    if (send === "replyComment") {
      const { _id, id_user, content, createdAt } = msg;
      const comment = await Comments.findById(_id);
      if (comment) {
        comment.reply.push({ id_user, content, createdAt });
        await comment.save();

        const newcmt = await Comments.findById(comment._id)
          .populate("id_user")
          .populate("reply.id_user");

        io.to(newcmt.id_product.toString()).emit(
          "sendReplyCommentToClient",
          newcmt
        );
      }
    } else {
      await newComment.save();
      const newcmt = await Comments.findById(newComment._id)
        .populate("id_user")
        .populate("reply.id_user");
      io.to(newcmt.id_product.toString()).emit("sendCommentToClient", newcmt);
    }
  });

  //chat realtime
  socket.on("addUser", (userId) => {
    console.log(userId);
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    if (senderId !== "admin") {
      io.emit("toAdmin", {
        senderId,
        text,
      });
    } else {
      const user = getUser(receiverId);
      console.log(user);
      console.log(usersChat);
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log(socket.id + "disconnected");
  });
});

app.use("/api/auth", require("./routes/userRouter"));
app.use("/api/", require("./routes/uploadRouter"));
app.use("/api/", require("./routes/productRouter"));
app.use("/api/", require("./routes/categoryRouter"));
app.use("/api/", require("./routes/commentRouter"));
app.use("/api/", require("./routes/orderRouter"));
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api", (req, res) => {
  res.json({ msg: "Hello everyone" });
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log("server runing on port", PORT);
});
