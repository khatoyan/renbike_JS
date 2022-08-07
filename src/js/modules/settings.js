const { api } = require("../api");
const { app } = require("../app");

document.addEventListener("DOMContentLoaded", init);

async function init() {
  app.eventSubscribers.push({
    eventName: "initedAuthorizedUser",
    callback: initCurrentUserInfo,
  });

  initListeners();
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

function initListeners() {
  document
    .getElementById("email-edit")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = Object.fromEntries(new FormData(e.target)).email;

      const res = await api.updateCurrentUser({
        login: email,
      });

      if (res.status === "error") {
        alert("Ошибка сохранения email");
        return;
      }

      setEmail(email);
      document.location.hash = "";
    });

  document
    .getElementById("password-edit")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const password = Object.fromEntries(new FormData(e.target))["new-pass"];

      const res = await api.updateCurrentUser({
        password,
      });

      if (res.status === "error") {
        alert("Ошибка сохранения password");
        return;
      }

      document.location.hash = "";
    });

  document.getElementById("card-edit").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target));

    const cardRequisites = {
      number: formData["number"],
      date: formData["date"],
      cvv: formData["cvv"],
    };

    const res = await api.updateCurrentUser({
      cardRequisites: {
        number: formData["number"],
        date: formData["date"],
        cvv: formData["cvv"],
      },
    });

    if (res.status === "error") {
      alert("Ошибка сохранения карты");
      return;
    }

    setCardRequisite(cardRequisites);
    document.location.hash = "";
  });
}
