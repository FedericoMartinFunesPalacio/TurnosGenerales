import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { ProveedorPage } from './pages/proveedor/proveedor';
import { ConsumidorPage } from './pages/consumidor/consumidor';
import { PublicCalendarioComponent } from './pages/public-calendario/public-calendario';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'proveedor', component: ProveedorPage },
  { path: 'consumidor', component: ConsumidorPage },
  { path: 'calendario/:proveedorId', component: PublicCalendarioComponent },
  { path: '**', redirectTo: 'login' },
];
