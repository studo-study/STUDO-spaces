import { MdEdit } from "react-icons/md";
import { Card } from "@/types/types";

interface CarditemProps {
  index: number;
  card: Card;
}
export default function CardItem({ index, card }: CarditemProps) {
  return (
    <div
      className={
        "w-full h-36 overflow-hidden rounded-3xl border border-studoborder/30 bg-studogrey/30 flex flex-col items-center"
      }
    >
      <div
        className={
          "w-full h-10 bg-studogrey/30 flex pr-2 px-5 py-2 items-center justify-between border-b border-studoborder/30"
        }
      >
        <span>{index + 1}</span>
        <div
          className={"rounded-full hover:bg-studogrey px-1 py-1 cursor-pointer"}
        >
          <MdEdit />
        </div>
      </div>
      <div className={"w-full h-full flex px-5 gap-5"}>
        <div
          className={
            "w-1/3 h-full flex items-center justify-center flex-col gap-1"
          }
        >
          <span
            className={
              "w-full px-5 h-12 flex truncate items-center border border-studoborder/30 rounded-full bg-studogrey/10 overflow-hidden"
            }
          >
            {card.term}
          </span>
        </div>
        <div
          className={
            "w-2/3 h-full flex items-center justify-center flex-col gap-1"
          }
        >
          <span
            className={
              "w-full px-5 h-12 flex truncate items-center  border border-studoborder/30 rounded-full overflow-hidden bg-studogrey/10"
            }
          >
            {card.definition}
          </span>
        </div>
      </div>
    </div>
  );
}
