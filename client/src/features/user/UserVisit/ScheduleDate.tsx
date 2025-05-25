import { Button } from "@mui/material";
import { TbCalendarTime } from "react-icons/tb";
import NewModal from "../../../shared/components/NewModal";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import { useSchedule } from "./ScheduleProvider";

const ScheduleDate = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));

  const { onChangeWeekDay, onChangeScheduleID } = useSchedule();

  function handleOpenModal(): void {
    setModal(true);
  }

  function handleCloseModal(): void {
    setModal(false);
  }

  return (
    <div>
      <Button
        onClick={handleOpenModal}
        style={{ border: "2px solid #d9d9d977" }}
      >
        <div className="flex items-center gap-x-3 capitalize text-black rounded-lg">
          <span className="font-bold max-lg:text-xs">
            {date?.format("MMMM DD, YYYY")}
          </span>
          <span className="text-lg">
            <TbCalendarTime />
          </span>
        </div>
      </Button>

      <NewModal
        isModalOpen={modal}
        boxContent={
          <div className="bg-[#efefef] rounded-lg p-[1rem]">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                  onChangeWeekDay(newValue?.day() ?? new Date().getDay());
                  onChangeScheduleID("");
                  handleCloseModal();
                }}
              />
            </LocalizationProvider>
          </div>
        }
        onCloseModal={handleCloseModal}
      />
    </div>
  );
};

export default ScheduleDate;
