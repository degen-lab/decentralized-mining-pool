import { networkType } from './network';

type ContractMapping = Record<
  networkType,
  {
    contractAddress: string;
    contractName: string;
    owner: string;
    askToJoin: string;
    getAllDataWaitingMiners: string;
    votePositiveJoin: string;
    voteNegativeJoin: string;
    getWaitingList: string;
    getMinersList: string;
  }
>;

export const contractMapping: ContractMapping = {
  mainnet: {
    contractAddress: '', // TODO: complete when deployed
    contractName: '', // TODO: complete when deployed
    owner: '', // TODO: complete when deployed
    askToJoin: 'ask-to-join',
    getAllDataWaitingMiners: 'get-all-data-waiting-miners',
    votePositiveJoin: 'vote-positive-join-request',
    voteNegativeJoin: 'vote-negative-join-request',
    getWaitingList: 'get-waiting-list',
    getMinersList: 'get-miners-list',
  },
  testnet: {
    contractAddress: '', // TODO: complete when deployed
    contractName: '', // TODO: complete when deployed
    owner: '', // TODO: complete when deployed
    askToJoin: 'ask-to-join',
    getAllDataWaitingMiners: 'get-all-data-waiting-miners',
    votePositiveJoin: 'vote-positive-join-request',
    voteNegativeJoin: 'vote-negative-join-request',
    getWaitingList: 'get-waiting-list',
    getMinersList: 'get-miners-list',
  },
  devnet: {
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'main-contract',
    owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    askToJoin: 'ask-to-join',
    getAllDataWaitingMiners: 'get-all-data-waiting-miners',
    votePositiveJoin: 'vote-positive-join-request',
    voteNegativeJoin: 'vote-negative-join-request',
    getWaitingList: 'get-waiting-list',
    getMinersList: 'get-miners-list',
  },
};
