import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { Region } from '../models/region';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
// import swal from 'sweetalert2';
import { FooterComponent } from '../components/footer/footer.component';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
// *** */ El codigo comentado deja de ser util en caso de usan Interceptors ***/
export class ClienteService {
    private urlEndPoint: string;
   // private httpHeaders: HttpHeaders; // no requerido si se usan Interceptors

    constructor(private _httpClient: HttpClient, private _router: Router,
        private authService: AuthService) {
        this.urlEndPoint = 'http://localhost:8080/api/clientes';
       // this.httpHeaders = new HttpHeaders({'Content-Type': 'application/json'}); // no es requerido si se usan Interceptors
    }
    /*
    con este metodo se agrega el header de autorizacion, sin usan Interceptors
    private agregarAuthorizationHeader() {
        let token = this.authService.token;
        if (token != null && token != undefined) {
            return this.httpHeaders.append('Authorization', 'Bearer ' + token);
        } else {
            return this.httpHeaders;
        }
    }
    con este metodo se hace la verificacionde autorizacion desde un Interceptor
    private isNoAutorizado(e): boolean {
        if (e.status == 401) {
            if (this.authService.isAuthenticated()) {
                this.authService.logOut();
            }
          this._router.navigate(['/login']);
          return true;
        }

        if (e.status == 403) {
            swal('Acceso denegado', 'Usted no tiene acceso a este recurso', 'warning');
            this._router.navigate(['/clientes']);
            return true;
          }
        return false;
      }*/

    getRegiones(): Observable<Region[]> {
        // return this._httpClient.get<Region[]>(this.urlEndPoint + '/regiones', {headers: this.agregarAuthorizationHeader()}).pipe(
        return this._httpClient.get<Region[]>(this.urlEndPoint + '/regiones'); /*.pipe(

            catchError(e => {
                // this.isNoAutorizado(e);
                return throwError(e);
            })
        );*/
    }

    getClientes(page: number): Observable<any> {
        // return of(CLIENTES); // con of se convierte a observable, un objeto observable es un stream de datos
        // los que quieran acceder a ese stream se deben suscribir
       return this._httpClient.get(this.urlEndPoint + '/page/' + page).pipe(
            map((response: any) => response)
       );
    }

    create(cliente: Cliente): Observable<any> {
       // return this._httpClient.post<any>(this.urlEndPoint, cliente, {headers: this.agregarAuthorizationHeader()})
       return this._httpClient.post<any>(this.urlEndPoint, cliente)
       .pipe(
            catchError(e => {
               /*if (this.isNoAutorizado(e)) {
                return throwError(e);
               }*/
                if (e.status == 400) {
                    return throwError(e);
                } else {
                    if (e.error.mensaje) {
                        console.log(e.error.mensaje);
                    }
                   // swal (e.error.mensaje, e.error.error, 'error');
                    return throwError(e);
                }
            })
        );
    }

    getCliente(id: number): Observable<Cliente> {
       // return this._httpClient.get<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
        return this._httpClient.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
        catchError(e => {
                /*if (this.isNoAutorizado(e)) {
                    return throwError(e);
                }*/
                if (e.status != 401 && e.error.mensaje) {
                    console.log(e.error.mensaje);
                    this._router.navigate(['/clientes']);
                }
                // swal('Error al buscar', e.error.mensaje, 'error');
                return throwError(e);
            })
        );
    }

    update(cliente: Cliente): Observable<any> {
       // return this._httpClient.put<any>(this.urlEndPoint, cliente, {headers: this.agregarAuthorizationHeader()})
       return this._httpClient.put<any>(this.urlEndPoint, cliente)
       .pipe(
            catchError(e => {
                /*if (this.isNoAutorizado(e)) {
                    return throwError(e);
                }*/
                if (e.status == 400) {
                    return throwError(e);
                } else {
                    if (e.error.mensaje) {
                        console.log(e.error.mensaje);
                    }
                    // swal (e.error.mensaje, e.error.error, 'error');
                    return throwError(e);
                }
            })
        );
    }

    delete(id: number): Observable<Cliente> {
       // return this._httpClient.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()})
       return this._httpClient.delete<Cliente>(`${this.urlEndPoint}/${id}`)
       .pipe(
            catchError(e => {
                /*if (this.isNoAutorizado(e)) {
                    return throwError(e);
                }*/
                if (e.error.mensaje) {
                    console.log(e.error.mensaje);
                }
                // swal (e.error.mensaje, e.error.error, 'error');
                return throwError(e);
            })
        );
    }

    subirFoto(foto: File, id: any): Observable<HttpEvent<{}>> {
        let fdata = new FormData();
        fdata.append('imgFile', foto); // el mismo nombre que definimos en el RequestParam
        fdata.append('id', id);

        const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, fdata, {
            reportProgress: true
          });
        return this._httpClient.request(req); /*.pipe(
            catchError(e => {
                this.isNoAutorizado(e);
                return throwError(e);
            })
        );*/
    }
}
