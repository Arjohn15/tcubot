import axios from "axios";
import { FC, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingCircular from "../../../shared/components/LoadingCircular";
import dayjs from "dayjs";
import { getCourseFormalName } from "../../../utils/getCourseFormalName";
import ScheduleProvider from "./ScheduleProvider";
import SchoolActivity from "./SchoolActivity";
import { Button } from "@mui/material";
import { IoMdArrowBack } from "react-icons/io";

const HOST = import.meta.env.VITE_API_URL;

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
  const navigate = useNavigate();
  const location = useLocation();
  const currentPathRef = useRef(location.pathname);

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

  async function addUserRecentVisit(): Promise<void> {
    try {
      await axios.post(
        `${HOST}/user/recent-visits`,
        {
          visitee_id: id,
        },
        {
          headers: {
            Authorization: `Bearer: ${localStorage.getItem("token-user")}`,
          },
        }
      );
    } catch (err: any) {
      console.error(err.response.data.message);
    }
  }

  async function getUser(): Promise<void> {
    try {
      const resp = await axios.get(`${HOST}/user/chat/visit/${id}`, {
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
    addUserRecentVisit();
  }, []);

  if (userState.loading) {
    return (
      <div className="h-[80vh]">
        <LoadingCircular />
      </div>
    );
  }

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
    <div className="flex max-lg:flex-col">
      <div className="relative w-[45%] px-[3rem] py-[2rem] max-lg:w-full max-lg:border-b-2 max-lg:border-gray-half max-lg:px-[2rem] max-lg:py-[1rem]">
        <h2 className="text-2xl font-bold pb-[2.5rem] max-lg:text-lg max-lg:text-center max-lg:pb-[0.5rem]">
          Personal Information
        </h2>

        <ul className="flex flex-col gap-y-3 py-[1rem] max-lg:text-xs">
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
        <div className="absolute top-[0.25rem] left-0">
          <Button
            style={{ minWidth: "max-content" }}
            onClick={() => {
              navigate(-1);

              setTimeout(() => {
                if (currentPathRef.current === window.location.pathname) {
                  navigate("/user/chat");
                }
              }, 200);
            }}
          >
            <span className="text-2xl text-black">
              <IoMdArrowBack />
            </span>
          </Button>
        </div>
      </div>
      <ScheduleProvider>
        <SchoolActivity section={section} role={role} />
      </ScheduleProvider>
    </div>
  );
};

export default UserVisit;
