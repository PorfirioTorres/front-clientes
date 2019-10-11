import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2';
// modelos
import { Cliente } from '../../models/cliente';

// servicios
import { ClienteService } from '../../services/cliente.service';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  // providers: [ClienteService]
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private _clienteService: ClienteService, private activatedRoute: ActivatedRoute
    , private modalService: ModalService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      params => {
        let page: number = +params.get('page');
        if (!page) {
          page = 0;
        }
        this._clienteService.getClientes(page).subscribe(
          response  => {
            this.clientes = response.content as Cliente[];
            this.paginador = response;
          }
        );
      });
  }

  delete(cliente: Cliente): void {
    Swal({
      title: '¿Estás seguro?',
      text: `Eliminar el cliente ${cliente.nombre} ${cliente.apellido}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {
        this._clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            Swal(
              'Cliente eliminado!',
              'El cliente ha sido eliminado.',
              'success'
            );
          }
        );
      }
    });
  }

  abrirModal(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
