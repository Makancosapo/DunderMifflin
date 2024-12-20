import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IJefes } from '../jefes.model';
import { JefesService } from '../service/jefes.service';

@Component({
  standalone: true,
  templateUrl: './jefes-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class JefesDeleteDialogComponent {
  jefes?: IJefes;

  protected jefesService = inject(JefesService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jefesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
