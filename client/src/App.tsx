import { StarknetProvider } from "@/StarknetProvider";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DonationEdit from "./pages/DonationEdit";
import Template from "./pages/Template";
import { EmbedlyContext } from "./context/contractContext";
import MyTemplate from "./pages/MyTemplate";
import NFTEdit from "./pages/NFTEdit";
import ConnectWallet from "./pages/ConnectWallet";
import { useContext } from "react";

function App() {
  const { currentAccount } = useContext(EmbedlyContext);

  return (
    <>
      <StarknetProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={currentAccount ? <Home /> : <ConnectWallet />}
            />
            <Route
              path="/template/donation"
              element={currentAccount ? <DonationEdit /> : <ConnectWallet />}
            />
            <Route
              path="/template/nft"
              element={currentAccount ? <NFTEdit /> : <ConnectWallet />}
            />
            <Route
              path="/custom/:id"
              element={currentAccount ? <Template /> : <ConnectWallet />}
            />
            <Route
              path="/mytemplates"
              element={currentAccount ? <MyTemplate /> : <ConnectWallet />}
            />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </StarknetProvider>
    </>
  );
}

export default App;
