import { NavLink } from 'react-router-dom';
import GarageIcon from '../../assets/icons/garage.svg?react';
import RaceIcon from '../../assets/icons/race.svg?react';
import { cn } from '../../lib/utils';

function Sidebar() {
  const links = [
    { name: 'Garage', Icon: GarageIcon, link: '/garage' },
    { name: 'Winners', Icon: RaceIcon, link: '/winners' },
  ];

  return (
    <nav>
      <ul>
        {links.map(({ name, Icon, link }) => (
          <li key={name}>
            <NavLink
              to={link}
              className={({ isActive }) =>
                cn(
                  'mb-2 flex cursor-pointer items-center gap-2 rounded-xl border-2 pl-2 text-base font-medium transition-colors duration-200 ease-in-out',
                  isActive
                    ? 'border-[#FF5722] bg-[#ff57221a] text-[#FF5722]'
                    : 'border-transparent text-[#94A3B8] hover:border-[#eb8161] hover:bg-[#f793751a] hover:text-[#eb8161]',
                )
              }
            >
              <Icon className='h-4 w-5 shrink-0' aria-hidden='true' />
              <span>{name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
