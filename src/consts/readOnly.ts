import { cvToHex, cvToJSON, hexToCV, tupleCV, uintCV, listCV, principalCV } from '@stacks/transactions';
import { network } from './network';
import { argType, convertArgsReadOnly } from './converter';

const getRequestOptionsPostRequest = (argsClarity: any[], userAddress: string) => {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: userAddress,
      network: network,
      arguments: argsClarity,
    }),
  };
};

export const fetchReadOnlyModular = async (requestUrl: string, userAddress: string, args: any[]) => {
  // let convertedArgs = convertArgsReadOnly(args);
  const requestOptions = getRequestOptionsPostRequest(args, userAddress);
  
  let returnedData = await fetch(requestUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => cvToJSON(hexToCV(data.result)));
    // console.log(returnedData)
  return returnedData;
};

export const fetchReadOnlyList = async (requestUrl: string, userAddress: string, args: argType[]) => {
  let convertedArgs = args;
  const requestOptions = getRequestOptionsPostRequest(convertedArgs, userAddress);

  let returnedData = await fetch(requestUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => cvToJSON(hexToCV(data.result)));
  return returnedData;
};

export const fetchReadOnlySimple = async (requestUrl: string, userAddress: string, requestList: any) => {
  let convertedList: any = [];
  requestList.forEach((element: any) => {
    convertedList.push(principalCV(element));
  });

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: userAddress,
      //userSession.loadUserData().profile.stxAddress.devnet, // todo: check this
      network: network,
      arguments: [cvToHex(listCV(convertedList))],
    }),
  };

  let returnedData = await fetch(requestUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => cvToJSON(hexToCV(data.result)));
  return await returnedData;
};
