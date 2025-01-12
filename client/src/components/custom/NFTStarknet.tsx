import { Button } from "@/components/ui/button";
import {
  useAccount,
  useConnect,
  useContract,
  useSendTransaction,
} from "@starknet-react/core";
import { useEffect, useMemo, useState } from "react";

interface NFTStarknetProps {
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

function NFTStarknet({
  bgColor,
  imageUrl,
  heading,
  text,
  buttonColor,
  btnText,
  contractAddress,
  functionToInvoke,
  abiUrl,
}: NFTStarknetProps) {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();

  // State for storing the fetched ABI
  const [starknetContractAbi, setStarknetContractAbi] = useState<any | null>(
    null
  );

  // Fetch ABI from the provided URL
  useEffect(() => {
    const fetchAbi = async () => {
      try {
        const response = await fetch(abiUrl);
        const abi = await response.json();
        setStarknetContractAbi(abi);
      } catch (error) {
        console.error("Error fetching ABI:", error);
      }
    };
    fetchAbi();
  }, [abiUrl]);

  // Initialize the contract with the ABI
  const { contract } = useContract({
    abi: starknetContractAbi,
    address: contractAddress,
  });

  // Create transaction calls
  const calls = useMemo(() => {
    if (!address || !contract) return [];

    console.log("address", address);
    console.log("contract", contract);
    console.log("functionToInvoke", functionToInvoke);

    try {
      if (
        contractAddress ==
        "0x0677d03cae9538bcd7c3325e5bd75ab778959fdf499323503ca657bf90e4c55c"
      )
        return [
          contract.populate(functionToInvoke, [
            address,
            BigInt(11),
            [BigInt(1)],
          ]),
        ];
      else return [contract.populate(functionToInvoke, [address])];
    } catch (error) {
      console.error("Error populating function call:", error);
      return [];
    }
  }, [contract, address, starknetContractAbi]);

  const { send: writeAsync } = useSendTransaction({
    calls,
  });

  return (
    <div className="flex justify-center">
      <div
        className=" p-6 "
        style={{ backgroundColor: bgColor, height: "500px", width: "400px" }}
      >
        {/* Image Section */}
        <div className="w-full h-72 bg-gray-200 rounded-md overflow-hidden">
          <img
            src={imageUrl || "https://via.placeholder.com/400"}
            alt={imageUrl ? "NFT Image" : "Default Placeholder"}
            className="w-full h-full object-cover"
          />
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
              console.log("address", address);

              if (address) {
                writeAsync();
              } else {
                const argentXConnector = connectors.find(
                  (connector) => connector.id === "argentX"
                );
                if (argentXConnector) {
                  connect({ connector: argentXConnector });
                } else {
                  console.error("ArgentX connector not found.");
                }
              }
            }}
          >
            {address ? btnText : "Connect with ArgentX "}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NFTStarknet;
