import { NgHcaptchaComponent } from 'ng-hcaptcha';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationGuard } from 'app/general/security/guards/authorization.guard';
import { ComplaintRegisterComponent } from './complaint-register/complaint-register.component';

const routes: Routes = [
  {
    path:'',
    canActivate: [AuthorizationGuard],
    children: [
      { path: 'ingreso-queja', component: ComplaintRegisterComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentahabienteRoutingModule { }
