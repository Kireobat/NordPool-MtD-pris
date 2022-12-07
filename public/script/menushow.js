console.log("menushow.js has loaded");

const participantButton = document.getElementById("partBtn");
const mealsButton = document.getElementById("mealsBtn");
const meals = document.getElementById("meals");
const participants = document.getElementById("participants");



participantButton.addEventListener("click", () => {
    meals.style.display = "none";
    participants.style.display = "block";
});

mealsButton.addEventListener("click", () => {
    participants.style.display = "none";
    meals.style.display = "block";
});
