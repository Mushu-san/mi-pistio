import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.BASE.concat('/user');

@Injectable({
  providedIn: 'root'
})
export class UserService {


constructor(private generalService: GeneralService) {}

getToken(loginObject: any, isEmployee: boolean): Observable<any> {
  const user = loginObject;
  user.username = user.username.concat(
    isEmployee ? ',ZW1wbGVhZG8=' : ',Y3VlbnRhaGFiaWVudGU='
  );
  return this.generalService.postData<any, any>(
    `${baseUrl}/token`,
    loginObject
  );
}

  getUserLoggedData(): Observable<any> {
    return this.generalService.getData<any>(`${baseUrl}/userlogged`);
  }

  validatePassword(username: string, isEmployee: boolean): Observable<any> {

    return this.generalService.postData<any, any>(`${baseUrl}/validatepassword`, {
      username: username,
      isEmpleado: isEmployee
    });
  }

  validateUser(username: string, isEmployee: boolean): Observable<any> {

    return this.generalService.postData<any, any>(`${baseUrl}/validateUsername`, {
      username: username,
      isEmpleado: isEmployee
    });
  }

  changePassword(username: string, password: string, isEmployee: boolean): Observable<any> {
      return this.generalService.postData<any, any>(`${baseUrl}/changepassword`, {
        username: username,
        password: password,
        isEmpleado: isEmployee
      });
  }

  signCuentaHabiente(body: any) : Observable<any> {
    return this.generalService.postData<any, any>(`${baseUrl}/signCuentaHabiente`, body);
  }

  getTipoQueja(): Observable<any> {
    return this.generalService.getData<any>(`${baseUrl}/tipo-queja`);
  }

  getInfoQuejabyCorrelativo(correlativo: string): Observable<any> {
    return this.generalService.getData<any>(`${baseUrl}/getInfoQueja/${correlativo}`);
  }
}
