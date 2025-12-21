import Hero from './Hero.jsx';
import Stats from './Stats.jsx';
import Info from './Info.jsx';

export default function Welcome() {
  return <div className='w-full h-full pt-10'>
    <Hero/>
    <Stats/>
    <Info/>
  </div>;
}