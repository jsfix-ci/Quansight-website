import { FC } from 'react';

import { createMarkup } from '@quansight/shared/utils';

import { TBlogPostProps } from '../types';

export const BlogPost: FC<TBlogPostProps> = ({ postText }) => (
  <div
    className=" prose-img:mx-auto mb-[5rem] min-w-full text-[1.8rem] leading-[2.7rem] text-black prose"
    dangerouslySetInnerHTML={createMarkup(postText)}
  />
);