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

  const [result, setResult] = useState<any>();

  const getWaitingList = useCallback(async () => {
    if (userSession.isUserSignedIn()) {
      const userAddress =
        network == 'mainnet'
          ? userSession.loadUserData().profile.stxAddress.mainnet
          : userSession.loadUserData().profile.stxAddress.testnet;
      let newResult = await fetchReadOnlyModular(
        postApiUrl[network](
          contractMapping[network].contractAddress,
          contractMapping[network].contractName,
          contractMapping[network].getWaitingList
        ),
        userAddress,
        []
      );
      let listArg = fromResultToList(newResult);

      let newResult2 = await fetchReadOnlySimple(
        postApiUrl[network](
          contractMapping[network].contractAddress,
          contractMapping[network].contractName,
          contractMapping[network].getAllDataWaitingMiners
        ),
        userAddress,
        listArg
      );

      // const newResult = await callReadOnlyFunction(options);
      setResult(newResult);
    }
  }, [result]);

  console.log(result);
  // fromResultToList(result);

  // const getAllDataWaitingMiners = useCallback(async () => {
  //   if (userSession.isUserSignedIn()) {
  //     const userAddress =
  //       network == 'mainnet'
  //         ? userSession.loadUserData().profile.stxAddress.mainnet
  //         : userSession.loadUserData().profile.stxAddress.testnet;
  //     let newResult = await fetchReadOnlySimple(
  //       postApiUrl[network](
  //         contractMapping[network].contractAddress,
  //         contractMapping[network].contractName,
  //         contractMapping[network].getAllDataWaitingMiners
  //       ),
  //       userAddress,
  //       [result]
  //     );
  //     console.log('Waiting list:');
  //     console.log(newResult);
  //   }
  // }, []);

  useEffect(() => {
    getWaitingList();
  }, [userSession.isUserSignedIn()]);

  // useEffect(() => {
  //   getAllDataWaitingMiners();
  // }, [userSession.isUserSignedIn()]);

  useInterval(getWaitingList, 10000);
  // useInterval(getAllDataWaitingMiners, 10000);

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
