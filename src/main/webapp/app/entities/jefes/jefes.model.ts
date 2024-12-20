export interface IJefes {
  id: number;
  nombre?: string | null;
  telefono?: string | null;
}

export type NewJefes = Omit<IJefes, 'id'> & { id: null };
