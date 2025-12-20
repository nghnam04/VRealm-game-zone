import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { Trash2, Edit, UserPlus } from "lucide-react";
import UserForm from "../../components/admin/UserForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const roleBadge = (role) => {
  switch (role) {
    case "ADMIN":
      return "bg-red-500/30 text-red-300";
    case "STAFF":
      return "bg-yellow-500/30 text-yellow-300";
    default:
      return "bg-green-500/30 text-green-300";
  }
};

const roleMap = {
  ADMIN: { id: 1, name: "ADMIN" },
  STAFF: { id: 2, name: "STAFF" },
  CUSTOMER: { id: 3, name: "CUSTOMER" },
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [fetchError, setFetchError] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Search
  const [inputSearch, setInputSearch] = useState("");
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("name"); // name | username | email

  // Filter
  const [showFilters, setShowFilters] = useState(false);
  const [roleInput, setRoleInput] = useState("");
  const [sortDirInput, setSortDirInput] = useState("asc");

  // Applied
  const [role, setRole] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/users", {
        params: {
          pageNo: page,
          pageSize,
          [searchField]: search || null,
          role: role || null,
          sortDir,
        },
      });

      const formattedUsers = res.data.content.map((u) => ({
        ...u,
        role: u.role && u.role.name ? u.role : roleMap["CUSTOMER"],
      }));

      setUsers(formattedUsers);
      setTotalPages(res.data.totalPages);
      setTotalUsers(res.data.totalElements);
      setFetchError("");
    } catch (err) {
      console.error(err);
      setFetchError("Không thể tải danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, role, sortDir, searchField]);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Xóa User sẽ xóa Booking và Feedback tương ứng. Bạn có chắc chắn muốn xóa User này?"
      )
    )
      return;

    try {
      await axiosInstance.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Lỗi khi xóa người dùng"
      );
    }
  };

  const handleSave = async (data) => {
    try {
      const payload = {
        name: data.name,
        username: data.username,
        email: data.email,
        ...(data.password ? { password: data.password } : {}),
        role: {
          id: roleMap[data.roleName].id,
          name: roleMap[data.roleName].name,
        },
      };

      if (editing) await axiosInstance.put(`/users/${editing.id}`, payload);
      else await axiosInstance.post("/users", payload);

      setFormVisible(false);
      setEditing(null);
      fetchUsers();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Lỗi khi lưu dữ liệu người dùng"
      );
      console.error(err);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setInputSearch("");
    setSearchField("name");
    setRole("");
    setRoleInput("");
    setSortDir("asc");
    setSortDirInput("asc");
    setPage(0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center p-10 font-display text-vr-blue text-2xl gap-4">
        <div className="flex justify-center items-center gap-3">
          <LoadingSpinner />
          <span>Đang tải chi tiết người dùng...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-3xl font-display text-white mb-6">
        Quản lý Người dùng ({totalUsers})
      </h2>

      {fetchError && (
        <div className="bg-red-900/30 text-red-400 p-3 rounded mb-4">
          {fetchError}
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40"
          >
            <option value="name">Tên</option>
            <option value="username">Tên đăng nhập</option>
            <option value="email">Email</option>
          </select>

          <input
            type="text"
            placeholder="Nhập từ khóa tìm kiếm..."
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 w-full md:w-1/3"
          />

          <button
            onClick={() => {
              setSearch(inputSearch);
              setPage(0);
            }}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 hover:bg-vr-blue/20"
          >
            Tìm kiếm
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 hover:bg-vr-blue/20 ml-auto"
          >
            Bộ lọc {showFilters ? "▲" : "▼"}
          </button>

          <button
            onClick={() => {
              setEditing(null);
              setFormVisible(true);
            }}
            className="btn-primary flex items-center ml-2"
          >
            <UserPlus size={18} className="mr-2" /> Tạo User Mới
          </button>
        </div>

        {showFilters && (
          <div className="p-4 bg-gray-900 border border-vr-blue/40 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <span className="w-28">Vai trò</span>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 flex-1"
                >
                  <option value="">Tất cả</option>
                  <option value="STAFF">STAFF</option>
                  <option value="CUSTOMER">CUSTOMER</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="w-28 ml-4">Thứ tự</span>
                <select
                  value={sortDirInput}
                  onChange={(e) => setSortDirInput(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-vr-blue/40 flex-1"
                >
                  <option value="asc">Tăng dần</option>
                  <option value="desc">Giảm dần</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setRole(roleInput);
                  setSortDir(sortDirInput);
                  setPage(0);
                }}
                className="px-4 py-2 rounded-lg btn-primary"
              >
                Lọc
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-lg bg-red-800"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto card-base p-4">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Tên đăng nhập
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-300 uppercase">
                Vai trò
              </th>
              <th className="px-6 py-3 text-right text-xs text-gray-300 uppercase">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-700/50 transition">
                <td className="px-6 py-4 text-gray-400">{u.id}</td>
                <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                <td className="px-6 py-4 text-gray-300">{u.username}</td>
                <td className="px-6 py-4 text-gray-400">{u.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${roleBadge(
                      u.role.name
                    )}`}
                  >
                    {u.role.name}
                  </span>
                </td>

                <td className="flex px-6 py-4 justify-end space-x-3">
                  <button
                    className="text-indigo-400 hover:text-indigo-300"
                    onClick={() => {
                      setEditing({
                        id: u.id,
                        name: u.name,
                        username: u.username,
                        email: u.email,
                        roleName: u.role.name,
                      });
                      setFormVisible(true);
                    }}
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(u.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6 text-white">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 rounded-lg border border-vr-blue/40 ${
            page === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-cyan-500"
          }`}
        >
          Trang trước
        </button>

        <span>
          Trang <strong>{page + 1}</strong> / {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 rounded-lg border border-vr-blue/40 ${
            page + 1 >= totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-cyan-500"
          }`}
        >
          Trang sau
        </button>
      </div>

      <UserForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
};

export default UserManagement;
