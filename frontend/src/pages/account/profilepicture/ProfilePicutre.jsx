import Profile from '../../../assets/icons/uploadpicca.svg';
import {useRef} from 'react';
export default function ProfilePicutre() {
  //events
  const button = useRef(null);
  const input = useRef(null);

  const TriggerButton = () => {
    input.current?.click();
  };

  //return statements
  return (
    <div className="bg-green-300 rounded-full h-22 w-22 cursor-pointer">
      <input type="file" ref={input} accept="image/png, image/jpeg, image/webp" hidden />
      <img src={Profile} onClick={TriggerButton} alt="upload-icon" className="w-full h-auto p-6 invert
	hover:opacity-100 opacity-0 transition-opacity duration-300"/>
    </div>);
}