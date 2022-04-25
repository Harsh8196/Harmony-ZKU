import React,{useState,useEffect,useRef} from 'react';
import {Link} from 'react-router-dom';
import MetaMaskOnboarding from '@metamask/onboarding';

const ONBOARD_TEXT = 'Click here to install MetaMask!';
const CONNECT_TEXT = 'Connect';
const CONNECTED_TEXT = 'Connected';


function Base({children}) {

  const [buttonText, setButtonText] =useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const onboarding = useRef();
 

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  useEffect(async () => {
    function handleNewAccounts(newAccounts) {
      setAccounts(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      await window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleNewAccounts);
      await window.ethereum.on('accountsChanged', handleNewAccounts);
      return async () => {
        await window.ethereum.off('accountsChanged', handleNewAccounts);
      };
    }
  }, []);

  const onClick = async () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      await window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((newAccounts) => setAccounts(newAccounts));
    } else {
      onboarding.current.startOnboarding();
    }
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top" >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">OneScan-Verify </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarToggler">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to='/admin'>Admin</Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to='/claim'>Claim</Link>
              </li> */}
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to='/issuer'>Issuer</Link>
              </li>
            </ul>
            <button
                  className="btn btn-outline-light mb-3"
                  disabled={isDisabled} onClick={onClick} style={{border:'round'}}
                  >
                  {buttonText}
            </button>
          </div>
        </div>
      </nav>
      <div>
        {children}
      </div>
    </div>
  )
}

export default Base