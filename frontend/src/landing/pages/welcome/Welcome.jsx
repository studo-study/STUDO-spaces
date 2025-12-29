import Hero from './Hero.jsx';
import Stats from './Stats.jsx';
import Info from './Info.jsx';

export default function Welcome() {
  return <div className='w-full h-full flex flex-col items-center justify-start py-10 pb-30 gap-20'>
    <Hero/>
    <Stats/>
	  <div id={"info"}></div>
    <Info/>
  </div>;
}