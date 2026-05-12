export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionResponse = {
  contributions?: Array<{
    date: string;
    count?: number;
    level?: number;
  }>;
};

export type GardenOptions = {
  username: string;
  year: number;
  title?: string;
  showLegend: boolean;
};
