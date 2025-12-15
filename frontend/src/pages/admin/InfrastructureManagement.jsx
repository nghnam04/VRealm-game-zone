import { useEffect, useState } from "react";
import statusService from "../../services/statusService";
import {
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusCard from "../../components/cards/StatusCard";
import convertToStatusChart from "../../components/utils/convertToStatusChart";

const InfrastructureManagement = () => {
  const [status, setStatus] = useState(null);
  const [uptime, setUptime] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const DAYS = 30;

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 10000);
    return () => clearInterval(interval);
  }, []);

  async function loadAll() {
    try {
      const [s, u, l] = await Promise.all([
        statusService.getCurrentStatus(),
        statusService.getUptime(DAYS),
        statusService.getLogs(DAYS),
      ]);

      setStatus(s);
      setUptime(u);
      setLogs(l);
      setLoading(false);
    } catch (err) {
      console.error("Tải dữ liệu không thành công", err);
      setLoading(false);
    }
  }

  if (loading || !status || !uptime) {
    return (
      <div className="flex flex-col items-center p-10 font-display text-vr-blue text-2xl gap-4">
        <div className="flex justify-center items-center gap-3">
          <LoadingSpinner />
          <span>Đang tải dữ liệu cơ sở hạ tầng hệ thống...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display text-white mb-6">
        Quản lý Cơ sở Hạ tầng Hệ thống
      </h2>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard
          title="Server Status"
          value={status.server}
          good={status.server === "UP"}
        />

        <StatusCard
          title="Database Status"
          value={status.database}
          good={status.database === "OK"}
        />

        <StatusCard
          title="Cache Status"
          value={status.redis}
          good={status.redis === "OK"}
        />

        <StatusCard
          title={`Tỷ lệ Uptime ${DAYS} ngày gần nhất`}
          value={`${uptime.uptime.toFixed(2)}%`}
          good={uptime.uptime >= 90}
        />
      </div>

      {/* Chart */}
      <div className="card-base p-4">
        <h2 className="text-xl text-white font-semibold mb-4">
          Biểu đồ Trạng thái Hệ thống
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={convertToStatusChart(logs)}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="uptime"
              stroke="#3b82f6"
              strokeWidth={1.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Downtime Logs */}
      <div className="card-base p-4">
        <h2 className="text-xl text-white font-semibold mb-4">
          Lịch sử Downtime
        </h2>

        {logs.filter((l) => l.status !== "OK" && l.status !== "UP").length ===
        0 ? (
          <p className="text-green-400">Hệ thống không có lần downtime nào</p>
        ) : (
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {logs
              .filter((l) => l.status !== "OK" && l.status !== "UP")
              .map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded bg-gray-800 border border-gray-700"
                >
                  <p className="text-red-400 font-semibold">
                    {log.component.toUpperCase()} – {log.status}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">{log.message}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfrastructureManagement;
