import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDepartamentos } from '../departamentos.model';
import { DepartamentosService } from '../service/departamentos.service';

const departamentosResolve = (route: ActivatedRouteSnapshot): Observable<null | IDepartamentos> => {
  const id = route.params.id;
  if (id) {
    return inject(DepartamentosService)
      .find(id)
      .pipe(
        mergeMap((departamentos: HttpResponse<IDepartamentos>) => {
          if (departamentos.body) {
            return of(departamentos.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default departamentosResolve;
