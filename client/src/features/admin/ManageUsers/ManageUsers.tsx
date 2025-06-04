import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchUsers, selectAllUsers } from "../shared/redux/usersSlice";
import { TextField } from "@mui/material";
import LoadingCircular from "../../../shared/components/LoadingCircular";
import UserDetails from "./UserDetails";

const ManageUsers: FC = () => {
  const [inputs, setInputs] = useState<{
    firstName: string;
    lastName: string;
    schoolNumber: string;
  }>({ firstName: "", lastName: "", schoolNumber: "" });

  const [inputsTwo, setInputsTwo] = useState<{
    firstName: string;
    lastName: string;
    schoolNumber: string;
  }>({ firstName: "", lastName: "", schoolNumber: "" });

  const [inputsThree, setInputsThree] = useState<{
    firstName: string;
    lastName: string;
    schoolNumber: string;
  }>({ firstName: "", lastName: "", schoolNumber: "" });

  const [isInterval, setIsInterval] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const { users, error } = useAppSelector(selectAllUsers);

  function handleChangeInputStudents(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  function handleChangeInputProfessors(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setInputsTwo({ ...inputsTwo, [e.target.name]: e.target.value });
  }

  function handleChangeInputPersonnel(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setInputsThree({ ...inputsThree, [e.target.name]: e.target.value });
  }
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchUsers());
    }, 3000);

    setTimeout(() => {
      setIsInterval(false);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-[2rem]">
      <h2 className="heading-two text-center">Manage Users</h2>

      <div className="border-2 border-gray-half rounded-lg">
        {users.length !== 0 && (
          <div>
            <div>
              <div className="flex justify-center gap-x-2 mx-[1rem] my-[2rem]">
                <div className="w-[12.5rem]">
                  <TextField
                    id="user-last-name"
                    placeholder="Last name"
                    variant="outlined"
                    name="lastName"
                    onChange={handleChangeInputStudents}
                    sx={{
                      "@media (max-width: 640px)": {
                        "& .MuiInputBase-input": {
                          padding: "0.75rem",
                        },
                      },
                    }}
                  />
                </div>
                <div className="w-[12.5rem]">
                  <TextField
                    id="user-first-name"
                    placeholder="First name"
                    variant="outlined"
                    name="firstName"
                    onChange={handleChangeInputStudents}
                    sx={{
                      "@media (max-width: 640px)": {
                        "& .MuiInputBase-input": {
                          padding: "0.75rem",
                        },
                      },
                    }}
                  />
                </div>
                <div className="w-[10rem]">
                  <TextField
                    id="user-school-number"
                    placeholder="School number"
                    variant="outlined"
                    name="schoolNumber"
                    onChange={handleChangeInputStudents}
                    sx={{
                      "@media (max-width: 640px)": {
                        "& .MuiInputBase-input": {
                          padding: "0.75rem",
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[95%] sm:w-[80%]">
                  <h3 className="text-lg text-center font-bold pb-[1rem] max-sm:text-base">
                    STUDENTS
                  </h3>
                  <div className="border-2 border-gray rounded-lg px-[1rem] mb-[2rem] h-[70vh] overflow-y-auto">
                    <div className="sticky top-0 z-10 bg-white">
                      <div>
                        <div className="flex w-full text-left font-bold px-[1rem] py-[0.5rem] text-sm">
                          <span className="w-1/3 block md:text-nowrap md:truncate overflow-x-hidden">
                            Last name
                          </span>
                          <span className="w-1/3 block md:text-nowrap md:truncate overflow-x-hidden">
                            First name
                          </span>
                          <span className="w-1/3 block md:text-nowrap md:truncate overflow-x-hidden">
                            School number
                          </span>
                        </div>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-y-5 my-[1rem]">
                      {users.map((user) => {
                        const matchesFirstName =
                          inputs.firstName !== "" &&
                          user.first_name
                            .toUpperCase()
                            .includes(inputs.firstName.toUpperCase());
                        const matchesLastName =
                          inputs.lastName !== "" &&
                          user.last_name
                            .toUpperCase()
                            .includes(inputs.lastName.toUpperCase());
                        const matchesSchoolNumber =
                          inputs.schoolNumber !== "" &&
                          user.school_assigned_number
                            .toUpperCase()
                            .includes(inputs.schoolNumber.toUpperCase());

                        if (user.role === "student") {
                          if (
                            matchesFirstName ||
                            matchesLastName ||
                            matchesSchoolNumber
                          ) {
                            return (
                              <li key={user._id}>
                                <UserDetails user={user} />
                              </li>
                            );
                          }

                          if (
                            inputs.firstName === "" &&
                            inputs.lastName === "" &&
                            inputs.schoolNumber === ""
                          ) {
                            return (
                              <li key={user._id}>
                                <UserDetails user={user} />
                              </li>
                            );
                          }
                        }

                        return null;
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-center gap-x-2 mx-[1rem] my-[2rem]">
                <div className="w-[12.5rem]">
                  <TextField
                    id="user-last-name"
                    placeholder="Last name"
                    variant="outlined"
                    name="lastName"
                    onChange={handleChangeInputProfessors}
                    sx={{
                      "@media (max-width: 640px)": {
                        "& .MuiInputBase-input": {
                          padding: "0.75rem",
                        },
                      },
                    }}
                  />
                </div>
                <div className="w-[12.5rem]">
                  <TextField
                    id="user-first-name"
                    placeholder="First name"
                    variant="outlined"
                    name="firstName"
                    onChange={handleChangeInputProfessors}
                    sx={{
                      "@media (max-width: 640px)": {
                        "& .MuiInputBase-input": {
                          padding: "0.75rem",
                        },
                      },
                    }}
                  />
                </div>
                <div className="w-[10rem]">
                  <TextField
                    id="user-school-number"
                    placeholder="School number"
                    variant="outlined"
                    name="schoolNumber"
                    onChange={handleChangeInputProfessors}
                    sx={{
                      "@media (max-width: 640px)": {
                        "& .MuiInputBase-input": {
                          padding: "0.75rem",
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[95%] sm:w-[80%]">
                  <h3 className="text-lg text-center font-bold pb-[1rem] max-sm:text-base">
                    PROFESSORS
                  </h3>
                  <div className="border-2 border-gray rounded-lg px-[1rem] mb-[2rem] h-[70vh] overflow-y-auto">
                    <div className="sticky top-0 z-10 bg-white">
                      <div>
                        <div className="flex w-full text-left font-bold px-[1rem] py-[0.5rem] text-sm">
                          <span className="w-1/3 block md:text-nowrap md:truncate overflow-x-hidden">
                            Last name
                          </span>
                          <span className="w-1/3 block md:text-nowrap md:truncate overflow-x-hidden">
                            First name
                          </span>
                          <span className="w-1/3 block md:text-nowrap md:truncate overflow-x-hidden">
                            School number
                          </span>
                        </div>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-y-5 my-[1rem]">
                      {users.map((user) => {
                        const matchesFirstName =
                          inputsTwo.firstName !== "" &&
                          user.first_name
                            .toUpperCase()
                            .includes(inputsTwo.firstName.toUpperCase());
                        const matchesLastName =
                          inputsTwo.lastName !== "" &&
                          user.last_name
                            .toUpperCase()
                            .includes(inputsTwo.lastName.toUpperCase());
                        const matchesSchoolNumber =
                          inputsTwo.schoolNumber !== "" &&
                          user.school_assigned_number
                            .toUpperCase()
                            .includes(inputsTwo.schoolNumber.toUpperCase());

                        if (user.role === "professor") {
                          if (
                            matchesFirstName ||
                            matchesLastName ||
                            matchesSchoolNumber
                          ) {
                            return (
                              <li key={user._id}>
                                <UserDetails user={user} />
                              </li>
                            );
                          }

                          if (
                            inputsTwo.firstName === "" &&
                            inputsTwo.lastName === "" &&
                            inputsTwo.schoolNumber === ""
                          ) {
                            return (
                              <li key={user._id}>
                                <UserDetails user={user} />
                              </li>
                            );
                          }
                        }

                        return null;
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-center gap-x-2 mx-[1rem] my-[2rem]">
                <div className="w-[12.5rem]">
                  <TextField
                    id="user-last-name"
                    placeholder="Last name"
                    variant="outlined"
                    name="lastName"
                    onChange={handleChangeInputPersonnel}
                    sx={{
                      "@media (max-width: 640px)": {
                        "& .MuiInputBase-input": {
                          padding: "0.75rem",
                        },
                      },
                    }}
                  />
                </div>
                <div className="w-[12.5rem]">
                  <TextField
                    id="user-first-name"
                    placeholder="First name"
                    variant="outlined"
                    name="firstName"
                    onChange={handleChangeInputPersonnel}
                    sx={{
                      "@media (max-width: 640px)": {
                        "& .MuiInputBase-input": {
                          padding: "0.75rem",
                        },
                      },
                    }}
                  />
                </div>
                <div className="w-[10rem]">
                  <TextField
                    id="user-school-number"
                    placeholder="School number"
                    variant="outlined"
                    name="schoolNumber"
                    onChange={handleChangeInputPersonnel}
                    sx={{
                      "@media (max-width: 640px)": {
                        "& .MuiInputBase-input": {
                          padding: "0.75rem",
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[95%] sm:w-[80%]">
                  <h3 className="text-lg text-center font-bold pb-[1rem] max-sm:text-base">
                    PERSONNEL
                  </h3>
                  <div className="border-2 border-gray rounded-lg px-[1rem] mb-[2rem] h-[70vh] overflow-y-auto">
                    <div className="sticky top-0 z-10 bg-white">
                      <div>
                        <div className="flex w-full text-left font-bold px-[1rem] py-[0.5rem] text-sm">
                          <span className="w-1/3 block md:text-nowrap md:truncate overflow-x-hidden">
                            Last name
                          </span>
                          <span className="w-1/3 block md:text-nowrap md:truncate overflow-x-hidden">
                            First name
                          </span>
                          <span className="w-1/3 block md:text-nowrap md:truncate overflow-x-hidden">
                            School number
                          </span>
                        </div>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-y-5 my-[1rem]">
                      {users.map((user) => {
                        const matchesFirstName =
                          inputsThree.firstName !== "" &&
                          user.first_name
                            .toUpperCase()
                            .includes(inputsThree.firstName.toUpperCase());
                        const matchesLastName =
                          inputsThree.lastName !== "" &&
                          user.last_name
                            .toUpperCase()
                            .includes(inputsThree.lastName.toUpperCase());
                        const matchesSchoolNumber =
                          inputsThree.schoolNumber !== "" &&
                          user.school_assigned_number
                            .toUpperCase()
                            .includes(inputsThree.schoolNumber.toUpperCase());

                        if (user.role === "personnel") {
                          if (
                            matchesFirstName ||
                            matchesLastName ||
                            matchesSchoolNumber
                          ) {
                            return (
                              <li key={user._id}>
                                <UserDetails user={user} />
                              </li>
                            );
                          }

                          if (
                            inputsThree.firstName === "" &&
                            inputsThree.lastName === "" &&
                            inputsThree.schoolNumber === ""
                          ) {
                            return (
                              <li key={user._id}>
                                <UserDetails user={user} />
                              </li>
                            );
                          }
                        }

                        return null;
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {users.length === 0 && !isInterval && (
          <div className="flex justify-center items-center h-[20rem]">
            <h3 className="font-bold text-xl text-gray">
              No users as of now for TCUbot.
            </h3>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-full">
            <h3 className="font-bold text-xl text-gray">
              Something went wrong. Please try again later.
            </h3>
          </div>
        )}

        {isInterval && (
          <div className="h-[70vh] flex justify-center items-center">
            <LoadingCircular />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
