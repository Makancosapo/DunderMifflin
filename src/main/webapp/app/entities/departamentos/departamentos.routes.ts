import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import DepartamentosResolve from './route/departamentos-routing-resolve.service';

const departamentosRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/departamentos.component').then(m => m.DepartamentosComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/departamentos-detail.component').then(m => m.DepartamentosDetailComponent),
    resolve: {
      departamentos: DepartamentosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/departamentos-update.component').then(m => m.DepartamentosUpdateComponent),
    resolve: {
      departamentos: DepartamentosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/departamentos-update.component').then(m => m.DepartamentosUpdateComponent),
    resolve: {
      departamentos: DepartamentosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default departamentosRoute;
