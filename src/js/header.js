import { app } from "./app";
import { api } from "./api";

document.addEventListener("DOMContentLoaded", async () => {
  await init();
  bindings();
});

async function init() {
  const res = await api.getCurrentUser();

  if (res.status === "error") {
    showUnauthorizedUserPanel();
    return;
  }

  showAuthorizedUserPanel(res.value.login);
}

const showUnauthorizedUserPanel = () => {
  document.getElementById("user-panel-unauthorized").removeAttribute("hidden");
};

const showAuthorizedUserPanel = (login) => {
  document.getElementById("user-panel-login").textContent = login;
  document.getElementById("user-panel-authorized").removeAttribute("hidden");
};

function bindings() {
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

    document.location.reload();
  });
}
