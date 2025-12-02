export const SiteConfig = {
  title: "EggscuseMe",
  description:
    "Stop throwing away your eggs. Track freshness, get cooking recommendations, and reduce food waste.",
  prodUrl: "https://eggscuseme.app",
  appId: "eggscuseme",
  domain: "eggscuseme.app",
  appIcon: "/images/icon.png",
  company: {
    name: "EggscuseMe",
    address: "Paris, France",
  },
  brand: {
    primary: "#D4A853", // Golden egg yolk color
  },
  team: {
    image: "",
    website: "",
    twitter: "",
    name: "EggscuseMe Team",
  },
  features: {
    /**
     * If enable, you need to specify the logic of upload here : src/features/images/uploadImageAction.tsx
     * You can use Vercel Blob Storage : https://vercel.com/docs/storage/vercel-blob
     * Or you can use Cloudflare R2 : https://mlv.sh/cloudflare-r2-tutorial
     * Or you can use AWS S3 : https://mlv.sh/aws-s3-tutorial
     */
    enableImageUpload: false as boolean,
    /**
     * If enable, the user will be redirected to `/orgs` when he visits the landing page at `/`
     * The logic is located in middleware.ts
     */
    enableLandingRedirection: true as boolean,
  },

  // EggscuseMe-specific config
  freshness: {
    extraFreshDays: 9, // Day 0-9: Extra-fresh
    freshDays: 21, // Day 10-21: Fresh
    cookThoroughlyDays: 28, // Day 22-28: Cook thoroughly
    // Day 29+: Expired
  },

  freePlan: {
    maxEggBoxes: 2, // Free users can track up to 2 egg boxes
  },
};
