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

export default class App extends React.Component {
  state = { web3Provider: null, accounts: null, networkId: null, contract: null, storageValue: null };

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

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3Provider: web3, accounts, networkId, contract });

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

  // ------------ GET AUCTION INFORMATION FUNCTION ------------
  getUserInformation = async () => {
    const { accounts, contract } = this.state;

    // Get the auction information
    const response = await contract.methods.getUser().call({ from: accounts[0] });
    this.setState({ userInfo: response })
  }

  // ------------ BID FUNCTION ------------
  bid = async () => {
    const { accounts, contract } = this.state;

    // TODO: Register user
    // Bid at an auction for X value
    const userInfoForm = {
      name: 'Cris',
      email: 'cristhian@test.com',
      tipoUsuario: 1,
      imageURI: 'https://i.pravatar.cc/400'
    }
    const res = await contract.methods.registerUser(userInfoForm.name, userInfoForm.email, userInfoForm.tipoUsuario, userInfoForm.imageURI).send({ from: accounts[0] })
    const response = await contract.methods.getUser().call({ from: accounts[0] });
    this.setState({ userInfo: response })
  };

  // ------------ STOP AUCTION FUNCTION ------------
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
            <div className="User-component-body">
              <h2 id="inline">User information</h2>
              <button id="button-call" onClick={this.getUserInformation}> GET INFORMATION</button>
              {
                this.state.userInfo &&
                <>
                  <div className="User-information">
                    {/* User Image */}
                    <div className="User-information-img">
                    {this.state.userInfo.imageURI && <img src={this.state.userInfo.imageURI}></img>}
                    {this.state.userInfo.imageURI && <p><u>Descargar imágen</u> &nbsp;&nbsp; <u>Solicitar más imágenes</u></p>}
                    </div>
                    {/* User information */}
                    <div className="User-information-text">

                      {/* User Description */}
                      <p>{this.state.userInfo.name}</p>

                      {/* Basic Information */}
                    <p><b>Is Active: </b>{this.state.userInfo.isActive ? "The auction is still active!! 🤩 🤩" : "The auction is not longer active 😭 😭"}</p>
                    <p><b>User Type:</b> {this.state.userInfo.tipoUsuario}</p>

                      {/* More information -  En funcion del tipo de */}
                      {/* {this.state.highestBidder && <p><b>Highest Bidder:</b> {this.state.highestBidder}</p>}
                      {this.state.highestPrice && <p><b>Highest Price:</b> {this.state.web3Provider.utils.fromWei(this.state.highestPrice, 'ether')} ether</p>}
                      {this.state.basePrice && <p><b>Base price:</b> {this.state.basePrice}</p>}
                      {this.state.originalOwner && <p><b>Original Owner:</b> {this.state.originalOwner}</p>}
                      {this.state.newOwner && <p><b>New Owner:</b> {this.state.newOwner}</p>} */}
                    </div>
                  </div>
                </>
              }
            </div>
          </div>


          {/* ---- User actions ---- */}
          <div className="User-component-2">
            <div className="User-component-body">
              <div className="User-actions">
                <h2>User actions</h2>

                {/* Input & Button to bid */}
                <input placeholder="Insert value in wei" onChange={(e) => this.setState({ value: e.target.value })}></input>
                <button id="button-send" onClick={this.bid}>BID</button>

                {/* Button to stop auction */}
                <button id="button-send" onClick={this.stopUser}>STOP AUCTION</button>

                {/* Helper to convert wei to ether */}
                {this.state.value && <p>You're gonna bid: {this.state.web3Provider.utils.fromWei(this.state.value, 'ether')} ether</p>}
              </div>
            </div>
          </div>
       
      </div>
    );
  }
}