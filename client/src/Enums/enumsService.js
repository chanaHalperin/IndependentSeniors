const BASE_URL = "http://localhost:8080/Enums";
const localStorageKey = "sharedEnums";
const enumCache = JSON.parse(localStorage.getItem(localStorageKey)) || {};
const saveToLocalStorage = () => {
  localStorage.setItem(localStorageKey, JSON.stringify(enumCache));
};
export async function getEnum(enumName) {
  if (enumCache[enumName]) {
    return enumCache[enumName]; // כבר בזיכרון
  }
  try {
    const res = await fetch(`${BASE_URL}/${enumName}`);
    if (!res.ok) throw new Error("Failed to load enum");
    const data = await res.json();

    enumCache[enumName] = data;
    saveToLocalStorage();
    return data;
  } catch (err) {
    console.error(`Error fetching enum "${enumName}":`, err);
    throw err;
  }
}
