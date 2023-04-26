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
import useCurrentTheme from '../consts/currentTheme';
import colors from '../consts/colors';

const VirtuosoTableComponents: TableComponents<any> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
  Table: (props) => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
};

const TableCreation = ({ rows, rowContent, columns, tableId, customTableWidth }: any) => {
  const { currentTheme } = useCurrentTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [orderBy, setOrderBy] = React.useState<any>();

  const totalRows = rows.length;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [sortedColumn, setSortedColumn] = React.useState<any>('id');

  const fixedHeaderContent = () => {
    return (
      <TableRow>
        {columns.map((column: any) => (
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
              sx={{
                ':hover': {
                  color: colors[currentTheme].secondary,
                },
                ':focus': {
                  color: colors[currentTheme].secondary,
                },
                ':active': {
                  color: colors[currentTheme].secondary,
                },
              }}
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

  const handleSortClick = (column: any) => {
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

  const screenWidth = (window.innerWidth * parseFloat(customTableWidth)) / 100;
  const tableWidth = 1241.6 * (parseFloat(customTableWidth) / 100);
  const rowHeight = tableId === 'waiting' || tableId === 'miners' ? 64.8 : 52.813;
  const headerHeight = 57.9;
  const tableHeight =
    screenWidth >= tableWidth
      ? rowsPerPage < totalRows
        ? (page + 1) * rowsPerPage < totalRows
          ? rowsPerPage * rowHeight + headerHeight
          : (totalRows - rowsPerPage * page) * rowHeight + headerHeight
        : totalRows * rowHeight + headerHeight
      : rowsPerPage < totalRows
      ? (page + 1) * rowsPerPage < totalRows
        ? rowsPerPage * rowHeight + headerHeight + 16.15
        : (totalRows - rowsPerPage * page) * rowHeight + headerHeight + 16.15
      : totalRows * rowHeight + headerHeight + 16.15;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 2,
        width: customTableWidth,
      }}
    >
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
      <Paper style={{ height: tableHeight, width: '100%' }} elevation={6}>
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

export default TableCreation;
