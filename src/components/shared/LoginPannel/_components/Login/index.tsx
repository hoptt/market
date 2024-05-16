"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Text from "@/components/common/Text";
import supabase from "@/utils/supabase/browserSupabase";
import React, { FormEventHandler } from "react";
interface Props {
  handleSetType: (type: "login" | "signup") => void;
}
export default function Login({ handleSetType }: Props) {
  const [confirm, setConfirm] = React.useState("");
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setConfirm(() => {
        if (error.message === "Email not confirmed") {
          return "email";
        } else if (error.message === "Invalid login credentials") {
          return "password";
        } else {
          return "unknown";
        }
      });
      return;
    }
    location.reload();
  };

  return (
    <form className="my-2 flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
      <Input name="email" type="email" placeholder="이메일" required />
      <Input name="password" type="password" placeholder="비밀번호" required />
      {confirm && (
        <>
          <div className="mt-1 flex justify-center">
            {confirm === "email" && (
              <Text color="red">이메일 인증을 진행해주세요</Text>
            )}
            {confirm === "password" && (
              <Text color="red">비밀번호를 다시 확인해주세요</Text>
            )}
            {confirm === "unknown" && (
              <Text color="red">고객센터에 문의해주세요</Text>
            )}
          </div>
        </>
      )}
      <div className="flex flex-col gap-2 w-full mt-5">
        <Button>로그인</Button>
        <Button outline type="button" onClick={() => handleSetType("signup")}>
          회원가입
        </Button>
      </div>
    </form>
  );
}
