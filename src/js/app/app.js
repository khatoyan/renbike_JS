import { api } from "../api";

class App {
  constructor(api) {
    this._api = api;
  }

  init() {}

  closeModal(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) {
      return;
    }

    modal.classList.remove("modal--active");
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) {
      return;
    }

    modal.classList.add("modal--active");

    modal
      .querySelector('[data-control="modal-background"]')
      .addEventListener("click", () => this.closeModal(modalId));

    modal
      .querySelector('[data-control="modal-btn-close"]')
      .addEventListener("click", () => this.closeModal(modalId));
  }
}

export const app = new App();