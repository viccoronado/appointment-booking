export const compareDate = (date1, date2) => {
  return function () {
    if (date1 && date2) return transformDate(date1) <= transformDate(date2);
    return;
  };
};

const transformDate = (date) => {
  const day = date.split("-")[0];
  const month = date.split("-")[1] - 1;
  let year = date.split("-")[2];
  if (year < 2000) year = "" + 20 + year;
  return new Date(year, month, day);
};
