import { createRoot } from "react-dom/client";
import { KMbPillarsSection } from "./components/KMbPillarsSection";
import { CaseStudiesSection } from "./components/CaseStudiesSection";
import { FinalConversionSection } from "./components/FinalConversionSection";
import { pillarData } from "./data/pillars";
import { caseStudiesData } from "./data/case-studies";

const pillarsMount = document.getElementById("kmb-pillars-root");
if (pillarsMount) {
  createRoot(pillarsMount).render(<KMbPillarsSection pillars={pillarData} />);
}

const casesMount = document.getElementById("case-studies-root");
if (casesMount) {
  createRoot(casesMount).render(<CaseStudiesSection carousels={caseStudiesData} />);
}

const conversionMount = document.getElementById("conversion-root");
if (conversionMount) {
  createRoot(conversionMount).render(<FinalConversionSection />);
}
