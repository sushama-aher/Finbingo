import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(
  ) { }

  setLocalStorage(key:string, value:any) {
    localStorage.setItem(key, value);
  }

  getLocalStorage(key:string) {
    const data:any= localStorage.getItem(key)
    return JSON.parse(data);
  }

  removeLocalStorage(key:string) {
    localStorage.removeItem(key);
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  setSessionStorage(key:string, value:any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSessionStorage(key:string) {
    const data:any= sessionStorage.getItem(key)
    return JSON.parse(data);
  }

  removeSessionStorage(key:string) {
    sessionStorage.removeItem(key);
  }

  clearSessionStorage() {
    sessionStorage.clear();
  }

  getItemFromCookies(key: string) {
    const name = key + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  setItem<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
