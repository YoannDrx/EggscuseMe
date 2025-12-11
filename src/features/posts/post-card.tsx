import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import Link from "next/link";
import type { Post } from "./post-manager";

type PostCardProps = {
  post: Post;
};

export const PostCard = (props: PostCardProps) => {
  return (
    <Link href={`/posts/${props.post.slug}`}>
      <NeoCard className="transition-all hover:shadow-xl">
        <NeoCardHeader className="h-fit">
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md">
            <img
              src={props.post.attributes.coverUrl}
              alt={props.post.attributes.title}
              className="size-full object-cover"
            />
          </AspectRatio>
        </NeoCardHeader>
        <NeoCardContent className="space-y-2">
          <NeoCardTitle>{props.post.attributes.title}</NeoCardTitle>
          <NeoCardDescription>
            {props.post.attributes.description}
          </NeoCardDescription>
        </NeoCardContent>
      </NeoCard>
    </Link>
  );
};
