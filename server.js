import express from "express"
import http from "http"
import { Server } from "socket.io"
const app = express()
const server = http.Server(app)
const io = new Server(server)
app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/", (_, res) => res.render("index"))

app.get("/:room", (req, res) => res.render("room", { roomId: req.params.room }))

const users = {}

io.on("connection", (socket) =>
    socket.on("join-room", (roomId, userId, userName) => {
        users[userId] = userName
        socket.join(roomId)
        socket.to(roomId).emit("user-connected", userId, userName)

        socket.on("disconnect", () => {
            delete users[userId]
            socket.to(roomId).emit("user-disconnected", userId)
        })

        socket.on("get-username", (userId, callback) => callback(users[userId]))

        socket.on("name-change", (name) => {
            users[userId] = name

            socket.to(roomId).emit("name-changed", userId)
        })
    })
)

server.listen(3001)
