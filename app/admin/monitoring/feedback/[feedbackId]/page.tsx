import { Typography } from "@/components/nowts/typography";
import {
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo/neo-card";
import { InlineTooltip } from "@/components/ui/tooltip";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { getRequiredAdmin } from "@/lib/auth/auth-user";
import { getFeedbackById } from "@/query/feedback/get-feedback";
import { Angry, Frown, Meh, SmilePlus } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { UserDetailsCard } from "@app/admin/_components/user-details-card";

const ReviewIcons = [
  {
    value: 1,
    icon: Angry,
    tooltip: "Extremely Dissatisfied",
  },
  {
    value: 2,
    icon: Frown,
    tooltip: "Somewhat Dissatisfied",
  },
  {
    value: 3,
    icon: Meh,
    tooltip: "Neutral",
  },
  {
    value: 4,
    icon: SmilePlus,
    tooltip: "Satisfied",
  },
];

export default function Page(props: {
  params: Promise<{ feedbackId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <FeedbackDetailPage {...props} />
    </Suspense>
  );
}

async function FeedbackDetailPage(props: {
  params: Promise<{ feedbackId: string }>;
}) {
  const params = await props.params;
  await getRequiredAdmin();

  const feedback = await getFeedbackById(params.feedbackId);

  if (!feedback) {
    notFound();
  }

  const reviewIcon = ReviewIcons.find((icon) => icon.value === feedback.review);

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Feedback</LayoutTitle>
        <LayoutDescription>
          Submitted {new Date(feedback.createdAt).toLocaleDateString()}
        </LayoutDescription>
      </LayoutHeader>

      <LayoutContent className="space-y-6">
        {feedback.user ? (
          <UserDetailsCard user={feedback.user} />
        ) : (
          <NeoCard>
            <NeoCardHeader>
              <NeoCardTitle>Anonymous</NeoCardTitle>
              <NeoCardDescription>Email {feedback.email}</NeoCardDescription>
            </NeoCardHeader>
          </NeoCard>
        )}

        <NeoCard>
          <NeoCardHeader>
            <NeoCardTitle>Review</NeoCardTitle>
            <NeoCardDescription>
              {reviewIcon && (
                <div className="flex items-center gap-3">
                  <InlineTooltip title={reviewIcon.tooltip}>
                    <reviewIcon.icon size={28} className="text-primary" />
                  </InlineTooltip>
                  <Typography variant="muted">{reviewIcon.tooltip}</Typography>
                </div>
              )}
            </NeoCardDescription>
          </NeoCardHeader>
          <NeoCardContent>
            <Typography variant="p" className="whitespace-pre-wrap">
              {feedback.message}
            </Typography>
          </NeoCardContent>
        </NeoCard>
      </LayoutContent>
    </Layout>
  );
}
