import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  public titulo: string;
  public usuario: Usuario;

  constructor(private authService: AuthService, private _router: Router) {
    this.titulo = 'Inicie Sesión';
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      swal('Loggin', `El usuario con nombre ${this.authService.usuario.nombre}
      ${this.authService.usuario.apellido} ya ha iniciado sesión`, 'info');
      this._router.navigate(['/clientes']);
    }
  }

  public login(): void {
    console.log(this.usuario.username);
    if (this.usuario.username == undefined || this.usuario.password == undefined) {
      swal('Error login', 'Ingrese los datos que se piden', 'error');
    }
    this.authService.login(this.usuario).subscribe(
      response => {
        let payload = JSON.parse(atob(response.access_token.split('.')[1]));
        this.authService.guardarUsuario(payload);
        this.authService.guardarToken(response.access_token);
        let usuario = this.authService.usuario;
        this._router.navigate(['/clientes']);
        swal('Bienvenido', `${usuario.nombre}`, 'success');
      },
      err => {
        if (err.status == 400) {
          swal('Error', 'nombre o password incorrectos', 'error');
        }
      }
    );
  }

}
