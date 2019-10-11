import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private _router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.authService.isAuthenticated()) {
        if (this.isTokenExpirado()) {
          this.authService.logOut();
          this._router.navigate(['/login']);
          return false;
        }
        return true;
      }
      this._router.navigate(['/login']);
    return false;
  }

  isTokenExpirado(): boolean {
    let token = this.authService.token;
    if (token) {
      let payload = JSON.parse(atob(token.split('.')[1]));
      let now = new Date().getTime() / 1000;

      if (now > payload.exp) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
