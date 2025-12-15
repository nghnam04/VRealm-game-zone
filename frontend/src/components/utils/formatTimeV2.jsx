const formatTimeV2 = (date) => {
  return new Date(date + "Z").toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default formatTimeV2;
