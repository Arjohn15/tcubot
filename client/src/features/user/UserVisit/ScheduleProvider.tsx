import { createContext, FC, ReactNode, useContext, useState } from "react";

interface ScheduleContextType {
  schedule: {
    weekday: number;
    scheduleID: string;
    weekdaySchedule: any[];
  };

  onChangeWeekDay: (weekday: number) => void;
  onChangeScheduleID: (id: string) => void;
  onChangeWeekDaySchedule: (weekdaySched: any[]) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

const ScheduleProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [schedule, setSchedule] = useState<ScheduleContextType["schedule"]>({
    weekday: new Date().getDay(),
    scheduleID: "",
    weekdaySchedule: [],
  });

  function handleChangeWeekDay(weekday: number): void {
    setSchedule({ ...schedule, weekday });
  }

  function handleChangeScheduleID(id: string): void {
    setSchedule((prevSched) => {
      return { ...prevSched, scheduleID: id };
    });
  }
  function handleChangeWeekDaySchedule(weekdaySched: any[]): void {
    setSchedule({
      ...schedule,
      weekdaySchedule: weekdaySched,
    });
  }

  return (
    <ScheduleContext.Provider
      value={{
        schedule,
        onChangeWeekDay: handleChangeWeekDay,
        onChangeScheduleID: handleChangeScheduleID,
        onChangeWeekDaySchedule: handleChangeWeekDaySchedule,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context)
    throw new Error("useSchedule must be used within a ThemeProvider");
  return context;
};

export default ScheduleProvider;
