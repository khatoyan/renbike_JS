import { api } from "../api";
import { app } from "../app";
import { openModalBikeRented } from "./catalog";

document.addEventListener("DOMContentLoaded", () => {
  app.eventSubscribers.push({
    eventName: "initedAuthorizedUser",
    callback: init,
  });
});

async function init() {
  const orders = await getOrders();
  renderOrders(orders);
}

async function getOrders() {
  const res = await api.getOrders();

  if (res.status === "error") {
    alert("Ошибка загрузки бронирований");
    return;
  }

  const promises = res.value.items.map(({ bikeId, _id: orderId }) =>
    getBikeById(bikeId, orderId)
  );

  return Promise.all(promises);
}

async function getBikeById(bikeId, orderId) {
  const res = await api.getBike(bikeId);

  if (res.status === "error") {
    alert("Ошибка загрузки бронирований");
    return {};
  }

  return {
    ...res.value,
    orderId,
  };
}

function renderOrders(orders) {
  const container = document.getElementById("bookingList");
  orders.forEach((rentedBike) => {
    container.append(getOrderCard(rentedBike));
  });
}

function getOrderCard(bike) {
  const template = document
    .getElementById("order-card-template")
    .cloneNode(true);

  template.querySelector('[data-field="bike-name"]').textContent = bike.name;

  template.querySelector(
    '[data-field="bike-cost"]'
  ).textContent = `${bike.cost} ₽/час`;

  const imageSRC = api.getBikeImagePath(bike._id);

  template
    .querySelector('[data-field="bike-img"]')
    .setAttribute("src", imageSRC);

  template
    .querySelectorAll('[data-field="bike-view-btn"]')
    .forEach((element) => {
      element.addEventListener("click", () => openModalBikeRented(bike));
    });

  app.showElement(template);

  return template;
}
