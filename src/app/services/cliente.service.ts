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

export class ClienteService {
    private urlEndPoint: string;

    constructor(private _httpClient: HttpClient, private _router: Router,
        private authService: AuthService) {
        this.urlEndPoint = 'http://localhost:8080/api/clientes';
    }

    getRegiones(): Observable<Region[]> {
        return this._httpClient.get<Region[]>(this.urlEndPoint + '/regiones');
    }

    getClientes(page: number): Observable<any> {
       return this._httpClient.get(this.urlEndPoint + '/page/' + page).pipe(
            map((response: any) => response)
       );
    }

    create(cliente: Cliente): Observable<any> {
       return this._httpClient.post<any>(this.urlEndPoint, cliente)
       .pipe(
            catchError(e => {
                if (e.status == 400) {
                    return throwError(e);
                } else {
                    if (e.error.mensaje) {
                        console.log(e.error.mensaje);
                    }
                    return throwError(e);
                }
            })
        );
    }

    getCliente(id: number): Observable<Cliente> {
        return this._httpClient.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
        catchError(e => {
                if (e.status != 401 && e.error.mensaje) {
                    console.log(e.error.mensaje);
                    this._router.navigate(['/clientes']);
                }
                return throwError(e);
            })
        );
    }

    update(cliente: Cliente): Observable<any> {
       return this._httpClient.put<any>(this.urlEndPoint, cliente)
       .pipe(
            catchError(e => {
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
       return this._httpClient.delete<Cliente>(`${this.urlEndPoint}/${id}`)
       .pipe(
            catchError(e => {
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
        fdata.append('imgFile', foto);
        fdata.append('id', id);

        const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, fdata, {
            reportProgress: true
          });
        return this._httpClient.request(req); 
    }
}
