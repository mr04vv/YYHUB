/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
// import {
//   CardHeader, Avatar, IconButton, CardContent, Typography, CardActions,
// } from '@material-ui/core';
import {
  CardHeader,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  CardActions,
  SvgIcon,
} from '@material-ui/core';
import styled from 'styled-components';
import FavoriteIcon from '@material-ui/icons/Favorite';
// import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import { PostInterface } from 'interfaces/posts/PostInterface';
import { CustomAvater } from 'pages/Account/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useEditPost from 'hooks/Post/useEditPost';
import useMyInfo from 'hooks/User/useMyInfo';
import useLike from 'hooks/Like/useLike';
import SimpleSnackBar from 'components/SimpleSnackBar';
import { Link } from 'react-router-dom';
import { CategoryInterface } from 'interfaces/CategoryInterface';
import CopyToClipboard from 'react-copy-to-clipboard';
import updatePlayCount from 'api/posts/updatePlayCount';

const { Twitter } = require('react-social-sharing');

interface PropInterface {
  posts: PostInterface[];
  isLoading: boolean;
  hasNext: boolean;
  hasPrev: boolean;
  page: string;
  per: string;
  next: Function;
  prev: Function;
  path: string;
  hasController: Boolean;
}

const PostList = ({
  posts,
  isLoading,
  hasNext,
  hasPrev,
  page,
  next,
  prev,
  per,
  path,
  hasController,
}: PropInterface) => {
  const [refs] = useState<any[]>([
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
  ]);
  const [isPlaying, setIsPlaying] = React.useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [isCopied, setIsCopied] = React.useState<boolean>(false);
  const setCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  useEffect(() => {
    setIsPlaying([false, false, false, false, false, false, false, false, false, false]);
  }, [posts]);
  const loop = (r: any, second: number) => {
    r.player.seekTo(second, 'seconds');
  };
  const edit = useEditPost();
  const user = useMyInfo();
  const like = useLike(posts, path);
  return (
    <Container>
      {isLoading || edit.isLoading ? (
        <CircularProgress style={{ margin: '30vh auto' }} />
      ) : (
        posts &&
        posts.map((p: PostInterface, index: number) => (
          <div key={p.id}>
            <CardHeader
              avatar={
                p.isAnonymous ? (
                  <Avatar aria-label="recipe">匿</Avatar>
                ) : (
                  <CustomAvater aria-label="recipe" src={p.user.imageUrl} />
                )
              }
              action={
                <>
                  {user.userInfo && user.userInfo.id === p.user.id && (
                    <IconButton
                      aria-label="settings"
                      aria-controls="simple-menu"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => edit.handleClick(e, index + 1)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </>
              }
              title={p.isAnonymous ? '匿名ユーザー' : p.user.name}
              subheader={new Date(p.createdAt).toLocaleString('ja')}
            />
            <Menu
              id="simple-menu"
              anchorEl={edit.anchorEl}
              keepMounted
              open={edit.isOpenNumber === index + 1}
              onClose={edit.handleClose}
            >
              <MenuItem onClick={() => edit.del(p.id, page, per)}>削除</MenuItem>
            </Menu>
            <ReactPlayer
              width="100%"
              height={window.innerWidth < 420 ? '300px' : '500px'}
              ref={refs[index]}
              controls
              onStart={async () => {
                updatePlayCount(p.id);
              }}
              onEnded={async () => {
                loop(refs[index].current, p.startTime);
                updatePlayCount(p.id);
              }}
              url={p.videoUrl}
              youtubeConfig={{
                playerVars: {
                  start: p.startTime,
                  end: p.endTime,
                },
              }}
              onPlay={() => setIsPlaying(isPlaying.map((v: boolean, idx: number) => idx === index))}
              playing={isPlaying[index]}
            />
            <CustomCardContent>
              <Typography gutterBottom component="h4">
                {p.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {p.detail}
              </Typography>
              <InfoWrapper>
                <Typography variant="body2" color="textSecondary" component="p">
                  {`長さ：${p.endTime - p.startTime}秒 / 再生回数：${p.playCount ? p.playCount : 0}回`}
                </Typography>
              </InfoWrapper>
              <TypeContainer>
                <TypeName>ゲーム：</TypeName>
                <Link to={`search?game=${p.game.id}`} onClick={() => window.scrollTo(0, 0)}>
                  {p.game.title}
                </Link>
              </TypeContainer>
              <TypeContainer>
                <TypeName>カテゴリ：</TypeName>
                {p.categories.map((c: CategoryInterface, idx: number) => (
                  <TypeContainer key={c.name}>
                    {idx !== 0 && ', '}
                    <Link to={`search?category=${c.id}`} onClick={() => window.scrollTo(0, 0)}>
                      {c.name}
                    </Link>
                  </TypeContainer>
                ))}
              </TypeContainer>
            </CustomCardContent>
            <CardActionContainer>
              <CustomCardAction>
                <LikeContainer>
                  <CustomIconButton
                    aria-label="add to favorites"
                    onClick={() => {
                      user.loginStatus === 'success'
                        ? p.alreadyLiked
                          ? like.delLike(p.id, index)
                          : like.like(p.id, index)
                        : like.setIsNoLoginError(true);
                    }}
                  >
                    <FavoriteIcon color={p.alreadyLiked ? 'secondary' : 'disabled'} width="3px" fontSize="small" />
                  </CustomIconButton>
                  <LikeCount>{p.likeCount}</LikeCount>
                </LikeContainer>
                {/* <CustomIconButton aria-label="add to favorites">
                    <PlaylistAdd />
                  </CustomIconButton> */}
                <CopyToClipboard text={`https://yy-tube.com/post/${p.id}`}>
                  <IconWrapper>
                    <SvgIcon color="action" onClick={() => setCopy()}>
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </SvgIcon>
                  </IconWrapper>
                </CopyToClipboard>
                <Twitter message="#わいちゅーぶ #わいわい #ガヤ民" link={`https://yy-tube.com/post/${p.id}`} />
              </CustomCardAction>
            </CardActionContainer>
            <Hr />
          </div>
        ))
      )}
      {posts && posts.length === 0 && <NoPost>投稿がありません</NoPost>}
      {!isLoading && posts && posts.length !== 0 && hasController && (
        <PageButtonContainer>
          <PageButton color="primary" variant="contained" disabled={!hasPrev} onClick={() => prev()}>
            前へ
          </PageButton>
          <PageButton color="primary" variant="contained" disabled={!hasNext} onClick={() => next()}>
            次へ
          </PageButton>
        </PageButtonContainer>
      )}
      <SimpleSnackBar
        isShow={like.isNoLoginError}
        onClose={() => like.setIsNoLoginError(false)}
        message="ログインしてください"
        type="warning"
      />
      <SimpleSnackBar isShow={isCopied} onClose={() => {}} message="クリップボードにコピーしました" type="success" />
    </Container>
  );
};

export default PostList;

const Hr = styled.hr`
  border-width: 1px;
  border-color: #a5a5a5;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 50px auto 100px;
  max-width: 800px;
`;

const PageButtonContainer = styled.div`
  margin: 2px auto;
  display: flex;
  width: 90%;
  justify-content: space-between;
`;

const PageButton = styled(Button)`
  text-transform: unset;
  background-color: #e85c9c;
  border-radius: 0;
  color: black;
  box-shadow: unset;
  width: 100px;
  :hover {
    background-color: #e85c9c;
    opacity: 0.7;
    color: black;
    box-shadow: unset;
  }
`;

const CardActionContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const CustomCardAction = styled(CardActions as React.SFC)`
  display: flex;
  justify-content: space-around;
  width: 400px;
`;

const CustomIconButton = styled(IconButton)`
  padding: 0;
`;

const NoPost = styled.div`
  text-align: center;
  margin: 40px;
`;

const CustomCardContent = styled(CardContent as React.SFC)`
  padding-bottom: 0;
`;

const LikeContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const LikeCount = styled.p`
  color: #a5a5a5;
  margin-left: 10px;
  font-size: 14px;
`;

const TypeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TypeName = styled.p`
  margin: 0;
`;

const IconWrapper = styled.div`
  :hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

const InfoWrapper = styled.div`
  margin: 8px 0;
`;
