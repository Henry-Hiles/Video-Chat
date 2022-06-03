const socket = io("/")
const login = document.querySelector("#login")
const nameButton = document.querySelector("#name")
const nameInput = document.querySelector("#name-input")
const nameDisplay = document.querySelector("#name-display")

document
    .querySelector("#change-name")
    .addEventListener("click", () => login.classList.remove("done"))

const yourName = localStorage.getItem("name")

if (yourName) nameDisplay.innerText = yourName
else login.classList.remove("done")

const validate = () => {
    if (!nameInput.value) return (nameInput.required = true)
    document.querySelector("#login").classList.add("done")
    localStorage.setItem("name", nameInput.value)
    nameDisplay.innerText = nameInput.value
    socket.emit("name-change", nameInput.value)
}

if (nameButton) nameButton.addEventListener("click", validate)
if (nameInput)
    nameInput.addEventListener(
        "keydown",
        (event) => event.keyCode == "13" && validate()
    )
