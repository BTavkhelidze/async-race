import { NavLink } from 'react-router-dom';
import GarageIcon from '../../assets/icons/garage.svg?react';
import RaceIcon from '../../assets/icons/race.svg?react';
import { cn } from '../../lib/utils';
import { useRaceStore } from '../../model/race/race.store';

function Sidebar() {
  const isRaceRunning = useRaceStore((state) => state.isRaceRunning);
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
              aria-disabled={isRaceRunning}
              tabIndex={isRaceRunning ? -1 : undefined}
              onClick={(event) => {
                if (isRaceRunning) {
                  event.preventDefault();
                }
              }}
              className={({ isActive }) =>
                cn(
                  'mb-2 flex cursor-pointer items-center gap-2 rounded-xl border-2 pl-2 text-base font-medium transition-colors duration-200 ease-in-out',
                  isRaceRunning &&
                    'cursor-not-allowed opacity-50 hover:border-transparent hover:bg-transparent hover:text-[#94A3B8]',
                  !isRaceRunning &&
                    (isActive
                      ? 'border-[#FF5722] bg-[#ff57221a] text-[#FF5722]'
                      : 'border-transparent text-[#94A3B8] hover:border-[#eb8161] hover:bg-[#f793751a] hover:text-[#eb8161]'),
                  isRaceRunning &&
                    isActive &&
                    'border-[#FF5722] bg-[#ff57221a] text-[#FF5722]',
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
