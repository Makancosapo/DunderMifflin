import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'dunderMifflinApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'departamentos',
    data: { pageTitle: 'dunderMifflinApp.departamentos.home.title' },
    loadChildren: () => import('./departamentos/departamentos.routes'),
  },
  {
    path: 'empleados',
    data: { pageTitle: 'dunderMifflinApp.empleados.home.title' },
    loadChildren: () => import('./empleados/empleados.routes'),
  },
  {
    path: 'jefes',
    data: { pageTitle: 'dunderMifflinApp.jefes.home.title' },
    loadChildren: () => import('./jefes/jefes.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
