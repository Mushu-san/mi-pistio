import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { GeneralService } from './general.service';
import { Observable } from 'rxjs';

const baseUrl = environment.BASE.concat('/queja');

@Injectable({
  providedIn: 'root',
})
export class QuejaService {
  constructor(private generalService: GeneralService) {}

  createQueja(form: FormData): Observable<any> {
    return this.generalService.postData<any, FormData>(`${baseUrl}/create`, form);
  }

  asignarQueja(dto: any): Observable<any> {
    return this.generalService.postData<any, FormData>(`${baseUrl}/asignar`, dto);
  }

  rechazarQueja(dto: any): Observable<any> {
    return this.generalService.postData<any, FormData>(`${baseUrl}/rechazar`, dto);
  }

  ingresoDetalleQueja(dto: any): Observable<any> {
    return this.generalService.postData<any, FormData>(`${baseUrl}/detalle`, dto);
  }

  getQuejasCMaster(): Observable<any> {
    return this.generalService.getData<any>(`${baseUrl}/centralizador/master`);
  }

  getFichaQueja(correlativo: string): Observable<any>{
    return this.generalService.getData<any>(`${baseUrl}/files/${correlativo}`, null, { responseType: 'blob' });
  }

  getQuejasForFollowPoint(): Observable<any> {
    return this.generalService.getData<any>(`${baseUrl}/followpoint`);
  }

  getDetalleForQuejaById(idQueja: string): Observable<any> {
    return this.generalService.getData<any>(`${baseUrl}/detalle/${idQueja}`);
  }

  procederQueja(idQueja: number): Observable<any> {
    return this.generalService.putData<any, any>(`${baseUrl}/proceder/${idQueja}`);
  }

  getComentariosForQuejaById(idQueja: string): Observable<any> {
    return this.generalService.getData<any>(`${baseUrl}/comentario/${idQueja}`);
  }

  rechazarQuejaOperador(form: FormData): Observable<any>{
    return this.generalService.postData<any, FormData>(`${baseUrl}/rechazo/operador`, form);
  }

  resolverQuejaOperador(form: FormData): Observable<any>{
    return this.generalService.postData<any, FormData>(`${baseUrl}/resolver`, form);
  }

  getQuejasForFollowCentralizador(): Observable<any> {
    return this.generalService.getData<any>(`${baseUrl}/followcentralizador`);
  }

  rechazarQuejaCentralizador(dto: any): Observable<any>{
    return this.generalService.postData<any, any>(`${baseUrl}/rechazo/centralizador`, dto);
  }

  resolverQuejaCentralizador(dto: any): Observable<any>{
    return this.generalService.postData<any, any>(`${baseUrl}/resolver/centralizador`, dto);
  }


  comentarioCentralizador(form: FormData): Observable<any>{
    return this.generalService.postData<any, FormData>(`${baseUrl}/detalle/centralizador`, form);
  }

}
