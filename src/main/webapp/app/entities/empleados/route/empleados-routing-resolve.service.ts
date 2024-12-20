import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmpleados } from '../empleados.model';
import { EmpleadosService } from '../service/empleados.service';

const empleadosResolve = (route: ActivatedRouteSnapshot): Observable<null | IEmpleados> => {
  const id = route.params.id;
  if (id) {
    return inject(EmpleadosService)
      .find(id)
      .pipe(
        mergeMap((empleados: HttpResponse<IEmpleados>) => {
          if (empleados.body) {
            return of(empleados.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default empleadosResolve;
