import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import supabase from "@/utils/supabase/browserSupabase";
import React, { FormEventHandler } from "react";
interface Props {
  handleSetType: (type: "login" | "signup") => void;
}
export default function Login({ handleSetType }: Props) {
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }
    location.reload();
  };
  return (
    <form className="my-2 flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
      <Input name="email" type="email" placeholder="이메일" required />
      <Input name="password" type="password" placeholder="비밀번호" required />
      <div className="flex flex-col gap-2 w-full mt-5">
        <Button outline>로그인</Button>
        <Button type="button" onClick={() => handleSetType("signup")}>
          회원가입
        </Button>
      </div>
    </form>
  );
}
