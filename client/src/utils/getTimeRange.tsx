import { parse, isWithinInterval, differenceInMinutes } from "date-fns";

function parseTime(timeStr: string): Date {
  return parse(timeStr.trim(), "HH:mm", new Date());
}

export function isTimeInRange(
  time: string,
  start: string,
  end: string
): boolean {
  const checkTime = parseTime(time);
  const startTime = parseTime(start);
  const endTime = parseTime(end);

  return isWithinInterval(checkTime, { start: startTime, end: endTime });
}

export function getTimeDifferenceInHoursAndMinutes(
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
