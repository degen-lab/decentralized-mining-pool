import { StacksMocknet, StacksMainnet, StacksTestnet } from '@stacks/network';
import { network, transactionUrl } from './network';
import { contractMapping } from './contract';
import { openContractCall } from '@stacks/connect';
import {
  AnchorMode,
  PostConditionMode,
} from '@stacks/transactions';
import { convertPrincipalToArg } from './converter';

const contractNetwork = network === 'mainnet' ? new StacksMainnet() : (network === 'testnet' ? new StacksTestnet() : new StacksMocknet())

const CallFunctions = (function_args: any, contractFunctionName: string) => {  
    const options = {
      network: contractNetwork,
      anchorMode: AnchorMode.Any,
      contractAddress: contractMapping[network].contractAddress,
      contractName: contractMapping[network].contractName,
      functionName: contractFunctionName,
      functionArgs: function_args,
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data: any) => {
        console.log(transactionUrl[network](data.txId).explorerUrl);
        console.log(transactionUrl[network](data.txId).apiUrl)
      },
      onCancel: () => {
        console.log('onCancel:', 'Transaction was canceled');
      },
    };
    openContractCall(options)
};

// function vote-accept-waiting() {
// convert_address_to_CV
// general_modular_call(contract_address, contract_name, function_name, [user_address])
// }


// add-pending-miners-to-pool
// and
// try-enter







// vote-positive-join-request
// args: (miner-to-vote principal)
// what does it do: When an user asks to join, they will be placed in a waiting list. With this function, you can vote for him to
//                  join the miners list.

export const ContractVotePositiveJoin = (args: any) => {
  const convertedArgs = [convertPrincipalToArg(args)];
  CallFunctions(convertedArgs, 'vote-positive-join-request')
}

// vote-negative-join-request
// args: (miner-to-vote principal)
// what does it do: When an user asks to join, they will be placed in a waiting list. With this function, you can vote against him
//                  joining the miners list.

export const ContractVoteNegativeJoin = (args: any) => {
  const convertedArgs = [convertPrincipalToArg(args)];
  CallFunctions(convertedArgs, 'vote-negative-join-request')
}

// try-enter-pool
// args: none
// what does it do: It tries moving the user that called the function from waiting to pending list
//                  (the user needs to pass the positive votes threshold)

export const ContractTryEnterPool = () => {
  CallFunctions([], 'try-enter-pool')
}

// ask-to-join
// args: (btc-address principal)
// what does it do: This function adds the user passed as argument to the waiting list

export const ContractAskToJoin = (args: any) => {
  const convertedArgs = [convertPrincipalToArg(args)];
  CallFunctions(convertedArgs, 'ask-to-join')
}

// deposit-stx (amount uint)
// args: 
// what does it do:
//
// withdraw-stx (amount uint)
// args: 
// what does it do:
//
// reward-distribution (block-number uint)
// args: 
// what does it do: distributes rewards for a given block

// add-pending-miners-to-pool
// args: none
// what does it do: It adds all the pending miners from pending list to pool

export const ContractAddPending = () => {
  CallFunctions([], 'add-pending-miners-to-pool')
}

// leave-pool
// args: 
// what does it do:
//
// propose-removal
// args: (miner-to-remove principal)
// what does it do: propose a miner to be removed from the pool

export const ContractProposeRemoval = (args: any) => {
  const convertedArgs = [convertPrincipalToArg(args)];
  CallFunctions(convertedArgs, 'propose-removal')
}

// vote-positive-remove-request (miner-to-vote principal)
// args: 
// what does it do:
//
// vote-negative-remove-request (miner-to-vote principal)
// args: 
// what does it do:
//
// start-vote-notifier
// args: 
// what does it do:
//
// end-vote-notifier
// args: 
// what does it do:
//
// vote-notifier (voted-notifier principal)
// args: 
// what does it do:
//
// warn-miner (miner principal)
// args: 
// what does it do: