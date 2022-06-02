const popup = document.querySelector("#popup")
const hrefInput = document.querySelector("#href")

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
