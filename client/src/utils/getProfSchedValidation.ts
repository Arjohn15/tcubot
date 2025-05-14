import * as yup from "yup";
import { getTimeDifferenceInHoursAndMinutes } from "./getTimeRange";

export const formProfessorSchedSchema = yup.object({
  timeStart: yup.string().max(10),
  timeEnd: yup.string().max(10),
  room: yup.string().required("room").max(10),
  subject: yup.string().required("subject").max(100),
  code: yup.string().required("code").max(10),
  assignedSection: yup.string().required("section").max(30),
  day: yup.number().required().min(0).max(6),
  timeRange: yup
    .string()
    .test(
      "is-time-range-valid",
      "less than 8-hour limit or valid time range",
      function () {
        const { timeStart, timeEnd } = this.parent;

        const { hours } = getTimeDifferenceInHoursAndMinutes(
          timeStart,
          timeEnd
        );
        return hours < 8 && hours >= 0;
      }
    ),
});
