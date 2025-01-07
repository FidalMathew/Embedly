import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { Button } from "../components/ui/button";

function Home() {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect({});

  return (
    <div>
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
