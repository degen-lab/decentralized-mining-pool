import {
  broadcastTransaction,
  cvToHex,
  cvToValue,
  cvToJSON,
  hexToCV,
  listCV,
  intCV,
  makeContractCall,
  PostConditionMode,
  standardPrincipalCV,
  stringAsciiCV,
  uintCV,
  ClarityValue,
} from '@stacks/transactions';
import { network } from './network';

import { stringCV } from '@stacks/transactions/dist/clarity/types/stringCV.js';
import { principalCV } from '@stacks/transactions/dist/clarity/types/principalCV.js';

// TODO: probably delete this
// // format: "{'keyA':'valueA', 'keyB':'valueB', keyC':'valueC'}",
// export const stringToMap = (text) => {
//   text = text.slice(1, -1);
//   let mapConverted = {};
//   text.split(',').forEach((keyValue) => {
//     const splitted = keyValue.split(':');
//     mapConverted[splitted[0].split("'")[1]] = splitted[1];
//   });
//   return mapConverted;
// };

export const convertIntToArg = (number: number) => {
  return uintCV(number);
};

export const convertCVToValue = (value: ClarityValue) => {
  return cvToValue(value);
};

export const convertStringToArg = (str: string) => {
  return stringCV(str, 'ascii');
};

export const convertPrincipalToArg = (principal: string) => {
  return principalCV(principal);
};

export const isPrincipal = (str: string) => {
  let secondChar = 'P';
  str = str.toString();
  if (network !== 'mainnet') secondChar = 'T';
  if (str.charAt(0) === 'S' && str.charAt(1) === secondChar && str.length >= 39 && str.length <= 41) {
    return true;
  }
  return false;
};

export const fromResultToList = (result: any, start: number, end: number) => {
  let listArg: any[] = [];
  let convertedArg: any[] = [];
  
  result.list.forEach((x:any) => listArg.push(x));
  listArg.slice(start, end).forEach((x:any) => convertedArg.push(x))
  
  return listCV(convertedArg);
};
