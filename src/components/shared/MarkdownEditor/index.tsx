import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/ko-kr";
import { Editor } from "@toast-ui/react-editor";
import { useRef } from "react";
type Props = {
  disabled?: boolean;
  initialValue?: string;
  handleOnChange: (value: string) => void;
};
export default function MarkdownEditor({
  disabled,
  initialValue,
  handleOnChange,
}: Props) {
  const ref = useRef<Editor>(null);
  return (
    <div className="relative">
      {disabled && (
        <div className="w-full h-full absolute top-0 left-0 bg-black opacity-50 z-30" />
      )}
      <Editor
        ref={ref}
        autofocus={false}
        initialValue={initialValue || " "}
        previewStyle="vertical"
        height="300px"
        initialEditType="wysiwyg"
        hideModeSwitch
        useCommandShortcut={true}
        language="ko-KR"
        toolbarItems={[
          ["heading", "bold", "italic", "strike"],
          ["hr", "quote"],
          ["ul", "ol", "task"],
          ["table", "link"],
        ]}
        onChange={() => {
          if (disabled) {
            return;
          }
          handleOnChange(ref.current?.getInstance().getMarkdown() || "");
        }}
      />
    </div>
  );
}
