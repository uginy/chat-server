const app = require("express")()
const http = require("http").Server(app)
const io = require("socket.io")(http)

const PORT = process.env.PORT || 5000
const userList = []

io.on("connection", (socket) => {
    socket.on("remove-user", (user) => {
        userList.splice(userList.indexOf(user), 1)
        userEmit(userList)
    })

    socket.on("update-user", ({ old: oldUser, new: newUser }) => {
        const findedIndex = userList.indexOf(oldUser) > -1 ? userList.indexOf(oldUser) : null
        if (findedIndex !== null) {
            userList[findedIndex] = newUser
        }
        userEmit(userList)
    })

    socket.on("message", (message) => {
        console.log("Messages", message)
        io.emit("message", { type: "new-message", text: message })
    })

    socket.on("add-user", (user) => {
        socket.user_name = user
        userList.push(user)
        console.log("Added User: ", user)
        console.log("UserList: ", userList)
        userEmit(userList)
    })

    socket.on("users", () => {
        userEmit(userList)
    })

    socket.on("disconnect", () => {
        if (userList.indexOf(socket.user_name) > -1) {
            userList.splice(userList.indexOf(socket.user_name), 1)
        }
        userEmit(userList)
    })

    const userEmit = (users) => {
        io.emit("users", { type: "users", list: users })
    }
})

http.listen(PORT, () => {
    console.log("started on port " + PORT)
})
