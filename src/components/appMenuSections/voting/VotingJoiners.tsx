import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import useCurrentTheme from '../../../consts/theme';
import colors from '../../../consts/colorPallete';
import { ContractVotePositiveJoin, ContractVoteNegativeJoin } from '../../../consts/smartContractFunctions';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import TableCreation from '../../../components/TableCreation';
import { WaitingData, waitingColumns, GetWaitingRows } from '../../../consts/tableData';

const VotingJoiners = () => {
  const { currentTheme } = useCurrentTheme();
  const waitingRows = GetWaitingRows();

  const handlePendingVoteButtonClick = (data: string, address: string) => {
    if (data === 'voteYes') {
      ContractVotePositiveJoin(address);
    } else if (data === 'voteNo') {
      ContractVoteNegativeJoin(address);
    }
  };

  const handleMinerInfoButtonClick = (address: string) => {
    // change this call to redirect the one who clicked to a new tab, or make a popup with the info of the given miner
    // the call is named 'readOnlyGetAllDataMinersInPool', but for now it gives read_length error (@deployer needs to fix it)
    // ContractVotePositiveJoin(address);
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
            {column.dataKey === 'generalInfo' && (
              <Box>
                <Button onClick={() => handleMinerInfoButtonClick(waitingRow['address'])}>
                  <InfoIcon fontSize="small" sx={{ color: colors[currentTheme].secondary }} />
                </Button>
              </Box>
            )}
            {column.dataKey === 'vote' ? (
              <Box>
                <Button onClick={() => handlePendingVoteButtonClick('voteYes', waitingRow['address'])}>
                  <ThumbUpAltIcon fontSize="small" sx={{ color: 'green' }} />
                </Button>
                <Button
                  style={{ marginRight: -52 }}
                  onClick={() => handlePendingVoteButtonClick('voteNo', waitingRow['address'])}
                >
                  <ThumbDownAltIcon fontSize="small" sx={{ color: 'red' }} />
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
      <TableCreation
        rows={waitingRows}
        rowContent={waitingRowContent}
        columns={waitingColumns}
        tableId="waiting"
        customTableWidth="75%"
      />
    </Box>
  );
};

export default VotingJoiners;
