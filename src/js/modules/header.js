import { app } from "../app";
import { api } from "../api";
import { hideUnauthorizedUserPanel, showAuthorizedUserPanel } from "../helpers";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  await app.init();
  initListeners();
}

function initListeners() {
  document
    .getElementById("btn-open-modal-login")
    .addEventListener("click", () => {
      app.openModal("modal-login");
    });

  document
    .getElementById("btn-open-modal-reg")
    .addEventListener("click", () => {
      app.openModal("modal-registration");
    });

  document
    .getElementById("auth-form-reg-link")
    .addEventListener("click", () => {
      app.closeModal("modal-login");
      app.openModal("modal-registration");
    });

  document
    .getElementById("reg-form-auth-link")
    .addEventListener("click", () => {
      app.closeModal("modal-registration");
      app.openModal("modal-login");
    });

  document.getElementById("card-form-close").addEventListener("click", () => {
    app.closeModal("modal-card");
  });

  document.getElementById("auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target));

    const res = await api.auth({
      login: formData["login-email"],
      password: formData["login-password"],
    });

    if (res.status === "error") {
      alert("Ошибка авторизации");
      return;
    }

    hideUnauthorizedUserPanel();
    showAuthorizedUserPanel(res.value.login);
    app.closeModal("modal-login");
  });

  document.getElementById("reg-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target));

    const res = await api.registration({
      login: formData["reg-email"],
      password: formData["reg-password1"],
    });

    if (res.status === "error") {
      alert("Ошибка регистрации");
      return;
    }

    app.closeModal("modal-registration");
    app.openModal("modal-card");
    hideUnauthorizedUserPanel();
    init();
  });

  document.getElementById("card-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target));

    const res = await api.updateCurrentUser({
      cardRequisites: {
        number: formData["card-number"],
        date: formData["card-date"],
        cvv: formData["card-cvv"],
      },
    });

    if (res.status === "error") {
      alert("Ошибка привязки карты");
      return;
    }

    app.closeModal("modal-card");
  });
}
