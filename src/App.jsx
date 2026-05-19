import { Route, Routes } from "react-router-dom";
import { RatingProvider } from "./context/RatingProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import Navbar from "./components/Navbar";
import CursorGlow from "./components/CursorGlow";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";

const App = () => {
  return (
    <ThemeProvider>
      <RatingProvider>
        <CursorGlow />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
          </Routes>
          <Footer />
        </div>
      </RatingProvider>
    </ThemeProvider>
  );
};

export default App;
