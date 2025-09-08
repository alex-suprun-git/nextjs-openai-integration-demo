import * as cron from 'node-cron';
import { generateMultipleContentEntries, ContentGenerationConfig } from './contentGenerator';

export interface ScheduledJob {
  id: string;
  name: string;
  cronExpression: string;
  configs: ContentGenerationConfig[];
  enabled: boolean;
  nextRun?: Date;
}

export interface JobExecutionResult {
  jobId: string;
  success: boolean;
  results: any[];
  error?: string;
  executedAt: Date;
}

class ContentScheduler {
  private jobs: Map<string, cron.ScheduledTask> = new Map();
  private jobConfigs: Map<string, ScheduledJob> = new Map();
  private executionHistory: JobExecutionResult[] = [];

  // Add a new scheduled job
  addJob(job: ScheduledJob): boolean {
    try {
      if (this.jobs.has(job.id)) {
        console.log(`Job ${job.id} already exists`);
        return false;
      }

      const task = cron.schedule(
        job.cronExpression,
        async () => {
          await this.executeJob(job.id);
        },
        {
          timezone: 'UTC',
        },
      );

      this.jobs.set(job.id, task);
      this.jobConfigs.set(job.id, job);
      this.updateNextRunTime(job.id);

      console.log(`Job ${job.id} scheduled successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to schedule job ${job.id}:`, error);
      return false;
    }
  }

  // Remove a scheduled job
  removeJob(jobId: string): boolean {
    try {
      const task = this.jobs.get(jobId);
      if (task) {
        task.stop();
        this.jobs.delete(jobId);
        this.jobConfigs.delete(jobId);
        console.log(`Job ${jobId} removed successfully`);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to remove job ${jobId}:`, error);
      return false;
    }
  }

  // Toggle job enabled/disabled
  toggleJob(jobId: string, enabled: boolean): boolean {
    try {
      const job = this.jobConfigs.get(jobId);
      if (!job) {
        return false;
      }

      job.enabled = enabled;
      const task = this.jobs.get(jobId);

      if (task) {
        if (enabled) {
          task.start();
        } else {
          task.stop();
        }
      }

      console.log(`Job ${jobId} ${enabled ? 'enabled' : 'disabled'}`);
      return true;
    } catch (error) {
      console.error(`Failed to toggle job ${jobId}:`, error);
      return false;
    }
  }

  // Execute a job immediately
  async executeJobNow(jobId: string): Promise<JobExecutionResult | null> {
    try {
      const job = this.jobConfigs.get(jobId);
      if (!job) {
        return null;
      }

      return await this.executeJob(jobId);
    } catch (error) {
      console.error(`Failed to execute job ${jobId}:`, error);
      return null;
    }
  }

  // Get all scheduled jobs
  getJobs(): ScheduledJob[] {
    return Array.from(this.jobConfigs.values());
  }

  // Get job execution history
  getExecutionHistory(): JobExecutionResult[] {
    return this.executionHistory;
  }

  // Stop all jobs
  stopAll(): void {
    this.jobs.forEach((task, jobId) => {
      task.stop();
      console.log(`Stopped job: ${jobId}`);
    });
  }

  // Start all jobs
  startAll(): void {
    this.jobs.forEach((task, jobId) => {
      const job = this.jobConfigs.get(jobId);
      if (job && job.enabled) {
        task.start();
        console.log(`Started job: ${jobId}`);
      }
    });
  }

  // Private method to execute a job
  private async executeJob(jobId: string): Promise<JobExecutionResult> {
    const job = this.jobConfigs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    const result: JobExecutionResult = {
      jobId,
      success: false,
      results: [],
      executedAt: new Date(),
    };

    try {
      console.log(`Executing job: ${jobId}`);

      const results = await generateMultipleContentEntries(job.configs);
      result.results = results;
      result.success = results.every((r) => r.success);

      if (result.success) {
        console.log(`Job ${jobId} executed successfully`);
      } else {
        console.log(`Job ${jobId} completed with errors`);
      }
    } catch (error) {
      console.error(`Error executing job ${jobId}:`, error);
      result.error = error instanceof Error ? error.message : 'Unknown error occurred';
    }

    this.executionHistory.push(result);

    // Keep only last 100 executions
    if (this.executionHistory.length > 100) {
      this.executionHistory = this.executionHistory.slice(-100);
    }

    return result;
  }

  // Private method to update next run time
  private updateNextRunTime(jobId: string): void {
    const job = this.jobConfigs.get(jobId);
    if (!job) return;

    try {
      // For now, we'll skip calculating next run time as it's not critical
      // The cron library will handle the scheduling
      job.nextRun = new Date(Date.now() + 60000); // Default to 1 minute from now
    } catch (error) {
      console.error(`Failed to calculate next run time for job ${jobId}:`, error);
    }
  }
}

// Create a singleton instance
export const contentScheduler = new ContentScheduler();

// Helper function to create a scheduled job
export function createScheduledJob(
  id: string,
  name: string,
  cronExpression: string,
  configs: ContentGenerationConfig[],
  enabled: boolean = true,
): ScheduledJob {
  return {
    id,
    name,
    cronExpression,
    configs,
    enabled,
  };
}

// Predefined schedule patterns
export const schedulePatterns = {
  // Every minute (for testing)
  everyMinute: '* * * * *',
  // Every 5 minutes
  every5Minutes: '*/5 * * * *',
  // Every hour
  hourly: '0 * * * *',
  // Every 6 hours
  every6Hours: '0 */6 * * *',
  // Daily at midnight
  daily: '0 0 * * *',
  // Daily at 9 AM
  dailyMorning: '0 9 * * *',
  // Weekly on Monday at 9 AM
  weekly: '0 9 * * 1',
  // Monthly on the 1st at 9 AM
  monthly: '0 9 1 * *',
  // Every 2 weeks on Monday at 9 AM
  biweekly: '0 9 * * 1/2',
};
