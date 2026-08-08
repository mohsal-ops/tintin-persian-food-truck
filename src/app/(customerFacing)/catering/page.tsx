import CateringPageClient from "./_components/CateringPageClient";
import { buildMetadata } from "@/lib/seo";
import { getLogoUrl } from "@/lib/siteSettings";

export const metadata = buildMetadata("catering");

export default async function Page() {
  const logoUrl = await getLogoUrl();
  return <CateringPageClient logoUrl={logoUrl} />;
}
