const convertToStatusChart = (logs, DAYS = 30) => {
  const days = {};

  // tạo sẵn 30 ngày gần nhất giá trị khởi tạo 0 log
  for (let i = 0; i < DAYS; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().substring(0, 10);
    days[key] = { total: 0, ok: 0 };
  }

  // đếm tổng log và log ok mỗi ngày
  logs.forEach((log) => {
    const d = log.timestamp.substring(0, 10);
    if (!days[d]) days[d] = { total: 0, ok: 0 };
    days[d].total++;
    if (log.status === "OK" || log.status === "UP") days[d].ok++;
  });

  return Object.keys(days)
    .sort()
    .map((d) => ({
      date: d,
      uptime: days[d].total
        ? ((days[d].ok / days[d].total) * 100).toFixed(2)
        : 0,
    }));
};
export default convertToStatusChart;
