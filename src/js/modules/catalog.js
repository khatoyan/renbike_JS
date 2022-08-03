import { api } from "../api";

document.addEventListener("DOMContentLoaded", () => {
  api.getCurrentUser().then((r) => alert(r.value.login));
});
