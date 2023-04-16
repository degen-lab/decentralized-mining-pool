import {
  broadcastTransaction,
  cvToHex,
  cvToJSON,
  hexToCV,
  intCV,
  makeContractCall,
  PostConditionMode,
  standardPrincipalCV,
  stringAsciiCV,
  uintCV,
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

const convertIntToArgReadOnly = (number: number) => {
  return cvToHex(uintCV(number));
};

const convertStringToArgReadOnly = (str: string) => {
  return cvToHex(stringCV(str, 'ascii'));
};

const convertPrincipalToArgReadOnly = (principal: string) => {
  return cvToHex(principalCV(principal));
};

const isPrincipal = (str: string) => {
  let secondChar = 'P';
  str = str.toString();
  if (network !== 'mainnet') secondChar = 'T';
  if (str.charAt(0) === 'S' && str.charAt(1) === secondChar && str.length >= 39 && str.length <= 41) {
    return true;
  }
  return false;
};

type addressType = string;
export type argType = number | string | addressType;

export const convertArgsReadOnly = (args: any[]) => {
  let convertedArgs: argType[] = [];
  args.forEach((x) => {
    if (!isNaN(x)) {
      // number
      convertedArgs.push(convertIntToArgReadOnly(x));
    } else if (isPrincipal(x)) {
      convertedArgs.push(convertPrincipalToArgReadOnly(x));
    } else convertedArgs.push(convertStringToArgReadOnly(x));
  });
  return convertedArgs;
};

// type argSCCallType = UIntCV | StandardPrincipalCV | StringAsciiCV;

export const convertArgsSCCall = (args: any[]) => {
  let convArgs: any[] = [];
  args.forEach((arg) => {
    if (!isNaN(arg)) {
      // number
      convArgs.push(uintCV(arg));
      // console.log('is number: ' + arg);
    } else if (isPrincipal(arg)) {
      // console.log('is principal ' + arg);
      convArgs.push(standardPrincipalCV(arg));
    } else {
      // console.log('is string ' + arg);
      convArgs.push(stringAsciiCV(arg));
    }
  });
  return convArgs;
};

export const fromResultToList = (result: any) => {
  // console.log(result.value);
  let listArg: any[] = [];
  result.value.forEach((x:any) => listArg.push(x.value));
  return listArg;
};
