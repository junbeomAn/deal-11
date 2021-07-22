const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://127.0.0.1:5500",
    method: ["GET", "POST"],
    credentials: true,
  },
});
const cors = require("cors");
const fetch = require("node-fetch");
const port = process.env.CHAT_PORT || 8000;

const api = {
  fetchPost: (url, headers, data) => {
    return fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((err) => console.error(err));
  },
};
app.use(cors());

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ room }) => {
    socket.join(room);
  });
  socket.on("leaveRoom", ({ room }) => {
    socket.leave(room);
  });
  socket.on("message", ({ msg, room, sendInfo }) => {
    const { toId, productId, token } = sendInfo;
    const url = `http://localhost:3000/api/v1/chat/message/${toId}/${productId}`;
    api
      .fetchPost(
        url,
        { "content-type": "application/json", token },
        { content: msg }
      )
      .then((res) => {
        if (res.ok) {
          io.in(room).emit("message", { msg, toId });
        } else {
          io.in(room).emit("message", {
            msg: "메시지가 전달되지 못했습니다. 다시 시도해주세요.",
            toId,
          });
        }
      });
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at PORT: ${port}/`);
});
