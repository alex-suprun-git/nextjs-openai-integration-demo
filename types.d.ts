type BaseEntry = {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  userId?: string;
  content?: string;
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

type AnalysisEntryResponse =
  | (BaseEntry & {
      analysis: AnalysisData | null;
    })
  | null;
