import { useCallback, useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { StacksMocknet } from '@stacks/network';
import '../App.css';

import { AnchorMode, standardPrincipalCV, PostConditionMode } from '@stacks/transactions';
// import { userSession } from '../components/ConnectWallet';
import useInterval from '@use-it/interval';
import { useAppSelector } from '../redux/store';
import { selectUsereSessionState } from '../redux/reducers/user-state';

const ContractCallGm = () => {
  const { doContractCall } = useConnect();
  const [hasPosted, setHasPosted] = useState(false);

  const userSession = useAppSelector(selectUsereSessionState);

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

  const getWaitingList = useCallback(async () => {
    if (userSession.isUserSignedIn()) {
      const userAddress = userSession.loadUserData().profile.stxAddress.testnet;
      const options = {
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'main-contract',
        functionName: 'get-waiting-list',
        network: new StacksMocknet(),
        functionArgs: [],
        senderAddress: userAddress,
      };

      console.log('Waiting list:');
    }
  }, []);

  const getMinersList = useCallback(async () => {
    if (userSession.isUserSignedIn()) {
      const userAddress = userSession.loadUserData().profile.stxAddress.testnet;
      const options = {
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'main-contract',
        functionName: 'get-miners-list',
        network: new StacksMocknet(),
        functionArgs: [],
        senderAddress: userAddress,
      };
      console.log('Miners List: ');
    }
  }, []);

  useEffect(() => {
    getWaitingList();
  }, [userSession.isUserSignedIn()]);

  useEffect(() => {
    getMinersList();
  }, [userSession.isUserSignedIn()]);

  useInterval(getWaitingList, 10000);
  useInterval(getMinersList, 10000);

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

export default ContractCallGm;
