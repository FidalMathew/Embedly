import { StarknetProvider } from "@/StarknetProvider";
import Home from "./pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DonationStarknetEdit from "./pages/DonationStarknetEdit";
import Template from "./pages/Template";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
