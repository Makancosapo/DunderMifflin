import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IJefes, NewJefes } from '../jefes.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJefes for edit and NewJefesFormGroupInput for create.
 */
type JefesFormGroupInput = IJefes | PartialWithRequiredKeyOf<NewJefes>;

type JefesFormDefaults = Pick<NewJefes, 'id'>;

type JefesFormGroupContent = {
  id: FormControl<IJefes['id'] | NewJefes['id']>;
  nombre: FormControl<IJefes['nombre']>;
  telefono: FormControl<IJefes['telefono']>;
};

export type JefesFormGroup = FormGroup<JefesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JefesFormService {
  createJefesFormGroup(jefes: JefesFormGroupInput = { id: null }): JefesFormGroup {
    const jefesRawValue = {
      ...this.getFormDefaults(),
      ...jefes,
    };
    return new FormGroup<JefesFormGroupContent>({
      id: new FormControl(
        { value: jefesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nombre: new FormControl(jefesRawValue.nombre),
      telefono: new FormControl(jefesRawValue.telefono),
    });
  }

  getJefes(form: JefesFormGroup): IJefes | NewJefes {
    return form.getRawValue() as IJefes | NewJefes;
  }

  resetForm(form: JefesFormGroup, jefes: JefesFormGroupInput): void {
    const jefesRawValue = { ...this.getFormDefaults(), ...jefes };
    form.reset(
      {
        ...jefesRawValue,
        id: { value: jefesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): JefesFormDefaults {
    return {
      id: null,
    };
  }
}
