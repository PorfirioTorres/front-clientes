import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
    titulo: string;

    constructor(private authService: AuthService, private _router: Router) {
        this.titulo = 'Angular';
    }
    ngOnInit(): void {

    }

    public logOut(): void {
        this.authService.logOut();
        swal('Bye', 'Se ha cerrado la sesión', 'success');
        this._router.navigate(['/login']);
    }
}
