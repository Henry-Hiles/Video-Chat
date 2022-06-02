import { v4 as uuidv4 } from "https://jspm.dev/uuid"

const input = document.querySelector("#go-input")
const setHref = () =>
    (document.querySelector("#go").href = input.value || uuidv4())

setHref()

input.addEventListener("keyup", setHref)
