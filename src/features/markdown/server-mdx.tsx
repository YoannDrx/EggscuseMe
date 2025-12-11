import { cn } from "@/lib/utils";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { rehypePlugins, remarkPlugins } from "./markdown.config";
import {
  NeoH1,
  NeoH2,
  NeoH3,
  NeoH4,
  NeoH5,
  NeoH6,
  NeoBlockquote,
  NeoCallout,
  NeoCodeBlock,
  NeoInlineCode,
  NeoImage,
  NeoUl,
  NeoOl,
  NeoLi,
  NeoLink,
  NeoTip,
  NeoParagraph,
} from "./mdx-components";

type ServerMdxProps = {
  source: string;
  className?: string;
  /**
   * Use neo-brutalist styled components instead of default typography
   */
  useNeoStyle?: boolean;
};

// Neo-brutalist MDX components
const NeoMdxComponents = {
  h1: NeoH1,
  h2: NeoH2,
  h3: NeoH3,
  h4: NeoH4,
  h5: NeoH5,
  h6: NeoH6,
  p: NeoParagraph,
  a: NeoLink,
  blockquote: NeoBlockquote,
  ul: NeoUl,
  ol: NeoOl,
  li: NeoLi,
  pre: NeoCodeBlock,
  code: NeoInlineCode,
  img: NeoImage,
  // Custom components for MDX
  Callout: NeoCallout,
  Tip: NeoTip,
  Image: NeoImage,
};

// Default empty components (uses global typography styles)
const DefaultMdxComponents = {};

export const ServerMdx = (props: ServerMdxProps) => {
  const { useNeoStyle = false, className, ...rest } = props;

  return (
    <div className={cn(!useNeoStyle && "typography", className)}>
      <RenderMdx {...rest} useNeoStyle={useNeoStyle} />
    </div>
  );
};

const RenderMdx = (props: ServerMdxProps) => {
  const components = props.useNeoStyle
    ? NeoMdxComponents
    : DefaultMdxComponents;

  return (
    <MDXRemote
      source={props.source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: remarkPlugins,
          rehypePlugins: rehypePlugins,
          format: "mdx",
        },
      }}
    />
  );
};
