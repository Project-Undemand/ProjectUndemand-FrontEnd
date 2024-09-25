import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import "./InquiryPage.css";
import axios from "axios";

function InquiryPage() {
  // const [selectedInquirySortOption, setSelectedInquirySortOption] =
  //   useState("최신순");
  // const [sortOptionClick, setSortOptionClick] = useState(false);
  // const [selectedInquiryFilterOption, setSelectedInquiryFilterOption] =
  //   useState("전체 보기");
  // const [filterOptionClick, setFilterOptionClick] = useState(false);
  const [inquiryData, setInquiryData] = useState([]);
  const [inquiryDataLength, setInquiryDataLength] = useState(0);

  useEffect(() => {
    const fetchInquiryData = async () => {
      try {
        const inquiryResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/inquiry`,
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
            withCredentials: true,
          }
        );
        setInquiryData(inquiryResponse.data);
        console.log(inquiryData);
        setInquiryDataLength(inquiryResponse.data.length);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    fetchInquiryData();
  }, []);

  return (
    <div className="inquiry-page">
      <div className="inquiry-page-top">
        <h3>Q&A</h3>
        <div className="inquiry-count">{`${inquiryDataLength}개의 문의 글`}</div>
      </div>
      {/* <div className="inquiry-page-middle">
        <div className="inquiry-filter">
          <div className="inquiry-sort-box">
            <div
              className="selected-sort-option"
              onClick={() => setSortOptionClick((prevState) => !prevState)}
            >{`정렬: ${selectedInquirySortOption}`}</div>
            <ul
              className={`inquiry-sort-option ${
                sortOptionClick && "drop-option"
              }`}
            >
              <li>최신순</li>
              <li>오래된순</li>
            </ul>
          </div>
          <div className="inquiry-search"></div>
          <div className="inquiry-filter-box">
            <div
              className="selected-filter-option"
              onClick={() => setFilterOptionClick((prevState) => !prevState)}
            >{`필터: ${selectedInquiryFilterOption}`}</div>
            <ul
              className={`inquiry-filter-option ${
                filterOptionClick && "drop-option"
              }`}
            >
              <li>{`전체 보기`}</li>
              <li>{`상품 문의`}</li>
              <li>{`배송 문의`}</li>
              <li>{`교환 문의`}</li>
              <li>{`반품 문의`}</li>
              <li>{`취소 문의`}</li>
              <li>{`기타 문의`}</li>
            </ul>
          </div>
        </div>
      </div> */}
      <div className="inquiry-article-section">
        {inquiryData.map((tableRow) => (
          <div key={tableRow.inquiryId} className="inquiry-section">
            <div className="inquiry-num-and-category-box">
              <div className="inquiry-num">
                <span>{`번호: ${tableRow.inquiryId}`}</span>
              </div>
              <div className="inquiry-category">
                <span>{`카테고리: ${tableRow.inquiryType}`}</span>
              </div>
            </div>
            <div className="inquiry-content-box">
              <h2 className="inquiry-title">{tableRow.inquiryTitle}</h2>
              {/* <img src={tableRow.inquiryInfo ? tableRow.inquiryInfo.productImgSrc : ''} alt={tableRow.inquiryInfo ? tableRow.inquiryInfo.productName : ''} className="inquiry-img"/> */}
            </div>
            <div className="writer-info-box">
              <div className="inquiry-writer">{`${tableRow.name.slice(
                0,
                1
              )}${"*"
                .repeat(Math.max(0, tableRow.name.length - 1))
                .slice(0, 2)}`}</div>
              <div className="inquiry-date">{tableRow.createdAt}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { InquiryPage };
