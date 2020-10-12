import { LoginUserData, User } from '../Models/user.model';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewUser } from '../Models/new-user.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

interface Response {
  message: string;
  token: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = null;
  private isAuth: boolean = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;
  constructor(private httpClient: HttpClient, private router: Router) {}

  createNewUser(newUser: NewUser) {
    this.httpClient
      .post('http://localhost:3000/api/auth/register', newUser)
      .subscribe((response) => {
        // console.log(response);
      });
  }

  login(userData: LoginUserData) {
    this.httpClient
      .post<Response>('http://localhost:3000/api/auth/login', userData)
      .subscribe((response) => {
        // console.log(response);
        const token = response.token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.token = token;
          this.isAuth = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.authStatusListener.next(false);
    // console.log('logout!');
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuth;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();

    if (!authInfo) {
      return;
    }

    const now = new Date();
    const expiresIn =
      new Date(authInfo.expirationDate).getTime() - now.getTime();

    // console.log(authInfo, expiresIn);

    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuth = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (token && expirationDate) {
      return {
        token: token,
        expirationDate: expirationDate,
      };
    }
    return null;
  }

  private setAuthTimer(duration: number) {
    // console.log('Set Timer:', duration);

    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
}
