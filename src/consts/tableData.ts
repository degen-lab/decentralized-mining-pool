import { useState, useEffect } from 'react';
import { ReadOnlyAllDataProposedRemovalMiners, ReadOnlyAllDataWaitingMiners, ReadOnlyGetMinersList } from './readOnly';

// data interface for all tables, used as type in TableCreation

export interface AllTableData {
  id: number;
  address: string;
  negativeVotes: string;
  vote: string;
  positiveVotes: string;
  wasBlacklisted: string;
  proposeRemoval: string;
  generalInfo: string;
}

// data for waiting table

export interface WaitingData {
  id: number;
  address: string;
  negativeVotes: string;
  vote: string;
  positiveVotes: string;
  wasBlacklisted: string;
}

interface WaitingColumnData {
  dataKey: keyof WaitingData;
  label: string;
  numeric?: boolean;
  width: number;
}

const createWaitingData = (
  id: number,
  address: string,
  negativeVotes: string,
  positiveVotes: string,
  wasBlacklisted: string
) => {
  return { id, address, negativeVotes, positiveVotes, wasBlacklisted };
};

export const waitingColumns: WaitingColumnData[] = [
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

interface WaitingListProps {
  value: {
    value: {
      value: {
        miner: { value: string };
        'negative-threshold': { value: string };
        'positive-threshold': { value: string };
        'negative-votes': { value: string };
        'positive-votes': { value: string };
        'was-blacklist': { value: boolean };
      };
    };
  }[];
}

export const GetWaitingRows = () => {
  const [waitingList, setWaitingList] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const newWaitingList = await ReadOnlyAllDataWaitingMiners();
      setWaitingList(newWaitingList);
    };
    fetchData();
  }, [setWaitingList]);

  const rows = waitingList
    ? waitingList.map((miner: WaitingListProps, index: number) => {
        const waitingValue = miner.value[0].value.value;
        return createWaitingData(
          index,
          waitingValue.miner.value,
          waitingValue['negative-votes'].value + '/' + waitingValue['negative-threshold'].value,
          waitingValue['positive-votes'].value + '/' + waitingValue['positive-threshold'].value,
          !waitingValue['was-blacklist'].value ? 'No' : 'Yes'
        );
      })
    : [];

  return rows;
};

// data for miners in pool table

export interface MinersData {
  id: number;
  address: string;
  proposeRemoval: string;
  generalInfo: string;
}

interface MinersColumnData {
  dataKey: keyof MinersData;
  label: string;
  numeric?: boolean;
  width: number;
}

const createMinersData = (id: number, address: string) => {
  return { id, address };
};

export const minerColumns: MinersColumnData[] = [
  {
    width: 750,
    label: 'Address',
    dataKey: 'address',
  },
  {
    width: 150,
    label: 'Propose Removal',
    dataKey: 'proposeRemoval',
    numeric: true,
  },
  {
    width: 120,
    label: 'Miner Info',
    dataKey: 'generalInfo',
    numeric: true,
  },
];

export const GetMinersRows = () => {
  const [minersList, setMinersList] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const newMinersList = await ReadOnlyGetMinersList();
      setMinersList(newMinersList.value);
    };
    fetchData();
  }, [setMinersList]);

  const rows = minersList
    ? minersList.map((miner: { value: string }, index: number) => {
        const minerValue = miner.value;
        return createMinersData(index, minerValue);
      })
    : [];

  return rows;
};

// data for removals table

export interface RemovalsData {
  id: number;
  address: string;
  negativeVotes: string;
  vote: string;
  positiveVotes: string;
  warnings: number;
  minerBlocks: number;
}

interface RemovalsColumnData {
  dataKey: keyof RemovalsData;
  label: string;
  numeric?: boolean;
  width: number;
}

const createRemovalsData = (
  id: number,
  address: string,
  negativeVotes: string,
  positiveVotes: string,
  warnings: number,
  minerBlocks: number
) => {
  return { id, address, negativeVotes, positiveVotes, warnings, minerBlocks };
};

export const removalsColumns: RemovalsColumnData[] = [
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
    label: 'Warnings',
    dataKey: 'warnings',
  },
  {
    width: 120,
    label: 'Blocks as Miner',
    dataKey: 'minerBlocks',
  },
];

export const GetRemovalsRows = () => {
  const [removalsList, setRemovalsList] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const newRemovalsList = await ReadOnlyAllDataProposedRemovalMiners();
      setRemovalsList(newRemovalsList);
    };
    fetchData();
  }, [setRemovalsList]);

  const rows = removalsList
    ? removalsList.map((miner: any, index: number) => {
        // have to change type of miner after the call works
        const removalsValue = miner;
        return createRemovalsData(index, '', '', '', 0, 0);
      })
    : [];

  return rows;
};
