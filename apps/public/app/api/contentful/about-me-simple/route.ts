import { NextRequest, NextResponse } from 'next/server';
import {
  updateSimpleAboutMeContent,
  updateSimpleAboutMeBothLanguages,
} from '../../../../utils/contentful/simpleAboutMeUpdater';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'update':
        return await handleUpdateAboutMe(params);
      case 'update-both':
        return await handleUpdateBothLanguages(params);
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "update" or "update-both"' },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('About Me Simple API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleUpdateAboutMe(params: any) {
  const {
    spaceId,
    environmentId,
    accessToken,
    entryId,
    language = 'en',
    updateStyle = 'refactor',
    additionalPrompt,
  } = params;

  if (!spaceId || !environmentId || !accessToken || !entryId) {
    return NextResponse.json(
      { error: 'Missing required parameters: spaceId, environmentId, accessToken, entryId' },
      { status: 400 },
    );
  }

  if (!['en', 'de'].includes(language)) {
    return NextResponse.json({ error: 'Invalid language. Use "en" or "de"' }, { status: 400 });
  }

  try {
    const result = await updateSimpleAboutMeContent({
      spaceId,
      environmentId,
      accessToken,
      entryId,
      language,
      updateStyle,
      additionalPrompt,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `About Me content updated successfully for ${language}`,
        result,
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to update About Me content' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error updating About Me content:', error);
    return NextResponse.json({ error: 'Failed to update About Me content' }, { status: 500 });
  }
}

async function handleUpdateBothLanguages(params: any) {
  const {
    spaceId,
    environmentId,
    accessToken,
    entryId,
    updateStyle = 'refactor',
    additionalPrompt,
  } = params;

  if (!spaceId || !environmentId || !accessToken || !entryId) {
    return NextResponse.json(
      { error: 'Missing required parameters: spaceId, environmentId, accessToken, entryId' },
      { status: 400 },
    );
  }

  try {
    const result = await updateSimpleAboutMeBothLanguages({
      spaceId,
      environmentId,
      accessToken,
      entryId,
      updateStyle,
      additionalPrompt,
    });

    const allSuccessful = result.en.success && result.de.success;

    if (allSuccessful) {
      return NextResponse.json({
        success: true,
        message: 'About Me content updated successfully for both languages',
        result,
      });
    } else {
      return NextResponse.json(
        {
          error: 'Failed to update About Me content for some languages',
          result,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error updating About Me content in both languages:', error);
    return NextResponse.json({ error: 'Failed to update About Me content' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'About Me Simple Update API',
    description: 'Update About me content using AI',
    endpoints: {
      'POST /api/contentful/about-me-simple': {
        description: 'Update About Me content',
        actions: {
          update: {
            description: 'Update About Me content for a specific language',
            parameters: {
              action: 'update',
              spaceId: 'string (required)',
              environmentId: 'string (required)',
              accessToken: 'string (required)',
              entryId: 'string (required)',
              language: 'en | de (optional, default: en)',
              updateStyle: 'refactor | rewrite | enhance (optional, default: refactor)',
              additionalPrompt: 'string (optional)',
            },
          },
          'update-both': {
            description: 'Update About Me content for both languages',
            parameters: {
              action: 'update-both',
              spaceId: 'string (required)',
              environmentId: 'string (required)',
              accessToken: 'string (required)',
              entryId: 'string (required)',
              updateStyle: 'refactor | rewrite | enhance (optional, default: refactor)',
              additionalPrompt: 'string (optional)',
            },
          },
        },
      },
    },
  });
}
