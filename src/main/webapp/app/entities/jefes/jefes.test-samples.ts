import { IJefes, NewJefes } from './jefes.model';

export const sampleWithRequiredData: IJefes = {
  id: 3628,
};

export const sampleWithPartialData: IJefes = {
  id: 9303,
  nombre: 'miserably beside duffel',
  telefono: 'youthfully',
};

export const sampleWithFullData: IJefes = {
  id: 5195,
  nombre: 'ick',
  telefono: 'designation cutlet',
};

export const sampleWithNewData: NewJefes = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
