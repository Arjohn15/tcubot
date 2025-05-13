import { parse, isWithinInterval, differenceInMinutes } from "date-fns";

function parseTime(timeStr: string): Date {
  return parse(timeStr.trim(), "HH:mm", new Date());
}

function isTimeInRange(time: string, start: string, end: string): boolean {
  const checkTime = parseTime(time);
  const startTime = parseTime(start);
  const endTime = parseTime(end);

  return isWithinInterval(checkTime, { start: startTime, end: endTime });
}

function getTimeDifferenceInHoursAndMinutes(
  start: string,
  end: string
): { hours: number; minutes: number } {
  const startTime = parseTime(start);
  const endTime = parseTime(end);

  const totalMinutes = differenceInMinutes(endTime, startTime);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

const start = "13:12";
const end = "18:30";

const diff = getTimeDifferenceInHoursAndMinutes(start, end);
console.log(`${diff.hours} hours and ${diff.minutes} minutes`); // 5 hours and 18 minutes
