const { api } = require("../api");
const { app } = require("../app");

document.addEventListener("DOMContentLoaded", init);

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
  return value.includes('@');
}

function isValidNumber(value, countOfNumbers) {

  if (value.length < countOfNumbers) {
    return false;
  }
    

  if (countOfNumbers === 3) {
    return /^[0-9]{3}$/.test(value);
  } 

  if (countOfNumbers === 16) {
    return /^[1-9]{1}[0-9]{15}$/.test(value)
  } 

  return true;
}

function isValidPassword(e) {
  return (e.length >= 6)
}

function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + window.pageYOffset,
    right: box.right + window.pageXOffset,
    bottom: box.bottom + window.pageYOffset,
    left: box.left + window.pageXOffset
  };
}



function renderToolTip(elem, errorText) {

  const coords = getCoords(elem);
  const toolContainer = document.createElement('div');
  const toolText = document.createElement('p')

  toolContainer.classList.add('tool-container');
  toolText.classList.add('tool-text');
  toolText.textContent = errorText;

  toolContainer.style.left = coords.right + 'px';
  toolContainer.style.top = coords.top + 'px';
  toolContainer.style.zIndex = 3000;

  toolContainer.appendChild(toolText);
  document.body.appendChild(toolContainer);

  setTimeout(() => {
    toolContainer.style.visibility = 'hidden'
  }, 2000)
}

function cardFormValidator(cardForm) {
  const cardInputs = cardForm.querySelectorAll('input');

  for (item of cardInputs) {
    console.log(item.value)
    const check = isValidNumber(item.value, +(item.getAttribute('maxlength')))

    if (!check || item.value === '') {
      renderToolTip(item, 'Неверно заполнены данные карты');
      return false;
    }
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

    const emailForm = document.getElementById('email-edit');
    const passwordForm = document.getElementById('password-edit');
    const cardForm = document.getElementById('card-edit');

    const emailInput = document.getElementById('settings-email');    
    const cardNumbInput = document.getElementById('settings-number');  
    const cardCVCInput = document.getElementById('settings-cvv');  
    const passInput = document.getElementById('settings-new-pass'); 
    const repPassInput = document.getElementById('settings-repeat-pass');  

    emailForm.addEventListener('submit', (e) => handleEmailEditSubmit(e));
    passwordForm.addEventListener('submit', (e) => handlePasswordEditSubmit(e));
    cardForm.addEventListener('submit', (e) => handleCardEditSubmit(e));

    emailInput.addEventListener('blur', (e) => {
      if (!isValidEmail(e)) {
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
      if (!isValidNumber(e.target.value, 16)) {
        renderToolTip(e.target, 'Неверный CVC код')
        return;
      }
    })

    passInput.addEventListener('blur', (e) => {
      if (!isValidPassword(e)) {
        renderToolTip(e.target, 'Неверный формат пароля')
        return;
      }
    })

    repPassInput.addEventListener('blur', (e) => {
      if (!isValidPassword(e)) {
        renderToolTip(e.target, 'Неверный формат пароля')
        return;
      }})



    /** Сохранение email. */
    async function handleEmailEditSubmit(e) {
        e.preventDefault();

        if (!isValidEmail(e)) {
          renderToolTip(e.target, 'Неверное значение email')
          return;
        }

        const email = Object.fromEntries(new FormData(e.target)).email;

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
        
        if (!isValidPassword(e)) {
          renderToolTip(e.target, 'Неверный формат пароля')
          return;
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

        if (!cardFormValidator(e.currentTarget))
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
