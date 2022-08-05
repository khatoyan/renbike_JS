import { api } from "../api";
import { app } from "../app";

import { getDeclensionWord } from "../helpers";

const bikeDeclension = {
  1: "велосипед",
  "2-4": "велосипеда",
  5: "велосипедов",
};

document.addEventListener("DOMContentLoaded", async () => {
  const { items: bikes, total: bikesCount } = await getCatalogItem();

  setBikesCount(bikesCount);
  renderCatalog(bikes);
});

function setBikesCount(count) {
  document.getElementById(
    "bikes-count"
  ).textContent = `${count} ${getDeclensionWord(count, bikeDeclension)}`;
}

async function getCatalogItem() {
  const res = await api.getBikes({
    pointId: "",
    page: 1,
  });

  if (res.status === "error") {
    alert("Ошибка загрузки каталога");
    return;
  }

  return res.value;
}

function renderCatalog(bikes) {
  const catalog = document.getElementById("catalog");

  bikes.forEach((el) => {
    catalog.append(getBikeCard(el));
  });
}

function getBikeCard(bike) {
  const template = document
    .getElementById("bike-template-card")
    .cloneNode(true);

  const imageSRC = api.getBikeImagePath(bike._id);

  template.querySelector('[data-field="bike-name"]').textContent = bike.name;
  template.querySelector(
    '[data-field="bike-cost"]'
  ).textContent = `${bike.cost} ₽/час`;

  template
    .querySelector('[data-field="bike-img"]')
    .setAttribute("src", imageSRC);

  template
    .querySelectorAll('[data-field="bike-order-btn"]')
    .forEach((element) => {
      element.addEventListener("click", () => handleBikeOrderClick(bike));
    });

  app.showElement(template);

  return template;
}

function handleBikeOrderClick(bike) {
  openModalBike(bike);
}

function openModalBike(bike) {
  const modalId = "template-modal-bike";
  const template = document.getElementById(modalId);
  const imageSRC = api.getBikeImagePath(bike._id);

  template.querySelector('[data-field="bike-name"]').textContent = bike.name;
  template.querySelector(
    '[data-field="bike-cost"]'
  ).textContent = `${bike.cost} ₽/час`;
  template
    .querySelector('[data-field="bike-img"]')
    .setAttribute("src", imageSRC);

  app.openModal(modalId);
}
