import { IDepartamentos } from 'app/entities/departamentos/departamentos.model';

export interface IEmpleados {
  id: number;
  nombre?: string | null;
  apellido?: string | null;
  correo?: string | null;
  telefono?: string | null;
  departamento?: IDepartamentos | null;
}

export type NewEmpleados = Omit<IEmpleados, 'id'> & { id: null };
