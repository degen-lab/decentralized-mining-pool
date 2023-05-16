import './styles.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import colors from '../../../consts/colorPallete';
import useCurrentTheme from '../../../consts/theme';

const ActionsContainer = () => {
  const { currentTheme } = useCurrentTheme();

  return (
    <div className="info-container-profile-page">
      <div className="heading-info-container">
        <div className="heading-title-info-container">
          <div className="heading-icon-info-container">
            <AccountCircleIcon className="icon-info-container" />
          </div>
          <div className="title-info-continer">ACTIONS</div>
        </div>
      </div>
      <div className="content-info-container">
        <div className="content-sections-title-info-container">
          <div>Deposit</div>
          <div>
            <button className="customButton">DEPOSIT</button>
          </div>
        </div>
        <div className="content-sections-title-info-container">
          <div>Withdraw</div>
          <div>
            <button>Withdraw</button>
          </div>
        </div>
        <div className="content-sections-title-info-container">
          {/* <div>Leave pool</div> */}
          <button>Leave pool</button>
        </div>
      </div>
    </div>
  );
};

export default ActionsContainer;
