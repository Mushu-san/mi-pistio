import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const secret =
  '5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(private route: Router) {}

  tokenExpired() {
    if(!sessionStorage.getItem('access_token')){
      return true
    }

    else{
      const token: string = sessionStorage.getItem('access_token');

      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      const isExpired = (Math.floor((new Date).getTime() / 1000)) >= expiry
      if(isExpired){
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('access_token');
      }
     return isExpired;
    }


  }
}
