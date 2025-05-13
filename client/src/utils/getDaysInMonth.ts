function getDaysInMonth(
  month: number,
  year: number = new Date().getFullYear()
) {
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = [];

  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  return days;
}

export default getDaysInMonth;
