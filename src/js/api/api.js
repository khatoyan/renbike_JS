import { apiRoutes } from "./api.routes";

class API {
  _insertParam(pathname, config) {
    if (!config) {
      return pathname;
    }

    const { path, query } = config;

    if (path) {
      pathname = pathname.replace(/(?::(\w+))/g, (_, name) => path[name]);
    }

    if (query) {
      pathname += `?${new URLSearchParams(config.query).toString()}`;
    }

    return `${document.location.origin}${pathname}`;
  }

  async auth({ login, password }) {
    const body = JSON.stringify({ login, password });

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

    return { status: "success" };
  }

  async updateCurrentUser({ login, password, cardRequisites }) {
    const body = JSON.stringify({ login, password, cardRequisites });

    const res = await fetch(apiRoutes.currentUser, {
      body,
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return { status: "error", value: res.status };
    }

    return { status: "success" };
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

    return { status: "success", value: data };
  }

  async getBikes({ pointId, page }) {
    const url = this._insertParam(apiRoutes.bikes, {
      query: { page },
      path: { pointId },
    });

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return { status: "error" };
    }

    const data = await res.json();

    return {
      status: "success",
      value: {
        items: data.itemsInPage,
        total: data.totalItems,
        pages: data.pages,
      },
    };
  }

  getBikeImagePath(bikeId) {
    return this._insertParam(apiRoutes.bikeImage, { path: { bikeId } });
  }

  async getPoints() {
    const res = await fetch(apiRoutes.points, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return { status: "error" };
    }

    const data = await res.json();

    return {
      status: "success",
      value: {
        items: data.map(({ address, _id }) => ({ address, _id })),
      },
    };
  }

  async getPoint(pointId) {
    const url = this._insertParam(apiRoutes.point, {
      path: { pointId },
    });
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return { status: "error" };
    }

    const data = await res.json();

    return {
      status: "success",
      value: data,
    };
  }

  async pushOrder(bikeId) {
    const body = JSON.stringify({ bikeId });

    const res = await fetch(apiRoutes.order, {
      body,
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return { status: "error" };
    }

    return {
      status: "success",
    };
  }

  async getOrders() {
    const res = await fetch(apiRoutes.order, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return { status: "error" };
    }

    const data = await res.json();

    return {
      status: "success",
      value: {
        items: data,
      },
    };
  }

  async getBike(bikeId) {
    const url = this._insertParam(apiRoutes.bike, {
      path: { bikeId },
    });

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      return { status: "error" };
    }

    const data = await res.json();

    return {
      status: "success",
      value: data,
    };
  }
}

export const api = new API();
