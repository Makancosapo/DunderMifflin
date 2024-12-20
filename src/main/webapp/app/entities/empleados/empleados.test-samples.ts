import { IEmpleados, NewEmpleados } from './empleados.model';

export const sampleWithRequiredData: IEmpleados = {
  id: 22962,
};

export const sampleWithPartialData: IEmpleados = {
  id: 8283,
  nombre: 'boo finished fowl',
  correo: 'miserly aw gaseous',
};

export const sampleWithFullData: IEmpleados = {
  id: 20685,
  nombre: 'inasmuch exhausted',
  apellido: 'meanwhile huzzah ew',
  correo: 'sheepishly yahoo',
  telefono: 'redesign prance disposer',
};

export const sampleWithNewData: NewEmpleados = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
