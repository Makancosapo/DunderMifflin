import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../jefes.test-samples';

import { JefesFormService } from './jefes-form.service';

describe('Jefes Form Service', () => {
  let service: JefesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JefesFormService);
  });

  describe('Service methods', () => {
    describe('createJefesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJefesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            telefono: expect.any(Object),
          }),
        );
      });

      it('passing IJefes should create a new form with FormGroup', () => {
        const formGroup = service.createJefesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nombre: expect.any(Object),
            telefono: expect.any(Object),
          }),
        );
      });
    });

    describe('getJefes', () => {
      it('should return NewJefes for default Jefes initial value', () => {
        const formGroup = service.createJefesFormGroup(sampleWithNewData);

        const jefes = service.getJefes(formGroup) as any;

        expect(jefes).toMatchObject(sampleWithNewData);
      });

      it('should return NewJefes for empty Jefes initial value', () => {
        const formGroup = service.createJefesFormGroup();

        const jefes = service.getJefes(formGroup) as any;

        expect(jefes).toMatchObject({});
      });

      it('should return IJefes', () => {
        const formGroup = service.createJefesFormGroup(sampleWithRequiredData);

        const jefes = service.getJefes(formGroup) as any;

        expect(jefes).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJefes should not enable id FormControl', () => {
        const formGroup = service.createJefesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJefes should disable id FormControl', () => {
        const formGroup = service.createJefesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
