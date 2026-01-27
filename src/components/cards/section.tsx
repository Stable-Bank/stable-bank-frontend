import React from "react";

export default function SectionCard({ title }: { title: string }) {
  return (
    <div className="font-normal text-sm text-white px-5 py-1.5 border border-solid border-white rounded-3xl inline-block">
      {title}
    </div>
  );
}
