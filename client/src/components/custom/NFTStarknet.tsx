import { Button } from "@/components/ui/button";
import {
  useAccount,
  useConnect,
  useContract,
  // useDisconnect,
  useSendTransaction,
} from "@starknet-react/core";
import { useMemo } from "react";

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
  imageUrl, // Default image if no URL is provided
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
  // const { disconnect } = useDisconnect({});

  // const testAddress =
  //   "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

  // get abi from url

  const starknetContractAbi = fetch(abiUrl).then((res) => res.json());

  const { contract } = useContract({
    abi: starknetContractAbi as any,
    address: contractAddress,
  });

  const calls = useMemo(() => {
    if (!address || !contract) return [];
    try {
      // return [contract.populate("set_count", [BigInt(679)])];

      return [contract.populate(functionToInvoke)];
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [contract, address, contractAddress]);

  const { send: writeAsync } = useSendTransaction({
    calls: calls,
  });

  return (
    <div
      className="border rounded-lg shadow-md p-6 max-w-sm mt-28 "
      style={{
        backgroundColor: bgColor,
        height: "500px",
        width: "400px",
      }}
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
            if (address) {
              writeAsync();
            } else {
              connectors.length > 0 ? (
                connectors.map((connector, index) =>
                  connectors[index].id == "argentX" ? (
                    connect({ connector })
                  ) : (
                    <></>
                  )
                )
              ) : (
                <></>
              );
            }
          }}
        >
          {btnText}
        </Button>
      </div>
    </div>
  );
}

export default NFTStarknet;
