import React, { useEffect, useState } from "react";
import { Table, Select, Tag, Typography } from "antd";
import axios from "axios";
import { useEnum } from "../../Enums/useEnum";

const { Option } = Select;
const { Title } = Typography;

const UserTable = ({ managerId }) => {
  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState(null); // ← חדש
  const [loading, setLoading] = useState(true);
 const userData = localStorage.getItem("user");
  // const user= userData ? JSON.parse(userData) :null;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8080/Manager/getByIdWithQueueElderlyToSignIn/${managerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
       
        setUsers(res.data.QueueElderlyToSignIn || []);
      } catch (error) {
        console.error("שגיאה בשליפת המשתמשים:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [managerId]);

  const handleRoleFilter = (value) => {
    setFilteredRole(value);
  };

  const handleStatusFilter = (value) => {
    setFilteredStatus(value);
  };

  const filteredUsers = users.filter((user) => {
    const roleMatch = filteredRole ? user.Role === filteredRole : true;
    const statusMatch = filteredStatus ? user.Status === filteredStatus : true;
    return roleMatch && statusMatch;
  });

  const columns = [
    {
      title: "שם פרטי",
      dataIndex: "FirstName",
      key: "FirstName",
      sorter: (a, b) => a.FirstName.localeCompare(b.FirstName),
    },
    {
      title: "שם משפחה",
      dataIndex: "LastName",
      key: "LastName",
      sorter: (a, b) => a.LastName.localeCompare(b.LastName),
    },
    {
      title: "אימייל",
      dataIndex: "Email",
      key: "Email",
      sorter: (a, b) => a.Email.localeCompare(b.Email),
    },
    {
      title: "תפקיד",
      dataIndex: "Role",
      key: "Role",
      render: (role) => <Tag color="blue">{role}</Tag>,
      sorter: (a, b) => a.Role.localeCompare(b.Role),
    },
    {
      title: "סטטוס",
      dataIndex: "Status",
      key: "Status",
      render: (status) => <Tag color="green">{status}</Tag>,
      sorter: (a, b) => a.Status.localeCompare(b.Status),
    },
  ];

  const { data: Roles } = useEnum("getRoles");
  const { data: UserStatus } = useEnum("getUserStatus");
console.log(UserStatus)
  return (
    <div style={{ padding: "2rem" }}>
      <Title level={3}>רשימת משתמשים בהרשמה</Title>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <Select
          placeholder="סינון לפי תפקיד"
          style={{ width: 200 }}
          onChange={handleRoleFilter}
          allowClear
        >
          {Roles &&
            Object.values(Roles).map((value) => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))}
        </Select>

        <Select
          placeholder="סינון לפי סטטוס"
          style={{ width: 200 }}
          onChange={handleStatusFilter}
          allowClear
        >
          {UserStatus &&
            Object.values(UserStatus).map((value) => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))}
        </Select>
      </div>
      {/* <Select
        placeholder="סינון לפי תפקיד"
        style={{ width: 200, marginBottom: 16 }}
        onChange={handleRoleFilter}
        allowClear
      >
        <Option value="ADMIN">מנהל</Option>
        <Option value="elderly">זקן</Option>
        <Option value="cleaner">מנקה</Option>
      </Select> */}

      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default UserTable;
