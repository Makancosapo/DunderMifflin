import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmpleados, NewEmpleados } from '../empleados.model';

export type PartialUpdateEmpleados = Partial<IEmpleados> & Pick<IEmpleados, 'id'>;

export type EntityResponseType = HttpResponse<IEmpleados>;
export type EntityArrayResponseType = HttpResponse<IEmpleados[]>;

@Injectable({ providedIn: 'root' })
export class EmpleadosService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/empleados');

  create(empleados: NewEmpleados): Observable<EntityResponseType> {
    return this.http.post<IEmpleados>(this.resourceUrl, empleados, { observe: 'response' });
  }

  update(empleados: IEmpleados): Observable<EntityResponseType> {
    return this.http.put<IEmpleados>(`${this.resourceUrl}/${this.getEmpleadosIdentifier(empleados)}`, empleados, { observe: 'response' });
  }

  partialUpdate(empleados: PartialUpdateEmpleados): Observable<EntityResponseType> {
    return this.http.patch<IEmpleados>(`${this.resourceUrl}/${this.getEmpleadosIdentifier(empleados)}`, empleados, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmpleados>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmpleados[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEmpleadosIdentifier(empleados: Pick<IEmpleados, 'id'>): number {
    return empleados.id;
  }

  compareEmpleados(o1: Pick<IEmpleados, 'id'> | null, o2: Pick<IEmpleados, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmpleadosIdentifier(o1) === this.getEmpleadosIdentifier(o2) : o1 === o2;
  }

  addEmpleadosToCollectionIfMissing<Type extends Pick<IEmpleados, 'id'>>(
    empleadosCollection: Type[],
    ...empleadosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const empleados: Type[] = empleadosToCheck.filter(isPresent);
    if (empleados.length > 0) {
      const empleadosCollectionIdentifiers = empleadosCollection.map(empleadosItem => this.getEmpleadosIdentifier(empleadosItem));
      const empleadosToAdd = empleados.filter(empleadosItem => {
        const empleadosIdentifier = this.getEmpleadosIdentifier(empleadosItem);
        if (empleadosCollectionIdentifiers.includes(empleadosIdentifier)) {
          return false;
        }
        empleadosCollectionIdentifiers.push(empleadosIdentifier);
        return true;
      });
      return [...empleadosToAdd, ...empleadosCollection];
    }
    return empleadosCollection;
  }
}
