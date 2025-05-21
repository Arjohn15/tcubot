import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingCircular from "../../../shared/components/LoadingCircular";
import { HOST } from "../../../utils/getHost";
import dayjs from "dayjs";
import { getCourseFormalName } from "../../../utils/getCourseFormalName";
import ScheduleProvider from "./ScheduleProvider";
import SchoolActivity from "./SchoolActivity";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  course: string;
  formattedBirthday: string;
  role: string;
  section: string;
  school_assigned_number: string;
  year: string;
  show_birthday: number;
  show_phone_number: number;
}

interface UserState {
  loading: boolean;
  userData: UserProfile;
  errorMessage: null | "An error occured. Please try again later.";
}
const UserVisit: FC = () => {
  const { id } = useParams();

  const [userState, setUserState] = useState<UserState>({
    loading: true,
    userData: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      course: "",
      formattedBirthday: "",
      role: "",
      section: "",
      school_assigned_number: "",
      year: "",
      show_birthday: 0,
      show_phone_number: 0,
    },
    errorMessage: null,
  });

  async function getUser(): Promise<void> {
    try {
      const resp = await axios.get(`http://${HOST}/user/chat/visit/${id}`, {
        headers: {
          Authorization: `Bearer: ${localStorage.getItem("token-user")}`,
        },
      });

      setUserState({
        userData: resp.data.userInfo,
        loading: false,
        errorMessage: null,
      });
    } catch (err: any) {
      setUserState({
        userData: {
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          course: "",
          formattedBirthday: "",
          role: "",
          section: "",
          school_assigned_number: "",
          year: "",
          show_birthday: 0,
          show_phone_number: 0,
        },
        loading: false,
        errorMessage: err.response.data.message,
      });
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  if (userState.loading) {
    return <LoadingCircular />;
  }
  console.log(userState.userData);
  if (userState.errorMessage) {
    return (
      <div className="h-full flex justify-center items-center">
        <h1 className="text-xl text-gray font-bold">
          {userState.errorMessage}
        </h1>
      </div>
    );
  }

  const {
    first_name,
    last_name,
    email,
    phone_number,
    course,
    formattedBirthday,
    role,
    section,
    school_assigned_number,
    year,
    show_birthday,
    show_phone_number,
  } = userState.userData;

  return (
    <div className="flex">
      <div className="w-[40%] px-[3rem] py-[2rem] border-gray-half border-b-2">
        <h2 className="text-2xl font-bold pb-[2.5rem]">Personal Information</h2>

        <ul className="flex flex-col gap-y-3 py-[1rem]">
          <li className="flex mt-[0.25rem]">
            <span>First name:</span>
            <span className="font-bold block ml-[0.5rem]">{first_name}</span>
          </li>
          <li className="flex mt-[0.25rem]">
            <span>Last name:</span>
            <span className="font-bold block ml-[0.5rem]">{last_name}</span>
          </li>
          {show_birthday === 1 && (
            <li className="flex mt-[0.25rem]">
              <span>Date of Birth:</span>
              <span className="font-bold block ml-[0.5rem]">
                {dayjs(formattedBirthday).format("MMMM DD, YYYY")}
              </span>
            </li>
          )}
          {show_phone_number === 1 && (
            <li className="flex mt-[0.25rem]">
              <span>Phone Number:</span>
              <span className="font-bold block ml-[0.5rem]">
                {phone_number}
              </span>
            </li>
          )}
          <li className="flex mt-[0.25rem]">
            <span>Email:</span>
            <span className="font-bold block ml-[0.5rem]">{email}</span>
          </li>
          <li className="flex mt-[0.25rem]">
            <span>Role:</span>
            <span className="font-bold block ml-[0.5rem] capitalize">
              {role}
            </span>
          </li>
          <li className="flex mt-[0.25rem]">
            <span>School Number:</span>
            <span className="font-bold block ml-[0.5rem]">
              {school_assigned_number}
            </span>
          </li>
          {course && year && (
            <>
              <li className="flex mt-[0.25rem]">
                <span>Year:</span>
                <span className="font-bold block ml-[0.5rem]">{year}</span>
              </li>
              <li className="flex mt-[0.25rem]">
                <span>Course:</span>
                <span className="font-bold block ml-[0.5rem]">
                  {course} ({getCourseFormalName(course)})
                </span>
              </li>
              <li className="flex mt-[0.25rem]">
                <span>Section:</span>
                <span className="font-bold block ml-[0.5rem] uppercase">
                  {section}
                </span>
              </li>
            </>
          )}
        </ul>
      </div>
      <ScheduleProvider>
        <SchoolActivity section={section} role={role} />
      </ScheduleProvider>
    </div>
  );
};

export default UserVisit;
