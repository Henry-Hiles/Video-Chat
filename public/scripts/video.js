import { addVideoStream, connectToNewUser, showNoVideoPrompt } from "./utils.js"
const socket = io("/")
const myPeer = new Peer()
const template = document.querySelector("#video-template")
const yourName = localStorage.getItem("name")

myPeer.on("open", async (id) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })

        const myVideo = template.content.firstElementChild.cloneNode(true)
        addVideoStream(myVideo, yourName, stream, true)
        myPeer.on("call", (call) => {
            call.answer(stream)
            const video = template.content.firstElementChild.cloneNode(true)
            call.on("close", () => video.remove())
            call.on("stream", (userVideoStream) =>
                socket.emit("get-username", call.peer, (username) =>
                    addVideoStream(video, username, userVideoStream)
                )
            )
        })

        socket.on("user-connected", (userId, username) =>
            connectToNewUser(userId, username, stream, myPeer)
        )
    } catch (error) {
        if (
            error.name == "NotAllowedError" ||
            error.name == "NotFoundError" ||
            error.name == "PermissionDeniedError" ||
            error.name == "DevicesNotFoundError"
        )
            return showNoVideoPrompt()

        console.log(error.name)

        throw error
    }

    socket.emit("join-room", ROOM_ID, id, yourName)
})

socket.on("user-disconnected", (userId) => {
    const call = myPeer.connections[userId]
    if (call) call[0].close()
})
