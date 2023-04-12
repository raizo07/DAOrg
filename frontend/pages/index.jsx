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







}