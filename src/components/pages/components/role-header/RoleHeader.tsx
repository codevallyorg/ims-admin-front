import { FC } from 'react';
import Button from '@/components/ui/button/Button';
import RoleCard from '../role-card/RoleCard';
import styles from './RoleHeader.module.css';
import Link from 'next/link';
import { ROUTE_CREATE_NEW_ROLE } from '@/utils/constants';

const RoleHeader: FC = () => {
  return (
    <div>
      <header className={styles.header}>
        <span className={styles.title}>Available Roles</span>

        <span>
          <Link href={ROUTE_CREATE_NEW_ROLE}>
            <Button type="primary">Create a new role</Button>
          </Link>
        </span>
      </header>

      <RoleCard />
    </div>
  );
};

export default RoleHeader;
