import { Typography } from "@/components/nowts/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NeoCard, NeoCardContent, NeoCardHeader } from "@/components/neo";
import { ClientMarkdown } from "@/features/markdown/client-markdown";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

export type ReviewItemProps = {
  /**
   * The review of the user. Use **bold** text to highlight.
   */
  review: string;
  /**
   * The name of the user.
   */
  name: string;
  /**
   * The role of the user. (his job)
   */
  role: string;
  /**
   * The image of the user.
   */
  image: string;
} & ComponentPropsWithoutRef<"div">;

export const ReviewItem = ({ className, ...props }: ReviewItemProps) => {
  return (
    <NeoCard className={cn("h-fit overflow-hidden pb-0", className)} {...props}>
      <NeoCardHeader>
        <ClientMarkdown className="citation">{props.review}</ClientMarkdown>
      </NeoCardHeader>
      <NeoCardContent className="bg-background flex items-center gap-2 rounded-lg py-6">
        <div>
          <Avatar>
            <AvatarFallback>{props.name[0]}</AvatarFallback>
            <AvatarImage src={props.image} alt="user image" />
          </Avatar>
        </div>
        <div>
          <Typography variant="small">{props.name}</Typography>
          <Typography variant="muted">{props.role}</Typography>
        </div>
      </NeoCardContent>
    </NeoCard>
  );
};
