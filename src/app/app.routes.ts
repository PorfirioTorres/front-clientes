import { RouterModule, Routes } from '@angular/router';

import { DirectivaComponent } from './components/directiva/directiva.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { FormComponent } from './components/clientes/form.component';
import { LoginComponent } from './components/usuarios/login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const APP_ROUTES: Routes = [
    {path: 'clientes', component: ClientesComponent},
    {path: 'directivas', component: DirectivaComponent},
    {path: 'clientes/form', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
    {path: 'clientes/form/:id', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
    {path: 'clientes/page/:page', component: ClientesComponent},
    {path: 'login', component: LoginComponent},
    {path: '**', pathMatch: 'full', redirectTo: 'clientes'}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
