import { IJefes } from 'app/entities/jefes/jefes.model';

export interface IDepartamentos {
  id: number;
  nombre?: string | null;
  ubicacion?: string | null;
  presupuesto?: number | null;
  nombrejefe?: IJefes | null;
}

export type NewDepartamentos = Omit<IDepartamentos, 'id'> & { id: null };
