/* eslint-disable */

// Import React package
import React from "react";

// Import component CSS style
import "./App.css";

// Import helper functions
import getWeb3 from "../helpers/getWeb3";

// Import React components
import { RegisterUser } from './RegisterUser';
import { UserInformation } from './UserInformation';
import { DonationInformation } from './DonationInformation';
import { RegisterDonation } from './RegisterDonation';

//////////////////////////////////////////////////////////////////////////////////|
//        CONTRACT ADDRESS           &          CONTRACT ABI                      |
//////////////////////////////////////////////////////////////////////////////////|                                                             |
const CONTRACT_ADDRESS = require("../contracts/UserManagment.json").networks[1337].address //1337
// const CONTRACT_ADDRESS = require("../contracts/User.json").networks[11155111].address //sepolia testnet

const CONTRACT_ABI = require("../contracts/UserManagment.json").abi
const CONTRACT_NAME = require("../contracts/UserManagment.json").contractName


const DONATION_CONTRACT_ADDRESS = require("../contracts/Donation.json").networks[1337].address
const DONATION_CONTRACT_ABI = require("../contracts/Donation.json").abi



export default class App extends React.Component {
  state = { web3Provider: null, accounts: null, networkId: null, contract: null, storageValue: null, userForm: {} };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the network ID
      const networkId = await web3.eth.net.getId();

      // Create the Smart Contract instance
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);


      // Create the Smart Contract instance
      const donationContract = new web3.eth.Contract(DONATION_CONTRACT_ABI, DONATION_CONTRACT_ADDRESS);
      this.setState({ donationContract });
      this.setState({ donationAmount: 0 });
      this.setState({ myDonationAmount: 0 });
      //const [donationMessage, setDonationMessage] = useState('');


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3Provider: web3, accounts, networkId, contract });

      // Load user information
      this.getUserInformation();

      // Load donation information
      this.getDonationInformation();

      // Load my donation information
      this.getMyDonationInformation();

      // --------- TO LISTEN TO EVENTS AFTER EVERY COMPONENT MOUNT ---------
      this.handleMetamaskEvent();


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // --------- METAMASK EVENTS ---------
  handleMetamaskEvent = async () => {
    window.ethereum.on('accountsChanged', function (accounts) {
      // Time to reload your interface with accounts[0]!
      alert("Incoming event from Metamask: Account changed 🦊")
      window.location.reload()
    })

    window.ethereum.on('chainChanged', function (networkId) {
      // Time to reload your interface with the new networkId
      alert("Incoming event from Metamask: Network changed 🦊")
      window.location.reload()
    })
  }

  // ------------ GET DONATION INFORMATION FUNCTION ------------
  getDonationInformation = async () => {
    const { donationContract } = this.state;

    // Get the users donation
    const response = await donationContract.methods.getTotalDonations().call();
    this.setState({ totalDonations: response })
  }

  // ------------ GET MY DONATION INFORMATION FUNCTION ------------
  getMyDonationInformation = async () => {
    const { donationContract, accounts } = this.state;

    // Get the user donation
    const response = await donationContract.methods.getDonationAmount(accounts[0]).call();
    this.setState({ myDonationAmount: response  })
  }
  // ------------ REGISTER DONATION FUNCTION ------------
  registerDonation = async (donationAmount) => {
    const { donationContract, web3Provider, accounts } = this.state;

    try {
      await donationContract.methods.depositEther().send({ from: accounts[0], value: web3Provider.utils.toWei(donationAmount, 'ether') });
    } catch (error) {
      console.error('Error sending donation:', error);
      // setDonationMessage('Donation failed.');
    }



    const response = await donationContract.methods.getTotalDonations().call();
    this.setState({ totalDonations: response })

    // Get the user donation
    const myResponse = await donationContract.methods.getDonationAmount(accounts[0]).call();
    this.setState({ myDonationAmount: myResponse })
  }

  // --------------------------------------------------------------


  // ------------ GET USER INFORMATION FUNCTION ------------
  getUserInformation = async () => {
    const { accounts, contract } = this.state;

    // Get the user information
    const response = await contract.methods.getUser().call({ from: accounts[0] });
    this.setState({ userInfo: response })
  }

  // ------------ REGISTER USER FUNCTION ------------
  registerUser = async (userForm) => {
    const { accounts, contract } = this.state;
    const res = await contract.methods.registerUser(userForm.name, userForm.email, userForm.tipoUsuario, userForm.imageURI).send({ from: accounts[0] })
    const response = await contract.methods.getUser().call({ from: accounts[0] });
    this.setState({ userInfo: response })
  };


  render() {
    if (!this.state.web3Provider) {
      return <div className="App-no-web3">
        <h3>No Web3 connection... 🧐</h3>
        <p>Jump to the next chapter to configure the Web3 Provider.</p>
        <h3>Let's go! ⏭️</h3>
      </div>;
    }
    return (
      <div className="App">
        {/* ---- Context Information: Account & Network ---- */}
        <div className="User-header">
          <div className="Header-context-information">
            <p> Network connected: {this.state.networkId}</p>
            <p> Your address: {this.state.accounts[0]}</p>
            {this.state.userInfo && (
              <p> Bienvenido  {this.state.userInfo.name} 👋</p>
            )}
          </div>
        </div>
        <div className="User-body">
          {/* User not registered */}
          {!this.state.userInfo && (
            <div className="card">
              <RegisterUser className="card" onRegisterUser={this.registerUser} />
            </div>
          )}

          {/* User registered */}
          {this.state.userInfo && (
            <div className="User-logged">
              <div className="card">
                <UserInformation className="card" user={this.state.userInfo} />
              </div>
              {/* ---- Donation information ---- */}
              <div className="card">
                <DonationInformation totalDonations={this.state.totalDonations} myDonationAmount={this.state.myDonationAmount} />
              </div>

              <div className="card">
                <RegisterDonation onRegisterDonation={this.registerDonation} myDonationAmount={this.state.myDonationAmount} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}