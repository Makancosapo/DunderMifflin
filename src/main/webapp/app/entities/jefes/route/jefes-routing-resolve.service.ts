import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJefes } from '../jefes.model';
import { JefesService } from '../service/jefes.service';

const jefesResolve = (route: ActivatedRouteSnapshot): Observable<null | IJefes> => {
  const id = route.params.id;
  if (id) {
    return inject(JefesService)
      .find(id)
      .pipe(
        mergeMap((jefes: HttpResponse<IJefes>) => {
          if (jefes.body) {
            return of(jefes.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default jefesResolve;
