const socket = io("/")
const videos = document.getElementById("videos")
const myPeer = new Peer()
const popup = document.querySelector("#popup")
const hrefInput = document.querySelector("#href")
const myVideo = document.createElement("video")

myVideo.muted = true

const dragElement = (element) => {
    let startX, startY, startWidth, startHeight

    const doDrag = (event) =>
        (element.style.width =
            startWidth +
            (event.clientX || event.touches[0].clientX) -
            startX +
            "px")

    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0

    const elementDrag = (event) => {
        pos1 = pos3 - (event.clientX || event.touches[0].clientX)
        pos2 = pos4 - (event.clientY || event.touches[0].clientY)
        pos3 = event.clientX || event.touches[0].clientX
        pos4 = event.clientY || event.touches[0].clientY
        element.style.top = `${element.offsetTop - pos2}px`
        element.style.left = `${element.offsetLeft - pos1}px`
    }

    const removeFunctions = (resize) => {
        document.removeEventListener("mousemove", resize ? doDrag : elementDrag)
        document.removeEventListener("mouseup", this)
        document.removeEventListener("touchmove", resize ? doDrag : elementDrag)
        document.removeEventListener("touchend", this)
    }

    const initDrag = (event) => {
        startX = event.clientX || event.touches[0].clientX
        startY = event.clientY || event.touches[0].clientY
        startWidth = element.clientWidth
        startHeight = element.clientHeight

        document.addEventListener("mousemove", doDrag)
        document.addEventListener("touchmove", doDrag)
        document.addEventListener("touchend", () => removeFunctions(true))
        document.addEventListener("mouseup", () => removeFunctions(true))
    }

    const resizer = document.createElement("div")
    resizer.className = "resizer"
    element.appendChild(resizer)
    resizer.addEventListener("mousedown", initDrag)
    resizer.addEventListener("touchstart", initDrag)

    const dragMouseDown = (event) => {
        if (event.target == resizer) return

        pos3 = event.clientX || event.touches[0].clientX
        pos4 = event.clientY || event.touches[0].clientY
        document.addEventListener("mousemove", elementDrag)
        document.addEventListener("touchmove", elementDrag)
        document.addEventListener("touchend", () => removeFunctions())
        document.addEventListener("mouseup", () => removeFunctions())
    }

    element.addEventListener("mousedown", dragMouseDown)
    element.addEventListener("touchstart", dragMouseDown)
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

document
    .querySelector("#share")
    .addEventListener("click", () => popup.classList.remove("dismissed"))

hrefInput.value = window.location.href

document.querySelector("#copy").addEventListener("click", () => {
    hrefInput.focus()
    hrefInput.select()
    navigator.clipboard.writeText(hrefInput.value)
    document.querySelector("#is-copied").classList.add("copied")
})

document
    .querySelector("#close")
    .addEventListener("click", () => popup.classList.add("dismissed"))

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
