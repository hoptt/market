"use client";
import Button from "@/components/common/Button";
import { ReactNode } from "react";
//@ts-expect-error
import { experimental_useFormStatus as useFormStatus } from "react-dom";

type Props = {
  children: ReactNode;
};
export default function SubmitButton({ children }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button color="orange" className="w-28 h-12" isLoading={pending}>
      {children}
    </Button>
  );
}
