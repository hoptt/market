interface Props {
  /**
   * 스피너의 크기를 지정합니다 (기본값: md)
   */
  size?: "xs" | "sm" | "md";
}

/**
 * 스피너를 표시하기 위한 컴포넌트
 */
export default function Spinner({ size = "md" }: Props) {
  return (
    <span
      className="animate-spin material-symbols-outlined"
      style={{
        fontSize:
          size === "md" ? "1rem" : size === "sm" ? "0.875rem" : "0.75rem",
      }}
    >
      progress_activity
    </span>
  );
}
