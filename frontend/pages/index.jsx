import { Contract, providers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import {
  CRYPTODEVS_DAO_ABI,
  CRYPTODEVS_DAO_CONTRACT_ADDRESS,
  CRYPTODEVS_NFT_ABI,
  CRYPTODEVS_NFT_CONTRACT_ADDRESS,
} from "../constants";
import styles from "../styles/Home.module.css";

export default function Home() {
  // ETH Balance of the DAO contract 
  const [treasuryBalance, setTreasuryBalance] = useState("0");
// Number of proposals created in the DAO 
const [numProposals, setNumProposal] = useState("0");
// Array of all proposals created in the DAO
const [proposals, setProposals] = useState([]);
// User's balance of CryptoDevs NFTs
const [nftBalance, setNftBalance] = useState("0");
// Fake NFT Token ID to purchase. Used when creating a proposal.
const [fakeNftTokenId, setFakeNftTokenId] = useState("");
// One of "Create Proposal" or "View Proposals"
const [selectedTab, setSelectedTab] = useState("");
// True if waiting for a transaction to be mined, false otherwise.
const [loading, setLoading] = useState(false);
// True if user has connected their wallet, false otherwise
const [walletConnected, setWalletConnected] = useState(false);
// isOwner gets the owner of the contract through the signed address
const [isOwner, setIsOwner] = useState(false);
const Web3ModalRef = useRef();

// Helper function to connect wallet
const connectWallet = async () => {
  try {
    await getProviderOrSigner();
    setWalletConnected(true);
  } catch (error) {
    console.error(error);
  }
};

const getDAOOwner = async () => {
  try {
    const signer = await getProviderOrSigner(true);
    const contract = getDAOContractInstance(signer);

    const _owner = await contract.owner();

    const address = await signer.getAddress();
    if (address.toLowerCase() === _owner.toLowercase()) {
      setIsOwner(true);
    }

  } catch (err) {
    console.error(err.message);
  }

};


const withdrawDAOEther = async () => {
  try {
    const signer = await getProviderOrSigner(true);
    const contract = getDAOContractInstance(signer);

    const tx = await contract.withdrawEther();
    setLoading(true);
    await tx.await();
    setLoading(false);
    getDAOTreasuryBalance();
  } catch (err) {
    console.error(err);
    window.alert(err.reason);
  }
};

const getDAOTreasuryBalance = async () => {
  try {
    const provider = await getProviderOrSigner();
    const balance = await provider.getBalance(
      CRYPTODEVS_DAO_CONTRACT_ADDRESS
    );
    setTreasuryBalance(balance.toString());
  } catch (error) {
    console.error(error);
  }
};

// Reads the number of proposals in the DAO contract and sets the `numProposals` state variable 
const getNumProposalsInDAO = async () => {
  try {
    const provider = getProviderOrSigner();
    const contract = getDAOContractInstance(provider);
    const daoNumberProposals = await contract.numProposals();
    setNumProposals(daoNumberProposals.toString());
  } catch (error) {
    console.error(error);
  }
};


// Reads the balance of the user's CryptoDevs NFTs and sets the `nftBalance` state variable
const getUserNFTBalance = async () => {
  try {
    const signer = getProviderOrSigner(true);
    const nftContract = getCryptodevsNFTContractInstance(signer);
    const balance = await nftContract.balanceOf(signer.getAddress());
    setNftBalance(parseInt(balance.toString()));
  } catch (error) {
    console.error(error);
  }
};






}