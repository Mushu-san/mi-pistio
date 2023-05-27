import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.BASE.concat('/prueba');

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  constructor(private generalService: GeneralService) {}

  hola(): Observable<any> {
    return this.generalService.getData<any>(`${baseUrl}/hola`);
  }


}
