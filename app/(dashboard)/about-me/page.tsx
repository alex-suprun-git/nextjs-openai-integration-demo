import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Block, BLOCKS, Inline, MARKS } from '@contentful/rich-text-types';
import { Heading } from '@/ui-lib';
import { pageQuery } from '@/content/queries';
import { pageSchema } from '@/content/types';
import { getContentFromCMS } from '@/content/utils';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'About me | OpenAI Daily Journal',
  description: 'A Brief info about Alex Suprun - the developer of this project.',
};

const AboutMePage = async () => {
  const locale = await getLocale();
  const componentData = (await getContentFromCMS(pageQuery, locale, {
    slug: 'about-me',
  })) as pageSchema;

  if (!componentData) {
    console.error('About-Me page data could not be fetched');
    return null;
  }

  const headline = componentData.pageCollection.items[0].title;
  const description = componentData.pageCollection.items[0].content.json;

  const renderOptions = {
    renderMark: {
      [MARKS.BOLD]: (text: ReactNode) => <strong className="">{text}</strong>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node: Block | Inline, children: React.ReactNode) => (
        <p className="mb-4 leading-loose text-stone-300">{children}</p>
      ),
    },
  };

  return (
    <div className="min-h-svh max-w-4xl p-10">
      <Heading>{headline}</Heading>
      {documentToReactComponents(description, renderOptions)}
    </div>
  );
};

export default AboutMePage;
