import { Controller, useFormContext } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import getDaysInMonth from "../../../utils/getDaysInMonth";
import getYearsRange from "../../../utils/getYearsRange";

// Define months array and current date values
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentMonth = new Date().getMonth();
const currentDate = new Date().getDate();
const currentYear = new Date().getFullYear();

const UserBirthday = () => {
  const { control } = useFormContext(); // Get the form context from RHF

  // Local states to manage month, day, and year
  const [month, setMonth] = useState<number>(currentMonth);
  const [date, setDate] = useState<number>(currentDate);
  const [year, setYear] = useState<number>(currentYear);

  const dates = getDaysInMonth(month); // Get days based on month
  const years = getYearsRange(); // Get available years range

  // This will merge the month, day, and year into a single string for RHF
  const birthdayValue = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    date
  ).padStart(2, "0")}`;

  return (
    <Controller
      name="birthday" // The field name in RHF
      control={control}
      defaultValue={birthdayValue} // Default value when the form is initialized
      render={({ field, fieldState: { error } }) => (
        <div>
          <span className="block text-sm pb-[0.5rem]">Birthday *</span>
          <div className="flex gap-x-3">
            {/* BIRTH MONTH */}
            <div className="grow-1">
              <FormControl fullWidth>
                <Select
                  name="birthday"
                  error={!!error}
                  value={month}
                  onChange={(e) => {
                    const newMonth = Number(e.target.value);
                    setMonth(newMonth);
                    field.onChange(
                      `${String(year)}-${String(newMonth + 1).padStart(
                        2,
                        "0"
                      )}-${String(date).padStart(2, "0")}`
                    );
                  }}
                  displayEmpty
                  inputProps={{ "aria-label": "New user birth month" }}
                >
                  {months.map((month, index) => (
                    <MenuItem key={month} value={index}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* BIRTH DAY */}
            <div className="grow-1">
              <FormControl fullWidth>
                <Select
                  name="birthday"
                  error={!!error}
                  value={date}
                  onChange={(e) => {
                    const newDate = Number(e.target.value);
                    setDate(newDate);
                    field.onChange(
                      `${String(year)}-${String(month + 1).padStart(
                        2,
                        "0"
                      )}-${String(newDate).padStart(2, "0")}`
                    );
                  }}
                  displayEmpty
                  inputProps={{ "aria-label": "New user birth date" }}
                >
                  {dates.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* BIRTH YEAR */}
            <div className="grow-1">
              <FormControl fullWidth>
                <Select
                  name="birthday"
                  error={!!error}
                  value={year}
                  onChange={(e) => {
                    const newYear = Number(e.target.value);
                    setYear(newYear);
                    field.onChange(
                      `${String(newYear)}-${String(month + 1).padStart(
                        2,
                        "0"
                      )}-${String(date).padStart(2, "0")}`
                    );
                  }}
                  displayEmpty
                  inputProps={{ "aria-label": "New user birth year" }}
                >
                  {years.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          {error && (
            <span className="text-red text-xs mt-1">{error.message}</span>
          )}
        </div>
      )}
    />
  );
};

export default UserBirthday;
