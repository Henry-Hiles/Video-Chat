const socket = io("/")
const videos = document.getElementById("videos")
const myPeer = new Peer()
const myVideo = document.createElement("video")

myVideo.muted = true

const dragElement = (element) => {
    let startX, startY, startWidth, startHeight

    const doDrag = (event) =>
        (element.style.width = startWidth + event.clientX - startX + "px")

    const initDrag = (event) => {
        startX = event.clientX
        startY = event.clientY
        startWidth = element.clientWidth
        startHeight = element.clientHeight

        document.addEventListener("mousemove", doDrag)
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", doDrag)
            document.removeEventListener("mouseup", this)
        })
    }

    const resizer = document.createElement("div")
    resizer.className = "resizer"
    element.appendChild(resizer)
    resizer.addEventListener("mousedown", initDrag)

    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0

    const elementDrag = (event) => {
        pos1 = pos3 - event.clientX
        pos2 = pos4 - event.clientY
        pos3 = event.clientX
        pos4 = event.clientY
        element.style.top = `${element.offsetTop - pos2}px`
        element.style.left = `${element.offsetLeft - pos1}px`
        event.preventDefault()
    }

    const dragMouseDown = (event) => {
        if (event.target == resizer) return false
        pos3 = event.clientX
        pos4 = event.clientY
        document.addEventListener("mousemove", elementDrag)
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mouseup", this)
            document.removeEventListener("mousemove", elementDrag)
        })
        event.preventDefault()
    }

    element.addEventListener("mousedown", dragMouseDown)
}

const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream)
    const video = document.createElement("video")

    call.on("stream", (userVideoStream) =>
        addVideoStream(video, userVideoStream)
    )

    call.on("close", () => video.remove())
}

const addVideoStream = (video, stream, isYours) => {
    video.srcObject = stream
    video.addEventListener("loadedmetadata", () => video.play())
    if (isYours) {
        const container = document.createElement("div")
        container.classList.add("your-video")
        container.append(video)
        videos.append(container)
        return dragElement(container)
    }

    video.controls = "controls"
    videos.append(video)
}

navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    .then((stream) => {
        addVideoStream(myVideo, stream, true)
        myPeer.on("call", (call) => {
            call.answer(stream)
            const video = document.createElement("video")
            call.on("close", () => video.remove())
            call.on("stream", (userVideoStream) =>
                addVideoStream(video, userVideoStream)
            )
        })

        socket.on("user-connected", (userId) =>
            connectToNewUser(userId, stream)
        )
    })

socket.on("user-disconnected", (userId) => {
    const call = myPeer.connections[userId]
    if (call) call[0].close()
})

myPeer.on("open", (id) => socket.emit("join-room", ROOM_ID, id))
