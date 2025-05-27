import { Controller, useFormContext } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import getDaysInMonth from "../../../utils/getDaysInMonth";
import getYearsRange from "../../../utils/getYearsRange";

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
  const { control } = useFormContext();

  const [month, setMonth] = useState<number>(currentMonth);
  const [date, setDate] = useState<number>(currentDate);
  const [year, setYear] = useState<number>(currentYear);

  const dates = getDaysInMonth(month);
  const years = getYearsRange();

  const birthdayValue = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    date
  ).padStart(2, "0")}`;

  return (
    <Controller
      name="birthday"
      control={control}
      defaultValue={birthdayValue}
      render={({ field, fieldState: { error } }) => (
        <div>
          <span className="block text-sm pb-[0.5rem] max-sm:text-xs">
            Birthday *
          </span>
          <div className="flex gap-x-3">
            {/* BIRTH MONTH */}
            <div className="grow-1">
              <FormControl fullWidth>
                <Select
                  name="birthday"
                  error={!!error}
                  value={month}
                  onChange={(e) => {
                    alert(e.target.value);
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
                      <span className="max-sm:text-xs max-sm:font-bold">
                        {month}
                      </span>
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
                      <span className="max-sm:text-xs max-sm:font-bold">
                        {d}
                      </span>
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
                      <span className="max-sm:text-xs max-sm:font-bold">
                        {y}
                      </span>
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
