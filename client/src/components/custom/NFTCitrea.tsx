import { Button } from "@/components/ui/button";
import { EmbedlyContext } from "@/context/contractContext";
import { ethers } from "ethers";

import { useContext } from "react";

interface NFTCitreaProps {
  bgColor: string;
  imageUrl?: string; // Optional prop for image URL
  heading: string;
  text: string;
  buttonColor: string;
  btnText: string;
  contractAddress: `0x${string}`;
  functionToInvoke: string;
  abiUrl: string;
}

function NFTCitrea({
  bgColor,
  imageUrl, // Default image if no URL is provided
  heading,
  text,
  buttonColor,
  btnText,
  contractAddress,
  functionToInvoke,
  abiUrl,
}: NFTCitreaProps) {
  const { currentAccount, connectWallet } = useContext(EmbedlyContext);

  const callContract = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      //   setIsSending(true);

      // Connect to MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request accounts
      const signer = provider.getSigner();

      // call contract

      const contractAbi = await fetch(abiUrl).then((res) => res.json());

      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );

      console.log("contract", contract);

      const tx = await contract[functionToInvoke]();
      console.log("Transaction:", tx);
      alert("Transaction sent!");
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Failed to send transaction.");
    } finally {
      //   setIsSending(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div
        className=" p-6 "
        style={{ backgroundColor: bgColor, height: "500px", width: "400px" }}
      >
        {/* Image Section */}
        <div className="w-full h-72 bg-gray-200 rounded-md overflow-hidden">
          <img src={imageUrl} alt="user" className="-z-50 overflow-hidden" />
        </div>

        {/* Text Section */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">{heading}</h2>
          <p className="text-sm text-gray-600 mt-2">{text}</p>
        </div>

        {/* Button Section */}
        <div className="mt-4">
          <Button
            className="w-full"
            style={{ backgroundColor: buttonColor, color: "#fff" }}
            onClick={() => {
              if (currentAccount) {
                callContract();
              } else {
                connectWallet();
              }
            }}
          >
            {btnText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NFTCitrea;
