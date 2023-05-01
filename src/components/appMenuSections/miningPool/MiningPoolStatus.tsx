import { useEffect, useState } from "react";
import { readOnlyGetCurrentBlock, readOnlyGetNotifierElectionProcessData } from "../../../consts/readOnly";

const MiningPoolStatus = () => {
  const [currentBlock, setCurrentBlock] = useState<number>()
  const [notifierVoteStatus, setNotifierVoteStatus] = useState<any>()
  const [electionBlocksRemaining, setElectionBlocksRemaining] = useState<any>()

  useEffect(() => {
    const getNotifierStatus = async () => {
      const notifier = await readOnlyGetNotifierElectionProcessData();
      setNotifierVoteStatus(notifier['vote-status'].value ? "Vote ongoing!" : "Elections haven't started yet!")
      setElectionBlocksRemaining(notifier['election-blocks-remaining'].value)
    };
    getNotifierStatus();
  }, [setNotifierVoteStatus, setElectionBlocksRemaining],);
  
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
        <li>notifier voting status: {notifierVoteStatus}</li>
        <li>election remaining blocks: {electionBlocksRemaining}</li>
      </ul>
    </div>
  );
};

export default MiningPoolStatus;
