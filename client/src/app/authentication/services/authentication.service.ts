import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API } from '../../shared/api-url';

interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

interface IJwtInfo {
  id: number,
  role: string,
  expirey: any
}

const TokenLocalStorageName = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  saveToken(newToken: string): void {
    localStorage.setItem(TokenLocalStorageName, newToken);
    this.token = newToken;
  }

  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem(TokenLocalStorageName);
    }
    return this.token;
  }

  logout(): void {
    this.token = '';
    localStorage.removeItem(TokenLocalStorageName);
    this.router.navigateByUrl('/');
  }

  getUserDetail(): IJwtInfo | null { // expiry is not check here
    const token = this.getToken();
    if (token) {
      const payload = window.atob(token.split('.')[1]);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const user = this.getUserDetail();
    if (user) {
      if (user.expirey > (Date.now()/1000)) {
        return true;
      }
    }
    localStorage.removeItem(TokenLocalStorageName);
    return false;
  }

  isCustomer(): boolean {
    if (this.isTokenExpired()) {
      return false;
    } else {
      return this.isUserHasRole('CUSTOMER');
    }
  }

  isAdmin(): boolean {
    if (this.isTokenExpired()) {
      return false;
    } else {
      return this.isUserHasRole('AMDIN');
    }
  }

  isEmp(): boolean {
    const user = this.getUserDetail();
    if (user) {
      return user.role === 'EMP' || user.role === 'ADMIN';
    }
    return false;
  }

  private isTokenExpired(): boolean {
    const user = this.getUserDetail();
    if (user) {
      if (user.expirey < (Date.now() / 1000)) {
        localStorage.removeItem(TokenLocalStorageName);
        return true;
      }
    }
    return false;
  }

  private isUserHasRole(role: 'AMDIN' | 'CUSTOMER' | 'EMP'): boolean {
    const user = this.getUserDetail();
    if (user) {
      return user.role === role;
    }
    return false;
  }

  private request(type: 'login' | 'register', user: TokenPayload) {
    let returnData: Observable<any>;
    returnData = this.http.post(`${API}/${type}`, user);

    return returnData.pipe(
      map(data => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
  }

  login(user: TokenPayload) {
    return this.request('login', user);
  };

  register(user: TokenPayload) {
    return this.request('register', user);
  }
}
