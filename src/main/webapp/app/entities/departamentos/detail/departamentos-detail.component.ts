import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IDepartamentos } from '../departamentos.model';

@Component({
  standalone: true,
  selector: 'jhi-departamentos-detail',
  templateUrl: './departamentos-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class DepartamentosDetailComponent {
  departamentos = input<IDepartamentos | null>(null);

  previousState(): void {
    window.history.back();
  }
}
