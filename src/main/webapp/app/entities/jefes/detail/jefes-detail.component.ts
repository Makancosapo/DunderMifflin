import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IJefes } from '../jefes.model';

@Component({
  standalone: true,
  selector: 'jhi-jefes-detail',
  templateUrl: './jefes-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class JefesDetailComponent {
  jefes = input<IJefes | null>(null);

  previousState(): void {
    window.history.back();
  }
}
