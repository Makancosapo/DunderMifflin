import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IEmpleados } from '../empleados.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../empleados.test-samples';

import { EmpleadosService } from './empleados.service';

const requireRestSample: IEmpleados = {
  ...sampleWithRequiredData,
};

describe('Empleados Service', () => {
  let service: EmpleadosService;
  let httpMock: HttpTestingController;
  let expectedResult: IEmpleados | IEmpleados[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EmpleadosService);
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

    it('should create a Empleados', () => {
      const empleados = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(empleados).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Empleados', () => {
      const empleados = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(empleados).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Empleados', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Empleados', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Empleados', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEmpleadosToCollectionIfMissing', () => {
      it('should add a Empleados to an empty array', () => {
        const empleados: IEmpleados = sampleWithRequiredData;
        expectedResult = service.addEmpleadosToCollectionIfMissing([], empleados);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(empleados);
      });

      it('should not add a Empleados to an array that contains it', () => {
        const empleados: IEmpleados = sampleWithRequiredData;
        const empleadosCollection: IEmpleados[] = [
          {
            ...empleados,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEmpleadosToCollectionIfMissing(empleadosCollection, empleados);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Empleados to an array that doesn't contain it", () => {
        const empleados: IEmpleados = sampleWithRequiredData;
        const empleadosCollection: IEmpleados[] = [sampleWithPartialData];
        expectedResult = service.addEmpleadosToCollectionIfMissing(empleadosCollection, empleados);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(empleados);
      });

      it('should add only unique Empleados to an array', () => {
        const empleadosArray: IEmpleados[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const empleadosCollection: IEmpleados[] = [sampleWithRequiredData];
        expectedResult = service.addEmpleadosToCollectionIfMissing(empleadosCollection, ...empleadosArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const empleados: IEmpleados = sampleWithRequiredData;
        const empleados2: IEmpleados = sampleWithPartialData;
        expectedResult = service.addEmpleadosToCollectionIfMissing([], empleados, empleados2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(empleados);
        expect(expectedResult).toContain(empleados2);
      });

      it('should accept null and undefined values', () => {
        const empleados: IEmpleados = sampleWithRequiredData;
        expectedResult = service.addEmpleadosToCollectionIfMissing([], null, empleados, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(empleados);
      });

      it('should return initial array if no Empleados is added', () => {
        const empleadosCollection: IEmpleados[] = [sampleWithRequiredData];
        expectedResult = service.addEmpleadosToCollectionIfMissing(empleadosCollection, undefined, null);
        expect(expectedResult).toEqual(empleadosCollection);
      });
    });

    describe('compareEmpleados', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEmpleados(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEmpleados(entity1, entity2);
        const compareResult2 = service.compareEmpleados(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEmpleados(entity1, entity2);
        const compareResult2 = service.compareEmpleados(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEmpleados(entity1, entity2);
        const compareResult2 = service.compareEmpleados(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
