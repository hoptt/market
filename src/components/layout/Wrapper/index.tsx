import classNames from "classnames";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}
export default function Wrapper({ children, className }: Props) {
  return <div className={classNames(className, "w-full")}>{children}</div>;
}
