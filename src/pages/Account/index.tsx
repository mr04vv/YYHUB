import React, { useEffect } from 'react';
import AccountCircle from '@material-ui/icons/PermIdentityTwoTone';
import useMyInfo from 'hooks/User/useMyInfo';
import { Button, CircularProgress, Tabs, Tab } from '@material-ui/core';
import styled from 'styled-components';
import useFetchPost from 'hooks/Post/useFetchPost';
import PostList from 'components/PostList';
import Login from 'pages/Login';
import useReactRouter from 'use-react-router';
import useMasterData from 'hooks/Post/useMasterData';
import { Container, CustomAvater, ProfileContainer, UserInfoContainer, UserName } from './styles';

const Account = () => {
  const info = useMyInfo();
  const post = useFetchPost();
  const { location, history } = useReactRouter();
  const [value, setValue] = React.useState('accounts');
  const master = useMasterData();

  function handleChange(event: React.ChangeEvent<{}>, newValue: string) {
    setValue(newValue);
    history.push({
      pathname: `/${newValue}`,
    });
  }

  useEffect(() => {
    if (location.pathname === '/accounts') {
      setValue('accounts');
    } else if (location.pathname === '/accounts/likes') {
      setValue('accounts/likes');
    }
  }, [location]);

  return (
    <>
      <Container>
        {info.isLoading && <CircularProgress style={{ margin: '30vh auto' }} />}
        {!info.isLoading && info.loginStatus === 'success' && (
          <AccountWrapper>
            <ProfileContainer>
              <CustomAvater aria-label="recipe" src={info.userInfo && info.userInfo.imageUrl}>
                <AccountCircle fontSize="large" />
              </CustomAvater>
              <UserInfoContainer>
                <UserName>{info.userInfo && info.userInfo.name}</UserName>
                <CustomButton size="small" variant="contained" color="primary" onClick={() => info.logout()}>
                  ログアウト
                </CustomButton>
              </UserInfoContainer>
            </ProfileContainer>
            <Tabs value={value} onChange={handleChange} indicatorColor="secondary" textColor="secondary" centered>
              <Tab label="投稿" value="accounts" />
              <Tab label="いいね" value="accounts/likes" />
            </Tabs>
          </AccountWrapper>
        )}
      </Container>
      {!info.isLoading && info.loginStatus === 'success' && (
        <PostList
          path={location.pathname === '/accounts' ? 'accounts' : 'likes'}
          posts={location.pathname === '/accounts' ? post.myPosts : post.likedPosts}
          isLoading={post.isLoading}
          hasNext={post.hasNext}
          hasPrev={post.hasPrev}
          page={post.page}
          next={post.next}
          prev={post.prev}
          per={post.per}
          hasController
          master={master}
          place="accounts"
        />
      )}
      {!info.isLoading && info.loginStatus !== 'success' && (
        <PromptContainer>
          <div>マイページの利用にはログインが必要です</div>
          <Login />
        </PromptContainer>
      )}
    </>
  );
};

export default Account;

const CustomButton = styled(Button)`
  text-transform: unset;
  background-color: #ffbd14;
  border-radius: 0;
  color: black;
  width: 120px;
  box-shadow: unset;
  :hover {
    background-color: #ffbd14;
    opacity: 0.7;
    color: black;
    box-shadow: unset;
  }
`;

const PromptContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;

const AccountWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
