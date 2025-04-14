// ⏰ Helper to convert UTC to IST in 12-hour AM/PM format
export const formatISTTime = (utcString) => {
  const date = new Date(utcString);
  const options = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleTimeString("en-IN", options);
};