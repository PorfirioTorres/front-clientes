import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _usuario: Usuario;
  private _token: string;

  constructor(private httpCliet: HttpClient) { }

  public login(usuario: Usuario): Observable<any> {
    const urlEndPoint = 'http://localhost:8080/oauth/token';
    const credencialesApp = btoa ('angularapp' + ':' + 'angularapp12345');
    const httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + credencialesApp});
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    return this.httpCliet.post<any>(urlEndPoint, params.toString(), {headers: httpHeaders});
  }

  public guardarUsuario(token: any): void {
    this._usuario = new Usuario();
    this._usuario.username = token.user_name;
    this._usuario.nombre = token.nombre;
    this._usuario.apellido = token.apellido;
    this._usuario.email = token.email;
    this._usuario.roles = token.authorities;
    console.log(this._usuario);
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  public guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', this._token);
  }

  public get usuario(): Usuario {
    if (this._usuario != undefined) {
      return this._usuario;
    } else if (this._usuario == undefined && sessionStorage.getItem('usuario') != undefined) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    } else {
      return new Usuario();
    }
  }

  public get token(): string {
    if (this._token != undefined) {
      return this._token;
    } else if (this._token == undefined && sessionStorage.getItem('token') != undefined) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    } else {
      return null;
    }
  }

  public isAuthenticated(): boolean {
    if (this.token) {
      let payload = JSON.parse(atob(this.token.split('.')[1]));
      if ((payload != undefined || payload != null) && payload.user_name && payload.user_name.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public hasRole(role: string): boolean {
    if (this.usuario.roles.includes(role)) {
      return true;
    } else {
      return false;
    }
  }

  public logOut(): void {
    this._token = null;
    this._token = null;
    sessionStorage.clear();
  }
}
