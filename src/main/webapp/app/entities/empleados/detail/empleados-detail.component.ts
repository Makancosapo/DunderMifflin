import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IEmpleados } from '../empleados.model';

@Component({
  standalone: true,
  selector: 'jhi-empleados-detail',
  templateUrl: './empleados-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EmpleadosDetailComponent {
  empleados = input<IEmpleados | null>(null);

  previousState(): void {
    window.history.back();
  }
}
