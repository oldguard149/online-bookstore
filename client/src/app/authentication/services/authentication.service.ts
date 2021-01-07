import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { apiurl } from '../../shared/api-url';

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
    localStorage.setItem('auth-token', newToken);
    this.token = newToken;
  }

  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('auth-token');
    }
    return this.token;
  }

  logout(): void {
    this.token = '';
    localStorage.removeItem('auth-token');
    this.router.navigateByUrl('/');
  }

  getUserDetail(): IJwtInfo | null {
    const token = this.getToken();
    if(token) {
      const payload = window.atob(token.split('.')[1]);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const user = this.getUserDetail();
    if (user) {
      return user.expirey > (Date.now() / 1000);
    }
    return false;
  }

  isCustomer(): boolean {
    const user = this.getUserDetail();
    if (user) {
      return user.role === 'CUSTOMER';
    }
    return false;
  }

  private request(type: 'login' | 'register', user: TokenPayload) {
    let $returnData: Observable<any>;
    $returnData = this.http.post(`${apiurl}/${type}`, user);

    return $returnData.pipe(
      map(data => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
  } // end of request()

  login(user: TokenPayload) {
    return this.request('login', user);
  };

  register(user: TokenPayload) {
    return this.request('register', user);
  }


}
