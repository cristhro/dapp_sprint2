/* eslint-disable */

// Import React package
import React from "react";

// Import component CSS style
import "./App.css";

// Import helper functions
import getWeb3 from "../helpers/getWeb3";

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
    this.setState({ donationAmount : 0 });
    //const [donationMessage, setDonationMessage] = useState('');


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3Provider: web3, accounts, networkId, contract });

      // Load user information
      this.getUserInformation();

      // Load donation information
      this.getDonationInformation();

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

    // Get the user donation
    const response = await donationContract.methods.getTotalDonations().call();
    this.setState({ totalDonations: response })
  }

  registerDonation = async () => {
    const { donationContract, donationAmount, web3Provider, accounts } = this.state;
    //const res = await donationContract.methods.receive().send({ from: accounts[0], value:1 });
    
     // Define la cantidad de Ether que quieres enviar
     const amountToSend = web3Provider.utils.toWei('1', 'ether'); // 1 Ether
    
    try {
      //await web3Provider.eth.sendTransaction({ from: accounts[0], to: donationContract, value: amountToSend });

      //await web3Provider.eth.sendTransaction({ from: accounts[0], to: donationContract, value: web3.utils.toWei('1', 'ether') });
      await donationContract.methods.receive().send({ from: accounts[0], value: web3Provider.utils.toWei(donationAmount, 'ether') });

      //await donationContract.methods.receive().send({ from: accounts[0] });
      //setDonationMessage('Donation successful!');
  } catch (error) {
      console.error('Error sending donation:', error);
      //setDonationMessage('Donation failed.');
  }
    
    
    
    const response = await donationContract.methods.getTotalDonations().call();
    this.setState({ totalDonations: response })





    
  }

  // --------------------------------------------------------------


  // ------------ GET USER INFORMATION FUNCTION ------------
  getUserInformation = async () => {
    const { accounts, contract } = this.state;

    // Get the user information
    const response = await contract.methods.getUser().call({ from: accounts[0] });
    this.setState({ userInfo: response })
  }

 

  // ------------ REGISTER FUNCTION ------------
  registerUser = async () => {
    const { accounts, contract, userForm } = this.state;

    // const userForm = {
    //   name: 'Cris',
    //   email: 'cristhian@test.com',
    //   tipoUsuario: 1,
    //   imageURI: 'https://i.pravatar.cc/400'
    // }
    const res = await contract.methods.registerUser(userForm.name, userForm.email, userForm.tipoUsuario, userForm.imageURI).send({ from: accounts[0] })
    const response = await contract.methods.getUser().call({ from: accounts[0] });
    this.setState({ userInfo: response })
  };

  // ------------ STOP USER FUNCTION ------------
  stopUser = async () => {
    const { accounts, contract } = this.state;

    // Stop the auction
    await contract.methods.stopUser().send({ from: accounts[0] });

    // Get the new values: isActive and newOwner
    const isActive = await contract.methods.isActive().call();
    const newOwner = await contract.methods.newOwner().call();

    // Update state with the result.
    this.setState({ isActive, newOwner });
  }
  

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
              </div>
          </div>

          {/* ---- User information ---- */}
          <div className="User-component-1">
            
              {
                this.state.userInfo &&
                <>
            <div className="User-component-body">
            <h2 id="inline">User information</h2>
                  <div className="User-information">
                    {/* User Image */}
                    <div className="User-information-img">
                    {this.state.userInfo.imageURI && <img src={this.state.userInfo.imageURI}></img>}
                    </div>
                    {/* User information */}
                    <div className="User-information-text">

                        {/* User Description */}
                      <p>{this.state.userInfo.name}</p>

                        {/* Basic Information */}
                      <p><b>Is Active: </b>{this.state.userInfo.isActive ? "The user is still active!! 🤩 🤩" : "The user is not longer active 😭 😭"}</p>
                      <p><b>User Type:</b> {this.state.userInfo.tipoUsuario}</p>
                    </div>
                  </div>
                  </div>
                </>
              }
          </div>


        {/* ---- User actions ---- */}

        {
          !this.state.userInfo &&
          <>
          <div className="User-component-2">
            <div className="User-component-body">
              <div className="User-actions">
                <h2>User Registration</h2>
                <input placeholder="Insert name" onChange={(e) => this.setState({ userForm: { ...this.state.userForm, name: e.target.value } })}></input>
                <input type="email"  placeholder="Insert email" onChange={(e) => this.setState({ userForm: { ...this.state.userForm, email: e.target.value } })}></input>
                <input type="number" placeholder="Insert tipoUsuario" onChange={(e) => this.setState({ userForm: { ...this.state.userForm, tipoUsuario: parseInt(e.target.value) || '' } })}></input>
                <input placeholder="Insert imageURI" onChange={(e) => this.setState({ userForm: { ...this.state.userForm, imageURI: e.target.value } })}></input>
                <button id="button-send" onClick={this.registerUser}>Register User</button>
              </div>
            </div>
          </div>
          </>
        }

       
        <hr></hr>


       {/* ---- Donation information ---- */}
       <div className="User-component-1">
        {
            this.state.totalDonations &&
            <>
        <div className="User-component-body">
        <h2 id="inline">Donation information</h2>
              <div className="User-information">
                {/* Donation information */}
                <div className="User-information-text">
                    {/* Basic Information */}
                  <p><b>Donations:</b> {this.state.totalDonations}</p>
                </div>
              </div>
              </div>
            </>
        }
        </div>

        <div className="User-component-2">
            <div className="User-component-body">
              <div className="User-actions">
                <h2>Donation Registration</h2>
                <input type="number" placeholder="Insert Donation" onChange={(e) => this.setState({ donationAmount: e.target.value })}></input>
                <button id="button-send" onClick={this.registerDonation}>Register Donation</button>
              </div>
              {/* <p>{donationMessage}</p> */}
            </div>
          </div>


      </div>
    );
  }
}