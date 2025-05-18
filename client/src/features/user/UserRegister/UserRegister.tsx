import { Box, Button } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserBirthday from "./UserBirthday";
import UserRole from "./UserRole";
import { RHFTextField } from "../../../shared/components/RHFTextField";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import { formRegisterSchema } from "../../../utils/getRegisterValidation";
import axios from "axios";
import { HOST } from "../../../utils/getHost";

const UserRegister = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(formRegisterSchema), // use yup validation
    defaultValues: {
      role: "student",
      year: "None",
      course: "None",
      section: "None",
    },
  });

  async function onSubmit(data: any) {
    try {
      const res = await axios.post(`http://${HOST}/register`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        localStorage.setItem("registered", "ok");
        navigate("/");
      }
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        const errorMessages = err.response.data.error;
        console.log("Validation error:", errorMessages);

        setErrorMessage(errorMessages);
      }

      if (err.response && err.response.status === 500) {
        const errorMessages = err.response.data.error;
        console.log(
          `Something went wrong. Status code: ${err.response.status}`,
          errorMessages
        );
        setErrorMessage(errorMessages);
      }
    }
  }

  function onError(errors: any) {
    const firstErrorField = Object.keys(errors)[0];
    const el = document.querySelector(`[name="${firstErrorField}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  return (
    <div className="h-[100vh] flex flex-col">
      <div className="grow-1">
        <div className="mt-[3rem] mb-[0.5rem] w-full flex justify-center">
          <img
            src="/images/logos/tcubot-main-logo(2).png"
            alt="TCUbot main logo"
            width={250}
          />
        </div>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit, onError)}
            noValidate
            sx={{ maxWidth: "100%", mx: "auto", my: "auto", display: "flex", alignItems: "center", justifyContent: "center"}}
          >
            <div className="w-[90vw] md:w-[40vw] border-2 border-gray-half px-[1.5rem] py-[2rem] rounded-lg grid gap-y-5 ">
              <h1 className="text-xl font-bold text-center">
                Register a new account
              </h1>
              <div className="flex gap-x-3">
                {/* FIRST NAME */}
                <div>
                  <RHFTextField name="first_name" label="First Name *" />
                </div>

                {/* LAST NAME */}
                <div>
                  <RHFTextField name="last_name" label="Last Name *" />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <RHFTextField name="email" label="Email *" />
              </div>

              {/* PHONE NUMBER */}
              <div>
                <RHFTextField name="phone_number" label="Phone number" />
              </div>

              {/* BIRTHDAY */}
              <UserBirthday />

              {/* SCHOOL ROLE */}
              <UserRole />

              {/* PASSWORD */}
              <div className="mt-[1rem]">
                <RHFTextField
                  name="password"
                  label="New password"
                  type="password"
                />
              </div>

              <div>
                <RHFTextField
                  name="confirm_password"
                  label="Confirm new password"
                  type="password"
                />
              </div>

              <div className="flex flex-col items-center">
                <Button
                  variant="contained"
                  sx={{
                    color: "white",
                    textTransform: "none",
                    padding: "0.75rem 0 0.75rem 0",
                  }}
                  fullWidth
                  type="submit"
                >
                  Register
                </Button>
                <span className="text-xs text-red mt-[0.5rem]">
                  {errorMessage}
                </span>
                <span className="absolute top-[0] right-[2rem]">
                  <Link to={"/"}>
                    <span className="font-bold w-max text-red mt-[1rem] block hover:cursor-pointer hover:underline">
                      Log in account
                    </span>
                  </Link>
                </span>
              </div>
            </div>
          </Box>
        </FormProvider>
      </div>
    </div>
  );
};

export default UserRegister;
