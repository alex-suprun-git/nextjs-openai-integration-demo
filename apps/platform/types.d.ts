type BaseEntry = {
  id: string;
  createdAt: Date;
  userId?: string;
  content?: string;
};

type UserEntry = BaseEntry & {
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
  title: string;
};

type AnalysisEntry = BaseEntry & AnalysisData;

type AnalysisSubEntry = BaseEntry & {
  analysis: AnalysisData & {
    id: string;
    createdAt: Date;
    entryId: string;
    userId: string;
  };
};

type AnalysisSubEntryResponse =
  | (BaseEntry & {
      analysis:
        | (AnalysisData & {
            id: string;
            createdAt: Date;
            entryId: string;
            userId: string;
          })
        | null;
    })
  | null;

type AnalysisEntryResponse = BaseEntry & AnalysisData;

type EditorEntry = {
  content: string;
  id?: string;
  analysis: AnalysisData;
};

type UserLocale = 'en' | 'de';
