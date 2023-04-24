import { FC } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';
import RoleList from '../role-list/RoleList';
import styles from './RoleHeader.module.css';
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

      <RoleList />
    </div>
  );
};

export default RoleHeader;
