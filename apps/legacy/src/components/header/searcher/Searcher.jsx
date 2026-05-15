import { useEffect, useState } from "react";

export default function Searcher({ searching }) {
  const [animation, setAnimation] = useState(false);
  useEffect(() => {
    setAnimation(searching);
  }, [searching]);

  return (
    <div className="min-w-full min-h-1 flex justify-baseline items-center absolute z-[9999]">
      <div
        className={`${animation ? "searchAnimation" : "w-0"} h-1 bg-studoblue`}
      ></div>
    </div>
  );
}
