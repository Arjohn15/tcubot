import { ChangeEvent, FC, useRef, useState } from "react";
import Modal from "../../../shared/components/Modal";
import { FaClock } from "react-icons/fa6";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { sections } from "../../../utils/getSchoolSections";

interface ScheduleType {
  timeStart: string;
  timeEnd: string;
  room: string;
  subject: string;
  code: string;
  assignedSection: string;
}

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const UPManageSchedule: FC = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [newSchedule, setNewSchedule] = useState<boolean>(false);
  const [day, setDay] = useState(0);

  const [schedule, setSchedule] = useState<ScheduleType>({
    timeStart: "",
    timeEnd: "",
    room: "",
    subject: "",
    code: "",
    assignedSection: "None",
  });

  function handleOpenModal(): void {
    setModal(true);
  }
  function handleCloseModal(): void {
    setModal(false);
  }

  function handleChangeSchedule(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    setSchedule({ ...schedule, [e.target.name]: e.target.value });
  }

  function handleSaveSchedule(): void {}

  const startTimeRef = useRef<HTMLInputElement>(null);

  console.log(schedule);
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
          <div className="relative bg-white rounded-lg w-[50vw] min-h-[60vh] p-[1rem]">
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
                          if (day <= 0) {
                            setDay(weekDays.length - 1);
                          } else {
                            setDay(day - 1);
                          }
                        }}
                        className="hover:cursor-pointer hover:opacity-[0.5] duration-300"
                      >
                        <span className="text-2xl">
                          <RiArrowLeftSLine />
                        </span>
                      </button>
                      <span className="font-bold block w-[8.5rem]">
                        {weekDays[day]}
                      </span>
                      <button
                        onClick={() => {
                          if (day >= weekDays.length - 1) {
                            setDay(0);
                          } else {
                            setDay(day + 1);
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
                  <td className="border border-gray p-[0.25rem]">
                    <span>Start time / End time</span>
                  </td>
                  <td className="border border-gray p-[0.25rem]">
                    <span>Section</span>
                  </td>
                  <td className="border border-gray p-[0.25rem]">
                    <span>Room</span>
                  </td>
                  <td className="border border-gray p-[0.25rem]">
                    <span>Subject</span>
                  </td>
                  <td className="border border-gray p-[0.25rem]">
                    <span>Code</span>
                  </td>
                </tr>
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
                            name="code"
                            value={schedule.code}
                            type="text"
                            onChange={handleChangeSchedule}
                            className="w-[5rem] border border-gray-300 rounded px-1 focus:outline-none focus:ring focus:ring-red-half"
                          />
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            {newSchedule && (
              <div className="flex justify-center bg-gray-half p-[0.25rem]">
                <div className="flex gap-x-10">
                  <button
                    onClick={() => setNewSchedule(false)}
                    className="text-red-half hover:cursor-pointer hover:opacity-[0.5] duration-300"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveSchedule}
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
