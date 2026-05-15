import { useFormContext } from "react-hook-form";

export default function LabelInput({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  className,
  validationRules = {},
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <input
        {...register(name, validationRules)}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`bg-transparent w-full outline-none ${className}`}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
      )}
    </>
  );
}
