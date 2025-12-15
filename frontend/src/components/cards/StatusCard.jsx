const StatusCard = ({ title, value, good }) => {
  return (
    <div className="card-base p-4">
      <h3 className="text-gray-300 text-sm">{title}</h3>
      <div
        className={`mt-2 text-2xl font-bold ${
          good ? "text-green-400" : "text-red-400"
        }`}
      >
        {value}
      </div>
    </div>
  );
};

export default StatusCard;
