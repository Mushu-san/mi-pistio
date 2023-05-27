import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from 'app/material.module';
import { GeneralModule } from 'app/general/general.module';
import { HomeComponent } from './home/home.component';
import { AutoconsultaComponent } from './autoconsulta/autoconsulta.component';
import { NgHcaptchaModule } from 'ng-hcaptcha';


@NgModule({
  declarations: [LoginComponent, HomeComponent, AutoconsultaComponent],
  imports: [
    CommonModule,
    PublicRoutingModule,
    MaterialModule,
    GeneralModule,
    NgHcaptchaModule.forRoot({
      siteKey: '5b478951-5baa-4b62-bb7f-17e3cbf1f219',
      languageCode: 'es'
    })

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PublicModule { }
