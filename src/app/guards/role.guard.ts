import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private _router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.authService.isAuthenticated()) {
        this._router.navigate(['/login']);
        return false;
      }

      let role = next.data['role'] as string;
      console.log(role);
      if (this.authService.hasRole(role)) {
        return true;
      }
      swal('Acceso denegado', 'Usted no tiene acceso a este recurso', 'warning');
      this._router.navigate(['/clientes']);
    return false;
  }
}
