import {useTranslation} from 'react-i18next';
import {NavLink} from 'react-router-dom';
import ClassNav from './classnav/ClassNav.jsx';
export default function Navbar() {
  //variables
  const { t, i18n } = useTranslation();
  const classes = [{name:'2A2',id:'12345'}, {name:'3A3',id:'2494343'} ];
  //return statement
  return (
    <div className="w-full h-fit  flex flex-col justify-baseline">
      <div className="w-full h-20 flex flex-col justify-center gap-5">
        <div className="w-full flex flex-row gap-10">
          {classes.map((item) => (
            <NavLink to={item.id} key={item.id}>
              <ClassNav name={item.name} />
            </NavLink>
          ))}

        </div>
        <div className="w-full h-1 bg-studogrey rounded-4xl">

        </div>
      </div>
    </div>);
}