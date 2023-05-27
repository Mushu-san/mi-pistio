import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AutoconsultaComponent } from './autoconsulta/autoconsulta.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'registro', component: LoginComponent},
  {path: 'autoconsulta', component: AutoconsultaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
