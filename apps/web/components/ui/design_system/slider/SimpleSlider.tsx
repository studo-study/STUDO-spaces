import { Slider } from "radix-ui";

interface SimpleSliderProps {
  min: number;
  max: number;
  value: number[];
  onValueChange: (value: number[]) => void;
}
const SimpleSlider: React.FC<SimpleSliderProps> = (props) => {
  const { min, max, value, onValueChange } = props;
  return (
    <div className={"w-35 flex items-center gap-2"}>
      <Slider.Root
        min={min}
        max={max}
        value={value}
        onValueChange={onValueChange}
        className={"relative flex items-center select-none w-full h-5"}
      >
        <Slider.Track className="focus:ring-studoblue bg-studogrey relative grow rounded-full h-0.75">
          <Slider.Range className="absolute bg-studoblue h-full rounded-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5  transition-all duration-300 focus:w-8 bg-white shadow-sm rounded-xl cursor-pointer"
          aria-label="Volume"
        />
      </Slider.Root>
      <span className={"dark:text-white text-studodarkblue"}>{value[0]}</span>
    </div>
  );
};

SimpleSlider.displayName = "SimpleSlider";
export default SimpleSlider;
