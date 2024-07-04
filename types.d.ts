type BaseEntry = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  content: string;
};

type JournalEntry = BaseEntry & {
  entryId: string;
};

type AnalysisEntry =
  | (BaseEntry & {
      analysis: {
        mood: string;
        summary: string;
        color: string;
        sentimentScore: number;
        negative: boolean;
        subject: string;
      } | null;
    })
  | null;
