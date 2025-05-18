import { FC, useState } from "react";
import { RegistrantType } from "../AdminDashboard/Registrant";
import dayjs from "dayjs";
import {
  courses,
  getCourseFormalName,
} from "../../../utils/getCourseFormalName";
import { MdOutlineEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from "@mui/material";
import Modal from "../../../shared/components/Modal";
import axios from "axios";
import { useAppDispatch } from "../../store/hooks";
import { snackbarOpened } from "../../store/shared/snackbarSlice";
import { getYearDescription, years } from "../../../utils/getYearDescription";
import { getSchoolSection, sections } from "../../../utils/getSchoolSections";
import { HOST } from "../../../utils/getHost";

const UserInfo: FC<{ user: RegistrantType; onCloseModal: () => void }> = ({
  user,
  onCloseModal,
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const [input, setInput] = useState<Omit<RegistrantType, "_id">>({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
    formattedBirthday: user.formattedBirthday,
    course: user.course,
    year: user.year,
    school_assigned_number: user.school_assigned_number,
    role: user.role,
    section: user.section,
  });

  const dispatch = useAppDispatch();
  function handleOpenModal(): void {
    setModal(true);
  }
  function handleCloseModal(): void {
    setModal(false);
  }

  function handleChangeInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  async function handleDeleteUser() {
    try {
      const res = await axios.delete(`http://${HOST}/user-delete/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
        },
      });

      if (res.status === 200) {
        dispatch(
          snackbarOpened({
            message: "User successfully deleted",
            severity: "success",
            isSnackbar: true,
          })
        );
        onCloseModal();
      }
    } catch (err: any) {
      console.error(err);
      dispatch(
        snackbarOpened({
          message:
            err.response.data.message ||
            "Unknown error. Please try again later.",
          severity: "error",
          isSnackbar: true,
        })
      );
      onCloseModal();
    }
  }

  async function handleUpdateUser() {
    const filteredInputs = Object.fromEntries(
      Object.entries(input).filter(
        ([key, value]) => value !== user[key as keyof typeof user]
      )
    );

    try {
      const res = await axios.put(
        `http://${HOST}/user-update-by-admin/${user._id}`,
        filteredInputs,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
          },
        }
      );

      if (res.status === 200) {
        dispatch(
          snackbarOpened({
            isSnackbar: true,
            message: "User updated successfully!",
            severity: "success",
          })
        );
        onCloseModal();
      }
    } catch (err: any) {
      console.error(err);
      dispatch(
        snackbarOpened({
          message: err.response.data.message,
          severity: "error",
          isSnackbar: true,
        })
      );
      onCloseModal();
    }
  }
  return (
    <>
      <h1 className="text-xl text-center font-bold">User Info</h1>
      <ul className="mt-[2rem] grid gap-y-5">
        <li className="flex items-center gap-x-2">
          <span className="font-bold">First name: </span>
          <div>
            {isEdit ? (
              <span className="block">
                <input
                  value={input.first_name}
                  onChange={handleChangeInput}
                  name="first_name"
                  type="text"
                  className="border-b-1 border-gray outline-none"
                  autoFocus={isEdit}
                />
              </span>
            ) : (
              <span>{input.first_name}</span>
            )}
          </div>
        </li>
        <li className="flex items-center gap-x-2">
          <span className="font-bold">Last name: </span>
          <div>
            {isEdit ? (
              <span className="block">
                <input
                  value={input.last_name}
                  onChange={handleChangeInput}
                  name="last_name"
                  type="text"
                  className="border-b-1 border-gray outline-none"
                />
              </span>
            ) : (
              <span>{input.last_name}</span>
            )}
          </div>
        </li>
        <li className="flex items-center gap-x-2">
          <span className="font-bold">Birthday: </span>
          <div>
            {isEdit ? (
              <span className="block">
                <input
                  onChange={handleChangeInput}
                  name="formattedBirthday"
                  type="date"
                  className="border-b-1 border-gray outline-none"
                />
              </span>
            ) : (
              <span>{dayjs(input.formattedBirthday).format("DD-MM-YYYY")}</span>
            )}
          </div>
        </li>
        <li className="flex items-center gap-x-2">
          <span className="font-bold">Email: </span>
          <div>
            {isEdit ? (
              <span className="block">
                <input
                  value={input.email}
                  onChange={handleChangeInput}
                  name="email"
                  type="text"
                  className="border-b-1 border-gray outline-none"
                />
              </span>
            ) : (
              <span>{input.email}</span>
            )}
          </div>
        </li>
        <li className="flex items-center gap-x-2">
          <span className="font-bold">Phone number: </span>
          <div>
            {isEdit ? (
              <span className="block">
                <input
                  value={input.phone_number}
                  onChange={handleChangeInput}
                  name="phone_number"
                  type="text"
                  className="border-b-1 border-gray w-full outline-none"
                />
              </span>
            ) : (
              <span>{input.phone_number}</span>
            )}
          </div>
        </li>
        {user.role === "student" && (
          <>
            <li className="flex items-center gap-x-2">
              <span className="font-bold">Year level: </span>
              <div>
                {isEdit ? (
                  <span className="block">
                    <select
                      name="year"
                      value={input.year}
                      onChange={handleChangeInput}
                      className="w-[6rem] hover:cursor-pointer hover:bg-gray-half duration-300 outline-none"
                    >
                      {years.map((course) => {
                        return (
                          <option key={course.level} value={course.level}>
                            {course.level_desc}
                          </option>
                        );
                      })}
                    </select>
                  </span>
                ) : (
                  <span>{getYearDescription(input.year)}</span>
                )}
              </div>
            </li>
            <li className="flex items-center gap-x-2">
              <span className="font-bold">Course: </span>
              <div>
                {isEdit ? (
                  <span className="block">
                    <select
                      name="course"
                      value={input.course}
                      onChange={handleChangeInput}
                      className="w-[4.25rem] hover:cursor-pointer hover:bg-gray-half duration-300 outline-none"
                    >
                      {courses.map((course) => {
                        return (
                          <option key={course.abb} value={course.abb}>
                            {course.abb}
                          </option>
                        );
                      })}
                    </select>
                  </span>
                ) : (
                  <span>
                    {input.course} ({getCourseFormalName(input.course)})
                  </span>
                )}
              </div>
            </li>
            <li className="flex items-center gap-x-2">
              <span className="font-bold">Section: </span>
              <div>
                {isEdit ? (
                  <span className="block">
                    <select
                      name="section"
                      value={input.section}
                      onChange={handleChangeInput}
                      className="w-[4.25rem] hover:cursor-pointer hover:bg-gray-half duration-300 outline-none"
                    >
                      {sections.map((section) => {
                        return (
                          <option key={section.id} value={section.id}>
                            {section.name}
                          </option>
                        );
                      })}
                    </select>
                  </span>
                ) : (
                  <span>{getSchoolSection(input.section)}</span>
                )}
              </div>
            </li>
          </>
        )}
        <li className="flex items-center gap-x-2">
          <span className="font-bold">School number: </span>
          <div>
            {isEdit ? (
              <span className="block">
                <input
                  value={input.school_assigned_number}
                  onChange={handleChangeInput}
                  name="school_assigned_number"
                  type="text"
                  className="border-b-1 border-gray outline-none"
                />
              </span>
            ) : (
              <span>{input.school_assigned_number}</span>
            )}
          </div>
        </li>
        <li className="flex items-center gap-x-2">
          <span className="font-bold">Role: </span>
          <div>
            {isEdit ? (
              <span className="block">
                <select
                  name="role"
                  value={input.role}
                  onChange={handleChangeInput}
                  className="w-[6rem] hover:cursor-pointer hover:bg-gray-half duration-300 outline-none"
                >
                  <option value="student" className="cursor-pointer">
                    Student
                  </option>
                  <option value="professor" className="cursor-pointer">
                    Professor
                  </option>
                  <option value="personnel" className="cursor-pointer">
                    Personnel
                  </option>
                </select>
              </span>
            ) : (
              <span className="capitalize">{input.role}</span>
            )}
          </div>
        </li>
      </ul>
      <div className="flex justify-center gap-x-5 p-[1rem]">
        <Button color="error" onClick={onCloseModal}>
          <span>Cancel</span>
        </Button>
        <Button
          color="success"
          onClick={handleUpdateUser}
          disabled={!isEdit ? true : false}
        >
          <span className="font-bold">Save</span>
        </Button>
      </div>

      <div className="absolute top-[1rem] right-[1rem] flex items-center gap-x-5">
        <button
          onClick={() => setIsEdit(!isEdit)}
          className="hover:opacity-[0.25] hover:cursor-pointer duration-300"
        >
          <span className="text-2xl ">
            <MdOutlineEdit />
          </span>
        </button>

        <Modal
          buttonContent={
            <span className="text-xl text-red">
              <FaRegTrashAlt />
            </span>
          }
          buttonStyle="hover:opacity-[0.25] hover:cursor-pointer duration-300 flex items-center"
          isModalOpen={modal}
          onCloseModal={handleCloseModal}
          onOpenModal={handleOpenModal}
          boxContent={
            <div className="bg-white w-[25vw] rounded-lg p-[1rem]">
              <div className="py-[0.25rem]">
                <p className="text-center pb-[1rem]">
                  Do you want to delete this user?
                </p>
                <div className="flex justify-center gap-x-2">
                  <Button color="error" onClick={handleCloseModal}>
                    <span>No</span>
                  </Button>
                  <Button color="success" onClick={handleDeleteUser}>
                    <span className="font-bold">Yes</span>
                  </Button>
                </div>
              </div>
              <p className="text-xs flex gap-x-1 italic text-red">
                <span>Note:</span>
                <span>
                  Once a user is deleted, their account can no longer be used
                  and all associated data will be permanently erased.
                </span>
              </p>
            </div>
          }
        />
      </div>
    </>
  );
};

export default UserInfo;
