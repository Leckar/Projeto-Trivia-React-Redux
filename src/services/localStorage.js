export const TOKEN = 'token';
export const RANKING = 'ranking';

export const readStorage = (storageKey) => JSON
  .parse(localStorage.getItem(storageKey)) || [];

export const saveInStorage = (storageKey, keyData) => {
  if (typeof keyData === 'string') localStorage.setItem(storageKey, keyData);
  else localStorage.setItem(storageKey, JSON.stringify(keyData));
};
