import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Param } from '../classes/Params';

const baseUrl = environment.BASE.concat('/punto-acceso');

@Injectable({
  providedIn: 'root'
})
export class PuntoAccesoService {

constructor(private generalService: GeneralService) { }

  getPuntosByRegionAndEstado(idRegion: number, estado: number): Observable<any>{
    return this.generalService.getData<any>(`${baseUrl}/AllByRegionAndEstado/${idRegion}/${estado}`);
  }

  createPunto(body: any): Observable<any>{
    return this.generalService.postData<any, any>(`${baseUrl}/save`, body);
  }

  updatePunto(body: any): Observable<any>{
    return this.generalService.putData<any, any>(`${baseUrl}/update`, null, body);
  }

  getPuntosComplaints(): Observable<any>{
    return this.generalService.getData<any>(`${baseUrl}/getPuntosForQueja`);
  }

}
