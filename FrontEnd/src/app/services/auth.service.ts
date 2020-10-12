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
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = null;
  private isAuth: boolean = false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;
  constructor(private httpClient: HttpClient, private router: Router) {}

  createNewUser(newUser: NewUser) {
    this.httpClient
      .post('http://localhost:3000/api/auth/register', newUser)
      .subscribe((response) => {
        // console.log(response);
        this.router.navigate(['/']);
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
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate, response.userId);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    this.userId = null;
    // console.log('logout!');
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getUserId() {
    return this.userId;
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
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (token && expirationDate && userId) {
      return {
        token: token,
        expirationDate: expirationDate,
        userId: userId,
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

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
}
