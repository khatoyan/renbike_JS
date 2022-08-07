import { api } from "../api";
import { app } from "../app";

document.addEventListener("DOMContentLoaded", () => {
  app.eventSubscribers.push({
    eventName: "initedAuthorizedUser",
    callback: init,
  });
});

async function init() {
  const orders = await getOrders();

  console.log(orders);

  // renderOrders();
}

async function getOrders() {
  const res = await api.getOrders();

  if (res.status === "error") {
    alert("Ошибка загрузки бронирований");
    return;
  }

  const promises = res.value.items.map(({ bikeId, _id: orderId }) => {
    return getBikeById(bikeId, orderId);
  });

  return Promise.all(promises);
}

async function getBikeById(bikeId, orderId) {
  const res = await api.getBike(bikeId);

  console.log(res);

  if (res.status === "error") {
    alert("Ошибка загрузки бронирований");
    return {};
  }

  return {
    ...res.value,
    orderId,
  };
}
