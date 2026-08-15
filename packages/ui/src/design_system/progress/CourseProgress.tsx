interface CourseProgressProps {
  done: number;
  toDo: number;
  inProg: number;
  totalLength: number;
}
const CourseProgress: React.FC<CourseProgressProps> = (props) => {
  const { done, inProg, totalLength } = props;
  const isFinished = totalLength === done;
  return (
    <div className="w-full bg-studogrey/30 shadow-2xl overflow-hidden flex flex-row h-2 rounded-full border border-gray-300 dark:border-studoborder/30">
      <div
        style={{
          width: `${isFinished ? 100 : (done / totalLength) * 100}%`,
        }}
        className="h-full bg-linear-90 from-emerald-400 to-emerald-500 transition-all duration-500"
      />
      {!isFinished && (
        <div
          style={{
            width: `${(inProg / totalLength) * 100}%`,
          }}
          className="h-full bg-linear-90 from-orange-400 to-orange-500 transition-all duration-300"
        />
      )}
    </div>
  );
};

CourseProgress.displayName = "CourseProgress";

export default CourseProgress;
