import {
  useAccount,
  useConnect,
  useContract,
  useDisconnect,
  useSendTransaction,
} from "@starknet-react/core";
import React, { useMemo } from "react";
import { starknetCounterAbi } from "../lib/starknetAbi";
import { Button } from "../components/ui/button";

function Home() {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect({});

  const testAddress =
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

  const { contract } = useContract({
    abi: starknetCounterAbi as any,
    address: testAddress,
  });

  const calls = useMemo(() => {
    if (!address || !contract) return [];
    try {
      console.log("contract", contract);
      // return [contract.populate("set_count", [BigInt(679)])];
      return [
        contract.populate("transfer", [
          "0x01a4B0066a5d7520c710cb07940c0Cb83355Ec1aE47d8D257eEeCD16A51225FA",
          BigInt(679),
        ]),
      ];
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [contract, address]);

  const { send: writeAsync } = useSendTransaction({
    calls: calls,
  });

  return (
    <div>
      <Button onClick={() => writeAsync()}>Test</Button>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <p className="font-semibold">{address ? address : "0x"}</p>
          {!address && connectors.length > 0 ? (
            connectors.map((connector, index) =>
              connectors[index].id == "argentX" ? (
                <Button key={index} onClick={() => connect({ connector })}>
                  Connect {connector.id}
                </Button>
              ) : (
                <></>
              )
            )
          ) : (
            <Button
              onClick={() => {
                disconnect();
              }}
            >
              Disconnect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
