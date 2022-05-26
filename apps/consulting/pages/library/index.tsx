import React, { FC, useState, useEffect } from 'react';

import { GetStaticProps } from 'next';

import { ISlugParams } from '@quansight/shared/types';
import {
  Layout,
  SEO,
  DomainVariant,
  Footer,
} from '@quansight/shared/ui-components';
import { isPageType } from '@quansight/shared/utils';

import { getDataSourceEntries } from '../../api/utils/getDataSourceEntries';
import { getFooter } from '../../api/utils/getFooter';
import { getLibraryArticleItems } from '../../api/utils/getLibraryArticleItems';
import { getLibraryLinkItems } from '../../api/utils/getLibraryLinkItems';
import { getPage } from '../../api/utils/getPage';
import { BlokProvider } from '../../components/BlokProvider/BlokProvider';
import { Carousel } from '../../components/Carousel/Carousel';
import { Filters } from '../../components/Filters/Filters';
import { Newsletter } from '../../components/Newsletter/Newsletter';
import { Page } from '../../components/Page/Page';
import { Tiles } from '../../components/Tiles/Tiles';
import { TLibraryProps } from '../../types/storyblok/bloks/libraryProps';
import { TRawBlok } from '../../types/storyblok/bloks/rawBlok';
import { getLibraryTiles } from '../../utils/getLibraryTiles/getLibraryTiles';

export const Library: FC<TLibraryProps> = ({
  data,
  footer,
  tiles,
  preview,
  postTypes,
  postCategories,
}) => {
  const [postType, setPostType] = useState<string | undefined>();
  const [postCategory, setPostCategory] = useState<string | undefined>();

  useEffect(() => {
    console.log('CHANGE');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postCategory, postType]);

  return (
    <Layout footer={<Footer {...footer.content} />}>
      <SEO
        title={data.content.title}
        description={data.content.description}
        variant={DomainVariant.Quansight}
      />

      {isPageType(data?.content?.component) && (
        <Page data={data} preview={preview}>
          {(blok: TRawBlok) => <BlokProvider blok={blok} />}
        </Page>
      )}
      <div className="px-8 mx-auto lg:px-40 xl:px-[30rem] max-w-layout">
        <Carousel tiles={tiles} />
        <Filters
          postTypes={postTypes}
          postCategories={postCategories}
          postType={postType}
          setPostType={setPostType}
          postCategory={postCategory}
          setPostCategory={setPostCategory}
        />
        <Tiles tiles={tiles} />
        <Newsletter />
        {/* TODO: pagination */}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<
  TLibraryProps,
  ISlugParams
> = async () => {
  const data = await getPage({ slug: 'library' });
  const footer = await getFooter();
  const libraryLinks = await getLibraryLinkItems();
  const articleItems = await getLibraryArticleItems();
  const postTypes = await getDataSourceEntries({ slug: 'post-type' });
  const postCategories = await getDataSourceEntries({ slug: 'post-category' });

  return {
    props: {
      data,
      footer,
      postTypes,
      postCategories,
      tiles: getLibraryTiles({
        articleItems,
        libraryLinks,
      }),

      preview: false,
    },
  };
};

export default Library;
