import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IDepartamentos } from 'app/entities/departamentos/departamentos.model';
import { DepartamentosService } from 'app/entities/departamentos/service/departamentos.service';
import { EmpleadosService } from '../service/empleados.service';
import { IEmpleados } from '../empleados.model';
import { EmpleadosFormService } from './empleados-form.service';

import { EmpleadosUpdateComponent } from './empleados-update.component';

describe('Empleados Management Update Component', () => {
  let comp: EmpleadosUpdateComponent;
  let fixture: ComponentFixture<EmpleadosUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let empleadosFormService: EmpleadosFormService;
  let empleadosService: EmpleadosService;
  let departamentosService: DepartamentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmpleadosUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EmpleadosUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmpleadosUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    empleadosFormService = TestBed.inject(EmpleadosFormService);
    empleadosService = TestBed.inject(EmpleadosService);
    departamentosService = TestBed.inject(DepartamentosService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Departamentos query and add missing value', () => {
      const empleados: IEmpleados = { id: 456 };
      const departamento: IDepartamentos = { id: 14699 };
      empleados.departamento = departamento;

      const departamentosCollection: IDepartamentos[] = [{ id: 22167 }];
      jest.spyOn(departamentosService, 'query').mockReturnValue(of(new HttpResponse({ body: departamentosCollection })));
      const additionalDepartamentos = [departamento];
      const expectedCollection: IDepartamentos[] = [...additionalDepartamentos, ...departamentosCollection];
      jest.spyOn(departamentosService, 'addDepartamentosToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ empleados });
      comp.ngOnInit();

      expect(departamentosService.query).toHaveBeenCalled();
      expect(departamentosService.addDepartamentosToCollectionIfMissing).toHaveBeenCalledWith(
        departamentosCollection,
        ...additionalDepartamentos.map(expect.objectContaining),
      );
      expect(comp.departamentosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const empleados: IEmpleados = { id: 456 };
      const departamento: IDepartamentos = { id: 3600 };
      empleados.departamento = departamento;

      activatedRoute.data = of({ empleados });
      comp.ngOnInit();

      expect(comp.departamentosSharedCollection).toContain(departamento);
      expect(comp.empleados).toEqual(empleados);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmpleados>>();
      const empleados = { id: 123 };
      jest.spyOn(empleadosFormService, 'getEmpleados').mockReturnValue(empleados);
      jest.spyOn(empleadosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ empleados });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: empleados }));
      saveSubject.complete();

      // THEN
      expect(empleadosFormService.getEmpleados).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(empleadosService.update).toHaveBeenCalledWith(expect.objectContaining(empleados));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmpleados>>();
      const empleados = { id: 123 };
      jest.spyOn(empleadosFormService, 'getEmpleados').mockReturnValue({ id: null });
      jest.spyOn(empleadosService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ empleados: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: empleados }));
      saveSubject.complete();

      // THEN
      expect(empleadosFormService.getEmpleados).toHaveBeenCalled();
      expect(empleadosService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmpleados>>();
      const empleados = { id: 123 };
      jest.spyOn(empleadosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ empleados });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(empleadosService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDepartamentos', () => {
      it('Should forward to departamentosService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(departamentosService, 'compareDepartamentos');
        comp.compareDepartamentos(entity, entity2);
        expect(departamentosService.compareDepartamentos).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
