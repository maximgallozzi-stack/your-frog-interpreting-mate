export interface TermMeaning {
  definition: string;
  translations: {
    it: string;
    en: string;
    fr: string;
  };
  context: string;
  synonyms: string[];
  note?: string; // For cases where no exact equivalent exists
}

export interface TermResult {
  term: string;
  meanings: TermMeaning[];
}

export interface VocabItem {
  term: string;
  translations: {
    it: string;
    en: string;
    fr: string;
  };
  usage: string;
}

export interface DomainResult {
  mainDomain: string;
  subDomains: string[];
  keyConcepts: string[];
  suggestedResources: string[];
}
