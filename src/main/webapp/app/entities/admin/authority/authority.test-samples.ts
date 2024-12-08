import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '707b00e8-297f-4a49-9a49-f513652cbaa5',
};

export const sampleWithPartialData: IAuthority = {
  name: 'ee14ea0b-16a5-45d8-a9ee-0c07c4060802',
};

export const sampleWithFullData: IAuthority = {
  name: '5d1e0507-9401-40b4-ad18-825a854814ca',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
