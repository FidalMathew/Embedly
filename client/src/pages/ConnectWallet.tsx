import { Button } from "@/components/ui/button";
import { EmbedlyContext } from "@/context/contractContext";
import { useContext } from "react";

function ConnectWallet() {
  const { connectWallet } = useContext(EmbedlyContext);
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-extrabold text-purple-800  mb-6">
        Connect Wallet to Get Started
      </h2>

      <Button
        className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={() => {
          console.log("Connect Wallet", connectWallet);
          connectWallet();
        }}
      >
        Connect Wallet
      </Button>
    </div>
  );
}

export default ConnectWallet;
