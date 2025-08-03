// src/Component/web3.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import toast from 'react-hot-toast';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) throw new Error('useWeb3 must be used within a Web3Provider');
  return context;
};

export const Web3Provider = ({ children }) => {
  // State
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [walletType, setWalletType] = useState(null); // 'metamask' or 'phantom'
  const [isConnected, setIsConnected] = useState(false);

  // Silent auto-connect (only if already connected/trusted)
  useEffect(() => {
    // Silent MetaMask
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts && accounts.length > 0) {
            setProvider(new ethers.BrowserProvider(window.ethereum));
            setAccount(accounts[0]);
            setWalletType('metamask');
            setIsConnected(true);
          }
        });
    }
    // Silent Phantom
    if (window.solana && window.solana.isPhantom) {
      window.solana.connect({ onlyIfTrusted: true }).then(res => {
        if (res.publicKey) {
          setAccount(res.publicKey.toString());
          setWalletType('phantom');
          setIsConnected(true);
        }
      }).catch(() => {});
    }
  }, []);

  // MetaMask connect (triggered by button click)
  const connectMetaMask = async () => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      toast.error('MetaMask is not installed');
      return { success: false };
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      const signer = await providerInstance.getSigner();
      const address = await signer.getAddress();
      const network = await providerInstance.getNetwork();
      setProvider(providerInstance);
      setAccount(address);
      setChainId(network.chainId.toString());
      setWalletType('metamask');
      setIsConnected(true);
      toast.success('MetaMask connected!');
      return { success: true, address };
    } catch (error) {
      toast.error('MetaMask connection cancelled or failed');
      return { success: false };
    }
  };

  // Phantom connect (triggered by button click)
  const connectPhantom = async () => {
    if (!window.solana || !window.solana.isPhantom) {
      toast.error('Phantom wallet is not installed');
      return { success: false };
    }
    try {
      const res = await window.solana.connect();
      setAccount(res.publicKey.toString());
      setWalletType('phantom');
      setIsConnected(true);
      toast.success('Phantom wallet connected!');
      return { success: true, address: res.publicKey.toString() };
    } catch (err) {
      toast.error('Phantom connection cancelled or failed');
      return { success: false };
    }
  };

  // Disconnect (only for Phantom; MetaMask doesn't support programmatic disconnect)
  const disconnect = async () => {
    if (walletType === 'phantom' && window.solana && window.solana.isPhantom) {
      try {
        await window.solana.disconnect();
      } catch {}
    }
    setAccount(null);
    setProvider(null);
    setChainId(null);
    setWalletType(null);
    setIsConnected(false);
    toast.success('Wallet disconnected');
  };

  // Optional: ETH payment function
  const sendEthereumPayment = async (amount, toAddress) => {
    if (!provider || walletType !== 'metamask') {
      toast.error('MetaMask not connected');
      return { success: false };
    }
    try {
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount.toString())
      });
      toast.success('Transaction sent! Waiting for confirmation...');
      const receipt = await tx.wait();
      return {
        success: true,
        hash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      toast.error('Payment failed');
      return { success: false, error: error.message };
    }
  };

  // Optional: SOL payment function
  const sendSolanaPayment = async (amount, toAddress) => {
    if (!window.solana || walletType !== 'phantom') {
      toast.error('Phantom wallet not connected');
      return { success: false };
    }
    try {
      // Default to public mainnet RPC; use your API if desired
      const connection = new Connection('https://api.mainnet.helius-rpc.com/?api-key=9cbff781-ff6f-45b5-817c-f53e251e4599');
      const fromPubkey = new PublicKey(account);
      const toPubkey = new PublicKey(toAddress);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: Math.round(amount * 1e9) // SOL -> lamports
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      const signed = await window.solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());

      toast.success('Transaction sent! Waiting for confirmation...');
      await connection.confirmTransaction(signature);

      return {
        success: true,
        hash: signature
      };
    } catch (error) {
      toast.error('Payment failed');
      return { success: false, error: error.message };
    }
  };

  // Context value
  const value = {
    account,
    provider,
    chainId,
    walletType,
    isConnected,
    connectMetaMask,
    connectPhantom,
    disconnect,
    sendEthereumPayment,
    sendSolanaPayment
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
