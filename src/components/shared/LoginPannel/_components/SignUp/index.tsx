"use client";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Text from "@/components/common/Text";
import supabase from "@/utils/supabase/browserSupabase";
import { FormEventHandler, useState } from "react";

interface Props {
  handleSetType: (type: "login" | "signup") => void;
}
export default function SignUp({ handleSetType }: Props) {
  const [confirm, setConfirm] = useState("");
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordconfirm = formData.get("passwordconfirm") as string;

    if (password !== passwordconfirm) {
      setConfirm("password-confirm");
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setConfirm(() => {
        if (error.message === "Password should be at least 6 characters.") {
          return "password-char";
        } else {
          return "unknown";
        }
      });
      return;
    }

    await supabase.auth.signInWithPassword({
      email,
      password,
    });

    location.reload();
  };
  return (
    <form className="my-2 flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
      <Input name="email" type="email" placeholder="이메일" required />
      <Input name="password" type="password" placeholder="비밀번호" required />
      <Input
        name="passwordconfirm"
        type="password"
        placeholder="비밀번호 확인"
        required
      />
      {confirm && (
        <>
          <div className="mt-1 flex justify-center">
            {confirm === "password-char" && (
              <Text color="red">비밀번호는 6자 이상으로 입력해주세요</Text>
            )}
            {confirm === "password-confirm" && (
              <Text color="red">비밀번호가 일치하지 않습니다</Text>
            )}
            {confirm === "unknown" && (
              <Text color="red">고객센터에 문의해주세요</Text>
            )}
          </div>
        </>
      )}
      <div className="flex flex-col gap-2 w-full mt-5">
        <Button>가입하기</Button>
      </div>
      <Text
        className="cursor-pointer mt-3 w-fit"
        color="grey"
        onClick={() => handleSetType("login")}
      >
        로그인
      </Text>
    </form>
  );
}
