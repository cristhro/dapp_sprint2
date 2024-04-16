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
const CONTRACT_ADDRESS = require("../contracts/StudentManagement.json").networks[1337].address //local 1337 sepolia testnet 11155111
const CONTRACT_ABI = require("../contracts/StudentManagement.json").abi
const CONTRACT_NAME = require("../contracts/StudentManagement.json").contractName

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
  getAuctionInformation = async () => {
    const { accounts, contract } = this.state;

    // Get the auction information
    const response = await contract.methods.getAuctionInfo().call({ from: accounts[0] });
    this.setState({ auctionInfo: response })

    // Get the highest price and bidder, and the status of the auction
    const imageURI = await contract.methods.getImageURI().call();
    const highestPrice = await contract.methods.getHighestPrice().call();
    const highestBidder = await contract.methods.getHighestBidder().call();
    const basePrice = await contract.methods.getBasePrice().call();
    const originalOwner = await contract.methods.originalOwner().call();
    const newOwner = await contract.methods.newOwner().call();
    const isActive = await contract.methods.isActive().call();
    this.setState({ imageURI, highestPrice, highestBidder, basePrice, originalOwner, newOwner, isActive })
  }

  // ------------ BID FUNCTION ------------
  bid = async () => {
    const { accounts, contract } = this.state;

    // Bid at an auction for X value
    await contract.methods.bid().send({ from: accounts[0], value: this.state.value });

    // Get the new values: highest price and bidder, and the status of the auction
    const highestPrice = await contract.methods.getHighestPrice().call();
    const highestBidder = await contract.methods.getHighestBidder().call();
    const isActive = await contract.methods.isActive().call();

    // Update state with the result.
    this.setState({ isActive: isActive, highestPrice, highestBidder });
  };

  // ------------ STOP AUCTION FUNCTION ------------
  stopAuction = async () => {
    const { accounts, contract } = this.state;

    // Stop the auction
    await contract.methods.stopAuction().send({ from: accounts[0] });

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
          <div className="Auction-header">
              <div className="Header-context-information">
                <p> Network connected: {this.state.networkId}</p>
                <p> Your address: {this.state.accounts[0]}</p>
              </div>
          </div>

          {/* ---- Auction information ---- */}
          <div className="Auction-component-1">
            <div className="Auction-component-body">
              <h2 id="inline">Auction information</h2>
              <button id="button-call" onClick={this.getAuctionInformation}> GET INFORMATION</button>
              {
                this.state.auctionInfo &&
                <>
                  <div className="Auction-information">
                    {/* Auction Image */}
                    <div className="Auction-information-img">
                      {this.state.imageURI && <img src={this.state.imageURI}></img>}
                      {this.state.imageURI && <p><u>Descargar imágen</u> &nbsp;&nbsp; <u>Solicitar más imágenes</u></p>}
                    </div>
                    {/* Auction information */}
                    <div className="Auction-information-text">

                      {/* Auction Description */}
                      <p>{this.state.auctionInfo[0]}</p>

                      {/* Basic Information */}
                      <p><b>Status: </b>{this.state.isActive ? "The auction is still active!! 🤩 🤩" : "The auction is not longer active 😭 😭"}</p>
                      <p><b>Created at:</b> {this.state.auctionInfo[1]}</p>
                      <p><b>Duration:</b> {this.state.auctionInfo[2]} seconds</p>

                      {/* More information */}
                      {this.state.highestBidder && <p><b>Highest Bidder:</b> {this.state.highestBidder}</p>}
                      {this.state.highestPrice && <p><b>Highest Price:</b> {this.state.web3Provider.utils.fromWei(this.state.highestPrice, 'ether')} ether</p>}
                      {this.state.basePrice && <p><b>Base price:</b> {this.state.basePrice}</p>}
                      {this.state.originalOwner && <p><b>Original Owner:</b> {this.state.originalOwner}</p>}
                      {this.state.newOwner && <p><b>New Owner:</b> {this.state.newOwner}</p>}
                    </div>
                  </div>
                </>
              }
            </div>
          </div>


          {/* ---- Auction actions ---- */}
          <div className="Auction-component-2">
            <div className="Auction-component-body">
              <div className="Auction-actions">
                <h2>Auction actions</h2>

                {/* Input & Button to bid */}
                <input placeholder="Insert value in wei" onChange={(e) => this.setState({ value: e.target.value })}></input>
                <button id="button-send" onClick={this.bid}>BID</button>

                {/* Button to stop auction */}
                <button id="button-send" onClick={this.stopAuction}>STOP AUCTION</button>

                {/* Helper to convert wei to ether */}
                {this.state.value && <p>You're gonna bid: {this.state.web3Provider.utils.fromWei(this.state.value, 'ether')} ether</p>}
              </div>
            </div>
          </div>
       
      </div>
    );
  }
}