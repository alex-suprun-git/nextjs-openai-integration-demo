import { NextRequest, NextResponse } from 'next/server';
import {
  scheduleAboutMeUpdates,
  executeAboutMeUpdate,
  setupDefaultAboutMeAutomation,
  getAboutMeScheduledJobs,
  removeAboutMeScheduledJobs,
  toggleAboutMeAutomation,
  aboutMeSchedulePatterns,
} from '../../../../utils/contentful/aboutMeScheduler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'schedule':
        return await handleSchedule(params);
      case 'execute':
        return await handleExecute(params);
      case 'setup-default':
        return await handleSetupDefault(params);
      case 'remove':
        return await handleRemove();
      case 'toggle':
        return await handleToggle(params);
      default:
        return NextResponse.json(
          {
            error:
              'Invalid action. Use "schedule", "execute", "setup-default", "remove", or "toggle"',
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('About Me Automation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleSchedule(params: any) {
  const {
    spaceId,
    environmentId,
    accessToken,
    entryId,
    cronExpression,
    updateStyle = 'refactor',
    additionalPrompt,
    enabled = true,
  } = params;

  if (!spaceId || !environmentId || !accessToken || !entryId || !cronExpression) {
    return NextResponse.json(
      {
        error:
          'Missing required parameters: spaceId, environmentId, accessToken, entryId, cronExpression',
      },
      { status: 400 },
    );
  }

  try {
    const success = scheduleAboutMeUpdates({
      spaceId,
      environmentId,
      accessToken,
      entryId,
      cronExpression,
      updateStyle,
      additionalPrompt,
      enabled,
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'About Me automation scheduled successfully',
        cronExpression,
        updateStyle,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to schedule About Me automation' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error scheduling About Me automation:', error);
    return NextResponse.json({ error: 'Failed to schedule About Me automation' }, { status: 500 });
  }
}

async function handleExecute(params: any) {
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
    const result = await executeAboutMeUpdate({
      spaceId,
      environmentId,
      accessToken,
      entryId,
      updateStyle,
      additionalPrompt,
    });

    return NextResponse.json({
      success: true,
      message: 'About Me update executed successfully',
      result,
    });
  } catch (error) {
    console.error('Error executing About Me update:', error);
    return NextResponse.json({ error: 'Failed to execute About Me update' }, { status: 500 });
  }
}

async function handleSetupDefault(params: any) {
  const { spaceId, environmentId, accessToken, entryId } = params;

  if (!spaceId || !environmentId || !accessToken || !entryId) {
    return NextResponse.json(
      { error: 'Missing required parameters: spaceId, environmentId, accessToken, entryId' },
      { status: 400 },
    );
  }

  try {
    const success = setupDefaultAboutMeAutomation(spaceId, environmentId, accessToken, entryId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Default About Me automation setup successfully',
        schedule: 'Weekly updates on Monday at 9 AM',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to setup default About Me automation' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error setting up default About Me automation:', error);
    return NextResponse.json(
      { error: 'Failed to setup default About Me automation' },
      { status: 500 },
    );
  }
}

async function handleRemove() {
  try {
    const success = removeAboutMeScheduledJobs();

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'All About Me scheduled jobs removed successfully',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to remove some About Me scheduled jobs' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error removing About Me scheduled jobs:', error);
    return NextResponse.json(
      { error: 'Failed to remove About Me scheduled jobs' },
      { status: 500 },
    );
  }
}

async function handleToggle(params: any) {
  const { enabled } = params;

  if (typeof enabled !== 'boolean') {
    return NextResponse.json(
      { error: 'Missing or invalid parameter: enabled (boolean)' },
      { status: 400 },
    );
  }

  try {
    const success = toggleAboutMeAutomation(enabled);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `About Me automation ${enabled ? 'enabled' : 'disabled'} successfully`,
      });
    } else {
      return NextResponse.json(
        { error: `Failed to ${enabled ? 'enable' : 'disable'} About Me automation` },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error toggling About Me automation:', error);
    return NextResponse.json({ error: 'Failed to toggle About Me automation' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const jobs = getAboutMeScheduledJobs();

    return NextResponse.json({
      message: 'About Me Automation API',
      description: 'Manage automated updates for About me content',
      currentJobs: jobs,
      availableSchedulePatterns: aboutMeSchedulePatterns,
      endpoints: {
        'POST /api/contentful/about-me-automation': {
          description: 'Manage About Me automation',
          actions: {
            schedule: {
              description: 'Schedule automated About Me updates',
              parameters: {
                action: 'schedule',
                spaceId: 'string (required)',
                environmentId: 'string (required)',
                accessToken: 'string (required)',
                entryId: 'string (required)',
                cronExpression: 'string (required)',
                updateStyle: 'refactor | rewrite | enhance (optional)',
                additionalPrompt: 'string (optional)',
                enabled: 'boolean (optional)',
              },
            },
            execute: {
              description: 'Execute About Me update immediately',
              parameters: {
                action: 'execute',
                spaceId: 'string (required)',
                environmentId: 'string (required)',
                accessToken: 'string (required)',
                entryId: 'string (required)',
                updateStyle: 'refactor | rewrite | enhance (optional)',
                additionalPrompt: 'string (optional)',
              },
            },
            'setup-default': {
              description: 'Setup default weekly About Me automation',
              parameters: {
                action: 'setup-default',
                spaceId: 'string (required)',
                environmentId: 'string (required)',
                accessToken: 'string (required)',
                entryId: 'string (required)',
              },
            },
            remove: {
              description: 'Remove all About Me scheduled jobs',
              parameters: {
                action: 'remove',
              },
            },
            toggle: {
              description: 'Enable/disable About Me automation',
              parameters: {
                action: 'toggle',
                enabled: 'boolean (required)',
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Error getting About Me automation info:', error);
    return NextResponse.json({ error: 'Failed to get About Me automation info' }, { status: 500 });
  }
}
