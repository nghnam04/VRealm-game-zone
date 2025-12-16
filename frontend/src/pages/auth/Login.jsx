import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(username, password);

    if (result?.user) {
      const role = result.user.role.name;
      if (role === "ADMIN") {
        navigate("/dashboard");
      } else if (role === "STAFF") {
        navigate("/payment");
      } else {
        navigate("/");
      }
    } else {
      if (result?.status === 429) {
        setError("Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 1 phút");
      } else if (result?.status === 401 || result?.status === 403) {
        setError("Tên đăng nhập hoặc mật khẩu không đúng");
      } else {
        setError(result?.error || "Có lỗi xảy ra. Vui lòng thử lại");
      }

      console.error("Login error:", result);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex justify-center items-center min-h-[70vh]"
    >
      <div className="card-base card-glow w-full max-w-md p-8">
        <h2 className="text-4xl font-display text-center text-vr-blue mb-8">
          Đăng Nhập
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-3 py-3 text-lg font-semibold relative"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner className="w-5 h-5 border-4 border-gray-200 border-t-transparent animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                "Đăng Nhập"
              )}
            </button>
          </div>
        </form>
        
        <p className="text-center text-gray-400 mt-6">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-medium text-white hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
