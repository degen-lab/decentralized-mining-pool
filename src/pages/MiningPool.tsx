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
import useCurrentTheme from '../consts/CurrentTheme';
import colors from '../consts/Colors';

interface Data {
  calories: number;
  carbs: number;
  dessert: string;
  fat: number;
  id: number;
  protein: number;
}

interface ColumnData {
  dataKey: keyof Data;
  label: string;
  numeric?: boolean;
  width: number;
}

type Sample = [string, number, number, number, number];

const sample: readonly Sample[] = [
  ['Frozen yoghurt', 159, 6.0, 24, 4.0],
  ['Ice cream sandwich', 237, 9.0, 37, 4.3],
  ['Eclair', 262, 16.0, 24, 6.0],
  ['Cupcake', 305, 3.7, 67, 4.3],
  ['Gingerbread', 356, 16.0, 49, 3.9],
];

const createData = (
  id: number,
  dessert: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): Data => {
  return { id, dessert, calories, fat, carbs, protein };
};

const columns: ColumnData[] = [
  {
    width: 250,
    label: 'Dessert',
    dataKey: 'dessert',
  },
  {
    width: 130,
    label: 'Calories (g)',
    dataKey: 'calories',
    numeric: true,
  },
  {
    width: 130,
    label: 'Fat (g)',
    dataKey: 'fat',
    numeric: true,
  },
  {
    width: 130,
    label: 'Carbs (g)',
    dataKey: 'carbs',
    numeric: true,
  },
  {
    width: 130,
    label: 'Protein (g)',
    dataKey: 'protein',
    numeric: true,
  },
];

const rows: Data[] = Array.from({ length: 123 }, (_, index) => {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  return createData(index, ...randomSelection);
});

const VirtuosoTableComponents: TableComponents<Data> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
  Table: (props) => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />),
};

const MiningPool = () => {
  const { currentTheme } = useCurrentTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [orderBy, setOrderBy] = React.useState<keyof Data>();
  const totalRows = rows.length;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [sortedColumn, setSortedColumn] = React.useState<keyof Data>('id');

  const rowContent = (_index: number, row: Data) => {
    return (
      <React.Fragment>
        {columns.map((column) => (
          <TableCell
            key={column.dataKey}
            align={column.numeric ? 'right' : 'left'}
            sx={{
              color: colors[currentTheme].secondary,
            }}
          >
            {row[column.dataKey]}
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
            align={column.numeric ? 'right' : 'left'}
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
  const rowHeight = 52.812;
  const headerHeight = 58.5;
  const tableHeight =
    screenWidth >= tableWidth
      ? rowsPerPage != totalRows
        ? rowsPerPage * rowHeight + headerHeight
        : totalRows * rowHeight + headerHeight
      : rowsPerPage != totalRows
      ? rowsPerPage * rowHeight + headerHeight + 16.18
      : totalRows * rowHeight + headerHeight + 16.18;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      style={{
        backgroundColor: colors[currentTheme].accent2,
        height: rowsPerPage < 20 ? 'calc(100vh - 60px)' : 'auto',
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
