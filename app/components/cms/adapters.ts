type ImageLike = { url?: string; src?: string; alt?: string; asset?: { url?: string } }

const pickImageUrl = (img?: ImageLike) => img?.src || img?.url || img?.asset?.url || ''
const pickAlt = (img?: ImageLike) => img?.alt || ''

export function toHeroProps(block: any) {
  const imageUrl = pickImageUrl(block?.image)
  return {
    eyebrow: block?.eyebrow ?? '',
    title: block?.title ?? block?.headline ?? '',
    subtitle: block?.subtitle ?? block?.subhead ?? '',
    image: imageUrl ? { src: imageUrl, alt: pickAlt(block?.image) } : undefined,
    ctas: (block?.ctas || [{ label: block?.cta?.label, href: block?.cta?.href }]).filter(Boolean).map((b: any) => ({
      label: b?.label ?? 'Learn more',
      href: b?.href ?? '#',
      variant: b?.variant ?? 'primary',
    })),
  }
}

export function toProseProps(block: any) {
  return {
    content: block?.content || block?.body || [],
    centered: !!block?.centered,
    maxWidth: block?.maxWidth ?? 'prose',
  }
}

export function toFeatureGridProps(block: any) {
  return {
    heading: block?.heading ?? '',
    subheading: block?.subheading ?? '',
    items: (block?.items || []).map((i: any) => ({
      icon: i?.icon ?? null,
      title: i?.title ?? '',
      description: i?.description ?? '',
      href: i?.href ?? '',
    })),
  }
}

export function toImageBannerProps(block: any) {
  const imageUrl = pickImageUrl(block?.image)
  return {
    image: imageUrl ? { src: imageUrl, alt: pickAlt(block?.image) } : undefined,
    caption: block?.caption ?? '',
    overlayTitle: block?.title ?? '',
    overlaySubtitle: block?.subtitle ?? '',
  }
}

export function toCTAGroupProps(block: any) {
  return {
    heading: block?.heading ?? '',
    description: block?.description ?? '',
    ctas: (block?.ctas || []).map((b: any) => ({
      label: b?.label ?? 'Learn more',
      href: b?.href ?? '#',
      variant: b?.variant ?? 'primary',
    })),
    align: block?.align ?? 'center',
  }
}

export function toFAQProps(block: any) {
  return {
    heading: block?.heading ?? '',
    items: (block?.items || []).map((q: any) => ({
      question: q?.question ?? '',
      answer: q?.answer ?? '',
    })),
  }
}


