import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IDepartamentos } from '../departamentos.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../departamentos.test-samples';

import { DepartamentosService } from './departamentos.service';

const requireRestSample: IDepartamentos = {
  ...sampleWithRequiredData,
};

describe('Departamentos Service', () => {
  let service: DepartamentosService;
  let httpMock: HttpTestingController;
  let expectedResult: IDepartamentos | IDepartamentos[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(DepartamentosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Departamentos', () => {
      const departamentos = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(departamentos).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Departamentos', () => {
      const departamentos = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(departamentos).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Departamentos', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Departamentos', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Departamentos', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDepartamentosToCollectionIfMissing', () => {
      it('should add a Departamentos to an empty array', () => {
        const departamentos: IDepartamentos = sampleWithRequiredData;
        expectedResult = service.addDepartamentosToCollectionIfMissing([], departamentos);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(departamentos);
      });

      it('should not add a Departamentos to an array that contains it', () => {
        const departamentos: IDepartamentos = sampleWithRequiredData;
        const departamentosCollection: IDepartamentos[] = [
          {
            ...departamentos,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDepartamentosToCollectionIfMissing(departamentosCollection, departamentos);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Departamentos to an array that doesn't contain it", () => {
        const departamentos: IDepartamentos = sampleWithRequiredData;
        const departamentosCollection: IDepartamentos[] = [sampleWithPartialData];
        expectedResult = service.addDepartamentosToCollectionIfMissing(departamentosCollection, departamentos);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(departamentos);
      });

      it('should add only unique Departamentos to an array', () => {
        const departamentosArray: IDepartamentos[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const departamentosCollection: IDepartamentos[] = [sampleWithRequiredData];
        expectedResult = service.addDepartamentosToCollectionIfMissing(departamentosCollection, ...departamentosArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const departamentos: IDepartamentos = sampleWithRequiredData;
        const departamentos2: IDepartamentos = sampleWithPartialData;
        expectedResult = service.addDepartamentosToCollectionIfMissing([], departamentos, departamentos2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(departamentos);
        expect(expectedResult).toContain(departamentos2);
      });

      it('should accept null and undefined values', () => {
        const departamentos: IDepartamentos = sampleWithRequiredData;
        expectedResult = service.addDepartamentosToCollectionIfMissing([], null, departamentos, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(departamentos);
      });

      it('should return initial array if no Departamentos is added', () => {
        const departamentosCollection: IDepartamentos[] = [sampleWithRequiredData];
        expectedResult = service.addDepartamentosToCollectionIfMissing(departamentosCollection, undefined, null);
        expect(expectedResult).toEqual(departamentosCollection);
      });
    });

    describe('compareDepartamentos', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDepartamentos(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDepartamentos(entity1, entity2);
        const compareResult2 = service.compareDepartamentos(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDepartamentos(entity1, entity2);
        const compareResult2 = service.compareDepartamentos(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDepartamentos(entity1, entity2);
        const compareResult2 = service.compareDepartamentos(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
