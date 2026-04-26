import Profile from "../../../assets/icons/uploadpicca.svg";
import { useRef } from "react";
import { PiStudent } from "react-icons/pi";

export default function ProfilePicutre(image) {

  const button = useRef(null);
  const input = useRef(null);

  const TriggerButton = () => {
    input.current?.click();
  };


  return (
    <div
      className="bg-emerald-400 flex items-center justify-center rounded-full min-h-22 min-w-22 relative cursor-pointer overflow-hidden group">
      {/*<input
        type="file"
        ref={input}
        accept="image/png, image/jpeg, image/webp"
        hidden
      />*/}

      {image.img === "default" ? <PiStudent size={40} color={"white"} /> : (
        <img
          src={image.img}
          alt="profile"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <img
        src={Profile}
        onClick={TriggerButton}
        alt="upload-icon"
        className="absolute inset-0 w-full h-full p-6 invert opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
    </div>);

}