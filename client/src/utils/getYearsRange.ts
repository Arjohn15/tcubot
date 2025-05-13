function getYearsRange() {
  const currentYear = new Date().getFullYear();

  const years = [];

  for (let i = 1900; i <= currentYear; i++) {
    years.push(i);
  }

  return years;
}

export default getYearsRange;
