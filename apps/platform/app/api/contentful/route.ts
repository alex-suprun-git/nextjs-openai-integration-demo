import { NextRequest, NextResponse } from 'next/server';
import { contentScheduler, createScheduledJob } from 'public/utils/contentful/contentScheduler';
import { createContentGenerationConfigs } from 'public/utils/contentful/contentGenerator';

interface GenerateContentParams {
  spaceId: string;
  environmentId: string;
  accessToken: string;
  contentTypeId: string;
  prompt: string;
  updateExisting?: boolean;
  entryId?: string;
}

interface ScheduleJobParams {
  jobId: string;
  jobName: string;
  cronExpression: string;
  spaceId: string;
  environmentId: string;
  accessToken: string;
  contentTypes: string[];
}

interface ExecuteJobParams {
  jobId: string;
}

interface RemoveJobParams {
  jobId: string;
}

interface ToggleJobParams {
  jobId: string;
  enabled: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'generate':
        return await handleGenerateContent(params as GenerateContentParams);
      case 'schedule':
        return await handleScheduleJob(params as ScheduleJobParams);
      case 'execute':
        return await handleExecuteJob(params as ExecuteJobParams);
      case 'list':
        return await handleListJobs();
      case 'remove':
        return await handleRemoveJob(params as RemoveJobParams);
      case 'toggle':
        return await handleToggleJob(params as ToggleJobParams);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Contentful API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleGenerateContent(params: GenerateContentParams) {
  const {
    spaceId,
    environmentId,
    accessToken,
    contentTypeId,
    prompt,
    updateExisting = false,
    entryId,
  } = params;

  if (!spaceId || !environmentId || !accessToken || !contentTypeId || !prompt) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const { generateContentForContentful } = await import(
      'public/utils/contentful/contentGenerator'
    );

    const result = await generateContentForContentful({
      spaceId,
      environmentId,
      accessToken,
      contentTypeId,
      prompt,
      updateExisting,
      entryId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}

async function handleScheduleJob(params: ScheduleJobParams) {
  const { jobId, jobName, cronExpression, spaceId, environmentId, accessToken, contentTypes } =
    params;

  if (
    !jobId ||
    !jobName ||
    !cronExpression ||
    !spaceId ||
    !environmentId ||
    !accessToken ||
    !contentTypes
  ) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const configs = createContentGenerationConfigs(
      spaceId,
      environmentId,
      accessToken,
      contentTypes,
    );

    const job = createScheduledJob(jobId, jobName, cronExpression, configs);
    const success = contentScheduler.addJob(job);

    if (success) {
      return NextResponse.json({ success: true, jobId });
    } else {
      return NextResponse.json({ error: 'Failed to schedule job' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error scheduling job:', error);
    return NextResponse.json({ error: 'Failed to schedule job' }, { status: 500 });
  }
}

async function handleExecuteJob(params: ExecuteJobParams) {
  const { jobId } = params;

  if (!jobId) {
    return NextResponse.json({ error: 'Missing jobId parameter' }, { status: 400 });
  }

  try {
    const results = await contentScheduler.executeJobNow(jobId);
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error executing job:', error);
    return NextResponse.json({ error: 'Failed to execute job' }, { status: 500 });
  }
}

async function handleListJobs() {
  try {
    const jobs = contentScheduler.getJobs();
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error listing jobs:', error);
    return NextResponse.json({ error: 'Failed to list jobs' }, { status: 500 });
  }
}

async function handleRemoveJob(params: RemoveJobParams) {
  const { jobId } = params;

  if (!jobId) {
    return NextResponse.json({ error: 'Missing jobId parameter' }, { status: 400 });
  }

  try {
    const success = contentScheduler.removeJob(jobId);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error removing job:', error);
    return NextResponse.json({ error: 'Failed to remove job' }, { status: 500 });
  }
}

async function handleToggleJob(params: ToggleJobParams) {
  const { jobId, enabled } = params;

  if (!jobId || typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'Missing jobId or enabled parameter' }, { status: 400 });
  }

  try {
    const success = contentScheduler.toggleJob(jobId, enabled);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error toggling job:', error);
    return NextResponse.json({ error: 'Failed to toggle job' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const jobs = contentScheduler.getJobs();
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error getting jobs:', error);
    return NextResponse.json({ error: 'Failed to get jobs' }, { status: 500 });
  }
}
