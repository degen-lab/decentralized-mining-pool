import { useEffect, useState } from 'react';
import colors from '../../../consts/colorPallete';
import useCurrentTheme from '../../../consts/theme';
import { Box } from '@mui/material';
import { readOnlyGetAllDataMinersInPool } from '../../../consts/readOnly';
import { getExplorerUrl, network } from '../../../consts/network';

interface MinerDataProps {
  balance: number;
  minerBlocks: number;
  totalWithdraw: number;
  warnings: number;
  wasBlacklisted: boolean;
}

const Voting = () => {
  const { currentTheme } = useCurrentTheme();
  const currentLink = window.location.href;
  const addressParts = currentLink.split('/');
  const address = addressParts[addressParts.length - 1];
  const [minerData, setMinerData] = useState<MinerDataProps | string>('');
  const [wasBlacklisted, setWasBlacklisted] = useState<boolean | null>(null);
  const [warnings, setWarnings] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [totalWithdrawals, setTotalWithdrawals] = useState<number | null>(null);
  const [blocksAsMiner, setBlocksAsMiner] = useState<number | null>(null);
  const [explorerLink, setExplorerLink] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (address !== null) {
      setExplorerLink(getExplorerUrl[network](address).explorerUrl);
    }
  }, [address]);

  useEffect(() => {
    const getMinerData = async () => {
      const data = await readOnlyGetAllDataMinersInPool(address);
      setMinerData(data);
    };
    getMinerData();
  }, []);

  useEffect(() => {
    if (typeof minerData !== 'string') {
      setWasBlacklisted(minerData.wasBlacklisted);
      setWarnings(minerData.warnings);
      setBalance(minerData.balance);
      setTotalWithdrawals(minerData.totalWithdraw);
      setBlocksAsMiner(minerData.minerBlocks);
    }
  }, [minerData]);

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
        <h2>Miner Profile - Details</h2>
        <ul>
          <li>Address: {address}</li>
          <li>Was Blacklisted: {wasBlacklisted !== null ? (wasBlacklisted === false ? 'No' : 'Yes') : ''}</li>
          <li>Warnings: {warnings !== null ? warnings : ''}</li>
          <li>Number of Blocks as Miner: {blocksAsMiner !== null ? blocksAsMiner : ''}</li>
          <li>Balance: {balance !== null ? balance : ''}</li>
          <li>Total Withdrawals: {totalWithdrawals !== null ? totalWithdrawals : ''}</li>
          <li>
            <button style={{ backgroundColor: colors[currentTheme].accent2, color: colors[currentTheme].secondary }}>
              <a
                style={{ backgroundColor: colors[currentTheme].accent2, color: colors[currentTheme].secondary }}
                target="_blank"
                rel="noreferrer"
                href={explorerLink !== undefined ? explorerLink : ''}
              >
                Check Address on Explorer
              </a>
            </button>
          </li>
        </ul>
      </div>
    </Box>
  );
};

export default Voting;
