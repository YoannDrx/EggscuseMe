import { redirect } from "next/navigation";

type InvitePageProps = {
  params: Promise<{ code: string }>;
};

/**
 * Legacy route - redirects to unified /join/[code] route
 * Kept for backwards compatibility with old shared links
 */
export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params;

  // Redirect to the unified join route
  redirect(`/join/${code}`);
}
