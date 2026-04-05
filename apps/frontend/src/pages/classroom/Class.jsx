import Classroom from "./Classroom.jsx";

export default function ClassPage() {
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-baseline pt-20 sm:pt-25 md:pt-35 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full sm:w-11/12 md:w-4/5 lg:w-3/5 h-full flex-col items-center justify-center gap-3">
        <Classroom />
      </div>
    </div>
  );
}