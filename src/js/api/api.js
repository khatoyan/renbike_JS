import { apiRoutes } from "./api.routes";

class API {
  _insertParam(pathname, config) {
    if (!config) {
      return pathname;
    }

    const { path, query } = config;

    if (path) {
      pathname = url.replace(/(?::(\w+))/g, (_, name) => path[name]);
    }

    if (query) {
      pathname += `?${new URLSearchParams(config.query).toString()}`;
    }

    return `${document.location.origin}${pathname}`;
  }

  async auth({ login, password }) {
    const body = JSON.stringify({ username: login, password });

    const res = await fetch(apiRoutes.auth, {
      body,
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return { status: "error", value: res.status };
    }

    const data = await res.json();

    return { status: "success", value: { login: data.login } };
  }

  async registration({ login, password }) {
    const body = JSON.stringify({ login, password });

    const res = await fetch(apiRoutes.currentUser, {
      body,
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return { status: "error", value: res.status };
    }

    const data = await res.json();

    return { status: "success", value: { login: data.login } };
  }

  async getCurrentUser() {
    const res = await fetch(apiRoutes.currentUser, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return { status: "error", value: res.status };
    }

    const data = await res.json();

    return { status: "success", value: { login: data.login } };
  }
}

export const api = new API();
