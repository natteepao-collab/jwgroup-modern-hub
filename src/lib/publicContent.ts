/** Presentation safeguards only; never mutate managed content or its identifiers. */
export function publicDestination(value: string | null | undefined) {
  const raw = value?.trim() || '';
  try {
    const url = new URL(raw);
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      return { href: url.href, external: true };
    }
  } catch {
    // Missing, placeholder and invalid destinations lead to existing contact flow.
  }
  return { href: '/contact', external: false };
}

export function managedSocialLink(value: string | null | undefined): string | null {
  const destination = publicDestination(value);
  if (!destination.external) return null;
  const url = new URL(destination.href);
  return url.pathname === '/' ? null : destination.href;
}

export function managedPhone(value: string | null | undefined) {
  const display = value?.trim() || '';
  if (!display || /[a-z]/i.test(display)) return null;
  const digits = display.replace(/[^0-9+]/g, '');
  return digits.replace(/\D/g, '').length >= 7 ? { display, href: `tel:${digits}` } : null;
}

export function publishedTestimonials<T extends { is_published?: boolean }>(items: T[] | null | undefined): T[] {
  return (items || []).filter(item => item.is_published === true);
}

// Counts cannot establish completed projects, experience, or verified awards.
export function publicAchievementCount(_items: unknown[]): null {
  return null;
}