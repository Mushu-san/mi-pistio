import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../commons/services/jwt.service';

@Component({
  selector: 'app-router-url',
  templateUrl: './router-url.component.html',
  styleUrls: ['./router-url.component.scss']
})
export class RouterUrlComponent implements OnInit {

  urls: any[] = [
    {
      name: 'Administración de empleados y puntos de atención',
      url: 'empleado/administracion',
      icon: 'supervised_user_circle',
      roles: ['ROLE_ADMIN']
    },
    {
      name: 'Administración de tipos de queja',
      url: 'empleado/tipo-queja',
      icon: 'supervised_user_circle',
      roles: ['ROLE_ADMIN']
    },
    {
      name: 'Ingreso de Quejas por Mal Servicio',
      url: 'empleado/ingreso-queja',
      icon: 'supervised_user_circle',
      roles: ['ROLE_ADMIN', 'ROLE_EMPLEADO_RECEPTOR']
    },
    {
      name: 'Ingreso de Quejas por Mal Servicio',
      url: 'cuentahabiente/ingreso-queja',
      icon: 'supervised_user_circle',
      roles: ['ROLE_ADMIN', 'ROLE_CUENTAHABIENTE']
    },
    {
      name: 'Quejas ingresadas por mal servicio',
      url: 'empleado/asignar-queja',
      icon: 'supervised_user_circle',
      roles: ['ROLE_ADMIN', 'ROLE_EMPLEADO_CENTRALIZADOR_MASTER']
    },
    {
      name: 'Seguimiento de quejas',
      url: 'empleado/seguimiento-operador',
      icon: 'supervised_user_circle',
      roles: ['ROLE_ADMIN', 'ROLE_EMPLEADO_OPERADOR']
    },
    {
      name: 'Seguimiento de quejas',
      url: 'empleado/seguimiento-centralizador',
      icon: 'supervised_user_circle',
      roles: ['ROLE_ADMIN', 'ROLE_EMPLEADO_CENTRALIZADOR']
    },
    {
      name: 'Autoconsulta de quejas',
      url: 'public/autoconsulta',
      icon: 'supervised_user_circle',
      roles: ['']
    },
  ]

  constructor(private route: Router, private jwtService: JwtService) {
   /*  if(!sessionStorage.getItem('user')){
      this.urls = []
    }
    if(this.jwtService.tokenExpired()){
      this.urls = []
    } */
   }

  ngOnInit(): void {
  }

  navigate(url: string){
    this.route.navigateByUrl(url);
  }

  validate(element: any): boolean {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const url: string = element.url;
    if(url && !user.roles){
      return url.split('/').includes('public')
    }
    else if(user){
      const roles: string[] = user.roles;
      if(roles)
      return roles.some((role: string) => element.roles.includes(role))
    }
    return false;
  }
}
