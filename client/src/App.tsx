import { StarknetProvider } from "@/StarknetProvider";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DonationStarknetEdit from "./pages/DonationStarknetEdit";
import Template from "./pages/Template";
import EmbedlyProvider from "./context/contractContext";

function App() {
  return (
    <>
      <EmbedlyProvider>
        <StarknetProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/template/donation"
                element={<DonationStarknetEdit />}
              />
              <Route path="/custom/:id" element={<Template />} />
              <Route path="*" element={<div>Not Found</div>} />
            </Routes>
          </BrowserRouter>
        </StarknetProvider>
      </EmbedlyProvider>
    </>
  );
}

export default App;
