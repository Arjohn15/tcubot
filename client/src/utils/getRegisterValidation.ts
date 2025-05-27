// validationSchema.ts
import dayjs from "dayjs";
import * as yup from "yup";

export const formRegisterSchema = yup.object({
  first_name: yup
    .string()
    .matches(/^[^0-9]*$/, "First name should not contain numbers")
    .required("First name is required"),

  last_name: yup
    .string()
    .matches(/^[^0-9]*$/, "Last name should not contain numbers")
    .required("Last name is required"),

  email: yup.string().email("Invalid email").required("Email is required"),

  phone_number: yup
    .string()
    .transform((value) => (value === "" ? null : value))
    .matches(
      /^(?:\+?\d{1,3})?[-. (]?\(?\d{1,4}\)?[-. )]?\d{1,4}[-. ]?\d{1,4}[-. ]?\d{1,4}$/,
      "Invalid phone number"
    )
    .nullable()
    .optional(),

  birthday: yup
    .string()
    .required("Birthday is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Birthday must be in YYYY-MM-DD format")
    .test("valid-date", "Birthday must be a valid date", (value) => {
      return dayjs(value, "YYYY-MM-DD", true).isValid();
    })
    .test("not-in-future", "Birthday cannot be in the future", (value) => {
      if (!value) return false;
      const date = dayjs(value, "YYYY-MM-DD");
      return date.isBefore(dayjs().add(1, "day"), "day");
    })
    .test("min-age", "You must be at least 15 years old", (value) => {
      if (!value) return false;
      const birthDate = dayjs(value, "YYYY-MM-DD");
      const today = dayjs();
      const age = today.diff(birthDate, "year");
      return age >= 15;
    }),

  role: yup.string().required(),

  year: yup.string().required(),

  course: yup.string().required(),

  section: yup.string().required(),

  school_assigned_number: yup
    .string()
    .required("School number is required")
    .matches(/^\d{2}-\d{5}$/, "School number must be in the format: XX-XXXXX"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[0-9]/, "Password must contain a number"),

  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});
