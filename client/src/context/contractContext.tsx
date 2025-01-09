import { useEffect, useState, createContext, ReactNode } from "react";
import { ethers } from "ethers";

// Extend the Window interface to include the ethereum property
interface CustomWindow extends Window {
  ethereum: any;
}
declare let window: CustomWindow;

export const EmbedlyContext = createContext({
  chainId: "",
  currentAccount: "",
  switchNetwork: () => {},
  connectWallet: () => {},
});

export default function EmbedlyProvider({ children }: { children: ReactNode }) {
  const [chainId, setChainId] = useState<string>("");
  const [currentAccount, setCurrentAccount] = useState<string>("");

  const { ethereum } = window;

  useEffect(() => {
    if (!ethereum) {
      console.log("Metamask not found");
      return;
    }

    // Define handlers
    const handleAccountsChanged = (accounts: string[]) => {
      setCurrentAccount(accounts[0]);
    };

    const handleChainChanged = (chainId: string) => {
      window.location.reload();
    };

    // Handle account change
    ethereum.on("accountsChanged", handleAccountsChanged);

    // Handle chain change
    ethereum.on("chainChanged", handleChainChanged);

    // Cleanup on unmount
    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [ethereum]);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        if (!ethereum) {
          console.log("Metamask not found");
          return;
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
        } else {
          setCurrentAccount("");
        }

        const currChainId = await ethereum.request({ method: "eth_chainId" });
        setChainId(currChainId);
      } catch (error) {
        console.log(error);
      }
    };

    checkIfWalletIsConnected();
  }, []); // Dependency array with an empty array means it runs only once, after component mounts

  const connectWallet = async () => {
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const switchNetwork = async () => {
    try {
      if (ethereum) {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13fb" }], // Hexadecimal chainId
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Chain ID:", chainId);

    if (chainId !== "0x13fb" && ethereum) {
      console.log("Switching network");
      switchNetwork();
    }
  }, [chainId]); // Dependency array now includes only chainId

  return (
    <EmbedlyContext.Provider
      value={{
        chainId,
        currentAccount,
        switchNetwork,
        connectWallet,
      }}
    >
      {children}
    </EmbedlyContext.Provider>
  );
}
