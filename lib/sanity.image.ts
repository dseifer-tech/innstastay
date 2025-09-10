import createImageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./sanity.client";

// Check if we should skip Sanity (CI mode or missing envs)
const shouldSkipSanity = () => {
  return (
    process.env.SKIP_SANITY === '1' ||
    !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.startsWith('dummy')
  );
};

const builder = shouldSkipSanity() ? null : createImageUrlBuilder(sanityClient);

export const urlFor = (src: any) => {
  if (shouldSkipSanity()) {
    return { url: () => '/placeholder-image.jpg', auto: () => ({ url: () => '/placeholder-image.jpg' }) };
  }
  return builder!.image(src).auto("format");
};
