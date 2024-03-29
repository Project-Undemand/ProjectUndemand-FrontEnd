/* eslint-disable */
import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Topbar from "./components/Topbar/Topbar.jsx";
import { Main } from "./pages/Main/Main.jsx";
import { Signup } from "./components/Signup.jsx";
import { Login } from "./components/Login.jsx";
import { CategoryPage } from "./pages/Category/CategoryPage.jsx";
import { ProductDetailPage } from "./pages/ProductDetailPage/ProductDetailPage.jsx";
import Footer from "./components/Footer/Footer.jsx";
import './App.css';

function App() {
  const [isScroll, setIscroll] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
        if (window.scrollY > 120) {
          setIscroll(true);
        } else {
          setIscroll(false);
        }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate]);

  return (
    <div className="Body">
      <div className={`Top-section ${isScroll ? 'scroll' : ''}`}>
        <Topbar isMenuVisible={isMenuVisible} setIsMenuVisible={setIsMenuVisible} />
      </div>

      <div className={`Middle-section ${isScroll ? 'scroll' : ''}`}>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/:category" element={<CategoryPage />}></Route>
          <Route path="/detail" element={<ProductDetailPage />}></Route>
        </Routes>
      </div>

      <div className="Bottom-section">
        <Footer />
        <div className="nothing"></div>
      </div>
    </div>
  );
}

export default App;
