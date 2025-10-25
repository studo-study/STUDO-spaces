import Image from '../../../assets/icons/image.svg';

export default function AddImage() {
  return (
    <div
      className="min-w-20 min-h-20 w-20
          flex justify-around items-baseline flex flex-col
	bg-studowhite  border-1 border-transparent border-studoborder rounded-2xl
	shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#bebebe] backdrop-blur-xs
	dark:bg-gray-700 dark:shadow-[8px_8px_16px_#1a1a2a,-8px_-8px_16px_#1a1a2a]
	border-[0.5px] border-solid overflow-hidden
  dark:border-t-gray-500 dark:border-l-gray-500
  border-[#8181812f] border-t-[#ffffff] border-l-[#f2f2f2]">
      <div className="w-full h-full flex justify-center items-center cursor-pointer overflow-hidden">
        <img src="" alt="" id="uploaded-image" className="w-full h-full hidden contain-content"/>
        <img src={Image} alt="" className="w-7 h-auto dark:brightness-0 dark:invert"/>
      </div>
      <div className="hidden">
        <input
          type="text"
          placeholder="paste direct imagelink"
          className="image-pastveld"
        />
      </div>

    </div>
  );
}