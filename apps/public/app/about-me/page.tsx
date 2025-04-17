import { Metadata } from 'next';
import { ReactNode } from 'react';
import Image from 'next/image';
import { getLocale } from 'next-intl/server';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Block, BLOCKS, Inline, MARKS } from '@contentful/rich-text-types';
import { Heading } from '@/ui-lib';
import { pageQuery } from '@/content/queries';
import { PageSchema } from '@/content/types';
import { getContentFromCMS } from '@/content/utils';

export const metadata: Metadata = {
  title: 'About me | OpenAI Daily Dashboard',
  description: 'A Brief info about Alex Suprun - the developer of this project.',
};

const AboutMePage = async () => {
  const locale = await getLocale();
  const componentData = (await getContentFromCMS(pageQuery, locale, {
    slug: 'about-me',
  })) as PageSchema;

  if (!componentData) {
    console.error('About-Me page data could not be fetched');
    return null;
  }

  const component = componentData.pageCollection.items[0];

  const headline = component?.title;
  const description = component?.content.json;
  const hasImage = component?.hasImage;
  const image = component?.image;

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
    <div className="container mx-auto flex min-h-svh justify-between gap-28 p-10">
      <div className="w-full md:w-3/5">
        <Heading>{headline}</Heading>
        {image && (
          <Image
            className="mb-10 block md:hidden"
            width={image.width / 1.5}
            height={image.height / 1.5}
            src={image.url}
            alt={image.description}
          />
        )}
        {description && documentToReactComponents(description, renderOptions)}
      </div>
      {hasImage && (
        <div className="hidden md:block md:w-2/5">
          {image && (
            <Image
              width={image.width}
              height={image.height}
              src={image.url}
              alt={image.description}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AboutMePage;
