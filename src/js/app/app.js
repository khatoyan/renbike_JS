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

    this.hideElement(modal);
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);

    if (!modal) {
      return;
    }

    this.showElement(modal);

    modal
      .querySelector('[data-control="modal-background"]')
      .addEventListener("click", () => this.hideElement(modal));

    modal
      .querySelector('[data-control="modal-btn-close"]')
      .addEventListener("click", () => this.hideElement(modal));
  }

  hideElement(element) {
    element.classList.add("hidden");
  }

  showElement(element) {
    element.classList.remove("hidden");
  }
}

export const app = new App();
