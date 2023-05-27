import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { GeneralService } from './general.service';

const baseUrl = environment.BASE.concat('/rol');

@Injectable({
  providedIn: 'root'
})
export class RolService {

constructor(private generalService: GeneralService) { }

  getAllRolesByEstado(estado: number) {
    return this.generalService.getData<any>(`${baseUrl}/getAllRolesByEstado/${estado}`);
  }


}
