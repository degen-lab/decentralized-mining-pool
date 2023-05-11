import { StacksMocknet, StacksMainnet, StacksTestnet } from '@stacks/network';
import { network } from './network';
import { contractMapping } from './contract';
import { callReadOnlyFunction, ClarityValue, ListCV, listCV, cvToJSON } from '@stacks/transactions';
import { convertPrincipalToArg, convertPrincipalToList, fromResultToList, convertCVToValue } from './converter';
import { userSession } from '../redux/reducers/user-state';

const contractNetwork =
  network === 'mainnet' ? new StacksMainnet() : network === 'testnet' ? new StacksTestnet() : new StacksMocknet();

const ReadOnlyFunctions = async (function_args: ClarityValue[], contractFunctionName: string) => {
  const userAddress =
    network === 'mainnet'
      ? userSession.loadUserData().profile.stxAddress.mainnet
      : userSession.isUserSignedIn()
      ? userSession.loadUserData().profile.stxAddress.testnet
      : contractMapping[network].owner;

  const readOnlyResults = {
    contractAddress: contractMapping[network].contractAddress,
    contractName: contractMapping[network].contractName,
    functionName: contractFunctionName,
    network: contractNetwork,
    functionArgs: function_args,
    senderAddress: userAddress,
  };

  return callReadOnlyFunction(readOnlyResults);
};

// get-address-status
// args: (address principal)
// what does it do: It returns the formatted status of the given address
// return: 'Miner', 'Waiting', 'Pending', or 'Not Asked to Join'

export const readOnlyAddressStatus = async (args: string) => {
  // const isUserLogged = userSession.isUserSignedIn() ? 'yes' : 'no';
  const statusArgs = convertPrincipalToArg(args);

  const status = await ReadOnlyFunctions([statusArgs], 'get-address-status');
  // isUserLogged === 'yes'
  //   ? await ReadOnlyFunctions([statusArgs], 'get-address-status')
  //   : { value: { data: 'is-none' } };

  const statusInfo = (status as any).value.data;
  return statusInfo === 'is-miner'
    ? 'Miner'
    : statusInfo === 'is-waiting'
    ? 'Waiting'
    : statusInfo === 'is-pending'
    ? 'Pending'
    : 'NormalUser';
};

// get-all-data-waiting-miners
// args: (waiting-miners-list (list 100 principal))
// what does it do: it returns the details for every miner in the waiting list passed as argument
// return: address, positive votes and threshold, negative votes and threshold, was blacklisted

export const ReadOnlyAllDataWaitingMiners = async (fullWaitingList: ClarityValue) => {
  const newResultList: ClarityValue[] = [];
  const newAddressList: ClarityValue[] = [];
  const step = 1;

  for (
    let currentIndex = 0;
    currentIndex < (fullWaitingList as ListCV).list.length;
    currentIndex = currentIndex + step
  ) {
    const newWaitingList = fromResultToList(fullWaitingList, currentIndex, currentIndex + step);
    const newResult = await ReadOnlyFunctions([newWaitingList], 'get-all-data-waiting-miners');

    if (newResult) {
      newAddressList.push(newWaitingList);
      newResultList.push(newResult);
    }
  }
  return { newResultList, newAddressList };
};

// get-proposed-removal-list
// args: none
// what does it do: returns a list of miners that are proposed for removal
// return: proposed for removal miners list

export const ReadOnlyGetProposedRemovalList = async () => {
  const removalList: ClarityValue = await ReadOnlyFunctions([], 'get-proposed-removal-list');
  return removalList;
};

// get-all-data-miners-proposed-for-removal
// args: (removal-miners-list (list 100 principal))
// what does it do: it returns the details for every miner in the list for miners proposed for removal, passed as argument
// return: address, positive votes and threshold, negative votes and threshold

export const ReadOnlyAllDataProposedRemovalMiners = async () => {
  const newResultList: ClarityValue[] = [];
  const newAddressList: ClarityValue[] = [];
  const fullRemovalsList: ClarityValue = await ReadOnlyGetProposedRemovalList();
  const step = 1;

  for (
    let currentIndex = 0;
    currentIndex < (fullRemovalsList as ListCV).list.length;
    currentIndex = currentIndex + step
  ) {
    const newRemovalsList = fromResultToList(fullRemovalsList, currentIndex, currentIndex + step);
    const newResult = await ReadOnlyFunctions([newRemovalsList], 'get-all-data-miners-proposed-for-removal');

    if (newResult) {
      newAddressList.push(cvToJSON(newRemovalsList));
      newResultList.push(cvToJSON(newResult));
    }
  }
  return { newResultList, newAddressList };
};

