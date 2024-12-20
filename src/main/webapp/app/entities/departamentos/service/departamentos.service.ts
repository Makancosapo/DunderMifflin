import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDepartamentos, NewDepartamentos } from '../departamentos.model';

export type PartialUpdateDepartamentos = Partial<IDepartamentos> & Pick<IDepartamentos, 'id'>;

export type EntityResponseType = HttpResponse<IDepartamentos>;
export type EntityArrayResponseType = HttpResponse<IDepartamentos[]>;

@Injectable({ providedIn: 'root' })
export class DepartamentosService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/departamentos');

  create(departamentos: NewDepartamentos): Observable<EntityResponseType> {
    return this.http.post<IDepartamentos>(this.resourceUrl, departamentos, { observe: 'response' });
  }

  update(departamentos: IDepartamentos): Observable<EntityResponseType> {
    return this.http.put<IDepartamentos>(`${this.resourceUrl}/${this.getDepartamentosIdentifier(departamentos)}`, departamentos, {
      observe: 'response',
    });
  }

  partialUpdate(departamentos: PartialUpdateDepartamentos): Observable<EntityResponseType> {
    return this.http.patch<IDepartamentos>(`${this.resourceUrl}/${this.getDepartamentosIdentifier(departamentos)}`, departamentos, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDepartamentos>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDepartamentos[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDepartamentosIdentifier(departamentos: Pick<IDepartamentos, 'id'>): number {
    return departamentos.id;
  }

  compareDepartamentos(o1: Pick<IDepartamentos, 'id'> | null, o2: Pick<IDepartamentos, 'id'> | null): boolean {
    return o1 && o2 ? this.getDepartamentosIdentifier(o1) === this.getDepartamentosIdentifier(o2) : o1 === o2;
  }

  addDepartamentosToCollectionIfMissing<Type extends Pick<IDepartamentos, 'id'>>(
    departamentosCollection: Type[],
    ...departamentosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const departamentos: Type[] = departamentosToCheck.filter(isPresent);
    if (departamentos.length > 0) {
      const departamentosCollectionIdentifiers = departamentosCollection.map(departamentosItem =>
        this.getDepartamentosIdentifier(departamentosItem),
      );
      const departamentosToAdd = departamentos.filter(departamentosItem => {
        const departamentosIdentifier = this.getDepartamentosIdentifier(departamentosItem);
        if (departamentosCollectionIdentifiers.includes(departamentosIdentifier)) {
          return false;
        }
        departamentosCollectionIdentifiers.push(departamentosIdentifier);
        return true;
      });
      return [...departamentosToAdd, ...departamentosCollection];
    }
    return departamentosCollection;
  }
}
