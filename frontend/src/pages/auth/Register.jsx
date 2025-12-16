import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn browser reload
    setError("");
    setSuccess("");

    const result = await register(name, email, username, password);

    if (result?.success) {
      setSuccess("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      if (result?.status === 403) {
        setError("Tên đăng nhập hoặc email đã tồn tại");
      } else if (result?.status === 429) {
        setError("Đăng ký sai quá nhiều lần. Vui lòng thử lại sau 1 phút");
      } else if (result?.status === 400) {
        setError("Dữ liệu không hợp lệ.");
      } else {
        setError(result?.error || "Đăng ký thất bại. Vui lòng thử lại");
      }
      console.error("Register error:", result);
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
          Đăng Ký
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/20 text-green-400 p-3 rounded-lg mb-4 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Họ tên
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-base"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
              required
            />
          </div>
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
                "Đăng Ký"
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Đã có tài khoản?{" "}
          <Link to="/login" className="font-medium text-white hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
