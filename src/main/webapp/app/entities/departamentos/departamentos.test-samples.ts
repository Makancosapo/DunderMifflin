import { IDepartamentos, NewDepartamentos } from './departamentos.model';

export const sampleWithRequiredData: IDepartamentos = {
  id: 24058,
};

export const sampleWithPartialData: IDepartamentos = {
  id: 514,
  ubicacion: 'nor',
  presupuesto: 2630.2,
};

export const sampleWithFullData: IDepartamentos = {
  id: 1717,
  nombre: 'categorise rightfully fortunately',
  ubicacion: 'tensely firsthand',
  presupuesto: 13685.59,
};

export const sampleWithNewData: NewDepartamentos = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
