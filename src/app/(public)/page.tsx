import { StoryPage } from "@/components/public/StoryPage";
import { getServices } from "@/features/booking/actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const services = await getServices().catch(() => []);
  return <StoryPage services={services} />;
}
