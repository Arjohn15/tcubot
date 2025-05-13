export const courses = [
  { abb: "None", formal: "None" },
  { abb: "BPA", formal: "Bachelor in Public Administration" },
  { abb: "BSPSY", formal: "Bachelor of Science in Psychology" },
  { abb: "BSSW", formal: "Bachelor of Science in Social Work" },

  // INFORMATION AND COMMUNICATION TECHNOLOGY
  { abb: "BSCS", formal: "Bachelor of Science in Computer Science" },
  { abb: "BSIS", formal: "Bachelor of Science in Information Systems" },

  // EDUCATION
  {
    abb: "BSED-ENG",
    formal: "Bachelor of Secondary Education Major in English",
  },
  {
    abb: "BSED-MATH",
    formal: "Bachelor of Secondary Education Major in Mathematics",
  },
  {
    abb: "BSED-SCI",
    formal: "Bachelor of Secondary Education Major in Science",
  },
  { abb: "BEED", formal: "Bachelor in Elementary Education" },

  // CRIMINAL JUSTICE
  { abb: "BSCRIM", formal: "Bachelor of Science in Criminology" },

  // BUSINESS MANAGEMENT
  { abb: "BSENTREP", formal: "Bachelor of Science in Entrepreneurship" },
  {
    abb: "BSBA-HRM",
    formal:
      "Bachelor of Science in Business Administration Major in Human Resource Management",
  },
  {
    abb: "BSBA-MM",
    formal:
      "Bachelor of Science in Business Administration Major in Marketing Management",
  },
  { abb: "BSOA", formal: "Bachelor of Science in Office Administration" },

  // HOSPITALITY & TOURISM MANAGEMENT
  { abb: "BSHM", formal: "Bachelor of Science in Hospitality Management" },
  { abb: "BSTM", formal: "Bachelor of Science in Tourism Management" },

  // GRADUATE STUDIES
  {
    abb: "MAED-EM",
    formal: "Master of Arts in Education Major in Educational Management",
  },
  { abb: "MBA", formal: "Master in Business Administration" },
  { abb: "MSCJ", formal: "Master of Science in Criminal Justice" },
  { abb: "MPA", formal: "Master in Public Administration" },
];

export const getCourseFormalName = (abb: string): string => {
  const course = courses.find((c) => c.abb === abb);
  return course ? course.formal : "Unknown Course";
};
