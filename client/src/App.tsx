import { StarknetProvider } from "@/StarknetProvider";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DonationEdit from "./pages/DonationEdit";
import Template from "./pages/Template";
import EmbedlyProvider from "./context/contractContext";
import MyTemplate from "./pages/MyTemplate";

function App() {
  return (
    <>
      <EmbedlyProvider>
        <StarknetProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/template/donation" element={<DonationEdit />} />
              <Route path="/custom/:id" element={<Template />} />
              <Route path="/mytemplates" element={<MyTemplate />} />
              <Route path="*" element={<div>Not Found</div>} />
            </Routes>
          </BrowserRouter>
        </StarknetProvider>
      </EmbedlyProvider>
    </>
  );
}

export default App;
