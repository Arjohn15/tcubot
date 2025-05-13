import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { MenuItem, Select } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { RHFTextField } from "../../../shared/components/RHFTextField";
import { courses } from "../../../utils/getCourseFormalName";
import { years } from "../../../utils/getYearDescription";
import { sections } from "../../../utils/getSchoolSections";

const UserRole = () => {
  const { control, watch } = useFormContext();

  const role = watch("role");

  return (
    <div>
      <div>
        <span className="block text-sm pb-[0.5rem]">I'm a TCU: *</span>
        <Controller
          name="role"
          control={control}
          render={({ field }) => {
            return (
              <FormControl fullWidth>
                <RadioGroup
                  {...field}
                  row
                  aria-labelledby="role-controlled-radio-buttons-group"
                  name="role-controlled-radio-buttons-group"
                  sx={{
                    columnGap: "calc(var(--spacing) * 3)",
                  }}
                >
                  <FormControlLabel
                    sx={{
                      flexGrow: "1",
                      border: "1px solid #d9d9d9",
                      margin: "0",
                      borderRadius: "4px",
                      padding: "0.25rem 0 0.25rem 0",
                    }}
                    value="student"
                    control={<Radio />}
                    label="Student"
                  />
                  <FormControlLabel
                    sx={{
                      flexGrow: "1",
                      border: "1px solid #d9d9d9",
                      margin: "0",
                      borderRadius: "4px",
                      padding: "0.25rem 0 0.25rem 0",
                    }}
                    value="professor"
                    control={<Radio />}
                    label="Professor"
                  />
                  <FormControlLabel
                    sx={{
                      flexGrow: "1",
                      border: "1px solid #d9d9d9",
                      margin: "0",
                      borderRadius: "4px",
                      padding: "0.25rem 0 0.25rem 0",
                    }}
                    value="personnel"
                    control={<Radio />}
                    label="Personnel"
                  />
                </RadioGroup>
              </FormControl>
            );
          }}
        />
      </div>

      <div className="border-gray border-1 rounded-md py-[1.5rem] px-[3rem] mt-[2rem]">
        {role === "student" && (
          <div className="grid grid-cols-2 gap-x-10 mb-[1rem]">
            <div>
              <span className="block text-sm pb-[0.5rem]">Year level:</span>

              <Controller
                name="year"
                render={({ field }) => {
                  return (
                    <div>
                      <FormControl fullWidth>
                        <Select
                          {...field}
                          displayEmpty
                          inputProps={{
                            "aria-label": "New user student year level",
                          }}
                        >
                          {years.map((y) => {
                            return (
                              <MenuItem key={y.level} value={y.level}>
                                {y.level_desc}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>
                  );
                }}
              />
            </div>
            <div>
              <span className="block text-sm pb-[0.5rem]">Course:</span>
              <Controller
                name="course"
                render={({ field }) => {
                  return (
                    <div>
                      <FormControl fullWidth>
                        <Select
                          {...field}
                          displayEmpty
                          inputProps={{
                            "aria-label": "New user student course",
                          }}
                        >
                          {courses.map((c) => {
                            return (
                              <MenuItem
                                key={c.abb}
                                value={c.abb}
                                title={c.formal}
                              >
                                {c.abb}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>
                  );
                }}
              />
            </div>
            <div className="col-span-2 my-[1rem]">
              <span className="block text-sm pb-[0.5rem]">Section:</span>
              <Controller
                name="section"
                render={({ field }) => {
                  return (
                    <div>
                      <FormControl fullWidth>
                        <Select
                          {...field}
                          displayEmpty
                          inputProps={{
                            "aria-label": "New user student section",
                          }}
                        >
                          {sections.map((section) => {
                            return (
                              <MenuItem
                                key={section.id}
                                value={section.id}
                                title={section.name}
                              >
                                {section.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        )}
        <div>
          <RHFTextField
            name="school_assigned_number"
            label="School assigned number *"
          />
        </div>
      </div>
    </div>
  );
};

export default UserRole;
