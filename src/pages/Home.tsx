import { useCallback, useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { StacksMocknet } from '@stacks/network';
import { postApiUrl } from '../consts/network';
import { network } from '../consts/network';
import { fetchReadOnlyModular, fetchReadOnlyList, fetchReadOnlySimple } from '../consts/readOnly';
import '../App.css';
import { contractMapping } from '../consts/contract';
import { fromResultToList } from '../consts/converter';

import {
  AnchorMode,
  standardPrincipalCV,
  PostConditionMode,
  callReadOnlyFunction,
  cvToString,
  listCV,
  hexToCV,
  ListCV,
  ClarityValue,
  cvToJSON,
} from '@stacks/transactions';
import { userSession } from '../components/ConnectWallet';
import useInterval from '@use-it/interval';

const ContractCallGm = () => {
  const { doContractCall } = useConnect();
  const [hasPosted, setHasPosted] = useState(false);

  function handleGm() {
    const userAddress = userSession.loadUserData().profile.stxAddress.testnet;
    doContractCall({
      network: new StacksMocknet(),
      anchorMode: AnchorMode.Any,
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'main-contract',
      functionName: 'ask-to-join',
      functionArgs: [standardPrincipalCV(userAddress)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log('onFinish:', data);
        setHasPosted(true);
        console.log('Explorer:', `localhost:8000/txid/${data.txId}?chain=testnet`);
      },
      onCancel: () => {
        console.log('onCancel:', 'Transaction was canceled');
      },
    });
  }

  if (!userSession.isUserSignedIn()) {
    return <h1>Log in</h1>;
  }

  return (
    <div>
      {!hasPosted && (
        <div>
          <h1 className="Vote">Ask to join</h1>
          <button className="Vote" onClick={() => handleGm()}>
            Join
          </button>
        </div>
      )}
      {hasPosted && (
        <div>
          <h1>{userSession.loadUserData().profile.stxAddress.testnet} asked to join!</h1>
        </div>
      )}
    </div>
  );
};

export const GetWaitingMinersDetails = async () => {
  const newResultList: ClarityValue[] = [];

  if (userSession.isUserSignedIn()) {
    const userAddress =
      network == 'mainnet'
        ? userSession.loadUserData().profile.stxAddress.mainnet
        : userSession.loadUserData().profile.stxAddress.testnet;
    const waitingList = {
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'main-contract',
      functionName: 'get-waiting-list',
      network: new StacksMocknet(),
      functionArgs: [],
      senderAddress: userAddress,
    };

    const fullWaitingList: ClarityValue = await callReadOnlyFunction(waitingList);
    const step = 1;

    for (
      let currentIndex = 0;
      currentIndex < (fullWaitingList as ListCV).list.length;
      currentIndex = currentIndex + step
    ) {
      const newWaitingList = fromResultToList(fullWaitingList, currentIndex, currentIndex + step);
      const waitingListDetailed = {
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'main-contract',
        functionName: 'get-all-data-waiting-miners',
        network: new StacksMocknet(),
        functionArgs: [newWaitingList],
        senderAddress: userAddress,
      };

      const newResult = await callReadOnlyFunction(waitingListDetailed);

      if (newResult) {
        newResultList.push(cvToJSON(newResult));
      }
    }
    return newResultList;
  }
};

export default ContractCallGm;
