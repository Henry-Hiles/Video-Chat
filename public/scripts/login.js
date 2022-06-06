const nameButton = document.querySelector("#name")
const nameInput = document.querySelector("#name-input")
const nameDisplay = document.querySelector("#name-display")

const loginURL = new URL("login", window.location.origin)
try {
    loginURL.searchParams.append("roomId", ROOM_ID)
} catch (error) {
    if (!error instanceof ReferenceError) throw error
}

document
    .querySelector("#change-name")
    ?.addEventListener("click", () => (window.location = loginURL))

const yourName = localStorage.getItem("name")

if (!yourName && window.location.pathname != "/login")
    window.location = loginURL
if (yourName && nameDisplay) nameDisplay.innerText = yourName

const validate = () => {
    if (!nameInput.value) return (nameInput.required = true)
    localStorage.setItem("name", nameInput.value)

    window.location.href =
        new URLSearchParams(window.location.search).get("roomId") || "/"
}

nameButton?.addEventListener?.("click", validate)
nameInput?.addEventListener?.(
    "keydown",
    (event) => event.keyCode == "13" && validate()
)
