import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Carousel from "../../components/Carousel/Carousel.jsx";
import ProductSlide from "../../components/ProductSlide/ProductSlide.jsx";
import "./Main.css";

const Main = () => {
  const [mainBestLoading, setMainBestLoading] = useState(true);
  const [mainNewLoading, setMainNewLoading] = useState(true);
  const [mainRecommendLoading, setMainRecommendLoading] = useState(true);
  const [mainBest, setMainBest] = useState([]);
  const memoizedMainBest = useMemo(() => mainBest, [mainBest]);
  const [mainNew, setMainNew] = useState([]);
  const memoizedMainNew = useMemo(() => mainNew, [mainNew]);
  const [mainRecommend, setMainRecommend] = useState([]);
  const memoizedMainRecommend = useMemo(() => mainRecommend, [mainRecommend]);
  const pageSize = 7;

  const getBestProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/products`,
        {
          params: {
            size: pageSize,
            page: 0,
            condition: "BEST",
            category: "",
            order: "",
            keyword: "",
          },
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );
      setMainBest(response.data.content);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const getNewProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/products`,
        {
          params: {
            size: pageSize,
            page: 0,
            condition: "NEW",
            category: "",
            order: "",
            keyword: "",
          },
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );
      setMainNew(response.data.content);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const getRecommendProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/products`,
        {
          params: {
            size: pageSize,
            page: 0,
            condition: "RECOMMEND",
            category: "",
            order: "",
            keyword: "",
          },
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
          withCredentials: true,
        }
      );
      setMainRecommend(response.data.content);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    getBestProducts();
    getNewProducts();
    getRecommendProducts();
  }, []);

  useEffect(() => {
    if (memoizedMainBest.length > 0) {
      setMainBestLoading(false);
    }
  }, [memoizedMainBest]);

  useEffect(() => {
    if (memoizedMainNew.length > 0) {
      setMainNewLoading(false);
    }
  }, [memoizedMainNew]);

  useEffect(() => {
    if (memoizedMainRecommend.length > 0) {
      setMainRecommendLoading(false);
    }
  }, [memoizedMainRecommend]);

  return (
    <div className="contents-body">
      <Carousel />
      <ProductSlide
        loading={mainNewLoading}
        products={mainNew}
        sectionTitle="New Products"
      />
      <ProductSlide
        loading={mainRecommendLoading}
        products={mainRecommend}
        sectionTitle="Recommend Products"
      />
      <ProductSlide
        loading={mainBestLoading}
        products={mainBest}
        sectionTitle="Best Products"
      />
    </div>
  );
};

export { Main };
