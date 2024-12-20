import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IJefes } from 'app/entities/jefes/jefes.model';
import { JefesService } from 'app/entities/jefes/service/jefes.service';
import { DepartamentosService } from '../service/departamentos.service';
import { IDepartamentos } from '../departamentos.model';
import { DepartamentosFormService } from './departamentos-form.service';

import { DepartamentosUpdateComponent } from './departamentos-update.component';

describe('Departamentos Management Update Component', () => {
  let comp: DepartamentosUpdateComponent;
  let fixture: ComponentFixture<DepartamentosUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let departamentosFormService: DepartamentosFormService;
  let departamentosService: DepartamentosService;
  let jefesService: JefesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DepartamentosUpdateComponent],
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
      .overrideTemplate(DepartamentosUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DepartamentosUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    departamentosFormService = TestBed.inject(DepartamentosFormService);
    departamentosService = TestBed.inject(DepartamentosService);
    jefesService = TestBed.inject(JefesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Jefes query and add missing value', () => {
      const departamentos: IDepartamentos = { id: 456 };
      const nombrejefe: IJefes = { id: 6953 };
      departamentos.nombrejefe = nombrejefe;

      const jefesCollection: IJefes[] = [{ id: 29807 }];
      jest.spyOn(jefesService, 'query').mockReturnValue(of(new HttpResponse({ body: jefesCollection })));
      const additionalJefes = [nombrejefe];
      const expectedCollection: IJefes[] = [...additionalJefes, ...jefesCollection];
      jest.spyOn(jefesService, 'addJefesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ departamentos });
      comp.ngOnInit();

      expect(jefesService.query).toHaveBeenCalled();
      expect(jefesService.addJefesToCollectionIfMissing).toHaveBeenCalledWith(
        jefesCollection,
        ...additionalJefes.map(expect.objectContaining),
      );
      expect(comp.jefesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const departamentos: IDepartamentos = { id: 456 };
      const nombrejefe: IJefes = { id: 17631 };
      departamentos.nombrejefe = nombrejefe;

      activatedRoute.data = of({ departamentos });
      comp.ngOnInit();

      expect(comp.jefesSharedCollection).toContain(nombrejefe);
      expect(comp.departamentos).toEqual(departamentos);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartamentos>>();
      const departamentos = { id: 123 };
      jest.spyOn(departamentosFormService, 'getDepartamentos').mockReturnValue(departamentos);
      jest.spyOn(departamentosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ departamentos });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: departamentos }));
      saveSubject.complete();

      // THEN
      expect(departamentosFormService.getDepartamentos).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(departamentosService.update).toHaveBeenCalledWith(expect.objectContaining(departamentos));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartamentos>>();
      const departamentos = { id: 123 };
      jest.spyOn(departamentosFormService, 'getDepartamentos').mockReturnValue({ id: null });
      jest.spyOn(departamentosService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ departamentos: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: departamentos }));
      saveSubject.complete();

      // THEN
      expect(departamentosFormService.getDepartamentos).toHaveBeenCalled();
      expect(departamentosService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDepartamentos>>();
      const departamentos = { id: 123 };
      jest.spyOn(departamentosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ departamentos });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(departamentosService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareJefes', () => {
      it('Should forward to jefesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(jefesService, 'compareJefes');
        comp.compareJefes(entity, entity2);
        expect(jefesService.compareJefes).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
