import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPaymentHistoryListByAdmin,
  fetchPaymentHistoryListBySeller,
} from "../MemberAdminApiUtil";
import "./MemberManagementPage.css";
import { groupByOrderId } from "../../../MyPage/MyPageApiUtils";

function PaymentManagementPage({ profileData }) {
  const dispatch = useDispatch();
  const PaymentHistoryListByAdmin = useSelector(
    (state) => state.PaymentHistoryListByAdmin
  );
  const PaymentHistoryListBySeller = useSelector(
    (state) => state.PaymentHistoryListBySeller
  );
  const [PaymentHistories, setPaymentHistories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;

  const memberRole = localStorage.getItem("memberRole");

  useEffect(() => {
    const fetchData = async () => {
      if (memberRole === "ADMIN") {
        await fetchPaymentHistoryListByAdmin(dispatch);
        setPaymentHistories(PaymentHistoryListByAdmin);
      }
      if (memberRole === "SELLER") {
        await fetchPaymentHistoryListBySeller(dispatch);
        setPaymentHistories(PaymentHistoryListBySeller);
      }
    };
    fetchData();
  }, [dispatch, memberRole]);

  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = PaymentHistories.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(PaymentHistories.length / paymentsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // 비어있는 행 추가 로직
  const emptyRows = [];
  if (currentPayments.length < paymentsPerPage) {
    for (let i = currentPayments.length; i < paymentsPerPage; i++) {
      emptyRows.push(
        <tr className="table-row" key={`empty-${i}`}>
          <td>
            <input type="checkbox" disabled />
          </td>
          <td>
            <span>&nbsp;</span>
          </td>
          <td>
            <span>&nbsp;</span>
          </td>
          <td>
            <span>&nbsp;</span>
          </td>
          <td>
            <span>&nbsp;</span>
          </td>
          <td>
            <span>&nbsp;</span>
          </td>
          <td>
            <span>&nbsp;</span>
          </td>
          <td>
            <span>&nbsp;</span>
          </td>
          <td>
            <span>&nbsp;</span>
          </td>
          <td>
            <span>&nbsp;</span>
          </td>
          <td>
            <span>&nbsp;</span>
          </td>
        </tr>
      );
    }
  }

  return (
    <div className="content-middle">
      <div className="admin-contents-container">
        <div className="members-info-container">
          <div className="members-info-contents">
            <h2>Payments ({`${PaymentHistories.length}건`})</h2>
            <p>전체 결제 내역 리스트입니다.</p>
            <table
              border="1"
              summary=""
              className="ec-base-table members-table"
            >
              <colgroup className="address-table-header">
                <col style={{ width: "33px" }} />
                <col style={{ width: "33px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "40px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "120px" }} />
              </colgroup>
              <thead className="address-list-header">
                <tr>
                  <th scope="col">
                    <input id="allCheck" type="checkbox" />
                  </th>
                  <th scope="col">Order ID</th>
                  <th scope="col">Payment ID</th>
                  <th scope="col">Orderer Name</th>
                  <th scope="col">Payment Status</th>
                  <th scope="col">Payment Method</th>
                  <th scope="col">Ordered At</th>
                  <th scope="col">Paied At</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Option</th>
                  <th scope="col">Manufacturer</th>
                </tr>
              </thead>
              <tbody className="members-body">
                {currentPayments.map((payment) => (
                  <tr className="table-row" key={payment.paymentId}>
                    <td>
                      <input
                        type="checkbox"
                        name="payment_idx[]"
                        value={payment.paymentId}
                      />
                    </td>
                    <td>
                      <span>{payment.orderId}</span>
                    </td>
                    <td>
                      <span>{payment.paymentId}</span>
                    </td>
                    <td>
                      <span>{payment.ordererName}</span>
                    </td>
                    <td>
                      <span>{payment.statusType}</span>
                    </td>
                    <td>
                      <span>{payment.payMethod}</span>
                    </td>
                    <td>
                      <span>
                        {new Date(payment.orderedAt).toLocaleDateString(
                          "ko-KR",
                          { year: "2-digit", month: "numeric", day: "numeric" }
                        )}
                      </span>
                    </td>
                    <td>
                      <span>
                        {new Date(payment.paiedAt).toLocaleDateString("ko-KR", {
                          year: "2-digit",
                          month: "numeric",
                          day: "numeric",
                        })}
                      </span>
                    </td>

                    <td>
                      <span>{payment.productPrice}</span>
                    </td>
                    <td>
                      <span>{payment.productQuantity}</span>
                    </td>
                    <td>
                      <span>{payment.option}</span>
                    </td>
                    <td>
                      <span>{payment.manufacturer}</span>
                    </td>
                  </tr>
                ))}
                {emptyRows}
              </tbody>
            </table>
            <div className="pagination">
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={number === currentPage ? "active" : ""}
                >
                  {number}
                </button>
              ))}
            </div>
            <div className="address-actions">
              <button className="register-button">판매자 등록</button>
              <button className="delete-button">비활성화</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { PaymentManagementPage };
