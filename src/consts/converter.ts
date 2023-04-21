import {
  broadcastTransaction,
  cvToHex,
  cvToJSON,
  hexToCV,
  listCV,
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
  return uintCV(number);
};

const convertStringToArgReadOnly = (str: string) => {
  return stringCV(str, 'ascii');
};

const convertPrincipalToArgReadOnly = (principal: string) => {
  return principalCV(principal);
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
    console.log(args)
    let convertedArgs: any[] = [];
    if (args.length > 0) {
        let convertArgsBefore: any;
        args.forEach((arg) => {
            console.log(cvToJSON(hexToCV(arg)))
            convertArgsBefore.push(cvToJSON(hexToCV(arg)))})
        convertArgsBefore.forEach((x: any) => {
    
            console.log(x)
            if (isPrincipal(x)) {
                convertedArgs.push(convertPrincipalToArgReadOnly(x));
            }
            else if (!isNaN(x)) {
                // number
                convertedArgs.push(convertIntToArgReadOnly(x));
            } 
            else convertedArgs.push(convertStringToArgReadOnly(x));
  });}
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
  let listArg: any[] = [];
  let convertedArg: any[] = [];
  
  result.list.forEach((x:any) => listArg.push(x));
  listArg.slice(0, 1).forEach((x:any) => convertedArg.push(x))
  
  return listCV(convertedArg);
};
