import { FC, ReactNode } from 'react';

type EmptyTextProps = {
  children: ReactNode;
};

const EmptyText: FC<EmptyTextProps> = ({ children }) => {
  return <div style={{ fontSize: 22 }}>{children}</div>;
};

export default EmptyText;
