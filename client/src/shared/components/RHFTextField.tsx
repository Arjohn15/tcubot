import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface TextFieldProps {
  name: string;
  label: string;
  type?: string;
}

export const RHFTextField = ({ name, label, type }: TextFieldProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <>
          <TextField
            {...field}
            fullWidth
            label={label}
            error={!!error}
            type={type}
            sx={{
              "@media (max-width: 640px)": {
                "& .MuiInputBase-input": {
                  fontSize: "0.85rem",
                },
              },
            }}
          />
          {error && (
            <span className="text-red text-xs mt-1">{error.message}</span>
          )}
        </>
      )}
    />
  );
};
