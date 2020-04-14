const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)

const PORT = process.env.PORT || 5000
const userList = []
const roomList = []

io.on("connection", (socket) => {
    socket.on("disconnect", function () {
        console.log("user disconnected")
        this.userList = null
    })

    socket.on("message", (message) => {
        console.log("Message Received: " + JSON.stringify(message))
        io.emit("message", { type: "new-message", text: message })
    })

    socket.on("users", (users) => {
        console.log("User: " + JSON.stringify(users))
        if (!userList.includes(users)) {
            userList.push(users)
        }
        io.emit("users", { type: "users", list: userList })
    })

    socket.on("rooms", (rooms) => {
        console.log("Room: " + JSON.stringify(rooms))
        if (!roomList.includes(rooms)) {
            roomList.push(rooms)
        }
        io.emit("rooms", { type: "rooms", list: roomList })
    })
})

http.listen(PORT, () => {
    console.log("started on port " + PORT)
})
