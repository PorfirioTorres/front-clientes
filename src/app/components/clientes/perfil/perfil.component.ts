import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../../../models/cliente';

import { ClienteService } from '../../../services/cliente.service';
import { ModalService } from '../../../services/modal.service';

import { HttpEventType } from '@angular/common/http';
import swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo: string;
  private fotoSeleccionada: File;
  public progreso: number;

  constructor(private clienteService: ClienteService, private modalService: ModalService,
    private authService: AuthService) {
    this.titulo = 'Subir foto del cliente';
    this.progreso = 0;
   }

  ngOnInit() {
  }

  seleccionarFoto(event: any): void  {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal('Error', 'El archivo seleccionado no es una imagen', 'error');
      this.fotoSeleccionada = null;
    }
    console.log(this.fotoSeleccionada);
  }

  subirFoto(): void {
    if (!this.fotoSeleccionada) {
      swal('Error', 'No has seleccionado una imagen', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round(event.loaded / event.total * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            swal('Se ha subido una imagen', response.mensaje, 'success');
          }
        });
    }
  }

  cerrarModal(): void {
    this.modalService.cerrarModal();
    this.progreso = 0;
    this.fotoSeleccionada = null;
  }

}
