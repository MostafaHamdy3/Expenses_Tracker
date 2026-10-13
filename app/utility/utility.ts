export const nFormatter = (num: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  var item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(2) + item.symbol : "0.00";
}

export const getFormattedDate = (date: number) => {  
  const newDate = new Date(date * 1000);

  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const day = String(newDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export type ExpensesPeriod = "all" | "year" | "month";

export const getPeriodStartSeconds = (period: ExpensesPeriod) => {
  if (period === "all") return null;

  const today = new Date();
  const startDate = period === "year"
    ? new Date(today.getFullYear(), 0, 1)
    : new Date(today.getFullYear(), today.getMonth(), 1);

  return Math.floor(startDate.getTime() / 1000);
};
