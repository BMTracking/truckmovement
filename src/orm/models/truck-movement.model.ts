'use strict'

export const POUZZONLANE_BLACK = 2;
export const POUZZONLANE_RED = 1;

export const TYPES = [POUZZONLANE_BLACK, POUZZONLANE_RED];

export const ORANGE_MONEY = 1;
export const MTN_MONEY = 2;
export const MOBILE_MOONEY = [ORANGE_MONEY, MTN_MONEY];

export const WEIGHT_UNIT = 'TONE';

/**
 * TruckMovementModel
 */
export default interface TruckMovementModel{
  id?: number;
  registration: string;
  type:number;
  mobilemoney_type:number;
  mobilemoney_id:string;
  amount:number;
  weight:number;
  date_in: Date;
  time_in: Date;
  date_out: Date;
  time_out: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}