const { api } = require("../api");
const { app } = require("../app");

document.addEventListener("DOMContentLoaded", init);

async function init() {
  app.eventSubscribers.push({
    eventName: "initedAuthorizedUser",
    callback: initCurrentUserInfo,
  });
}

function initCurrentUserInfo() {
  setEmail(app.currentUserInfo.login);
  setCardRequisite(app.currentUserInfo.cardRequisites);
}

function setEmail(email) {
  document.getElementById("email-value").textContent = email;
  document.getElementById("settings-email").value = email;
}

function setCardRequisite(card) {
  const hiddenCardNumber = "•••• •••• •••• ";
  document.getElementById("settings-number").value = card.number;
  document.getElementById("settings-date").value = card.date;
  document.getElementById("settings-cvv").value = card.cvv;
  document.getElementById(
    "card-number-value"
  ).textContent = `${hiddenCardNumber}${card.number
    .split("")
    .slice(-4)
    .join("")}`;
}
