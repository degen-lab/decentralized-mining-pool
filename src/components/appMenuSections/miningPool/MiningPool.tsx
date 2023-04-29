import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import useCurrentTheme from '../../../consts/theme';
import colors from '../../../consts/colorPallete';
import { useEffect, useState } from 'react';
import {
  ContractVotePositiveJoin,
  ContractVoteNegativeJoin,
  ContractTryEnterPool,
  ContractAddPending,
  ContractProposeRemoval,
} from '../../../consts/smartContractFunctions';
import { readOnlyAddressStatus, readOnlyGetRemainingBlocksJoin } from '../../../consts/readOnly';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import Button from '@mui/material/Button';
import TableCreation from '../../../components/TableCreation';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import InfoIcon from '@mui/icons-material/Info';
import {
  WaitingData,
  waitingColumns,
  GetWaitingRows,
  GetMinersRows,
  minerColumns,
  MinersData,
  RemovalsData,
  removalsColumns,
  GetRemovalsRows,
} from '../../../consts/tableData';
import { userSession } from '../../../redux/reducers/user-state';

const MiningPool = () => {
  const { currentTheme } = useCurrentTheme();
  const [finalStatus, setFinalStatus] = useState<string>();
  const [blocksLeftUntilJoin, setBlocksLeftUntilJoin] = useState<number>();
  const waitingRows = GetWaitingRows();
  const minersRows = GetMinersRows();
  // will add later, after read_length too big is solved
  // const removalRows = GetRemovalsRows();

  useEffect(() => {
    const fetchStatus = async () => {
      const args = userSession.loadUserData().profile.stxAddress.testnet;
      const status = await readOnlyAddressStatus(args);
      setFinalStatus(status);
    };
    fetchStatus();
  }, [setFinalStatus]);

  useEffect(() => {
    const fetchBlocksLeft = async () => {
      const blocksLeft = await readOnlyGetRemainingBlocksJoin();
      setBlocksLeftUntilJoin(blocksLeft);
    };
    fetchBlocksLeft();
  }, [setBlocksLeftUntilJoin]);

  const tryEnterPool = () => {
    ContractTryEnterPool();
  };

  const addPendingToPool = () => {
    ContractAddPending();
  };

  const handlePendingVoteButtonClick = (data: string, address: string) => {
    if (data === 'voteYes') {
      ContractVotePositiveJoin(address);
    } else if (data === 'voteNo') {
      ContractVoteNegativeJoin(address);
    }
  };

  const handleMinerRemoveButtonClick = (address: string) => {
    ContractProposeRemoval(address);
  };

  const handleMinerInfoButtonClick = (address: string) => {
    ContractVotePositiveJoin(address);
  };

  const waitingRowContent = (_index: number, waitingRow: WaitingData) => {
    return (
      <React.Fragment>
        {waitingColumns.map((column) => (
          <TableCell
            key={column.dataKey}
            align={column.dataKey === 'address' ? 'left' : 'right'}
            sx={{
              color: colors[currentTheme].secondary,
            }}
          >
            {column.dataKey === 'vote' ? (
              <Box>
                <Button>
                  <ThumbUpAltIcon
                    fontSize="small"
                    sx={{ color: 'green' }}
                    onClick={() => handlePendingVoteButtonClick('voteYes', waitingRow['address'])}
                  />
                </Button>
                <Button style={{ marginRight: -52 }}>
                  <ThumbDownAltIcon
                    fontSize="small"
                    sx={{ color: 'red' }}
                    onClick={() => handlePendingVoteButtonClick('voteNo', waitingRow['address'])}
                  />
                </Button>
              </Box>
            ) : (
              waitingRow[column.dataKey]
            )}
          </TableCell>
        ))}
      </React.Fragment>
    );
  };

  const minersRowContent = (_index: number, minersRow: MinersData) => {
    return (
      <React.Fragment>
        {minerColumns.map((column) => (
          <TableCell
            key={column.dataKey}
            align={column.dataKey === 'address' ? 'left' : 'right'}
            sx={{
              color: colors[currentTheme].secondary,
            }}
          >
            {column.dataKey === 'proposeRemoval' ? (
              <Box>
                <Button sx={{ marginRight: 3 }}>
                  <PersonRemoveIcon
                    fontSize="small"
                    sx={{ color: 'red' }}
                    onClick={() => handleMinerRemoveButtonClick(minersRow['address'])}
                  />
                </Button>
              </Box>
            ) : (
              minersRow[column.dataKey]
            )}
            {column.dataKey === 'generalInfo' ? (
              <Box>
                <Button>
                  <InfoIcon
                    fontSize="small"
                    sx={{ color: colors[currentTheme].secondary }}
                    onClick={() => handleMinerInfoButtonClick(minersRow['address'])}
                  />
                </Button>
              </Box>
            ) : (
              minersRow[column.dataKey]
            )}
          </TableCell>
        ))}
      </React.Fragment>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        minHeight: 'calc(100vh - 60px)',
      }}
      style={{
        backgroundColor: colors[currentTheme].accent2,
        color: colors[currentTheme].secondary,
      }}
    >
      Status: {finalStatus}
      {finalStatus === 'Waiting' && (
        <Button
          sx={{ border: 1 }}
          style={{
            backgroundColor: colors[currentTheme].accent2,
            color: colors[currentTheme].secondary,
            marginTop: 10,
            marginBottom: -10,
          }}
          onClick={() => tryEnterPool()}
        >
          Try Enter
        </Button>
      )}
      {(finalStatus === 'Pending' || finalStatus === 'Miner') && (
        <Box style={{ marginTop: 10, marginBottom: -10 }}>Blocks Left: {blocksLeftUntilJoin}</Box>
      )}
      {(finalStatus === 'Pending' || finalStatus === 'Miner') && blocksLeftUntilJoin === 0 && (
        <Button
          sx={{ border: 1 }}
          style={{
            backgroundColor: colors[currentTheme].accent2,
            color: colors[currentTheme].secondary,
            marginTop: 20,
            marginBottom: -10,
          }}
          onClick={() => addPendingToPool()}
        >
          Join Pool
        </Button>
      )}
      <TableCreation
        rows={waitingRows}
        rowContent={waitingRowContent}
        columns={waitingColumns}
        tableId="waiting"
        customTableWidth="75%"
      />
      <TableCreation
        rows={minersRows}
        rowContent={minersRowContent}
        columns={minerColumns}
        tableId="miners"
        customTableWidth="75%"
      />
    </Box>
  );
};

export default MiningPool;
