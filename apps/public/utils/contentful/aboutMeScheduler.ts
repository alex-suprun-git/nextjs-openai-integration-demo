import { contentScheduler, createScheduledJob, schedulePatterns } from './contentScheduler';
import { updateSimpleAboutMeBothLanguages } from './simpleAboutMeUpdater';

export interface AboutMeSchedulerConfig {
  spaceId: string;
  environmentId: string;
  accessToken: string;
  entryId: string;
  cronExpression: string;
  updateStyle?: 'refactor' | 'rewrite' | 'enhance' | 'translate';
  additionalPrompt?: string;
  enabled?: boolean;
}

// Function to schedule About me updates
export function scheduleAboutMeUpdates(config: AboutMeSchedulerConfig): boolean {
  const {
    spaceId,
    environmentId,
    accessToken,
    entryId,
    cronExpression,
    updateStyle = 'refactor',
    additionalPrompt,
    enabled = true,
  } = config;

  const job = createScheduledJob(
    'about-me-auto-update',
    'About Me Auto Update',
    cronExpression,
    [
      {
        spaceId,
        environmentId,
        accessToken,
        contentTypeId: 'page',
        prompt: `Update the About me content with style: ${updateStyle}${additionalPrompt ? ` and additional requirements: ${additionalPrompt}` : ''}`,
        updateExisting: true,
        entryId,
      },
    ],
    enabled,
  );

  return contentScheduler.addJob(job);
}

// Function to execute About me update immediately
export async function executeAboutMeUpdate(
  config: Omit<AboutMeSchedulerConfig, 'cronExpression' | 'enabled'>,
): Promise<any> {
  const {
    spaceId,
    environmentId,
    accessToken,
    entryId,
    updateStyle = 'refactor',
    additionalPrompt,
  } = config;

  try {
    const result = await updateSimpleAboutMeBothLanguages({
      spaceId,
      environmentId,
      accessToken,
      entryId,
      updateStyle,
      additionalPrompt,
    });

    console.log('About Me update executed successfully:', {
      en: result.en.success,
      de: result.de.success,
      enNewContent: result.en.newContent?.substring(0, 100) + '...',
      deNewContent: result.de.newContent?.substring(0, 100) + '...',
    });

    return result;
  } catch (error) {
    console.error('Error executing About Me update:', error);
    throw error;
  }
}

// Predefined scheduling patterns for About me updates
export const aboutMeSchedulePatterns = {
  // Weekly updates
  weekly: schedulePatterns.weekly,
  // Monthly updates
  monthly: schedulePatterns.monthly,
  // Every 2 weeks
  biweekly: '0 9 * * 1/2',
  // Every 3 months
  quarterly: '0 9 1 */3 *',
  // Daily at 9 AM (for testing)
  daily: schedulePatterns.dailyMorning,
  // Every 6 hours (for testing)
  every6Hours: schedulePatterns.every6Hours,
};

// Function to setup default About me automation
export function setupDefaultAboutMeAutomation(
  spaceId: string,
  environmentId: string,
  accessToken: string,
  entryId: string,
): boolean {
  console.log('Setting up default About Me automation...');

  // Schedule weekly updates
  const weeklySuccess = scheduleAboutMeUpdates({
    spaceId,
    environmentId,
    accessToken,
    entryId,
    cronExpression: aboutMeSchedulePatterns.weekly,
    updateStyle: 'refactor',
    additionalPrompt: 'Keep it fresh and engaging while maintaining professionalism',
    enabled: true,
  });

  if (weeklySuccess) {
    console.log('✅ Weekly About Me updates scheduled successfully');
  } else {
    console.log('❌ Failed to schedule weekly About Me updates');
  }

  return weeklySuccess;
}

// Function to get all About me scheduled jobs
export function getAboutMeScheduledJobs() {
  const allJobs = contentScheduler.getJobs();
  return allJobs.filter((job) => job.id.includes('about-me'));
}

// Function to remove About me scheduled jobs
export function removeAboutMeScheduledJobs(): boolean {
  const aboutMeJobs = getAboutMeScheduledJobs();
  let success = true;

  aboutMeJobs.forEach((job) => {
    const removed = contentScheduler.removeJob(job.id);
    if (!removed) {
      success = false;
      console.log(`Failed to remove job: ${job.id}`);
    } else {
      console.log(`Removed job: ${job.id}`);
    }
  });

  return success;
}

// Function to toggle About me automation
export function toggleAboutMeAutomation(enabled: boolean): boolean {
  const aboutMeJobs = getAboutMeScheduledJobs();
  let success = true;

  aboutMeJobs.forEach((job) => {
    const toggled = contentScheduler.toggleJob(job.id, enabled);
    if (!toggled) {
      success = false;
      console.log(`Failed to toggle job: ${job.id}`);
    } else {
      console.log(`${enabled ? 'Enabled' : 'Disabled'} job: ${job.id}`);
    }
  });

  return success;
}
