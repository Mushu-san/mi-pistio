import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadoRoutingModule } from './empleado-routing.module';
import { EmployeeAdministrationComponent } from './employee-administration/employee-administration.component';
import { MaterialModule } from 'app/material.module';
import { GeneralModule } from 'app/general/general.module';
import { MatDynamicFormModule } from 'mat-dynamic-form';
import { ComplaintAdministrationComponent } from './complaint-administration/complaint-administration.component';
import { ComplaintRegisterComponent } from './complaint-register/complaint-register.component';
import { AssignComplaintsComponent } from './assign-complaints/assign-complaints.component';
import { FollowOperatorComponent } from './follow-operator/follow-operator.component';
import { FollowCentralizadorComponent } from './follow-centralizador/follow-centralizador.component';


@NgModule({
  declarations: [EmployeeAdministrationComponent, ComplaintAdministrationComponent, ComplaintRegisterComponent, AssignComplaintsComponent, FollowOperatorComponent, FollowCentralizadorComponent],
  imports: [
    CommonModule,
    EmpleadoRoutingModule,
    MaterialModule,
    GeneralModule
  ],
  exports: [
    ComplaintRegisterComponent
  ]
})
export class EmpleadoModule { }
