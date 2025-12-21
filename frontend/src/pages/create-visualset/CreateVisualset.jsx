import VsHeader from './header/VsHeader.jsx';
import VsFooter from './footer/VsFooter.jsx';
import VsInput from './inputfield/VsInput.jsx';

export default function CreateVisualset() {
  const folders = ['folder1', 'folder2', 'folder3'];
  return (
    <div
      className="w-full min-h-screen h-fit flex text-base flex-col items-center justify-baseline pt-35 gap-5 mb-20">
      <div className="w-3/5 h-fit flex flex-col gap-5">
        <VsHeader folders={folders}/>
        <VsInput/>
        <VsFooter/>
      </div>
    </div>);
}

function CreateNewImage() {
  return;
}