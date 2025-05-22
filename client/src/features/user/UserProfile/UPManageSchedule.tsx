import { ChangeEvent, FC, useRef, useState } from "react";
import Modal from "../../../shared/components/Modal";
import { FaClock } from "react-icons/fa6";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { sections } from "../../../utils/getSchoolSections";
import * as yup from "yup";
import { formProfessorSchedSchema } from "../../../utils/getProfSchedValidation";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { snackbarOpened } from "../../store/shared/snackbarSlice";
import dayjs from "dayjs";
import LoadingCircular from "../../../shared/components/LoadingCircular";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { selectUserState } from "../redux/userSlice";

const HOST = import.meta.env.VITE_API_URL;

interface ScheduleType {
  timeStart?: string;
  timeEnd?: string;
  room: string;
  subject: string;
  code: string;
  assignedSection: string;
  timeRange?: string;
  day: number;
}

interface Schedules {
  _id: string;
  time_start?: string;
  time_end?: string;
  room: string;
  subject: string;
  code: string;
  assigned_section: string;
  day: number;
}

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const UPManageSchedule: FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [newSchedule, setNewSchedule] = useState<boolean>(false);

  const [schedulesLoading, setSchedulesLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<Schedules[]>([]);

  const [errorsSchedule, setErrorsSchedule] = useState({});

  const [schedule, setSchedule] = useState<ScheduleType>({
    timeStart: "",
    timeEnd: "",
    room: "",
    subject: "",
    code: "",
    assignedSection: "None",
    timeRange: "",
    day: new Date().getDay(),
  });

  const [scheduleEdit, setScheduleEdit] = useState<ScheduleType>({
    timeStart: "",
    timeEnd: "",
    room: "",
    subject: "",
    code: "",
    assignedSection: "None",
    timeRange: "",
    day: new Date().getDay(),
  });

  const [configureID, setConfigureID] = useState<string>("");
  const [editID, setEditID] = useState<string>("");

  const dispatch = useAppDispatch();

  const { user } = useAppSelector(selectUserState);
  function handleOpenModal(): void {
    setModal(true);
    getAllProfSchedules(schedule.day);
  }

  function handleCloseModal(): void {
    setModal(false);
  }

  function handleChangeSchedule(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    setSchedule({ ...schedule, [e.target.name]: e.target.value });
  }

  function handleChangeEditSchedule(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    setScheduleEdit({ ...scheduleEdit, [e.target.name]: e.target.value });
  }
  async function getAllProfSchedules(selectedDay: number): Promise<void> {
    try {
      const resp = await axios.post(
        `${HOST}/user/professor/schedule-all`,
        { day: selectedDay },
        {
          headers: {
            Authorization: `Bearer: ${localStorage.getItem("token-user")}`,
          },
        }
      );

      setSchedules(resp.data.schedules);
      setSchedule({
        day: selectedDay,
        timeStart: "",
        timeEnd: "",
        room: "",
        subject: "",
        code: "",
        assignedSection: "None",
        timeRange: "",
      });
      setNewSchedule(false);
      setSchedulesLoading(false);
    } catch (err: any) {
      dispatch(
        snackbarOpened({
          message:
            err.response.data.message ||
            "Unknown error. Please try again later.",
          severity: "error",
          isSnackbar: true,
        })
      );
      setSchedulesLoading(false);
      handleCloseModal();
    }
  }

  async function handleSaveSchedule(
    validatedData: ScheduleType
  ): Promise<void> {
    try {
      const resp = await axios.post(
        `${HOST}/user/professor/schedule`,
        {
          professorName: `${user.first_name} ${user.last_name}`,
          ...validatedData,
        },
        {
          headers: {
            Authorization: `Bearer: ${localStorage.getItem("token-user")}`,
          },
        }
      );

      dispatch(
        snackbarOpened({
          message: resp.data.message,
          severity: "success",
          isSnackbar: true,
        })
      );

      getAllProfSchedules(schedule.day);
    } catch (err: any) {
      dispatch(
        snackbarOpened({
          message:
            err.response.data.message ||
            "Unknown error. Please try again later.",
          severity: "error",
          isSnackbar: true,
        })
      );
      setSchedulesLoading(false);
      handleCloseModal();
    }
  }

  async function handleValidateSchedule(): Promise<void> {
    const formattedErrors: Record<string, string> = {};

    try {
      const validatedData = await formProfessorSchedSchema.validate(schedule, {
        abortEarly: false,
      });

      delete validatedData.timeRange;

      setErrorsSchedule({});
      handleSaveSchedule(validatedData);
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((validationError: yup.ValidationError) => {
          if (validationError.path) {
            formattedErrors[validationError.path] = validationError.message;
          }
        });

        setErrorsSchedule(formattedErrors);
      }
    }
  }

  const startTimeRef = useRef<HTMLInputElement>(null);

  const errorScheduleFields = Object.entries(errorsSchedule).map(
    ([_, val], ind, arr) => {
      return arr.length - 1 !== ind ? `${val}, ` : `${val} `;
    }
  );

  return (
    <div>
      <Modal
        isModalOpen={modal}
        onCloseModal={handleCloseModal}
        onOpenModal={handleOpenModal}
        buttonContent={
          <>
            <span>Manage my schedule</span>
            <span className="block ml-[0.5rem]">
              <FaClock />
            </span>
          </>
        }
        buttonStyle="flex items-center border-2 border-gray rounded-xl px-[0.5rem] hover:cursor-pointer hover:opacity-[0.65] duration-300 font-bold"
        boxContent={
          <div className="relative bg-white rounded-lg w-[60vw] h-[80vh] overflow-y-auto p-[1rem]">
            <div className="flex items-center justify-center text-xl p-[1rem]">
              <h1 className="font-bold">My Schedule</h1>
              <span className="block ml-[0.5rem]">
                <FaClock />
              </span>
            </div>

            <table className="table-auto text-center w-full border border-gray border-collapse">
              <thead>
                <tr>
                  <th colSpan={5} className="p-[0.25rem]">
                    <div className="flex justify-evenly items-center col-span-5 p-[0.5rem]">
                      <button
                        onClick={() => {
                          if (schedule.day <= 0) {
                            setSchedule({
                              ...schedule,
                              day: weekDays.length - 1,
                            });
                            getAllProfSchedules(weekDays.length - 1);
                          } else {
                            setSchedule({ ...schedule, day: schedule.day - 1 });
                            getAllProfSchedules(schedule.day - 1);
                          }
                        }}
                        className="hover:cursor-pointer hover:opacity-[0.5] duration-300"
                      >
                        <span className="text-2xl">
                          <RiArrowLeftSLine />
                        </span>
                      </button>
                      <span className="font-bold block w-[8.5rem]">
                        {weekDays[schedule.day]}
                      </span>
                      <button
                        onClick={() => {
                          if (schedule.day >= weekDays.length - 1) {
                            setSchedule({ ...schedule, day: 0 });
                            getAllProfSchedules(0);
                          } else {
                            setSchedule({
                              ...schedule,
                              day: schedule.day + 1,
                            });
                            getAllProfSchedules(schedule.day + 1);
                          }
                        }}
                        className="hover:cursor-pointer hover:opacity-[0.5] duration-300"
                      >
                        <span className="text-2xl">
                          <RiArrowRightSLine />
                        </span>
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="w-[11.5rem] border border-gray p-[0.25rem] font-bold">
                    <span>Start time / End time</span>
                  </td>
                  <td className="border border-gray p-[0.25rem] font-bold">
                    <span>Section</span>
                  </td>
                  <td className="border border-gray p-[0.25rem] font-bold">
                    <span>Room</span>
                  </td>
                  <td className="border border-gray p-[0.25rem] font-bold">
                    <span>Subject</span>
                  </td>
                  <td className="border border-gray p-[0.25rem] font-bold">
                    <span>Code</span>
                  </td>
                </tr>

                {schedules.length !== 0 &&
                  schedules.map((schedule) => {
                    const formattedTimeStart = dayjs(
                      `1970-01-01T${schedule.time_start}`
                    ).format("h:mm A");
                    const formattedTimeEnd = dayjs(
                      `1970-01-01T${schedule.time_end}`
                    ).format("h:mm A");

                    return (
                      <tr
                        key={schedule._id}
                        onMouseEnter={() => setConfigureID(schedule._id)}
                        onMouseLeave={() => setConfigureID("")}
                      >
                        {editID === schedule._id ? (
                          <>
                            <td className="border border-gray p-[0.5rem] w-[10px]">
                              <div className="flex justify-center gap-x-2">
                                <div>
                                  <input
                                    ref={startTimeRef}
                                    name="timeStart"
                                    type="time"
                                    value={scheduleEdit.timeStart}
                                    onChange={handleChangeEditSchedule}
                                    className="border border-gray-300 rounded px-1 focus:outline-none focus:ring focus:ring-red-half"
                                  />
                                </div>
                                <span>-</span>
                                <div>
                                  <input
                                    name="timeEnd"
                                    type="time"
                                    value={scheduleEdit.timeEnd}
                                    onChange={handleChangeEditSchedule}
                                    className="border border-gray-300 rounded px-1 focus:outline-none focus:ring focus:ring-red-half"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="border border-gray p-[0.25rem] w-[10px]">
                              <div>
                                <select
                                  name="assignedSection"
                                  value={scheduleEdit.assignedSection}
                                  onChange={handleChangeEditSchedule}
                                  className="w-[5rem] border border-gray-300 rounded px-1 focus:outline-none focus:ring focus:ring-red-half"
                                >
                                  {sections.map((section) => {
                                    return (
                                      <option
                                        key={section.id}
                                        value={section.id}
                                      >
                                        {section.name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </td>
                            <td className="border border-gray p-[0.25rem] w-[10px] ">
                              <div>
                                <input
                                  placeholder="e.g. 420"
                                  name="room"
                                  value={scheduleEdit.room}
                                  type="text"
                                  onChange={handleChangeEditSchedule}
                                  className="w-[5rem] border border-gray-300 rounded px-1 focus:outline-none focus:ring focus:ring-red-half"
                                />
                              </div>
                            </td>
                            <td className="border border-gray p-[0.25rem] w-[10px]">
                              <div>
                                <input
                                  placeholder="e.g. PE"
                                  name="subject"
                                  value={scheduleEdit.subject}
                                  type="text"
                                  onChange={handleChangeEditSchedule}
                                  className="w-[5rem] border border-gray-300 rounded px-1 focus:outline-none focus:ring focus:ring-red-half"
                                />
                              </div>
                            </td>
                            <td className="border border-gray py-[0.25rem] px-[1rem] w-[10px] relative">
                              <div>
                                <input
                                  placeholder="e.g. GE22"
                                  name="code"
                                  value={scheduleEdit.code}
                                  type="text"
                                  onChange={handleChangeEditSchedule}
                                  className="w-[5rem] border border-gray-300 rounded px-1 focus:outline-none focus:ring focus:ring-red-half"
                                />
                              </div>
                              <div className="flex gap-x-1 absolute top-[50%] right-0 translate-y-[-50%]">
                                <button
                                  onClick={() => setEditID("")}
                                  className="hover:cursor-pointer hover:opacity-[0.5] duration-300"
                                >
                                  <span className="text-red text-lg">
                                    <IoMdClose />
                                  </span>
                                </button>
                                <button
                                  onClick={async () => {
                                    try {
                                      const resp = await axios.put(
                                        `${HOST}/user/professor/schedule-update/${schedule._id}`,
                                        scheduleEdit,
                                        {
                                          headers: {
                                            Authorization: `Bearer: ${localStorage.getItem(
                                              "token-user"
                                            )}`,
                                          },
                                        }
                                      );

                                      dispatch(
                                        snackbarOpened({
                                          message: resp.data.message,
                                          severity: "success",
                                          isSnackbar: true,
                                        })
                                      );

                                      getAllProfSchedules(schedule.day);
                                    } catch (err: any) {
                                      dispatch(
                                        snackbarOpened({
                                          message:
                                            err.response.data.message ||
                                            "Unknown error. Please try again later.",
                                          severity: "error",
                                          isSnackbar: true,
                                        })
                                      );
                                      setSchedulesLoading(false);
                                      handleCloseModal();
                                    }
                                    setEditID("");
                                  }}
                                  className="hover:cursor-pointer hover:opacity-[0.5] duration-300"
                                >
                                  <span className="text-green text-lg">
                                    <IoMdCheckmark />
                                  </span>
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="border border-gray p-[0.25rem]">
                              <span>
                                {formattedTimeStart} - {formattedTimeEnd}
                              </span>
                            </td>
                            <td className="border border-gray p-[0.25rem] uppercase">
                              <span>{schedule.assigned_section}</span>
                            </td>
                            <td className="border border-gray p-[0.25rem]">
                              <span>{schedule.room}</span>
                            </td>
                            <td className="border border-gray p-[0.25rem]">
                              <span>{schedule.subject}</span>
                            </td>
                            <td className="border border-gray py-[0.25rem] px-[2rem] relative">
                              <span>{schedule.code}</span>
                              {configureID === schedule._id && (
                                <div className="flex gap-x-1 absolute top-[50%] right-[0.5rem] translate-y-[-50%]">
                                  <button
                                    onClick={() => {
                                      setEditID(schedule._id);
                                      setScheduleEdit({
                                        assignedSection:
                                          schedule.assigned_section,
                                        code: schedule.code,
                                        day: schedule.day,
                                        room: schedule.room,
                                        subject: schedule.subject,
                                        timeEnd: schedule.time_end,
                                        timeStart: schedule.time_start,
                                      });
                                    }}
                                    className="hover:cursor-pointer hover:opacity-[0.5] duration-300"
                                  >
                                    <span>
                                      <MdEdit />
                                    </span>
                                  </button>
                                  <button
                                    className="hover:cursor-pointer hover:opacity-[0.5] duration-300"
                                    onClick={async () => {
                                      try {
                                        const resp = await axios.delete(
                                          `${HOST}/user/professor/schedule-delete/${schedule._id}`,
                                          {
                                            headers: {
                                              Authorization: `Bearer: ${localStorage.getItem(
                                                "token-user"
                                              )}`,
                                            },
                                          }
                                        );
                                        dispatch(
                                          snackbarOpened({
                                            message: resp.data.message,
                                            severity: "success",
                                            isSnackbar: true,
                                          })
                                        );
                                        getAllProfSchedules(schedule.day);
                                      } catch (err: any) {
                                        dispatch(
                                          snackbarOpened({
                                            message:
                                              err.response.data.message ||
                                              "Unknown error. Please try again later.",
                                            severity: "error",
                                            isSnackbar: true,
                                          })
                                        );
                                      }
                                    }}
                                  >
                                    <span className="text-red">
                                      <MdDelete />
                                    </span>
                                  </button>
                                </div>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                {schedulesLoading && (
                  <tr>
                    <td colSpan={5} className="py-[0.5rem]">
                      <LoadingCircular size="1.5rem" />
                    </td>
                  </tr>
                )}

                {schedules.length === 0 && !newSchedule && (
                  <tr>
                    <td colSpan={5} className="p-[1rem] opacity-[0.25]">
                      <span>
                        You have no schedule on {weekDays[schedule.day]}
                      </span>
                    </td>
                  </tr>
                )}
                {!newSchedule && (
                  <tr>
                    <td colSpan={5}>
                      <button
                        onClick={() => {
                          setNewSchedule(true);
                          setTimeout(() => {
                            if (startTimeRef.current) {
                              startTimeRef.current.focus();
                            }
                          }, 100);
                        }}
                        className="bg-gray w-full flex justify-center p-[0.25rem] hover:cursor-pointer hover:bg-gray-half duration-300"
                      >
                        <span className="text-xl text-green-600">
                          <IoMdAddCircleOutline />
                        </span>
                      </button>
                    </td>
                  </tr>
                )}
                {newSchedule && (
                  <>
                    <tr>
                      <td className="border border-gray p-[0.5rem] w-[10px]">
                        <div className="flex justify-center gap-x-2">
                          <div>
                            <input
                              ref={startTimeRef}
                              name="timeStart"
                              type="time"
                              value={schedule.timeStart}
                              onChange={handleChangeSchedule}
                              className="border border-gray-300 rounded px-1 focus:outline-none focus:ring focus:ring-red-half"
                            />
                          </div>
                          <span>-</span>
                          <div>
                            <input
                              name="timeEnd"
                              type="time"
                              value={schedule.timeEnd}
                              onChange={handleChangeSchedule}
                              className="border border-gray-300 rounded px-1 focus:outline-none focus:ring focus:ring-red-half"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray p-[0.25rem] w-[10px]">
                        <div>
                          <select
                            name="assignedSection"
                            value={schedule.assignedSection}
                            onChange={handleChangeSchedule}
                            className="w-[5rem] border border-gray-300 rounded px-1 focus:outline-none focus:ring focus:ring-red-half"
                          >
                            {sections.map((section) => {
                              return (
                                <option key={section.id} value={section.id}>
                                  {section.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </td>
                      <td className="border border-gray p-[0.25rem] w-[10px]">
                        <div>
                          <input
                            placeholder="e.g. 420"
                            name="room"
                            value={schedule.room}
                            type="text"
                            onChange={handleChangeSchedule}
                            className="w-[5rem] border border-gray-300 rounded px-1 focus:outline-none focus:ring focus:ring-red-half"
                          />
                        </div>
                      </td>
                      <td className="border border-gray p-[0.25rem] w-[10px]">
                        <div>
                          <input
                            placeholder="e.g. PE"
                            name="subject"
                            value={schedule.subject}
                            type="text"
                            onChange={handleChangeSchedule}
                            className="w-[5rem] border border-gray-300 rounded px-1 focus:outline-none focus:ring focus:ring-red-half"
                          />
                        </div>
                      </td>
                      <td className="border border-gray p-[0.25rem] w-[10px]">
                        <div>
                          <input
                            placeholder="e.g. GE22"
                            name="code"
                            value={schedule.code}
                            type="text"
                            onChange={handleChangeSchedule}
                            className="w-[5rem] border border-gray-300 rounded px-1 focus:outline-none focus:ring focus:ring-red-half"
                          />
                        </div>
                      </td>
                    </tr>
                    {errorScheduleFields.length !== 0 && (
                      <tr>
                        <td colSpan={5}>
                          <span className="text-red text-xs p-[0.5rem] block">
                            Field {errorScheduleFields}{" "}
                            {errorScheduleFields.length > 1 ? "are" : "is"}{" "}
                            required
                          </span>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>

            {newSchedule && (
              <div className="flex justify-center bg-gray-half p-[0.25rem]">
                <div className="flex gap-x-10">
                  <button
                    onClick={() => {
                      setNewSchedule(false);
                      setErrorsSchedule({});
                    }}
                    className="text-red-half hover:cursor-pointer hover:opacity-[0.5] duration-300"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleValidateSchedule}
                    className="text-green-500 hover:cursor-pointer hover:opacity-[0.5] duration-300"
                  >
                    <span>Save</span>
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleCloseModal}
              className="absolute top-[0.5rem] right-[0.5rem] hover:cursor-pointer hover:text-red duration-300"
            >
              <span className="text-2xl">
                <IoMdClose />
              </span>
            </button>
          </div>
        }
      />
    </div>
  );
};

export default UPManageSchedule;
