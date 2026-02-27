import React from "react";

export default function ReaderLayout(props: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col px-6 py-12 md:py-16">
      <div className="flex-1 w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
        {props.children}
      </div>
    </div>
  );
}

