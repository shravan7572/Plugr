import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Upcoming from "./pages/Upcoming";
import { NotFound } from "./pages/notfound";
import NoInternet from "./pages/Nodata";

function App() {
  return (
    <BrowserRouter>
      <NoInternet />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;