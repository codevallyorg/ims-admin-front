import { PRIMARY_RED } from '@/utils/colors';
import { Badge as BadgeAntd } from 'antd';
import React from 'react';

type BadgeProps = {
  count?: number;
  children: React.ReactNode;
};
const Badge: React.FC<BadgeProps> = ({ count, children }) => (
  <BadgeAntd
    count={count}
    size="small"
    style={{ backgroundColor: PRIMARY_RED }}
  >
    {children}
  </BadgeAntd>
);

export default Badge;
