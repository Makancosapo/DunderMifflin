import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IDepartamentos } from '../departamentos.model';
import { DepartamentosService } from '../service/departamentos.service';

@Component({
  standalone: true,
  templateUrl: './departamentos-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class DepartamentosDeleteDialogComponent {
  departamentos?: IDepartamentos;

  protected departamentosService = inject(DepartamentosService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.departamentosService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
