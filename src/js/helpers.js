import { app } from "./app";
import { api } from "./api";

export function getDeclensionWord(value, declensions) {
  let count = value % 100;
  if (count >= 5 && count <= 20) {
    return declensions["5"];
  }

  count %= 10;
  if (count === 1) {
    return declensions["1"];
  }
  if (count >= 2 && count <= 4) {
    return declensions["2-4"];
  }

  return declensions["5"];
}

export function getValueFromQuery(name) {
  return new URLSearchParams(document.location.search).get(name);
}

export function getUpdatedQuery(query, { name, value }) {
  const newQuery = new URLSearchParams(query);
  newQuery.set(name, value);
  return newQuery.toString();
}

export function showUnauthorizedUserPanel() {
  app.showElement("user-panel-unauthorized");
}

export function showAuthorizedUserPanel(login) {
  document.getElementById("user-panel-login").textContent = login;
  app.showElement("user-panel-authorized");
}

export function hideUnauthorizedUserPanel() {
  app.hideElement("user-panel-unauthorized");
}

export function fillDefaultFieldBikeModal(modal, bike) {
  const imageSRC = api.getBikeImagePath(bike._id);

  modal.querySelector('[data-field="bike-name"]').textContent = bike.name;
  modal.querySelector(
    '[data-field="bike-cost"]'
  ).textContent = `${bike.cost} ₽/час`;
  modal.querySelector('[data-field="bike-img"]').setAttribute("src", imageSRC);
}

function initMap(bike) {
  const map = new ymaps.Map("map", {
    center: [54.983358, 82.967614],
    zoom: 11,
  });
  if (bike.coordinates) {
    const placemark = new ymaps.Placemark(bike.coordinates, {
      balloonContent: bike.address,
    });
    map.geoObjects.add(placemark);
    map.setBounds(map.geoObjects.getBounds(), { checkZoomRange: true });
  }
}

export function openModalBikeRented(bike) {
  const modalId = "template-modal-bike-rented";
  const template = document.getElementById(modalId);

  fillDefaultFieldBikeModal(template, bike);

  ymaps.ready(() => initMap(bike));

  app.openModal(modalId);
}
