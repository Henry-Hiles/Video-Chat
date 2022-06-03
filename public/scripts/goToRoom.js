import { v4 as uuidv4 } from "https://jspm.dev/uuid"
import { type } from "./utils.js"

const input = document.querySelector("#go-input")

input.addEventListener("keydown", (event) => {
    if (event.keyCode == "32") {
        event.preventDefault()
        return type("-")
    }
    if (event.keyCode === 13) return (location.href = input.value)
    if (!/^[-a-z0-9]+$/i.test(event.key)) event.preventDefault()
})

const setHref = () =>
    (document.querySelector("#go").href = input.value || uuidv4())

setHref()

input.addEventListener("keyup", setHref)
