import './styles.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import colors from '../../../consts/colorPallete';
import useCurrentTheme from '../../../consts/theme';

interface IAboutContainerProps {
  currentRole: string;
  connectedWallet: string | null;
  explorerLink: string | undefined;
}
const AboutContainer = ({ currentRole, connectedWallet, explorerLink }: IAboutContainerProps) => {
  const { currentTheme } = useCurrentTheme();

  console.log('conn', connectedWallet);
  return (
    <div className="info-container-profile-page">
      <div className="heading-info-container">
        <div className="heading-title-info-container">
          <div className="heading-icon-info-container">
            <AccountCircleIcon className="icon-info-container" />
          </div>
          <div className="title-info-continer">ABOUT</div>
        </div>
      </div>
      <div className="content-info-container">
        <div className="content-sections-title-info-container">
          Connected wallet: {connectedWallet !== null ? connectedWallet : ''}
        </div>
        <div className="content-sections-title-info-container">Role: {currentRole}</div>
        <div className="content-sections-title-info-container">
          Link to explorer:{' '}
          <button style={{ backgroundColor: colors[currentTheme].accent2, color: colors[currentTheme].secondary }}>
            <a
              style={{ backgroundColor: colors[currentTheme].accent2, color: colors[currentTheme].secondary }}
              target="_blank"
              rel="noreferrer"
              href={explorerLink !== undefined ? explorerLink : ''}
            >
              Visit
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutContainer;
