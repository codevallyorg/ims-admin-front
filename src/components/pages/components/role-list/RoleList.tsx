import { Avatar, Col, List, Row } from 'antd';
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';

import Role from '@/services/role';
import { IRole, RoleEnum } from '@/types/entities/IRole';
import { showErrorNotification } from '@/utils/general';
import { CHARACTER_SECONDARY } from '@/utils/colors';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import styles from './RoleList.module.css';
import { ROUTE_ROLE_MANAGEMENT } from '@/utils/constants';

const RoleList: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [roles, setRoles] = useState<IRole[]>([]);

  useEffect(() => {
    const loadAllRoles = async () => {
      try {
        setLoading(true);

        const roles = await Role.getAllRoles();

        setRoles(roles);
      } catch (err: any) {
        console.error(err);
        showErrorNotification(err);
      } finally {
        setLoading(false);
      }
    };

    loadAllRoles();
  }, []);

  return (
    <List
      dataSource={roles}
      loading={loading}
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 3,
        xxl: 3,
      }}
      renderItem={(item: IRole) => (
        <List.Item key={item.id}>
          <Row
            style={{
              padding: '16px 24px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Col>
              <Avatar.Group
                maxCount={3}
                maxPopoverTrigger="click"
                size="large"
                maxStyle={{
                  color: '#f56a00',
                  backgroundColor: '#fde3cf',
                  cursor: 'pointer',
                }}
              >
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                <Avatar
                  style={{ backgroundColor: '#87d068' }}
                  icon={<UserOutlined />}
                />
                <Avatar
                  style={{ backgroundColor: '#1890ff' }}
                  icon={<AntDesignOutlined />}
                />
              </Avatar.Group>
            </Col>

            <Col flex="auto" style={{ margin: '0 16px' }}>
              <div className={styles.roleName}>
                <Link
                  style={{ color: 'inherit' }}
                  href={`${ROUTE_ROLE_MANAGEMENT}/${item.id}`}
                >
                  {item.name}
                </Link>
              </div>

              <div
                style={{ color: CHARACTER_SECONDARY }}
              >{`${item.users.length} User Profiles`}</div>
            </Col>

            <Col style={{ alignSelf: 'center' }}>
              {item.name !== RoleEnum.SuperAdmin && (
                <Link href={`${ROUTE_ROLE_MANAGEMENT}/${item.id}/edit-role`}>
                  Edit
                </Link>
              )}
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default RoleList;
