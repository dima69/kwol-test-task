import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import * as z from "zod";

const schema = z.object({
  email: z.email("Введите корректный e-mail"),
  accepted: z.literal(true, "А принять условия?"),
  name: z
    .string()
    .min(1, "Имя слишком короткое")
    .regex(/^[a-zA-Z\s]+$/, "Только латинские буквы")
    .optional(),
  password: z
    .string()
    .min(6, "Пароль не короче 6 символов")
    .regex(/^[a-zA-Z]+$/, "Только латинские буквы")
    .optional(),
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { accepted: true },
  });

  const onSubmit = async (data: FormData) => {
    if (step === 1) {
      const res = await fetch("http://localhost:3000/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (res.status === 409) {
        setError("email", { message: "Этот e-mail уже занят" });
        return;
      }
      if (!res.ok) {
        setError("email", { message: "Что-то пошло не так" });
        return;
      }

      setStep(2);
      return;
    }

    if (!data.name || !data.password) {
      if (!data.name) setError("name", { message: "Введите имя" });
      if (!data.password) setError("password", { message: "Введите пароль" });
      return;
    }

    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        password: data.password,
      }),
    });

    if (!res.ok) {
      setError("root", { message: "Что-то пошло не так" });
      return;
    }

    navigate("/users");
  };

  return (
    <div className="md:shadow-default max-w-[536px] rounded-t-[24px] bg-white px-[20px] py-[24px] md:rounded-[48px] md:px-[68px] md:pt-[56px] md:pb-[40px]">
      <div className="mb-[24px] text-center text-[32px] leading-[36px] font-semibold md:mb-[32px] md:text-[44px] md:leading-[44px]">
        Регистрация
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[8px]"
      >
        <div className="flex flex-col gap-[4px]">
          <div className="text-[14px] text-[#626C77]">Корпоративный e-mail</div>
          <input
            {...register("email")}
            type="text"
            disabled={step === 2}
            className="h-[60px] w-full rounded-[16px] border border-[#BCC3D0]/50 bg-[#F2F3F7] px-[12px] font-medium placeholder:text-[#626C77] disabled:opacity-50"
            placeholder="Введи почту"
          />
          {errors.email && (
            <div className="text-sm font-medium text-red-500">
              {errors.email.message}
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="flex flex-col text-[14px] font-medium">
            <div className="flex flex-row gap-2">
              <input
                type="checkbox"
                id="accept"
                {...register("accepted")}
                className="accent-[#2662F3]"
              />
              <label
                htmlFor="accept"
                className="leading-[20px] text-[#626C77] select-none"
              >
                Я подтверждаю согласие c{" "}
                <a href="#" className="font-medium text-[#2662F3]">
                  политикой конфеденциальности
                </a>
              </label>
            </div>
            {errors.accepted && (
              <div className="text-sm font-medium text-red-500">
                {errors.accepted.message}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <>
            <div className="flex flex-col gap-[4px]">
              <div className="text-[14px] text-[#626C77]">Имя</div>
              <input
                {...register("name")}
                type="text"
                className="h-[60px] w-full rounded-[16px] border border-[#BCC3D0]/50 bg-[#F2F3F7] px-[12px] font-medium placeholder:text-[#626C77]"
                placeholder="Введи имя"
              />
              {errors.name && (
                <div className="text-sm font-medium text-red-500">
                  {errors.name.message}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-[4px]">
              <div className="text-[14px] text-[#626C77]">Пароль</div>
              <input
                {...register("password")}
                type="password"
                className="h-[60px] w-full rounded-[16px] border border-[#BCC3D0]/50 bg-[#F2F3F7] px-[12px] font-medium placeholder:text-[#626C77]"
                placeholder="Введи пароль"
              />
              {errors.password && (
                <div className="text-sm font-medium text-red-500">
                  {errors.password.message}
                </div>
              )}
            </div>
          </>
        )}

        {errors.root && (
          <div className="text-sm font-medium text-red-500">
            {errors.root.message}
          </div>
        )}

        <div className="flex flex-col gap-[12px]">
          <button
            type="submit"
            className="h-[60px] w-full rounded-[10px] bg-[#2662F3] text-[12px] font-bold tracking-[0.05em] text-white uppercase hover:bg-[#709AFE] active:bg-[#1450E0]"
          >
            {step === 1 ? "Продолжить" : "Зарегистрироваться"}
          </button>
          {step === 1 && (
            <button
              type="button"
              className="h-[60px] w-full rounded-[10px] bg-[#E7EBF2] text-[12px] font-bold tracking-[0.05em] text-[#1F242A] uppercase hover:bg-[#F4F5F7] active:bg-[#E7EBF2]"
            >
              Войти
            </button>
          )}
        </div>

        {step === 1 && (
          <div className="text-center text-[12px]">
            <div className="font-medium text-[#626C77]">
              Возник вопрос или что-то сломалось?
            </div>
            <a href="#" className="font-medium text-[#2662F3]">
              Вступай в чат и задавай вопрос
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
