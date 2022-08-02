import { app } from "./app";
import { api } from "./api";

document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  const res = await api.getCurrentUser();

  if (res.status === "error") {
    showUnauthorizedUserPanel();
    return;
  }

  showAuthorizedUserPanel(res.value.login);
}

function showUnauthorizedUserPanel() {
  document.getElementById("user-panel-unauthorized").removeAttribute("hidden");
  initListeners();
}

function hideUnauthorizedUserPanel() {
  document.getElementById("user-panel-unauthorized").setAttribute("hidden", "");
  initListeners();
}

function showAuthorizedUserPanel(login) {
  document.getElementById("user-panel-login").textContent = login;
  document.getElementById("user-panel-authorized").removeAttribute("hidden");
}

function initListeners() {
  document
    .getElementById("btn-open-modal-login")
    .addEventListener("click", () => {
      app.openModal("modal-login");
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
}
