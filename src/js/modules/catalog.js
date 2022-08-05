import { api } from "../api";

document.addEventListener("DOMContentLoaded", async () => {
  const bikes = await getCatalogItem();

  renderCatalog(bikes);
});

async function getCatalogItem() {
  const bikes = await api.getBikes({ pointId: "", page: 1 });

  if (bikes.status === "error") {
    alert("Ошибка загрузки каталога");
    return;
  }

  return bikes.value.items;
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

  template.querySelector('[data-field="bike-name"]').textContent = bike.name;
  template.querySelector('[data-field="bike-img"]').textContent =
    api.getBikeImagePath(bike.img);

  template
    .querySelectorAll('[data-field="bike-order-btn"]')
    .forEach((element) => {
      element.addEventListener("click", handleBikeOrderClick);
    });

  template.classList.remove("hidden");

  return template;
}

function handleBikeOrderClick(bike) {}

function renderModalBike() {}
