const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)

const PORT = process.env.PORT || 5000
const userList = []
const roomList = []

io.on("connection", (socket) => {
    socket.on("remove-user", (user) => {
        userList.splice(userList.indexOf(user), 1)
        io.emit("users", { type: "users", list: userList })
    })

    socket.on("message", (message) => {
        // console.log("Message Received: " + JSON.stringify(message))
        io.emit("message", { type: "new-message", text: message })
    })

    socket.on("users", (users) => {
        socket.user_name = users
        console.log("User: ", users)
        if (!userList.includes(users)) {
            userList.push(users)
        }
        io.emit("users", { type: "users", list: userList })
    })

    socket.on("room", (room) => {
        socket.join(room)
    })

    socket.on("rooms", (rooms) => {
        if (!roomList.includes(rooms)) {
            roomList.push(rooms)
        }
        io.emit("rooms", { type: "rooms", list: roomList })
    })

    socket.on("disconnect", () => {
        userList.splice(userList.indexOf(socket.user_name), 1)
        io.emit("users", { type: "users", list: userList })
    })
})

http.listen(PORT, () => {
    console.log("started on port " + PORT)
})
