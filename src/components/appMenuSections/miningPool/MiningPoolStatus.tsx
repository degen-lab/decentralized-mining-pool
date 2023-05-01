import { useEffect, useState } from "react";
import { readOnlyGetCurrentBlock, readOnlyGetNotifierElectionProcessData } from "../../../consts/readOnly";

const MiningPoolStatus = () => {
  const [currentBlock, setCurrentBlock] = useState<number>()
  const [notifierStatus, setNotifierStatus] = useState<any>()

  useEffect(() => {
    const getNotifierStatus = async () => {
      const notifier = await readOnlyGetNotifierElectionProcessData();
      setNotifierStatus(notifier)
    };
    getNotifierStatus();
  }, [setNotifierStatus]);
  
  useEffect(() => {
    const getCurrentBlock = async () => {
      const block = await readOnlyGetCurrentBlock();
      setCurrentBlock(block);
    };
    getCurrentBlock();
  }, [setCurrentBlock]);

  return (
    <div>
      <h2>Mining Pool - Status</h2>
      <ul>
        <li>current notifier</li>
        <li>current miners</li>
        <li>stacks rewards</li>
        <li>ongoing block: {currentBlock}</li>
        <li>notifier voting status: {notifierStatus['vote-status'].value ? "Vote ongoing!" : "Elections haven't started yet!"}</li>
        <li>election remaining blocks: {notifierStatus['election-blocks-remaining'].value}</li>
      </ul>
    </div>
  );
};

export default MiningPoolStatus;
