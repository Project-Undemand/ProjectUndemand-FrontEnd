import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMemberLists } from "../MemberAdminApiUtil";
import "./MemberManagementPage.css";

function MemberManagementPage({ profileData }) {
  const dispatch = useDispatch();

  const members = useSelector((state) => state.memberList);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 5;

  const memberId = localStorage.getItem("memberId");
  const memberRole = profileData?.member?.member_role;

  useEffect(() => {
    const fetchData = async () => {
      if (memberRole === "ADMIN") {
        fetchMemberLists(dispatch);
      }
    };
    fetchData();
  }, [dispatch, memberRole]);

  useEffect(() => {
    if (selectedRole === "ALL") {
      setFilteredMembers(members);
    } else {
      setFilteredMembers(
        members.filter((member) => member.memberRole === selectedRole)
      );
    }
  }, [selectedRole]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setIsDropdownVisible(false); // 선택 후 드롭다운을 숨깁니다.
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(
    indexOfFirstMember,
    indexOfLastMember
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredMembers.length / membersPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="content-middle">
      <div className="admin-contents-container">
        <div className="members-info-container">
          <div className="members-info-contents">
            <h2>회원 ({`${Object.keys(members).length}명`})</h2>
            <p>전체 회원에 대한 리스트입니다.</p>
            <table
              border="1"
              summary=""
              className="ec-base-table members-table"
            >
              <colgroup className="address-table-header">
                <col style={{ width: "33px" }} />
                <col style={{ width: "40px" }} />
                <col style={{ width: "80px" }} />
                <col style={{ width: "auto" }} />
                <col style={{ width: "200px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "120px" }} />
              </colgroup>
              <thead className="address-list-header">
                <tr>
                  <th scope="col">
                    <input id="allCheck" type="checkbox" />
                  </th>
                  <th scope="col">id</th>
                  <th scope="col" className="role-header">
                    role
                    <select
                      value={selectedRole}
                      onChange={handleRoleChange}
                      className="role-dropdown"
                    >
                      <option value="ALL">All</option>
                      <option value="USER">USER</option>
                      <option value="SELLER">SELLER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </th>
                  <th scope="col">email</th>
                  <th scope="col">제조업체</th>
                  <th scope="col">생성일</th>
                  <th scope="col">최근로그인</th>
                </tr>
              </thead>
              <tbody className="members-body">
                {currentMembers.map((member) => (
                  <tr className="table-row" key={member.id}>
                    <td>
                      <input
                        type="checkbox"
                        name="ma_idx[]"
                        value={member.id}
                      />
                    </td>
                    <td>
                      <span>{member.id}</span>
                    </td>
                    <td>
                      <span>{member.memberRole}</span>
                    </td>
                    <td>
                      <span>{member.email}</span>
                    </td>
                    <td>
                      <span>{member.manufacturer || "-"}</span>
                    </td>
                    <td>
                      <span>
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span>
                        {member.lastLoginAt
                          ? new Date(member.lastLoginAt).toLocaleDateString()
                          : "-"}
                      </span>
                    </td>
                  </tr>
                ))}
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
              <button className="delete-button">판매자 등록</button>
              <button className="register-button">비활성화</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { MemberManagementPage };
