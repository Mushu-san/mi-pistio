import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizationGuard } from './general/security/guards/authorization.guard';
import { AppComponent } from './app.component';
import { HomeComponent } from './public/home/home.component';

const routes: Routes = [
  {
    path:'public',
    children: [
      {
        path: '',
        loadChildren: () => import('./public/public.module').then(m => m.PublicModule)
      }
    ]
  },
  {
    path: 'empleado',
    canActivate: [AuthorizationGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./empleado/empleado.module').then(m => m.EmpleadoModule)
      }
    ]
  },
  {
    path: 'cuentahabiente',
    canActivate: [AuthorizationGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./cuentahabiente/cuentahabiente.module').then(m => m.CuentahabienteModule)
      }
    ]
  },
  {
    path: 'inicio',
    component: HomeComponent,
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'inicio',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
