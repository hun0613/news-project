const useExchageDateFormat = (Date: Date) => {
  let year = Date.getFullYear();
  let month = Date.getMonth() + 1 < 10 ? `0${Date.getMonth() + 1}` : Date.getMonth() + 1;
  let date = Date.getDate() < 10 ? `0${Date.getDate()}` : Date.getDate();

  return `${year}-${month}-${date}`;
};

export default useExchageDateFormat;
