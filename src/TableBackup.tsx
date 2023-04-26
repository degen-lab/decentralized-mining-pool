import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { TableSortLabel } from '@mui/material';
import useCurrentTheme from './consts/currentTheme';
import colors from './consts/colors';
import { GetWaitingMinersDetails } from './pages/Home';
import { useEffect, useState } from 'react';
import { CallFunctions, ReadOnlyFunctions } from './consts/callFunctions';
import { useConnect } from '@stacks/connect-react';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import Button from '@mui/material/Button';
import { convertPrincipalToArg } from './consts/converter';
import { userSession } from './components/ConnectWallet';

interface Data {
  id: number;
  address: string;
  negativeVotes: string;
  vote: string;
  positiveVotes: string;
  wasBlacklisted: string;
}

interface ColumnData {
  dataKey: keyof Data;
  label: string;
  numeric?: boolean;
  width: number;
}

const createData = (
  id: number,
  address: string,
  negativeVotes: string,
  positiveVotes: string,
  wasBlacklisted: string
) => {
  return { id, address, negativeVotes, positiveVotes, wasBlacklisted };
};

const columns: ColumnData[] = [
  {
    width: 400,
    label: 'Address',
    dataKey: 'address',
  },
  {
    width: 130,
    label: 'Negative Votes',
    dataKey: 'negativeVotes',
    numeric: true,
  },
  {
    width: 120,
    label: 'Positive Votes',
    dataKey: 'positiveVotes',
    numeric: true,
  },
  {
    width: 120,
    label: 'Vote',
    dataKey: 'vote',
    numeric: true,
  },
  {
    width: 120,
    label: 'Blacklisted',
    dataKey: 'wasBlacklisted',
  },
];

const VirtuosoTableComponents: TableComponents<Data> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
  Table: (props) => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
};

const MiningPool = () => {
  const [minersList, setMinersList] = useState<any>([]);
  const { currentTheme } = useCurrentTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [orderBy, setOrderBy] = React.useState<keyof Data>();

  const rows = minersList.map((miner: any, index: number) => {
    const minerValue = miner.value[0].value.value;
    return createData(
      index,
      minerValue.miner.value,
      minerValue['negative-votes'].value + '/' + minerValue['negative-threshold'].value,
      minerValue['positive-votes'].value + '/' + minerValue['positive-threshold'].value,
      !minerValue['was-blacklist'].value ? 'No' : 'Yes'
    );
  });

  const totalRows = rows.length;

  useEffect(() => {
    const fetchData = async () => {
      const newMinersList = await GetWaitingMinersDetails();
      setMinersList(newMinersList);
    };
    fetchData();
  }, [setMinersList]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [sortedColumn, setSortedColumn] = React.useState<keyof Data>('id');
  const { doContractCall } = useConnect();

  const handleVoteButtonClick = (data: string, address: string) => {
    const args = [convertPrincipalToArg(address)];

    if (data === 'voteYes') {
      CallFunctions(args, 'vote-positive-join-request', doContractCall);
    } else if (data === 'voteNo') {
      CallFunctions(args, 'vote-negative-join-request', doContractCall);
    }
  };

  const rowContent = (_index: number, row: Data) => {
    return (
      <React.Fragment>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            align={column.dataKey == 'address' ? 'left' : 'right'}
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
                    onClick={() => handleVoteButtonClick('voteYes', row['address'])}
                  />
                </Button>
                <Button style={{ marginRight: -52 }}>
                  <ThumbDownAltIcon
                    fontSize="small"
                    sx={{ color: 'red' }}
                    onClick={() => handleVoteButtonClick('voteNo', row['address'])}
                  />
                </Button>
              </Box>
            ) : (
              row[column.dataKey]
            )}
          </TableCell>
        ))}
      </React.Fragment>
    );
  };

  const fixedHeaderContent = () => {
    return (
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align={column.dataKey == 'address' ? 'left' : 'right'}
            style={{ width: column.width }}
            sx={{
              backgroundColor: colors[currentTheme].primary,
              color: colors[currentTheme].secondary,
            }}
          >
            <TableSortLabel
              active={orderBy === column.dataKey}
              direction={orderBy === column.dataKey ? sortDirection : 'asc'}
              onClick={() => handleSortClick(column.dataKey)}
            >
              {column.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const handleSortClick = (column: keyof Data) => {
    if (column === sortedColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedColumn(column);
      setSortDirection('asc');
      setOrderBy(column);
    }
  };

  const sortedRows = React.useMemo(() => {
    const sortedRows = [...rows];
    sortedRows.sort((rowA, rowB) => {
      const valueA = rowA[sortedColumn];
      const valueB = rowB[sortedColumn];
      if (sortDirection === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
      }
    });
    return sortedRows;
  }, [rows, sortedColumn, sortDirection]);

  const screenWidth = window.innerWidth * 0.75;
  const tableWidth = 931.2;
  const rowHeight = 64.8;
  const headerHeight = 57.9;
  const tableHeight =
    screenWidth >= tableWidth
      ? rowsPerPage < totalRows
        ? (page + 1) * rowsPerPage < totalRows
          ? rowsPerPage * rowHeight + headerHeight
          : (totalRows - rowsPerPage * page) * rowHeight + headerHeight
        : totalRows * rowHeight + headerHeight
      : rowsPerPage != totalRows
      ? rowsPerPage * rowHeight + headerHeight + 16.15
      : totalRows * rowHeight + headerHeight + 16.15;

  const [finalStatus, setFinalStatus] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const statusArgs = convertPrincipalToArg(userSession.loadUserData().profile.stxAddress.testnet);
      const status = await ReadOnlyFunctions([statusArgs], 'get-address-status');
      const statusInfo = (status as any).value.data;
      setFinalStatus(
        statusInfo === 'is-miner'
          ? 'Miner'
          : statusInfo === 'is-waiting'
          ? 'Waiting'
          : statusInfo === 'is-pending'
          ? 'Pending'
          : 'Not Asked to Join'
      );
    };
    fetchData();
  }, [setFinalStatus]);

  function tryEnterPool() {
    CallFunctions([], 'try-enter-pool', doContractCall);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      style={{
        backgroundColor: colors[currentTheme].accent2,
        height: rowsPerPage <= 10 || totalRows < 10 ? 'calc(100vh - 60px)' : 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
        style={{
          backgroundColor: colors[currentTheme].accent2,
          color: colors[currentTheme].secondary,
          marginTop: 10,
          marginBottom: 5,
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
      </Box>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, { label: 'All', value: totalRows }]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors[currentTheme].secondary,
        }}
      />
      <Paper style={{ height: tableHeight, width: '75%' }} elevation={6}>
        <TableVirtuoso
          data={sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
          style={{ backgroundColor: colors[currentTheme].accent2 }}
        />
      </Paper>
    </Box>
  );
};

export default MiningPool;

// done:
// STATUS: waiting
// ask to join
// table - waiting list
// voting waiting
// try-enter
// display current user STATUS

// TODO:
// modify contract name to "-5"
// STATUS: pending
// read-only for pending
// // check if modular needed/different
// table - pending list
// address, blocks-till can join get-data-miner-pending-accept
// blocks-till pass should be done separately

// button: check if enough blocks passed readOnly
// can-call-add-miners true/false
// button add-pending-miners-to-pool

// STATUS: miner
// table - miners list
// include

// GENERAL INFO
// Notifier: read only and displayed
// list of miners:
// number of blocks won: read only
// stacks rewards: read only

//
