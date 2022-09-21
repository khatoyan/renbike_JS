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

/** Ожидаем данных об учётной записи, загружаем данные о велосипедах. */
document.addEventListener("DOMContentLoaded", () => {
  app.eventSubscribers.push({
    eventName: "initedAuthorizedUser",
    callback: init,
  });
});

/** Загрузка данных приложения, необходимых на странице каталога. */
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

/**
 * Отрисовка табов-фильтров по пунктам проката.
 *
 * @param currentPointId Идентификатор точки проката.
 */
async function renderTabs(currentPointId) {
  const points = await api.getPoints();

  if (points.status === "error") {
    alert("Ошибка загрузки точек проката");
    return;
  }

  /**
   * @todo к практике "Document Object Model"
   * - [ ] Нужно в контейнер #pointsTabs отрисовать данные, полученные от сервера
   * - [ ] Каждый отдельный пункт рисует метод getPointElementLink
   * - [ ] В конце списка должен быть вариант "Все пункты" с пустым id
   */
}

/**
 * Рисует пункт проката для табов-фильтров.
 *
 * @param address Адрес пункта проката.
 * @param _id Идентификатор.
 * @param isActive Признак активности.
 * @returns {HTMLAnchorElement}
 */
function getPointElementLink({ address, _id, isActive }) {
  /**
   * @todo к практике "Document Object Model"
   * - [ ] Нужно создать новый DOM-узел вида HTMLAnchorElement
   * - [ ] Адрес выведем в тело ссылки
   * - [ ] Путь возьмем из метода getPointLink
   * - [ ] В зависимости от флага isActive выставим актуальные CSS классы
   */
}

/**
 * Метод для получения актуальной ссылки на каталог, отфильтрованный по пункту проката.
 *
 * @param pointId Идентификатор пункта проката.
 * @returns {string}
 */
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

/**
 * Метод рисует блок постраничной навигации для списка велосипедов.
 *
 * @param currentPage Текущая страница.
 * @param totalPages Общее количество страниц.
 */
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

/**
 * Метод рисует ссылку на очередную страницу списка.
 *
 * @param pageNumber Номер страницы.
 * @param isActive Признак активности пункта.
 * @returns {HTMLAnchorElement}
 */
function getPaginationElementLink({ pageNumber, isActive }) {
  /**
   * @todo к практике "Document Object Model"
   * - [ ] Нужно создать новый DOM-узел вида HTMLAnchorElement
   * - [ ] Номер страницы выведем в тело ссылки
   * - [ ] Путь возьмем из метода getPaginationLink
   * - [ ] В зависимости от флага isActive выставим актуальные CSS классы
   */
}

/**
 * Метод формирует ссылку на очередную страницу списка.
 *
 * @param pageNumber Номер страницы.
 * @returns {string}
 */
function getPaginationLink(pageNumber) {
  const query = getUpdatedQuery(document.location.search, {
    name: pageQueryName,
    value: pageNumber,
  });

  return `${document.location.pathname}?${query}`;
}

/**
 * Метод формирует ссылку на следующую страницу списка.
 *
 * @param pageNumber Номер страницы.
 * @returns {HTMLAnchorElement}
 */
function getPaginationNextButton(pageNumber) {
  const link = document.createElement("a");

  link.setAttribute("href", getPaginationLink(pageNumber));
  link.classList.add("pagination__next");
  link.textContent = "Дальше";

  return link;
}

/**
 * Метод рисует актуальное количество велоспедов.
 *
 * @param count Количество.
 */
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
}

/**
 * Рисует список карточек велосипедов.
 *
 * @param bikes Массив с данными о велосипедах.
 */
function renderCatalog(bikes) {
  const catalog = document.getElementById("catalog");

  bikes.forEach((el) => {
    catalog.append(getBikeCard(el));
  });
}

/**
 * Рисует одну карточку велосипеда.
 *
 * @param bike Данные о велосипеде.
 * @returns {Node}
 */
function getBikeCard(bike) {
  /**
   * @todo к практике "Document Object Model"
   * - [ ] Необходимо взять шаблон #bike-template-card
   * - [ ] Можно делать копию DOM узла с помощью нативного метода cloneNode
   * - [ ] Данные из объекта bike нужно вписать в узлы DOM, для поиска удобно использовать data-атрибуты
   * - [ ] Шаблон по-умолчанию скрыт средствами CSS, здесь пригодится метод app.showElement
   * - [ ] На клик по карточке надо подписать handleBikeClick
   */
}

/**
 * Обработчик клика по карточке велосипеда.
 *
 * @param bike Данные о велосипеде.
 */
function handleBikeClick(bike) {
  /**
   * @todo к практике "Document Object Model"
   * - [ ] В зависимости от состояния флага `rented` в данных о велосипеде надо отобразить актуальное модальное окно
   */
}

/**
 * Метод для отображения свободного (доступного к аренде) велосипеда.
 *
 * @param bike Данные о велосипеде.
 */
function openModalBikeFree(bike) {
  /**
   * @todo к практике "Document Object Model"
   * - [ ] Необходимо взять шаблон #template-modal-bike
   * - [ ] Для наполнения данными можем использовать fillDefaultFieldBikeModal
   * - [ ] Клик по кнопке бронирования надо подписать на handleBikeRentClick
   * - [ ] Для отображения модального окна пригодится метод app.openModal
   */
}

/**
 * Обработка клика по кнопке бронирования.
 *
 * @param bikeId Идентификатор велосипеда.
 */
async function handleBikeRentClick(bikeId) {
  /**
   * @todo к практике "Взаимодействие с сервером".
   * - [ ] Необходимо вызвать метод api.pushOrder
   * - [ ] В случае получения success статуса перенаправить пользователя на страницу /booking.html
   * - [ ] В случае получения error статуса - показать сообщение об ошибке
   */
  alert("TODO не реализовано");
}
