console.log("client.js has loaded");

const openMenuBtn = document.getElementById("openMenuBtn");
const locationSelector = document.getElementById("locationSelector");

let isMenuOpen = false;

openMenuBtn.addEventListener("click", () => {
    if (isMenuOpen == false) {
        locationSelector.style.display = "grid";
        openMenuBtn.style.display = "none";
        isMenuOpen = true;
    } else {
        locationSelector.style.display = "none";
        openMenuBtn.style.display = "block";
        isMenuOpen = false;
    }
});