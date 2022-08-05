import { api } from "../api";
import { app } from "../app";

import { getDeclensionWord, getValueFromQuery } from "../helpers";

const pointIdQueryName = "pointId";
const pageQueryName = "page";
const bikeDeclension = {
  1: "велосипед",
  "2-4": "велосипеда",
  5: "велосипедов",
};

document.addEventListener("DOMContentLoaded", async () => {
  const pointId = getValueFromQuery(pointIdQueryName) || "";
  const currentPage = getValueFromQuery(pageQueryName) || 1;

  const {
    items: bikes,
    total: bikesCount,
    pages: totalPages,
  } = await getCatalogItem({
    pointId,
    currentPage,
  });

  renderPagination({ totalPages, currentPage });
  setBikesCount(bikesCount);
  renderCatalog(bikes);
});

function renderPagination({ currentPage, totalPages }) {
  const container = document.getElementById("pagination");

  for (let index = 0; index < totalPages; index++) {
    const pageNumber = index + 1;
    container.append(
      getPaginationElementLink({
        pageNumber,
        isActive: +currentPage === pageNumber,
      })
    );
  }

  if (currentPage < totalPages) {
    container.append(getPaginationNextButton(+currentPage + 1));
  }
}

function getPaginationElementLink({ pageNumber, isActive }) {
  const link = document.createElement("a");

  link.setAttribute("href", getPaginationLink(pageNumber));
  link.classList.add("pagination__link");
  link.textContent = pageNumber;

  if (isActive) {
    link.classList.add("pagination__link--active");
  }

  return link;
}

function getPaginationLink(pageNumber) {
  const query = new URLSearchParams(document.location.search);

  query.set(pageQueryName, pageNumber);

  return `${document.location.pathname}?${query.toString()}`;
}

function getPaginationNextButton(pageNumber) {
  const link = document.createElement("a");

  link.setAttribute("href", getPaginationLink(pageNumber));
  link.classList.add("pagination__next");
  link.textContent = "Дальше";

  return link;
}

function setBikesCount(count) {
  document.getElementById(
    "bikes-count"
  ).textContent = `${count} ${getDeclensionWord(count, bikeDeclension)}`;
}

async function getCatalogItem({ currentPage }) {
  const res = await api.getBikes({
    pointId: "",
    page: currentPage,
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
