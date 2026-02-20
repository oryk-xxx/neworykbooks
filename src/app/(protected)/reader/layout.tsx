export default function ReaderLayout(props: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col px-4 py-6 md:px-6">
      {props.children}
    </div>
  );
}

