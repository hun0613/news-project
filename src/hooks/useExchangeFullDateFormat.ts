const weekendArr: string[] = ["일", "월", "화", "수", "목", "금", "토"];

const useExchageFullDateFormat = (Date: Date) => {
  let year = Date.getFullYear();
  let month = Date.getMonth() + 1 < 10 ? `0${Date.getMonth() + 1}` : Date.getMonth() + 1;
  let date = Date.getUTCDate() < 10 ? `0${Date.getUTCDate()}` : Date.getUTCDate();

  let weekend = Date.getDay();

  return `${year}.${month}.${date}. (${weekendArr[weekend]})`;
};

export default useExchageFullDateFormat;
