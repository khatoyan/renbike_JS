const { api } = require("../api");
const { app } = require("../app");

document.addEventListener("DOMContentLoaded", init);

const emailForm = document.getElementById('email-edit');
const passwordForm = document.getElementById('password-edit');
const cardForm = document.getElementById('card-edit');

const emailInput = document.getElementById('settings-email');    
const cardNumbInput = document.getElementById('settings-number');  
const cardCVCInput = document.getElementById('settings-cvv');  
const passInput = document.getElementById('settings-new-pass'); 
const repPassInput = document.getElementById('settings-repeat-pass'); 


async function init() {
  app.eventSubscribers.push({
    eventName: "initedAuthorizedUser",
    callback: initCurrentUserInfo,
  });

  initListeners();
}

function initCurrentUserInfo() {
  setEmail(app.currentUserInfo.login);
  setCardRequisite(app.currentUserInfo.cardRequisites);
}

function setEmail(email) {
  document.getElementById("email-value").textContent = email;
  document.getElementById("settings-email").value = email;
}

function setCardRequisite(cardRequisites) {
  const card = cardRequisites || {};

  document.getElementById("settings-number").value = card.number || "";
  document.getElementById("settings-date").value = card.date || "";
  document.getElementById("settings-cvv").value = card.cvv || "";

  document.getElementById("card-number-value").textContent = card.number
    ? getCardNumberWithMask(card.number)
    : "Не заполнено";
}

function getCardNumberWithMask(number) {
  const hiddenCardNumber = "•••• •••• •••• ";
  return `${hiddenCardNumber}${number.split("").slice(-4).join("")}`;
}

function isValidEmail(value) {
  return /^[A-Z0-9]+@[A-Z0-9]+.[A-Z]{2,4}$/i.test(value);
}

function isValidNumber(value, countOfNumbers) {

  if (value.length < countOfNumbers) {
    return false;
  }
  
  return !isNaN(value);
}

function isValidPassword(value) {
  return (value.length >= 6)
}

function renderToolTip(elem, errorText) {

  const coords = elem.getBoundingClientRect();
  const toolContainer = document.createElement('div');
  const toolText = document.createElement('p');

  toolContainer.classList.add('tool-container');
  toolText.classList.add('tool-text');
  toolText.textContent = errorText;

  elem.classList.add('wrondInput');

  toolContainer.style.left = coords.right + 'px';
  toolContainer.style.top = coords.top + 'px';
  toolContainer.style.zIndex = 3000;

  toolContainer.appendChild(toolText);
  document.body.appendChild(toolContainer);

  elem.addEventListener('focus', () => {
    elem.classList.remove('wrondInput');
    toolContainer.remove();
  });

  elem.parentNode.addEventListener('submit', () =>  {
    toolContainer.remove()
    elem.classList.remove('wrondInput');
  });
}

function isCardFormValid(cardForm) {

  cardForm.forEach(item => {
    if (typeof item === 'input' && item.value === '') {
      renderToolTip(item, 'Заполните все данные');
      return false;
    }
  });

  const cardNumber = cardForm
    .querySelector('input')
    .getElementById('settings-number');

  const numberСheck = isValidNumber(cardNumber.value, +(cardNumber.getAttribute('maxlength')))

  if (!numberСheck) {
    renderToolTip(item, 'Неверно заполнен номер карты');
    return false;
  }

  const cardCVC = cardForm
    .querySelector('input')
    .getElementById('settings-cvc');

  const checkCVC = isValidNumber(cardCVC.value, +(cardCVC.getAttribute('maxlength')))

  if (!checkCVC) {
    renderToolTip(item, 'Неверно заполнен CVC код');
    return false;
  }

  return true;
}

/** Регистрация обработчиков событий. */
function initListeners() {
    /**
     * @todo к практике "Работа с событиями"
     * - [ ] Для форм редактирования email, пароля и карты оплаты на событие onSubmit привязать
     * соответствующие обработчики;
     * - [ ] Реализовать валидацию полей форм по гайдам: https://guides.kontur.ru/principles/validation/
     */ 

    emailForm.addEventListener('submit', (e) => handleEmailEditSubmit(e));
    passwordForm.addEventListener('submit', (e) => handlePasswordEditSubmit(e));
    cardForm.addEventListener('submit', (e) => handleCardEditSubmit(e));

    emailInput.addEventListener('blur', (e) => {
      if (!isValidEmail(e.target.value)) {
        renderToolTip(e.target, 'Неверное значение email')
        return;
      }
    })

    cardNumbInput.addEventListener('blur', (e) => {
      if (!isValidNumber(e.target.value, 16)) {
        renderToolTip(e.target, 'Неверный номер карты')
        return;
      }
    })

    cardCVCInput.addEventListener('blur', (e) => {
      if (!isValidNumber(e.target.value, 3)) {
        renderToolTip(e.target, 'Неверный CVC код')
        return;
      }
    })

    passInput.addEventListener('blur', (e) => {
      if (!isValidPassword(e.target.value)) {
        renderToolTip(e.target, 'Неверный формат пароля')
        return;
      }
    })

    repPassInput.addEventListener('blur', (e) => {
      if (!isValidPassword(e.target.value)) {
        renderToolTip(e.target, 'Неверный формат пароля')
        return;
      }})



    /** Сохранение email. */
    async function handleEmailEditSubmit(e) {
        e.preventDefault();

        const email = Object.fromEntries(new FormData(e.target)).email;

        if (!isValidEmail(email)) {
          renderToolTip(e.target, 'Неверное значение email')
          return;
        }

        const res = await api.updateCurrentUser({
            login: email,
        });

        if (res.status === "error") {
            alert("Ошибка сохранения email");
            return;
        }

        setEmail(email);
        document.location.hash = "";
    }

    /** Сохранение пароля. */
    async function handlePasswordEditSubmit(e) {
        e.preventDefault();

        for (item of e.target.querySelectorAll('input')) {
          if (!isValidPassword(item.value)) {
            renderToolTip(item, 'Неверный формат пароля')
            return;
          }
        }

        const password = Object.fromEntries(new FormData(e.target))["new-pass"];

        const res = await api.updateCurrentUser({
            password,
        });

        if (res.status === "error") {
            alert("Ошибка сохранения password");
            return;
        }

        document.location.hash = "";
    }

    /** Сохранение данных о карте оплаты. */
    async function handleCardEditSubmit(e) {
        e.preventDefault();

        if (!isCardFormValid(e.currentTarget))
          return;

        const formData = Object.fromEntries(new FormData(e.target));

        const cardRequisites = {
            number: formData["number"],
            date: formData["date"],
            cvv: formData["cvv"],
        };

        const res = await api.updateCurrentUser({
            cardRequisites,
        });

        if (res.status === "error") {
            alert("Ошибка сохранения карты");
            return;
        }

        setCardRequisite(cardRequisites);
        document.location.hash = "";
    }
}
