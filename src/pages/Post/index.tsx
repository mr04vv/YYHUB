import * as React from 'react';
import PostList from 'components/PostList';
import Helmet from 'react-helmet';
import useMasterData from 'hooks/Post/useMasterData';
import useFetchPost from './enhancer';

const Post = () => {
  const postList = useFetchPost();
  const post = postList.posts[0];
  const master = useMasterData();

  return (
    <>
      {post && (
        <Helmet
          title="わいちゅーぶ | わいわいの動画共有SNS"
          meta={[
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: post.title },
            { name: 'twitter:description', content: post.detail },
            { name: 'twitter:image', content: post.tumbnailUrl },
            { property: 'og:title', content: post.title },
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: `https://yy-tube.com/post/${post.id}` },
            { property: 'og:image', content: post.tumbnailUrl },
            { property: 'og:description', content: post.detail },
          ]}
        />
      )}
      <PostList
        path="home"
        posts={postList.posts}
        isLoading={postList.isLoading}
        hasNext={false}
        hasPrev={false}
        page="0"
        next={() => {}}
        prev={() => {}}
        per="1"
        hasController={false}
        master={master}
        place="post"
      />
    </>
  );
};

export default Post;
