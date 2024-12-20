import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJefes, NewJefes } from '../jefes.model';

export type PartialUpdateJefes = Partial<IJefes> & Pick<IJefes, 'id'>;

export type EntityResponseType = HttpResponse<IJefes>;
export type EntityArrayResponseType = HttpResponse<IJefes[]>;

@Injectable({ providedIn: 'root' })
export class JefesService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/jefes');

  create(jefes: NewJefes): Observable<EntityResponseType> {
    return this.http.post<IJefes>(this.resourceUrl, jefes, { observe: 'response' });
  }

  update(jefes: IJefes): Observable<EntityResponseType> {
    return this.http.put<IJefes>(`${this.resourceUrl}/${this.getJefesIdentifier(jefes)}`, jefes, { observe: 'response' });
  }

  partialUpdate(jefes: PartialUpdateJefes): Observable<EntityResponseType> {
    return this.http.patch<IJefes>(`${this.resourceUrl}/${this.getJefesIdentifier(jefes)}`, jefes, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJefes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJefes[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJefesIdentifier(jefes: Pick<IJefes, 'id'>): number {
    return jefes.id;
  }

  compareJefes(o1: Pick<IJefes, 'id'> | null, o2: Pick<IJefes, 'id'> | null): boolean {
    return o1 && o2 ? this.getJefesIdentifier(o1) === this.getJefesIdentifier(o2) : o1 === o2;
  }

  addJefesToCollectionIfMissing<Type extends Pick<IJefes, 'id'>>(
    jefesCollection: Type[],
    ...jefesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jefes: Type[] = jefesToCheck.filter(isPresent);
    if (jefes.length > 0) {
      const jefesCollectionIdentifiers = jefesCollection.map(jefesItem => this.getJefesIdentifier(jefesItem));
      const jefesToAdd = jefes.filter(jefesItem => {
        const jefesIdentifier = this.getJefesIdentifier(jefesItem);
        if (jefesCollectionIdentifiers.includes(jefesIdentifier)) {
          return false;
        }
        jefesCollectionIdentifiers.push(jefesIdentifier);
        return true;
      });
      return [...jefesToAdd, ...jefesCollection];
    }
    return jefesCollection;
  }
}