// get-all-data-miners-pending-accept
// args: (pending-miners-list (list 100 principal))
// what does it do: it returns the details for every miner that is in the pending list (given as arg)
// return: address, remaining blocks until join
export const readOnlyGetAllDataMinersPendingAccept = async () => {
  const newResultList: ClarityValue[] = [];
  const fullPendingList: ClarityValue = await readOnlyGetPendingAcceptList();
  const step = 1;

  for (
    let currentIndex = 0;
    currentIndex < (fullPendingList as ListCV).list.length;
    currentIndex = currentIndex + step
  ) {
    const newWaitingList = fromResultToList(fullPendingList, currentIndex, currentIndex + step);
    const newResult = await ReadOnlyFunctions([newWaitingList], 'get-all-data-miners-pending-accept');

    if (newResult) {
      newResultList.push(cvToJSON(newResult));
    }
  }
  return newResultList;
};

// get-all-data-miners-in-pool
// args: (local-miners-list (list 100 principal))
// what does it do: it returns the details for every miner from arg list
// return: address, blocks as miner, was blacklisted, warnings, balance, total withdrawals
export const readOnlyGetAllDataMinersInPool = async (address: string) => {
  const convertedArgs = [convertPrincipalToList(address)];
  const minerData = await ReadOnlyFunctions(convertedArgs, 'get-all-data-miners-in-pool');
  const withdraws = await readOnlyGetAllTotalWithdrawals(address);

  if (cvToJSON(minerData).value[0].value.value === '104') {
    return 'not-a-miner';
  }

  if (cvToJSON(minerData).value[0].value.value === '132') {
    return 'block-height-error';
  }

  const totalWithdraw = Number(withdraws);
  const balance = Number(cvToJSON(minerData).value[0].value.value.balance.value);
  const minerBlocks = Number(cvToJSON(minerData).value[0].value.value['blocks-as-miner'].value);
  const warnings = Number(cvToJSON(minerData).value[0].value.value.warnings.value);
  const wasBlacklisted = cvToJSON(minerData).value[0].value.value['was-blacklist'].value;

  return { address, totalWithdraw, balance, minerBlocks, warnings, wasBlacklisted };
};

// get-remaining-blocks-until-join
// args: none
// what does it do: Gets the number of blocks left until a miner can accept the users that are in pending list
// return: Remaining blocks, number
export const readOnlyGetRemainingBlocksJoin = async () => {
  const blocksLeft = await ReadOnlyFunctions([], 'get-remaining-blocks-until-join');
  return Number(convertCVToValue(blocksLeft));
};

// get-data-notifier-election-process
// args: none
// what does it do: returns notifier voting status and the blocks remaining until the end
// return: vote status of the notifier, election blocks remaining
export const readOnlyGetNotifierElectionProcessData = async () => {
  const notifierData = await ReadOnlyFunctions([], 'get-data-notifier-election-process');
  return cvToJSON(notifierData).value;
};

// get-all-data-notifier-voter-miners
// args: (voter-miners-list (list 100 principal))
// what does it do: returns the miner and which notifier it voted for each miner
// return: address, notifier which the users in arg list voted for
export const readOnlyGetAllDataNotifierVoterMiners = async (voterMinersList: ClarityValue) => {
  const votedNotifier = await ReadOnlyFunctions([voterMinersList], 'get-all-data-notifier-voter-miners');
  return cvToJSON(votedNotifier).value[0].value.value === '133'
    ? "you haven't voted yet"
    : cvToJSON(votedNotifier).value[0].value.value['voted-notifier'].value;
};

// was-block-claimed
// args: (given-block-height uint)
// what does it do: true/false if rewards on the block were claimed
// return: true or false
export const readOnlyClaimedBlockStatus = async (blockHeight: any) => {
  const test = await ReadOnlyFunctions([], 'was-block-claimed');
  console.log('TEST', test);
};

// get-all-data-balance-miners
// args: (local-miners-list (list 100 principal))
// what does it do: returns the stx balance for every miner in the arg list
// return: address, balance for the address
export const readOnlyGetMinersBalanceData = async (localMinersList: any) => {
  const test = await ReadOnlyFunctions([], 'get-all-data-balance-miners');
  console.log('TEST', test);
};

// get-balance
// args: (address principal)
// what does it do: returns balance for given address
// return: balance
export const readOnlyGetBalance = async (principalAddress: string) => {
  const balanceArgs = convertPrincipalToList(principalAddress);
  const balance = await ReadOnlyFunctions([balanceArgs], 'get-balance');
  return Number(convertCVToValue(balance).value);
};

// get-principals-list
// args: (address principal)
// what does it do: ?
// return: ?
export const readOnlyGetPrincipalsList = async (principalAddress: any) => {
  const test = await ReadOnlyFunctions([], 'get-principals-list');
  console.log('TEST', test);
};

