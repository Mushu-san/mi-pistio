import { EmployeeAdministrationComponent } from './employee-administration/employee-administration.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationGuard } from 'app/general/security/guards/authorization.guard';
import { ComplaintAdministrationComponent } from './complaint-administration/complaint-administration.component';
import { ComplaintRegisterComponent } from './complaint-register/complaint-register.component';
import { AssignComplaintsComponent } from './assign-complaints/assign-complaints.component';
import { FollowOperatorComponent } from './follow-operator/follow-operator.component';
import { FollowCentralizadorComponent } from './follow-centralizador/follow-centralizador.component';

const routes: Routes = [
  {
    path:'',
    canActivate: [AuthorizationGuard],
    children: [
      { path: 'administracion', component: EmployeeAdministrationComponent},
      { path: 'tipo-queja', component: ComplaintAdministrationComponent},
      { path: 'ingreso-queja', component: ComplaintRegisterComponent},
      { path: 'asignar-queja', component: AssignComplaintsComponent},
      { path: 'seguimiento-operador', component: FollowOperatorComponent},
      { path: 'seguimiento-centralizador', component: FollowCentralizadorComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadoRoutingModule { }
