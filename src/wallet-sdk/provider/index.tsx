import { createContext, FC, useEffect, useState, useContext, useMemo } from "react";
import type { WalletProviderProps, WalletContextValue, WalletState, Wallet } from "../types"
import WalletModal from '../components/WalletModal'
import ChainModal from '../components/ChainModal';
const WalletContext = createContext<WalletContextValue>({
  connect: async () => { },
  disconnect: async () => { },
  isConnected: false,
  isConnecting: false,
  address: "",
  chainID: 0,
  switchChain: async () => { },
  openModal: function (): void { },
  closeModal: function (): void { },
  openChainModal: function (): void { },
  closeChainModal: function (): void { },
  ensName: null,
  error: null,
  chains: [],
  provider: undefined,
});

export const WallerProvider: FC<WalletProviderProps> = ({
  children,
  chains,
  provider,
  wallets,
  autoConnect,
}) => {
  const [state, setState] = useState<WalletState>({
    address: '',
    chainID: -1,
    isConnecting: false,
    isConnected: false,
    ensName: '',
    error: null,
    chains,
    provider,
  })
  const [modalOpen, setModalOpen] = useState(false);
  const walletsMap = useMemo(() => {
    return wallets.reduce((acc, wallet) => {
      acc[wallet.id] = wallet;
      return acc;
    }, {} as Record<string, Wallet>);
  }, [wallets]);
  const [walletId, setWalletId] = useState("");
  const value: WalletContextValue = {
    ...state,
    connect: async (walletID: string) => {
      const wallet = walletsMap[walletID];
      if (!wallet) {
        throw new Error(`Wallet with ID ${walletID} not found`);
      }
      setState({
        ...state,
        isConnecting: true,
      })
      try {
        const { accounts, signer, chainId, address, provider } = await wallet.connector();
        setModalOpen(false);
        setWalletId(walletID);
        setState({
          ...state,
          isConnected: true,
          address,
          chainID: chainId,
          provider
        })
      } catch (error) {
        setState({
          ...state,
          error: error as Error,
        })
      }
    },
    disconnect: async () => {
      setState({
        ...state,
        isConnected: false,
        address: '',
        chainID: -1,
        provider: undefined,
      })
    },
    openChainModal: () => {
      setChainsOpen(true);
    },
    closeChainModal: () => {
      setChainsOpen(false);
    },
    switchChain: async (chainID: number) => {
      console.log("switchChain to ", chainID);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainID.toString(16)}` }], // 使用十六进制的链 ID
      })
      window.addEventListener("wallet_chain_changed", async(event: any) => {
        const newChainId = event.detail.chainId;
        console.log("chain_changed event:", newChainId);
        const wallet = walletsMap[walletId];
        const { accounts, signer, chainId, address, provider } = await wallet.connector();
        setState({
          ...state,
          isConnected: true,
          address,
          chainID: chainId,
          provider
        })
        window.removeEventListener("wallet_chain_changed", () => { });
      });
      setChainsOpen(false);
    },
    openModal: function (): void {
      console.log(111);

      setModalOpen(true);
    },
    closeModal: function (): void {
      setModalOpen(false);
    },
  }
  const [chainsOpen, setChainsOpen] = useState(false);
  useEffect(() => {
    if (autoConnect) { }
  }, [])
  return (
    <WalletContext.Provider value={value}>
      {children}
      <WalletModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        wallets={wallets}
        onSelectWallet={(wallet) => { value.connect(wallet.id); }}
        connecting={false}
        error={null}
      ></WalletModal>
      <ChainModal
        isOpen={chainsOpen}
        onClose={() => setChainsOpen(false)}
        chains={ChainsConfig}
        onSelectChain={value.switchChain}
      ></ChainModal>
    </WalletContext.Provider>
  )
};

export const useWallet = (): WalletContextValue => {
  const context = useContext(WalletContext);
  console.log("useWallet", context);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

export const ChainsConfig = [
  {
    id: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    currency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: {
      name: "Etherscan",
      url: "https://etherscan.io",
    },
  },
  {
    id: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    currency: {
      name: "Sepolia Ether",
      symbol: "SepoliaETH",
      decimals: 18,
    },
    blockExplorer: {
      name: "Etherscan",
      url: "https://sepolia.etherscan.io",
    },
  },
];

export default WallerProvider;