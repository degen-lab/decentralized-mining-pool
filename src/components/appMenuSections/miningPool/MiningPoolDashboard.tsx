const MiningPoolDashboard = () => {
  return (
    <div>
      <h4>General info about the mining pool (widgets/statistics - short)</h4>
      <ul>
        <li>ongoing block</li>
        <li>mining performance</li>
        <li>notifier voting status</li>
      </ul>
      <h4>Detailed info about the mining pool (widgets/statistics for all existing blocks)</h4>
      <ul>
        <li>last winner bloack id</li>
        <li>number of blocks won</li>
        <li>mining performance</li>
        <li>voting history</li>
      </ul>
    </div>
  );
};
export default MiningPoolDashboard;
