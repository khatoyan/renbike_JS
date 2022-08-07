import { api } from "../api";
import { showAuthorizedUserPanel, showUnauthorizedUserPanel } from "../helpers";

class App {
  eventSubscribers = [];
  currentUserInfo = {};

  constructor(api) {
    this._api = api;
  }

  async init() {
    const res = await api.getCurrentUser();

    if (res.status === "success") {
      showAuthorizedUserPanel(res.value.login);

      this.currentUserInfo = res.value;
      this.resolveEventSubscribers("initedAuthorizedUser");
      return;
    }

    if (document.location.pathname !== "/") {
      document.location.pathname = "/";
    }

    showUnauthorizedUserPanel();
  }

  resolveEventSubscribers(eventName) {
    this.eventSubscribers = this.eventSubscribers
      .map((el) => {
        if (el.eventName === eventName) {
          el.callback();
        }

        return el;
      })
      .filter((el) => el.eventName !== eventName);
  }

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
    if (typeof element === "string") {
      element = document.getElementById(element);
    }

    element.classList.add("hidden");
  }

  showElement(element) {
    if (typeof element === "string") {
      element = document.getElementById(element);
    }

    element.classList.remove("hidden");
  }
}

export const app = new App();
