import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class IsCustomerGuard implements CanActivate {
  constructor(
    private _auth: AuthenticationService,
    private _router: Router
  ) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this._auth.getUserDetail();
    if (user) {
      if (user.role === 'CUSTOMER') {
        return true;
      }
    }
    return this._router.parseUrl('/');
  }
  
}
