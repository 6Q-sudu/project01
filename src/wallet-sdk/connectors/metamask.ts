import { ethers } from 'ethers'
import type { Wallet } from '../types'
const connectMetamask = async (): Promise<any> => {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }
    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    console.log("address:", address);
    const { chainId } = await provider.getNetwork();
    console.log("chainID:", chainId);



    window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
      console.log('Accounts changed:', newAccounts);
      if (newAccounts.length === 0) {
        window.dispatchEvent(new CustomEvent("wallet_disconnected"));
      } else {
        window.dispatchEvent(new CustomEvent("wallet_connected", { detail: { accounts: newAccounts } }));
      }
    });

    window.ethereum.on('chainChanged', (newChainIdHex: string) => {
      const newChainId = parseInt(newChainIdHex);
      console.log('Chain changed:', newChainId);
      window.dispatchEvent(new CustomEvent("wallet_chain_changed", { detail: { chainId: newChainId } }));
    });

    return { accounts, signer, chainId, address, provider }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to connect to MetaMask: ${errMsg}`);
  }
}

export const metaMaskWallet: Wallet = {
  id: 'metamask',
  name: 'MetaMask',
  icon: 'https://portfolio.metamask.io/favicon.png',
  connector: connectMetamask,
  description: 'MetaMask is a crypto wallet & gateway to blockchain apps',
  installed: true,
  downloadLink: 'https://metamask.io/download.html'
}

export default metaMaskWallet