import { app } from "./app";
import { api } from "./api";

/**
 * Метод для склонений числительных словоформ.
 *
 * @param value Число.
 * @param declensions Набор словоформ (1 - велосипед, 2-4 велосипеда, 5 - велосипедов).
 * @returns {string}
 */

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

/**
 * Достаёт значение параметра из query к странице.
 *
 * @param name Ключ параметра.
 * @returns {string}
 */
export function getValueFromQuery(name) {
  return new URLSearchParams(document.location.search).get(name);
}

/**
 * Добавляет пару ключ-значение в query.
 *
 * @param query Текущее состояние.
 * @param name Новый ключ.
 * @param value Новое значение.
 * @returns {string}
 */
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

/**
 * Метод для заполнения модального окна данными актуального велосипеда.
 *
 * @param modal Целевое модальное окно.
 * @param bike Данные о велосипеде.
 */
export function fillDefaultFieldBikeModal(bikeModal, bike) {

  const bikeImage = bikeModal.querySelector("[data-field=bike-img]");
  const bikeName = bikeModal.querySelector("[data-field=bike-name]");
  const bikeCost = bikeModal.querySelector("[data-field=bike-cost]");

  bikeName.textContent = bike.name;
  bikeImage.src = api.getBikeImagePath(bike._id);
  bikeCost.textContent = `${bike.cost} р/мин`;

  /**
   * @todo к практике "Document Object Model"
   * - [ ] Нужно взять название, стоимость за час, путь к изображению из данных о велосипеде
   * и заполнить соответствующие DOM узлы в целевом модальном окне.
   */
}

/**
 * Инициализация интерактивной карты (Яндекс).
 *
 * @param bike Данные о велосипеде.
 */
function initMap(bike) {

  /**
   * @todo к практике "Document Object Model"
   * - [ ] Нужно отрисовать в контейнер #map новый объект карты;
   * - [ ] На созданную карту добавить ymaps.Placemark с данными о пункте выдачи;
   * - [ ] Т.к. точка на карте может оказаться за пределами текущего положения, нужно
   * получив методом getBounds данные об актуальных границах сразу применить их к карте - setBounds.
   *
   * Пригодится актуальная документация:
   * https://yandex.ru/dev/maps/jsapi/doc/2.1/quick-start/index.html?from=jsapi
   */
}

/**
 * Метод для отображения забронированного велосипеда.
 *
 * @param bike Данные о велосипеде.
 */
export function openModalBikeRented(bike) {

  const rentedBikeModal = document.getElementById('template-modal-bike-rented');

  fillDefaultFieldBikeModal(rentedBikeModal, bike);
  ymaps.ready(initMap())
  app.openModal('template-modal-bike-rented');

  /**
   * @todo к практике "Document Object Model"
   * - [ ] Необходимо взять шаблон #template-modal-bike-rented
   * - [ ] Для наполнения данными можем использовать fillDefaultFieldBikeModal
   * - [ ] Нужно по событию ymaps.ready вызвать initMap
   * - [ ] Для отображения модального окна пригодится метод app.openModal
   */
}
