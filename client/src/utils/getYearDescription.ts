export const years = [
  { level: "None", level_desc: "None" },
  // Undergraduate
  { level: "1st", level_desc: "1st Year" },
  { level: "2nd", level_desc: "2nd Year" },
  { level: "3rd", level_desc: "3rd Year" },
  { level: "4th", level_desc: "4th Year" },
  //   Postgraduate
  { level: "post", level_desc: "Postgraduate" },
];

export const getYearDescription = (level: string): string => {
  const year = years.find((y) => y.level === level);
  return year ? year.level_desc : "Unknown Year Level";
};