// get-k
// args: none
// what does it do: threshold for notifier votes
// return: number
export const readOnlyGetK = async () => {
  const k = await ReadOnlyFunctions([], 'get-k');
  return Number(cvToJSON(k).value);
};

// get-notifier
// args: none
// what does it do: returns the current notifier
// return: address
export const readOnlyGetNotifier = async () => {
  const currentNotifier = await ReadOnlyFunctions([], 'get-notifier');
  return cvToJSON(currentNotifier).value;
};

// get-waiting-list
// args: none
// what does it do: returns a list of miners that are in waiting list
// return: waiting miners list
export const ReadOnlyGetWaitingList = async () => {
  const waitingList: ClarityValue = await ReadOnlyFunctions([], 'get-waiting-list');
  return waitingList;
};

// get-miners-list
// args: none
// what does it do: returns a list of miners that are in pool
// return: miners in pool list
export const ReadOnlyGetMinersList = async () => {
  const minersList = cvToJSON(await ReadOnlyFunctions([], 'get-miners-list'));
  return minersList;
};

// get-pending-accept-list
// args: none
// what does it do: returns the list of users that are pending
// return: list
export const readOnlyGetPendingAcceptList = async () => {
  const pendingAccept = await ReadOnlyFunctions([], 'get-pending-accept-list');
  return pendingAccept;
};

// get-notifier-vote-number
// args: (voted-notifier principal)
// what does it do: get the votes for a given notifier
// return: votes, number
export const readOnlyGetNotifierVoteNumber = async (address: string) => {
  const principal = [convertPrincipalToArg(address)];
  const votes = await ReadOnlyFunctions(principal, 'get-notifier-vote-number');
  return cvToJSON(votes).value === null ? 0 : Number(cvToJSON(votes).value.value);
};

// get-max-voted-notifier
// args: none
// what does it do: get the notifier with the most votes
// return: address
export const readOnlyGetNotifierMaxVoted = async () => {
  const mostVotedNotifierAddress = await ReadOnlyFunctions([], 'get-max-voted-notifier');
  console.log('TEST most voted notifier address', mostVotedNotifierAddress);
  return mostVotedNotifierAddress;
};

// get-max-votes-notifier
// args: none
// what does it do: get the votes of the most voted notifier
// return: votes, number
export const readOnlyGetMaxVotesNotifier = async () => {
  const maxVotesNotifier = await ReadOnlyFunctions([], 'get-max-votes-notifier');
  console.log('TEST max votes for notifier - returning votes and number', maxVotesNotifier);
  return maxVotesNotifier;
};

// get-notifier-vote-status
// args: none
// what does it do: get if the notifier election process has started
// return: false or true, boolean
export const readOnlyGetNotifierVoteStatus = async () => {
  const notifierVoteStatus = await ReadOnlyFunctions([], 'get-notifier-vote-status');
  console.log('TEST - get notifier vote status', notifierVoteStatus);
  return notifierVoteStatus;
};

// get-current-block
// args: none
// what does it do: get the current block height of the Stacks blockchain
// returns: current block
export const readOnlyGetCurrentBlock = async () => {
  const currentBlock = await ReadOnlyFunctions([], 'get-current-block');
  return cvToJSON(currentBlock).value.value;
};

//exchange toggle for miners
//get-auto-exchange
//done by Alexis with Suciu

export const readOnlyExchangeToggle = async (args: string) => {
  const exchangeArgs = convertPrincipalToArg(args);
  const exchange = await ReadOnlyFunctions([exchangeArgs], 'get-auto-exchange');

  return cvToJSON(exchange).value === null ? cvToJSON(exchange).value : cvToJSON(exchange).value.value.value.value;
};

//number of blocks won
//get-blocks-won
export const readOnlyGetBlocksWon = async () => {
  const wonBlocks = await ReadOnlyFunctions([], 'get-blocks-won');
  return cvToJSON(wonBlocks).value;
};

//stacks rewards
//get-total-rewards-distributed
export const readOnlyGetStacksRewards = async () => {
  const stacksRewards = await ReadOnlyFunctions([], 'get-total-rewards-distributed');
  return cvToJSON(stacksRewards).value;
};

// get-all-data-total-withdrawals
// args: list of addresses
// what does it do: gets how much each address in the list has withdrawn from the sc
// returns: number, amount

export const readOnlyGetAllTotalWithdrawals = async (address: string) => {
  const convertedArgs: ClarityValue = listCV([convertPrincipalToArg(address)]);
  const totalWithdrawals = await ReadOnlyFunctions([convertedArgs], 'get-all-data-total-withdrawals');

  return cvToJSON(totalWithdrawals).value[0].value.value;
};
