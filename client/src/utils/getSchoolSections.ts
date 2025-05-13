export const sections = [
  { id: "None", name: "None" },
  { id: "bscs-2a", name: "BSCS-2A" },
];

export const getSchoolSection = (sectionID: string): string => {
  const section = sections.find((sec) => sec.id === sectionID);
  return section ? section.name : "Unknown Section";
};
