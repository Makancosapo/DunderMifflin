import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import JefesResolve from './route/jefes-routing-resolve.service';

const jefesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/jefes.component').then(m => m.JefesComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/jefes-detail.component').then(m => m.JefesDetailComponent),
    resolve: {
      jefes: JefesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/jefes-update.component').then(m => m.JefesUpdateComponent),
    resolve: {
      jefes: JefesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/jefes-update.component').then(m => m.JefesUpdateComponent),
    resolve: {
      jefes: JefesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default jefesRoute;
