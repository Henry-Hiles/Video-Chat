import { v4 as uuidv4 } from "https://jspm.dev/uuid"
import { type } from "./utils.js"

const input = document.querySelector("#go-input")

input.addEventListener("keydown", (event) => {
    if (event.code == "Space") {
        event.preventDefault()
        type("-")
    } else if (!/^[-a-z0-9]+$/i.test(event.key)) event.preventDefault()
})

const setHref = () =>
    (document.querySelector("#go").href = input.value || uuidv4())

setHref()

input.addEventListener("keyup", setHref)
