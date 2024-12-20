import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../empleados.test-samples';

import { EmpleadosFormService } from './empleados-form.service';

describe('Empleados Form Service', () => {
  let service: EmpleadosFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpleadosFormService);
  });

  describe('Service methods', () => {
    describe('createEmpleadosFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmpleadosFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            apellido: expect.any(Object),
            correo: expect.any(Object),
            telefono: expect.any(Object),
            departamento: expect.any(Object),
          }),
        );
      });

      it('passing IEmpleados should create a new form with FormGroup', () => {
        const formGroup = service.createEmpleadosFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            apellido: expect.any(Object),
            correo: expect.any(Object),
            telefono: expect.any(Object),
            departamento: expect.any(Object),
          }),
        );
      });
    });

    describe('getEmpleados', () => {
      it('should return NewEmpleados for default Empleados initial value', () => {
        const formGroup = service.createEmpleadosFormGroup(sampleWithNewData);

        const empleados = service.getEmpleados(formGroup) as any;

        expect(empleados).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmpleados for empty Empleados initial value', () => {
        const formGroup = service.createEmpleadosFormGroup();

        const empleados = service.getEmpleados(formGroup) as any;

        expect(empleados).toMatchObject({});
      });

      it('should return IEmpleados', () => {
        const formGroup = service.createEmpleadosFormGroup(sampleWithRequiredData);

        const empleados = service.getEmpleados(formGroup) as any;

        expect(empleados).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmpleados should not enable id FormControl', () => {
        const formGroup = service.createEmpleadosFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmpleados should disable id FormControl', () => {
        const formGroup = service.createEmpleadosFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
