import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 12973,
  login: 'wx',
};

export const sampleWithPartialData: IUser = {
  id: 25776,
  login: 'kB7',
};

export const sampleWithFullData: IUser = {
  id: 30281,
  login: '!E+Jj@e',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
