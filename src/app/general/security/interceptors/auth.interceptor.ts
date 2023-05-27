import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtService } from "app/general/commons/services/jwt.service";
import { Observable } from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private router: Router, private jwtService: JwtService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {


    if(!sessionStorage.getItem('access_token')){

      if(req.url.split('/').includes('public') || req.url.split('/').includes('user')){
        let authReq = req;
        return next.handle(authReq);
      }
      else{
        //redireccionar a login
      console.log("pasa por  aca");
      this.router.navigate(['/public/login']);
      }

    }

    if(!sessionStorage.getItem('access_token') && (req.url.includes('/public'))){
      //manda la peticion
      let authReq = req;
      return next.handle(authReq);
    }

    /* if(this.jwtService.tokenExpired()){
      this.router.navigateByUrl('/public/login');

    } */

    else{
      return next.handle(this.addAccessToken(req));
    }
  }

  addAccessToken(request: HttpRequest<unknown>): HttpRequest<unknown> {

    let authToken = sessionStorage.getItem('access_token')
    let newRequest = request;

    if (authToken) {
      return newRequest.clone({
        headers: newRequest.headers.append('Authorization', 'Bearer ' + authToken)
    });
    }
    return newRequest;
  }

}
