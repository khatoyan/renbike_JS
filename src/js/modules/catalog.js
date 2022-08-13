import { api } from "../api";
import { app } from "../app";

import {
  fillDefaultFieldBikeModal,
  getDeclensionWord,
  getUpdatedQuery,
  getValueFromQuery,
  openModalBikeRented,
} from "../helpers";

const pointIdQueryName = "pointId";
const pageQueryName = "page";
const bikeDeclension = {
  1: "велосипед",
  "2-4": "велосипеда",
  5: "велосипедов",
};

document.addEventListener("DOMContentLoaded", () => {
  app.eventSubscribers.push({
    eventName: "initedAuthorizedUser",
    callback: init,
  });
});

async function init() {
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

  renderTabs(pointId);
  renderPagination({ totalPages, currentPage });
  setBikesCount(bikesCount);
  renderCatalog(bikes);
}

async function renderTabs(currentPointId) {
  const container = document.getElementById("pointsTabs");
  const points = await api.getPoints();

  if (points.status === "error") {
    alert("Ошибка загрузки точек проката");
    return;
  }

  points.value.items.forEach((el) => {
    container.append(
      getPointElementLink({ ...el, isActive: currentPointId === el._id })
    );
  });

  container.append(
    getPointElementLink({
      _id: "",
      address: "Все пункты",
      isActive: !currentPointId,
    })
  );
}

function getPointElementLink({ address, _id, isActive }) {
  const link = document.createElement("a");

  link.setAttribute("href", getPointLink(_id));
  link.classList.add("tabs__link");
  link.textContent = address;

  if (isActive) {
    link.classList.add("tabs__link--active");
  }

  return link;
}

function getPointLink(pointId) {
  const queryWithPointId = getUpdatedQuery(document.location.search, {
    name: pointIdQueryName,
    value: pointId,
  });

  const newQuery = getUpdatedQuery(queryWithPointId, {
    name: pageQueryName,
    value: "",
  });

  return `${document.location.pathname}?${newQuery}`;
}

function renderPagination({ currentPage, totalPages }) {
  const container = document.getElementById("pagination");

  if (totalPages < 2) {
    return;
  }

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
  const query = getUpdatedQuery(document.location.search, {
    name: pageQueryName,
    value: pageNumber,
  });

  return `${document.location.pathname}?${query}`;
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

async function getCatalogItem({ currentPage, pointId }) {
  const res = await api.getBikes({
    pointId: pointId,
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
      element.addEventListener("click", () => handleBikeClick(bike));
    });

  app.showElement(template);

  return template;
}

function handleBikeClick(bike) {
  if (bike.isRented) {
    openModalBikeRented(bike);
    return;
  }

  openModalBikeFree(bike);
}

function openModalBikeFree(bike) {
  const modalId = "template-modal-bike";
  const template = document.getElementById(modalId);

  fillDefaultFieldBikeModal(template, bike);
  template
    .querySelector('[data-control="bike-rent"]')
    .addEventListener("click", () => {
      handleBikeRentClick(bike._id);
    });

  app.openModal(modalId);
}

async function handleBikeRentClick(bikeId) {
  const res = await api.pushOrder(bikeId);

  if (res.status === "error") {
    alert("Ошибка аренды велосипеда");
    return;
  }

  document.location.href = "/booking.html";
}
