import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { JefesService } from '../service/jefes.service';
import { IJefes } from '../jefes.model';
import { JefesFormService } from './jefes-form.service';

import { JefesUpdateComponent } from './jefes-update.component';

describe('Jefes Management Update Component', () => {
  let comp: JefesUpdateComponent;
  let fixture: ComponentFixture<JefesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jefesFormService: JefesFormService;
  let jefesService: JefesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JefesUpdateComponent],
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
      .overrideTemplate(JefesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JefesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jefesFormService = TestBed.inject(JefesFormService);
    jefesService = TestBed.inject(JefesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const jefes: IJefes = { id: 456 };

      activatedRoute.data = of({ jefes });
      comp.ngOnInit();

      expect(comp.jefes).toEqual(jefes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJefes>>();
      const jefes = { id: 123 };
      jest.spyOn(jefesFormService, 'getJefes').mockReturnValue(jefes);
      jest.spyOn(jefesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jefes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jefes }));
      saveSubject.complete();

      // THEN
      expect(jefesFormService.getJefes).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jefesService.update).toHaveBeenCalledWith(expect.objectContaining(jefes));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJefes>>();
      const jefes = { id: 123 };
      jest.spyOn(jefesFormService, 'getJefes').mockReturnValue({ id: null });
      jest.spyOn(jefesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jefes: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jefes }));
      saveSubject.complete();

      // THEN
      expect(jefesFormService.getJefes).toHaveBeenCalled();
      expect(jefesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJefes>>();
      const jefes = { id: 123 };
      jest.spyOn(jefesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jefes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jefesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
