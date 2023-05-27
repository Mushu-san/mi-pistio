import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.BASE.concat('/catalogo');

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

constructor(private generalService: GeneralService) { }

  getCatalogoByIdAndEstado(id: number, estado: number): Observable<any>{
    return this.generalService.getData<any>(`${baseUrl}/${id}/${estado}`);
  }

  getTipoQueja(): Observable<any>{
    return this.generalService.getData<any>(`${baseUrl}/tipo-queja`);
  }

  saveTipoQueja(data: any): Observable<any>{
    return this.generalService.postData<any, any>(`${baseUrl}/saveTipoQueja`, data);
  }

  updateTipoQueja(data: any): Observable<any>{
    return this.generalService.putData<any, any>(`${baseUrl}/updateTipoQueja`, null, data);
  }
}
