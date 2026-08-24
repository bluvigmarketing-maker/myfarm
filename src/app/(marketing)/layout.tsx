import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AppTour } from "@/components/app-tour/app-tour";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
      <AppTour />
    </div>
  );
}
