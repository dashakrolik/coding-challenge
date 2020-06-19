import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const KERNEL_KEY = 'auth-kernel';
const KERNEL_KEY_PYTHON = 'auth-kernel-python';
const KERNEL_KEY_JAVA = 'auth-kernel-java';
const KERNEL_KEY_JAVASCRIPT = 'auth-kernel-javascript';
const KERNEL_KEY_SCALA = 'auth-kernel-scala';
const KERNEL_KEY_CSHARP = 'auth-kernel-csharp'

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  logOut = () => window.sessionStorage.clear();

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    window.sessionStorage.removeItem(KERNEL_KEY + "-python");
    window.sessionStorage.removeItem(KERNEL_KEY + "-java");
    window.sessionStorage.removeItem(KERNEL_KEY + "-javascript");
    window.sessionStorage.removeItem(KERNEL_KEY + "-scala");
    window.sessionStorage.removeItem(KERNEL_KEY + "-csharp");
  }

  public getToken = (): string => sessionStorage.getItem(TOKEN_KEY);

  public isUserLoggedIn = (): boolean => !!this.getToken();

  public saveUser(user) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser = () => JSON.parse(sessionStorage.getItem(USER_KEY));

  public getKernelId = (language: string) => {
    return window.sessionStorage.getItem(KERNEL_KEY + "-" + language);
  };

  public setKernelId = (kernelId: string, language: string) => {
    const currentKernelId = window.sessionStorage.getItem(KERNEL_KEY + "-" + language);
    window.sessionStorage.setItem(KERNEL_KEY + "-" + language, kernelId);
  }
}
