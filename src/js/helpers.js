import { app } from "./app";

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
