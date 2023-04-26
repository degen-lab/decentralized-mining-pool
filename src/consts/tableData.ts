import { useState, useEffect } from 'react'
import { ReadOnlyAllDataWaitingMiners, ReadOnlyGetMinersList } from './readOnly';

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

export const GetWaitingRows = () => {
    const [waitingList, setWaitingList] = useState<any>([]);

    useEffect(() => {
        const fetchData = async () => {
          const newWaitingList = await ReadOnlyAllDataWaitingMiners();
          setWaitingList(newWaitingList);
        };
        fetchData();
      }, [setWaitingList]);

    const rows = waitingList ? waitingList.map((miner: any, index: number) => {
        const waitingValue = miner.value[0].value.value;
        return createWaitingData(
            index,
            waitingValue.miner.value,
            waitingValue['negative-votes'].value + '/' + waitingValue['negative-threshold'].value,
            waitingValue['positive-votes'].value + '/' + waitingValue['positive-threshold'].value,
            !waitingValue['was-blacklist'].value ? 'No' : 'Yes'
        );
    }) : [];

    return rows;
}

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

const createMinersData = (
    id: number,
    address: string,
) => {
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

    const rows = minersList ? minersList.map((miner: any, index: number) => {
        const minerValue = miner.value;
        return createMinersData(
            index,
            minerValue,
        );
    }) : [];

    return rows;
}