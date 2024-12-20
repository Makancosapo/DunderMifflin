import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import EmpleadosResolve from './route/empleados-routing-resolve.service';

const empleadosRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/empleados.component').then(m => m.EmpleadosComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/empleados-detail.component').then(m => m.EmpleadosDetailComponent),
    resolve: {
      empleados: EmpleadosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/empleados-update.component').then(m => m.EmpleadosUpdateComponent),
    resolve: {
      empleados: EmpleadosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/empleados-update.component').then(m => m.EmpleadosUpdateComponent),
    resolve: {
      empleados: EmpleadosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default empleadosRoute;
