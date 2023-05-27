import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuentahabienteRoutingModule } from './cuentahabiente-routing.module';
import { GeneralModule } from 'app/general/general.module';
import { EmpleadoModule } from 'app/empleado/empleado.module';
import { MaterialModule } from 'app/material.module';
import { ComplaintRegisterComponent } from './complaint-register/complaint-register.component';
import { NgHcaptchaModule } from 'ng-hcaptcha';


@NgModule({
  declarations: [ComplaintRegisterComponent],
  imports: [
    CommonModule,
    CuentahabienteRoutingModule,
    GeneralModule,
    EmpleadoModule,
    MaterialModule,
    NgHcaptchaModule.forRoot({
      siteKey: '5b478951-5baa-4b62-bb7f-17e3cbf1f219',
      languageCode: 'es'
    })
  ]
})
export class CuentahabienteModule { }
