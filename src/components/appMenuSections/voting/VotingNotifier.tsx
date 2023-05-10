import colors from '../../../consts/colorPallete';
import useCurrentTheme from '../../../consts/theme';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  readOnlyGetAllDataNotifierVoterMiners,
  readOnlyGetNotifier,
  readOnlyGetNotifierElectionProcessData,
} from '../../../consts/readOnly';
import { useAppSelector } from '../../../redux/store';
import { selectUserSessionState } from '../../../redux/reducers/user-state';
import { ContractStartVoteNotifier } from '../../../consts/smartContractFunctions';
import { principalCV, listCV } from '@stacks/transactions';

const VotingNotifier = () => {
  const { currentTheme } = useCurrentTheme();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [electionBlocksRemaining, setElectionBlocksRemaining] = useState<number | null>(null);
  const [currentNotifier, setCurrentNotifier] = useState<string | null>(null);
  const [notifierVoteStatus, setNotifierVoteStatus] = useState<any>(null);
  const [votedNotifier, setVotedNotifier] = useState<any>(null);
  const userSession = useAppSelector(selectUserSessionState);

  useEffect(() => {
    const getCurrentNotifier = async () => {
      const notifier = await readOnlyGetNotifier();
      setCurrentNotifier(notifier);
    };

    getCurrentNotifier();
  }, [currentNotifier]);

  useEffect(() => {
    const getNotifierStatus = async () => {
      const notifier = await readOnlyGetNotifierElectionProcessData();
      console.log('notifier', notifier);
      //if notifierVoteStatus === true => vote ongoing; else => election not started yet
      setNotifierVoteStatus(notifier['vote-status'].value);
      setElectionBlocksRemaining(notifier['election-blocks-remaining'].value);
    };
    getNotifierStatus();
  }, [notifierVoteStatus, electionBlocksRemaining]);

  useEffect(() => {
    const args = userSession.loadUserData().profile.stxAddress.testnet;
    setUserAddress(args);
  }, [userAddress]);

  useEffect(() => {
    const getVotedNotifier = async () => {
      if (userAddress !== null) {
        const voteResult = await readOnlyGetAllDataNotifierVoterMiners(listCV([principalCV(userAddress)]));

        setVotedNotifier(voteResult);
      }
    };
    getVotedNotifier();
  }, [votedNotifier, userAddress]);
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: colors[currentTheme].accent2,
        color: colors[currentTheme].secondary,
        marginTop: -2.5,
      }}
    >
      <div>
        <h2>Voting - Notifier</h2>
        <ul>
          <li>
            who I voted for:{' '}
            {votedNotifier !== null ? (votedNotifier === '133' ? "you haven't voted yet" : votedNotifier) : ''}
          </li>
          <li>number of blocks remaining to vote: {electionBlocksRemaining !== null && electionBlocksRemaining}</li>
          <li>
            the elected notifier if the vote ended:{' '}
            {notifierVoteStatus
              ? 'the vote is still open, no notifier to show yet'
              : currentNotifier !== null
              ? currentNotifier
              : '-'}
          </li>
          <li>
            <Button
              variant="contained"
              className="minerProfileButtons"
              onClick={() => {
                ContractStartVoteNotifier();
              }}
            >
              button to start notifier vote
            </Button>
          </li>
        </ul>
        <div>some table here</div>
      </div>
    </Box>
  );
};

export default VotingNotifier;
