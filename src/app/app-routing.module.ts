import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { NotasComponent } from './components/notas/notas.component';
import { AuthGuard } from './services/guards/auth.guard';
import { MapaComponent } from './components/mapa/mapa.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'map', component: MapaComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'notas', canActivate:[AuthGuard],component: NotasComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
