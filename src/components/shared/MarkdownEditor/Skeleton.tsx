import Spinner from "@/components/common/Spinner";
import React from "react";

export default function MarkdownEditorSkeleton() {
  return (
    <div style={{ height: 300 }} className="flex justify-center items-center">
      <Spinner />
    </div>
  );
}
