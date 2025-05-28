export const sections = [
  { id: "None", name: "None" },
  { id: "bscs-a2023", name: "BSCS-A2023" },
  { id: "bscs-b2023", name: "BSCS-B2023" },
];

export const getSchoolSection = (sectionID: string): string => {
  const section = sections.find((sec) => sec.id === sectionID);
  return section ? section.name : "Unknown Section";
};
