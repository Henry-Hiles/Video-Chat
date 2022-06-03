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
    resizer.classList.add("resizer")
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

    element.addEventListener(
        "mousedown",
        (event) => event.button == 0 && dragMouseDown(event)
    )
    element.addEventListener("touchstart", dragMouseDown)
}

export const addVideoStream = (videoContainer, username, stream, isYours) => {
    const videos = document.querySelector("#videos")

    const video = videoContainer.querySelector("video")
    video.srcObject = stream
    video.addEventListener("loadedmetadata", () => video.play())
    if (isYours) {
        video.muted = true
        videoContainer.classList.add("your-video")
        videos.append(videoContainer)
        return dragElement(videoContainer)
    }

    videoContainer.querySelector(".name").innerText = username

    videos.append(videoContainer)
}

export const showNoVideoPrompt = () =>
    document.querySelector("#novideo").classList.add("show")

export const connectToNewUser = (userId, username, stream, myPeer) => {
    const call = myPeer.call(userId, stream)
    const video = document
        .querySelector("#video-template")
        .content.firstElementChild.cloneNode(true)

    call.on("stream", (userVideoStream) =>
        addVideoStream(video, username, userVideoStream)
    )

    call.on("close", () => video.remove())
}

export const type = (newText) => {
    const element = document.activeElement
    element.setRangeText(
        newText,
        element.selectionStart,
        element.selectionEnd,
        "end"
    )
}
