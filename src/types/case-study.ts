export interface CaseStudyPoint {
  heading: string;
  body: string;
}

export interface CaseStudyVideo {
  id: string;
  title: string;
  tagline: string;
  clientType?: string;
  summary?: string;
  points?: CaseStudyPoint[];
  webIntegrationUrl?: string;
  fullEpisodeUrl?: string;
  vimeoUrl: string;
  thumbnailUrl?: string;
}

export interface CaseStudyCarousel {
  id: string;
  title: string;
  tagline: string;
  videos: CaseStudyVideo[];
}
