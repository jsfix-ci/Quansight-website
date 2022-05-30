import { FC } from 'react';

import { TBlogHeaderProps } from '../types';
import { BlogHeaderAuthor } from './BlogHeaderAuthor';
import { BlogHeaderLink } from './BlogHeaderLink';
import { BlogHeaderPostData } from './BlogHeaderPostData';

export const BlogHeader: FC<TBlogHeaderProps> = ({
  postTitle,
  publishedDate,
  firstName,
  lastName,
  githubNick,
  githubLink,
  authorImage,
}) => {
  return (
    <header className="mt-[5.8rem] mb-[7rem]">
      <BlogHeaderLink />
      <BlogHeaderPostData postTitle={postTitle} publishedDate={publishedDate} />
      <BlogHeaderAuthor
        firstName={firstName}
        lastName={lastName}
        githubNick={githubNick}
        githubLink={githubLink}
        authorImage={authorImage}
      />
    </header>
  );
};
