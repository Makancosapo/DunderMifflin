import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IDepartamentos } from 'app/entities/departamentos/departamentos.model';
import { DepartamentosService } from 'app/entities/departamentos/service/departamentos.service';
import { IEmpleados } from '../empleados.model';
import { EmpleadosService } from '../service/empleados.service';
import { EmpleadosFormGroup, EmpleadosFormService } from './empleados-form.service';

@Component({
  standalone: true,
  selector: 'jhi-empleados-update',
  templateUrl: './empleados-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EmpleadosUpdateComponent implements OnInit {
  isSaving = false;
  empleados: IEmpleados | null = null;

  departamentosSharedCollection: IDepartamentos[] = [];

  protected empleadosService = inject(EmpleadosService);
  protected empleadosFormService = inject(EmpleadosFormService);
  protected departamentosService = inject(DepartamentosService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EmpleadosFormGroup = this.empleadosFormService.createEmpleadosFormGroup();

  compareDepartamentos = (o1: IDepartamentos | null, o2: IDepartamentos | null): boolean =>
    this.departamentosService.compareDepartamentos(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ empleados }) => {
      this.empleados = empleados;
      if (empleados) {
        this.updateForm(empleados);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const empleados = this.empleadosFormService.getEmpleados(this.editForm);
    if (empleados.id !== null) {
      this.subscribeToSaveResponse(this.empleadosService.update(empleados));
    } else {
      this.subscribeToSaveResponse(this.empleadosService.create(empleados));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmpleados>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(empleados: IEmpleados): void {
    this.empleados = empleados;
    this.empleadosFormService.resetForm(this.editForm, empleados);

    this.departamentosSharedCollection = this.departamentosService.addDepartamentosToCollectionIfMissing<IDepartamentos>(
      this.departamentosSharedCollection,
      empleados.departamento,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.departamentosService
      .query()
      .pipe(map((res: HttpResponse<IDepartamentos[]>) => res.body ?? []))
      .pipe(
        map((departamentos: IDepartamentos[]) =>
          this.departamentosService.addDepartamentosToCollectionIfMissing<IDepartamentos>(departamentos, this.empleados?.departamento),
        ),
      )
      .subscribe((departamentos: IDepartamentos[]) => (this.departamentosSharedCollection = departamentos));
  }
}
