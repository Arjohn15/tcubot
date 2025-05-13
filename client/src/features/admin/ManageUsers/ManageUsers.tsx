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
  const [isInterval, setIsInterval] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector(selectAllUsers);

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>): void {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
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
            <div className="flex justify-center gap-x-2 mx-[1rem] my-[2rem]">
              <div className="w-[12.5rem]">
                <TextField
                  id="user-last-name"
                  placeholder="Last name"
                  variant="outlined"
                  name="lastName"
                  onChange={handleChangeInput}
                />
              </div>
              <div className="w-[12.5rem]">
                <TextField
                  id="user-first-name"
                  placeholder="First name"
                  variant="outlined"
                  name="firstName"
                  onChange={handleChangeInput}
                />
              </div>
              <div className="w-[10rem]">
                <TextField
                  id="user-school-number"
                  placeholder="School number"
                  variant="outlined"
                  name="schoolNumber"
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-[80%] h-[70vh] overflow-y-auto border-2 border-gray rounded-lg px-[1rem] mb-[2rem]">
                <div className="sticky top-0 z-10 bg-white">
                  <div>
                    <div className="flex w-full text-left font-bold px-[1rem] py-[0.5rem] text-sm">
                      <span className="w-1/3 block text-nowrap truncate overflow-x-hidden">
                        Last name
                      </span>
                      <span className="w-1/3 block text-nowrap truncate overflow-x-hidden">
                        First name
                      </span>
                      <span className="w-1/3 block text-nowrap truncate overflow-x-hidden">
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
                    return null;
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {loading && <LoadingCircular />}

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
