import { app } from "./app";
import { api } from "./api";

document.addEventListener("DOMContentLoaded", () => {
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
});
