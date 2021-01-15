import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CanDoManagementGuard implements CanLoad {
  constructor(
    private _auth: AuthenticationService,
    private _router: Router
  ) {

  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const user = this._auth.getUserDetail();
      if (user) {
        if (user.role === 'EMP' || user.role === 'ADMIN') {
          return true;
        } else {
          return this._router.parseUrl('/');
        }
      }
      return this._router.parseUrl('/');
  }
}
