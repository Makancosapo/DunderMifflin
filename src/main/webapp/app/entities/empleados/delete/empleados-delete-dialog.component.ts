import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEmpleados } from '../empleados.model';
import { EmpleadosService } from '../service/empleados.service';

@Component({
  standalone: true,
  templateUrl: './empleados-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EmpleadosDeleteDialogComponent {
  empleados?: IEmpleados;

  protected empleadosService = inject(EmpleadosService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.empleadosService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
