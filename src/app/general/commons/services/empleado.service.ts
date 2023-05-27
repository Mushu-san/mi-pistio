import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.BASE.concat('/empleado');

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  constructor(private generalService: GeneralService) {}

  getAllEmpleadosByPuntoAndEstadoNot(idPunto: number, estado: number): Observable<any> {
    return this.generalService.getData<any>(`${baseUrl}/getAllEmpleadosByPuntoAndEstadoNot/${idPunto}/${estado}`);
  }

  signUpEmpleado(body: any): Observable<any> {
    return this.generalService.postData<any, any>(`${baseUrl}/signEmployee`, body);
  }

  updateEmpleado(body: any): Observable<any> {
    return this.generalService.putData<any, any>(`${baseUrl}/updateEmpleado`, null, body );
  }

  getAllEmpleadosByPunto(idPunto: number): Observable<any> {
    return this.generalService.getData<any>(`${baseUrl}/getEmployeeForQueja/${idPunto}`);
  }
}
