import { StoryPage } from "@/components/public/StoryPage";
import { getServices } from "@/features/booking/actions";
import { getLivePromotion } from "@/features/content/public";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [promotion, services] = await Promise.all([
    getLivePromotion().catch(() => null),
    getServices().catch(() => []),
  ]);
  return <StoryPage promotion={promotion} services={services} />;
}
