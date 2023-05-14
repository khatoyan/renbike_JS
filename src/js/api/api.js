import { apiRoutes } from "./api.routes";

/** Основной интерфейс взаимодействия с сервером. */
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

  /**
   * Создание бронирования.
   *
   * @param bikeId Идентификатор велосипеда.
   */
  async pushOrder(bikeId) {
    /**
     * @todo к практике "Взаимодействие с сервером".
     * - [ ] Необходимо отправить POST запрос на apiRoutes.order, в качестве тела запроса отправить {bikeId}
     * - [ ] На выходе вернуть объект формата {status: "success" | "error"}
     */

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bikeId }),
    }

    const res = await fetch(apiRoutes.order, options);

    if (!res.ok) {
      return { status: 'error' };
    }

    return {
      status: 'success'
    };
  }

  /** Загрузка списка бронирований. */
  async getOrders() {
    /**
     * @todo к практике "Взаимодействие с сервером".
     * - [ ] Необходимо отправить GET запрос на apiRoutes.order, в ответ ожидать json
     * - [ ] На выходе вернуть объект формата {status: "success" | "error", value: {items: [...]}}
     */


    const res = await fetch(apiRoutes.order);

    if (!res.ok) {
      return { status: 'error' }
    }

    const data = await res.json();

    return {
      status: "success",
      value: { items: data }
    };
  }

  /**
   * Загрузка информации о конкретном велосипеде.
   *
   * @param bikeId Идентификатор велосипеда.
   */

  async getBike(bikeId) {
    /**
     * @todo к практике "Взаимодействие с сервером".
     * - [ ] Необходимо отправить GET запрос на apiRoutes.bike, в ответ ожидать json
     * Здесь может пригодиться метод this._insertParam для подстановки иденитфикатора в url
     *
     * - [ ] На выходе вернуть объект формата {status: "success" | "error", value: {...}}
     */

    const url = this._insertParam(apiRoutes.bike, { path: { bikeId } });
    
    const res = await fetch(url);

    if (!res.ok) {
       return { status: 'error' };
    }
   
    const data = await res.json();

    return {
      status: 'success',
      value: data,
    }
  }


}


export const api = new API();
