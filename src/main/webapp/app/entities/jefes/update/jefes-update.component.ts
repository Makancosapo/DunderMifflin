import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IJefes } from '../jefes.model';
import { JefesService } from '../service/jefes.service';
import { JefesFormGroup, JefesFormService } from './jefes-form.service';

@Component({
  standalone: true,
  selector: 'jhi-jefes-update',
  templateUrl: './jefes-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class JefesUpdateComponent implements OnInit {
  isSaving = false;
  jefes: IJefes | null = null;

  protected jefesService = inject(JefesService);
  protected jefesFormService = inject(JefesFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: JefesFormGroup = this.jefesFormService.createJefesFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jefes }) => {
      this.jefes = jefes;
      if (jefes) {
        this.updateForm(jefes);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jefes = this.jefesFormService.getJefes(this.editForm);
    if (jefes.id !== null) {
      this.subscribeToSaveResponse(this.jefesService.update(jefes));
    } else {
      this.subscribeToSaveResponse(this.jefesService.create(jefes));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJefes>>): void {
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

  protected updateForm(jefes: IJefes): void {
    this.jefes = jefes;
    this.jefesFormService.resetForm(this.editForm, jefes);
  }
}
