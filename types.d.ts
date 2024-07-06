type BaseEntry = {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  userId?: string;
  content?: string;
};

type UserEntry = BaseEntry & {
  clerkId: string;
  email: string;
};

type JournalEntry = BaseEntry & {
  entryId: string;
};

type AnalysisData = {
  mood: string;
  summary: string;
  color: string;
  sentimentScore: number;
  negative: boolean;
  subject: string;
};

type AnalysisEntry = BaseEntry &
  AnalysisData & {
    updatedAt: Date;
  };

type AnalysisSubEntry = BaseEntry & {
  analysis: AnalysisData;
};

type AnalysisSubEntryResponse =
  | (BaseEntry & {
      analysis: AnalysisData | null;
    })
  | null;

type AnalysisEntryResponse = BaseEntry & AnalysisData;
