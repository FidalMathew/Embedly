import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    ethereum: any;
  }
}

import { useContext, useState } from "react";
import { ethers } from "ethers";
import { EmbedlyContext } from "@/context/contractContext";

interface DonationCitreaProps {
  bgColor: string;
  imageUrl?: string; // Optional prop for image URL
  heading: string;
  text: string;
  buttonColor: string;
  btnText: string;
  reciverAddress: string;
}

function DonationCitrea({
  bgColor,
  imageUrl, // Default image if no URL is provided
  heading,
  text,
  buttonColor,
  btnText,
  reciverAddress,
}: DonationCitreaProps) {
  const [ethAmount, setEthAmount] = useState<string>("0");
  const { currentAccount, connectWallet } = useContext(EmbedlyContext);

  const sendEth = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      // Ensure the amount is valid
      if (isNaN(Number(ethAmount)) || Number(ethAmount) <= 0) {
        alert("Please enter a valid ETH amount.");
        return;
      }

      //   setIsSending(true);

      // Connect to MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request accounts
      const signer = provider.getSigner();

      // Send transaction
      const tx = await signer.sendTransaction({
        to: reciverAddress,
        value: ethers.utils.parseEther(ethAmount), // Convert ETH to wei
      });

      console.log("Transaction sent:", tx);
      alert(`Transaction successful! Hash: ${tx.hash}`);
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
        <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden">
          <img
            src={imageUrl}
            alt="Donation"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Text Section */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">{heading}</h2>
          <p className="text-sm text-gray-600 mt-2">{text}</p>
        </div>

        {/* Input Section */}
        <div className="mt-4">
          <label
            htmlFor="donation-amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <Input
            type="text"
            id="donation-amount"
            placeholder="Enter amount in ETH"
            className="mt-2 w-full"
            value={ethAmount}
            onChange={(e) => {
              console.log("ethAmount", e.target.value);
              setEthAmount(e.target.value);
            }}
          />
        </div>

        {/* Button Section */}
        <div className="mt-4">
          <Button
            className="w-full"
            style={{ backgroundColor: buttonColor, color: "#fff" }}
            onClick={() => {
              if (currentAccount) {
                sendEth();
              } else {
                connectWallet();
              }
            }}
          >
            {currentAccount ? btnText : "Connect with Metamask"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DonationCitrea;
