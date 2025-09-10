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

let builder: any = null;
if (!shouldSkipSanity()) {
  try {
    builder = createImageUrlBuilder(sanityClient);
  } catch (error) {
    console.warn('Failed to create Sanity image builder:', error);
    builder = null;
  }
}

export const urlFor = (src: any) => {
  if (shouldSkipSanity()) {
    // Create a mock ImageUrlBuilder with all the methods needed
    const mockBuilder = {
      url: () => '/placeholder-image.jpg',
      auto: () => mockBuilder,
      width: () => mockBuilder,
      height: () => mockBuilder,
      fit: () => mockBuilder,
      crop: () => mockBuilder,
      quality: () => mockBuilder,
      format: () => mockBuilder,
      dpr: () => mockBuilder,
      blur: () => mockBuilder,
      sharpen: () => mockBuilder,
      rect: () => mockBuilder,
      focalPoint: () => mockBuilder,
      flipHorizontal: () => mockBuilder,
      flipVertical: () => mockBuilder,
      invert: () => mockBuilder,
      orientation: () => mockBuilder,
      pad: () => mockBuilder,
      bg: () => mockBuilder,
      saturation: () => mockBuilder,
      hue: () => mockBuilder,
      lightness: () => mockBuilder
    };
    return mockBuilder;
  }
  return builder?.image(src).auto("format");
};
