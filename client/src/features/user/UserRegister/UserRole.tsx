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
        <span className="block text-sm pb-[0.5rem] max-sm:text-xs">
          I'm a TCU: *
        </span>
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
                    "@media (max-width: 640px)": {
                      width: "100%",
                      display: "flex",
                      flexWrap: "nowrap",
                    },
                  }}
                >
                  <FormControlLabel
                    sx={{
                      flexGrow: "1",
                      border: "1px solid #d9d9d9",
                      margin: "0",
                      borderRadius: "4px",
                      padding: "0.25rem 0 0.25rem 0",
                      "& .MuiFormControlLabel-label": {
                        "@media (max-width: 640px)": {
                          fontSize: "0.85rem",
                          padding: "0.5rem",
                        },
                      },
                    }}
                    value="student"
                    control={
                      <Radio
                        sx={{
                          "@media (max-width: 640px)": {
                            transform: "scale(0.85)",
                            padding: "0",
                          },
                        }}
                      />
                    }
                    label="Student"
                  />
                  <FormControlLabel
                    sx={{
                      flexGrow: "1",
                      border: "1px solid #d9d9d9",
                      margin: "0",
                      borderRadius: "4px",
                      padding: "0.25rem 0 0.25rem 0",
                      "& .MuiFormControlLabel-label": {
                        "@media (max-width: 640px)": {
                          fontSize: "0.85rem",
                          padding: "0.5rem",
                        },
                      },
                    }}
                    value="professor"
                    control={
                      <Radio
                        sx={{
                          "@media (max-width: 640px)": {
                            transform: "scale(0.85)",
                            padding: "0",
                          },
                        }}
                      />
                    }
                    label="Professor"
                  />
                  <FormControlLabel
                    sx={{
                      flexGrow: "1",
                      border: "1px solid #d9d9d9",
                      margin: "0",
                      borderRadius: "4px",
                      padding: "0.25rem 0 0.25rem 0",
                      "& .MuiFormControlLabel-label": {
                        "@media (max-width: 640px)": {
                          fontSize: "0.85rem",
                          padding: "0.5rem",
                        },
                      },
                    }}
                    value="personnel"
                    control={
                      <Radio
                        sx={{
                          "@media (max-width: 640px)": {
                            transform: "scale(0.85)",
                            padding: "0",
                          },
                        }}
                      />
                    }
                    label="Personnel"
                  />
                </RadioGroup>
              </FormControl>
            );
          }}
        />
      </div>

      <div className="border-gray border-1 rounded-md py-[1.5rem] px-[3rem] mt-[2rem] max-sm:border-none max-sm:px-[0] max-sm:py-[0rem] max-sm:pt-[1rem] max-sm:mt-[0]">
        {role === "student" && (
          <div className="grid grid-cols-2 gap-x-10 mb-[1rem] max-sm:flex max-sm:gap-x-3 max-sm:justify-between max-sm:w-full">
            <div className="max-sm:grow-1">
              <span className="block text-sm pb-[0.5rem] max-sm:text-xs">
                Year level:
              </span>

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
                          sx={{
                            "@media (max-width: 640px)": {
                              "& .MuiSelect-select": {
                                fontSize: "0.85rem",
                                padding: "0.85rem",
                              },
                            },
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
            <div className="max-sm:grow-1">
              <span className="block text-sm pb-[0.5rem] max-sm:text-xs">
                Course:
              </span>
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
                          sx={{
                            "@media (max-width: 640px)": {
                              "& .MuiSelect-select": {
                                width: "3.25rem",
                                fontSize: "0.85rem",
                                padding: "0.85rem",
                              },
                            },
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
            <div className="col-span-2 my-[1rem] max-sm:my-[0] max-sm:grow-1">
              <span className="block text-sm pb-[0.5rem] max-sm:text-xs">
                Section:
              </span>
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
                          sx={{
                            "@media (max-width: 640px)": {
                              "& .MuiSelect-select": {
                                width: "3.25rem",
                                fontSize: "0.85rem",
                                padding: "0.85rem",
                              },
                            },
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
