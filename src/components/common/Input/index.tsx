import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react";
import classNames from "classnames";

interface Props extends ComponentPropsWithoutRef<"input"> {}

/**
 * Input 요소를 처리하기 위한 컴포넌트
 */
const Input = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLInputElement>) => (
    <input
      {...props}
      ref={ref}
      className={classNames(
        props.className,
        "border text-base p-2 outline-none text-black disabled:opacity-50",
        {}
      )}
    />
  )
);
Input.displayName = "Input";

export default Input;
