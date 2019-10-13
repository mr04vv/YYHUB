import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import History from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import Help from '@material-ui/icons/HelpOutline';
import AccountCircle from '@material-ui/icons/AccountCircle';
import useNavigation from 'hooks/Footer/useNavigation';
import NotificationsNone from '@material-ui/icons/InfoOutlined';
import useReactRouter from 'use-react-router';
import useMyInfo from 'hooks/User/useMyInfo';
import styled from 'styled-components';
import { Avatar } from '@material-ui/core';
import useStyles from './styles';

const BottomFooter = () => {
  const classes = useStyles();
  const nav = useNavigation();
  const { location } = useReactRouter();
  const user = useMyInfo();

  return (
    <>
      {location.pathname !== '/login' && (
        <BottomNavigation showLabels value={nav.value} onChange={nav.handleChange} className={classes.root}>
          <BottomNavigationAction className={classes.icon} classes={{ selected: classes.selected }} value="/home" icon={<History />} />
          <BottomNavigationAction className={classes.icon} classes={{ selected: classes.selected }} value="/search" icon={<SearchIcon />} />
          <BottomNavigationAction className={classes.icon} classes={{ selected: classes.selected }} value="/help" icon={<Help />} />
          <BottomNavigationAction className={classes.icon} classes={{ selected: classes.selected }} value="/info" icon={<NotificationsNone />} />
          {user.userInfo && user.userInfo.imageUrl
            ? <BottomNavigationAction className={classes.icon} classes={{ selected: classes.selected }} value="/accounts" icon={<CustomAvater aria-label="recipe" src={user.userInfo.imageUrl} />} />
            : <BottomNavigationAction className={classes.icon} classes={{ selected: classes.selected }} value="/accounts" icon={<AccountCircle />} />}

        </BottomNavigation>
      )}
    </>
  );
};

export default BottomFooter;

const CustomAvater = styled(Avatar)`
  width: 24px;
  height: 24px;
`;
