import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../departamentos.test-samples';

import { DepartamentosFormService } from './departamentos-form.service';

describe('Departamentos Form Service', () => {
  let service: DepartamentosFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartamentosFormService);
  });

  describe('Service methods', () => {
    describe('createDepartamentosFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDepartamentosFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            ubicacion: expect.any(Object),
            presupuesto: expect.any(Object),
            nombrejefe: expect.any(Object),
          }),
        );
      });

      it('passing IDepartamentos should create a new form with FormGroup', () => {
        const formGroup = service.createDepartamentosFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            ubicacion: expect.any(Object),
            presupuesto: expect.any(Object),
            nombrejefe: expect.any(Object),
          }),
        );
      });
    });

    describe('getDepartamentos', () => {
      it('should return NewDepartamentos for default Departamentos initial value', () => {
        const formGroup = service.createDepartamentosFormGroup(sampleWithNewData);

        const departamentos = service.getDepartamentos(formGroup) as any;

        expect(departamentos).toMatchObject(sampleWithNewData);
      });

      it('should return NewDepartamentos for empty Departamentos initial value', () => {
        const formGroup = service.createDepartamentosFormGroup();

        const departamentos = service.getDepartamentos(formGroup) as any;

        expect(departamentos).toMatchObject({});
      });

      it('should return IDepartamentos', () => {
        const formGroup = service.createDepartamentosFormGroup(sampleWithRequiredData);

        const departamentos = service.getDepartamentos(formGroup) as any;

        expect(departamentos).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDepartamentos should not enable id FormControl', () => {
        const formGroup = service.createDepartamentosFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDepartamentos should disable id FormControl', () => {
        const formGroup = service.createDepartamentosFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
