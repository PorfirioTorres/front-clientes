import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente';
import { Region } from '../../models/region';
import { ClienteService } from '../../services/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  private cliente: Cliente;
  private titulo: string;
  private errores: string[];
  private regiones: Region[];

  constructor(private clienteService: ClienteService, private _router: Router,
    private _activatedRoute: ActivatedRoute) {
    this.titulo = 'Crear cliente';
    this.cliente = new Cliente();
   }

  ngOnInit() {
    this.cargarCliente();
  }

  public cargarCliente(): void {
    this._activatedRoute.params.subscribe(
      params => {
        let id = params['id'];
        if (id) {
          this.clienteService.getCliente(id).subscribe(
            (cliente) => this.cliente = cliente
          );
        }
      }
    );

    this.clienteService.getRegiones().subscribe(
      response => this.regiones = response
    );
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      response => {
        this._router.navigate(['/clientes']);
        swal('Cliente creado',
        `${response.mensaje} ${response.cliente.nombre} ${response.cliente.apellido} `,
        'success');
      },
      err => {
        console.log('Estatus: ' + err.status);
        this.errores = err.error.errores as string[];
      }
    );
  }

  public update(): void {
    this.clienteService.update(this.cliente).subscribe(
      result => {
        this._router.navigate(['/clientes']);
        swal('Cliente actualizado',
        `${result.mensaje} ${result.cliente.nombre} ${result.cliente.apellido}`,
        'success');
      },
      err => {
        console.log('Estatus: ' + err.status);
        this.errores = err.error.errores as string[];
      }
    );
  }

  public compararRegion(r1: Region, r2: Region): boolean {
    if (r1 === undefined && r2 === undefined) {
        return true;
    }
    if (r1 === undefined || r2 === undefined) {
      return false;
    } else {
      return r1.id === r2.id;
    }
  }

}
