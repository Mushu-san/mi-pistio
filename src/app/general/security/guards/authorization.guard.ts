import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree } from "@angular/router";
import { BlockUiService } from "app/general/commons/services/block-ui.service";
import { JwtService } from "app/general/commons/services/jwt.service";
import { Observable } from "rxjs";

const rolesEmpleado = ['ROLE_EMPLEADO_ENCARGADO', 'ROLE_EMPLEADO_ADMIN', 'ROLE_EMPLEADO_RECEPTOR',
'ROLE_EMPLEADO_CENTRALIZADOR_MASTER', 'ROLE_EMPLEADO_OPERADOR', 'ROLE_EMPLEADO_CENTRALIZADOR']

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate, CanActivateChild {

  constructor(
    private blockUI: BlockUiService,
    private jwtService: JwtService
  ){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    this.blockUI.block();
    if(sessionStorage.getItem('access_token')){

      if(this.jwtService.tokenExpired()){
        console.log('Token expirado');
        window.location.href = '/public/login';
        return false;
      }

      const user = JSON.parse(sessionStorage.getItem('user'));
      if(!user){
        window.location.href = '/inicio';
        return false;
      }

      if(state.url.split('/').includes('cuentahabiente') && user.roles.includes('ROLE_CUENTAHABIENTE')){
        this.blockUI.unblock();
        return true;
      }

      if(user.roles.includes('ROLE_ADMIN')){
        this.blockUI.unblock();
        return true;
      }

      if(state.url.split('/').includes('empleado') && rolesEmpleado.some((role: string) => user.roles.includes(role)) ){
        this.blockUI.unblock();
        return true;
      }

      else{
        console.log('No tiene permisos para acceder a esta pagina'); //TODO: Redireccionar a pagina de error
        window.location.href = '/public/login';
        return false;
      }

    }
    else{
      this.blockUI.unblock(); //TODO: Redireccionar a pagina de error
      window.location.href = '/public/login';
      return false;
    }

  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
   return this.canActivate(childRoute, state);
  }


}
