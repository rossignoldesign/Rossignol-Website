export interface PillarSection {
  heading: string;
  body: string;
}

export interface PillarData {
  id: string;
  title: string;
  subhead: string;
  tags: string[];
  actionText: string;
  sections: PillarSection[];
}

export type Pillar = PillarData;
