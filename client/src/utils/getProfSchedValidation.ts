import * as yup from "yup";

export const formProfessorSchedSchema = yup.object({
  room: yup.string().required("").max(10),
  subject: yup.string().required().max(100),
  code: yup.string().required().max(10),
});
