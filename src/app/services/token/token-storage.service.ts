import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const KERNEL_KEY_PYTHON = 'auth-kernel-python';
const KERNEL_KEY_JAVA = 'auth-kernel-java';
const KERNEL_KEY_JAVASCRIPT = 'auth-kernel-javascript';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  logOut = () => window.sessionStorage.clear();

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    window.sessionStorage.removeItem(KERNEL_KEY_PYTHON);
    window.sessionStorage.removeItem(KERNEL_KEY_JAVA);
    window.sessionStorage.removeItem(KERNEL_KEY_JAVASCRIPT);
  }

  public getToken = (): string => sessionStorage.getItem(TOKEN_KEY);

  public isUserLoggedIn = (): boolean => !!this.getToken();

  public saveUser(user) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser = () => JSON.parse(sessionStorage.getItem(USER_KEY));

  public getKernelId = (language: string) => {
    if (language === 'java') {
      return window.sessionStorage.getItem(KERNEL_KEY_JAVA)
    } else if (language === 'python') {
      return window.sessionStorage.getItem(KERNEL_KEY_PYTHON)
    } else if (language === 'javascript') {
      return window.sessionStorage.getItem(KERNEL_KEY_JAVASCRIPT)
    }
  };

  public setKernelId = (kernelId: string, language: string) => {
    if (language === 'java') {
      const currentKernelId = window.sessionStorage.getItem(KERNEL_KEY_JAVA);
      if (currentKernelId == null || kernelId != currentKernelId) {
        window.sessionStorage.setItem(KERNEL_KEY_JAVA, kernelId);
      }
    } else if (language === 'python') {
      const currentKernelId = window.sessionStorage.getItem(KERNEL_KEY_PYTHON);
      if (currentKernelId == null || kernelId != currentKernelId) {
        window.sessionStorage.setItem(KERNEL_KEY_PYTHON, kernelId);
      }
    } else if (language === 'javascript') {
      const currentKernelId = window.sessionStorage.getItem(KERNEL_KEY_JAVASCRIPT);
      if (currentKernelId == null || kernelId != currentKernelId) {
        window.sessionStorage.setItem(KERNEL_KEY_JAVASCRIPT, kernelId);
      }
    }
  }
}
