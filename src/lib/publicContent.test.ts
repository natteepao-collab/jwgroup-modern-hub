import { describe, expect, test } from 'bun:test';
import { managedPhone, managedSocialLink, publicAchievementCount, publicDestination, publishedTestimonials } from './publicContent';

describe('approved public content safeguards', () => {
  test('zero managed reviews shows zero reviews rather than four examples', () => {
    expect(publishedTestimonials([])).toEqual([]);
    expect(publishedTestimonials([{ is_published: false }, { is_published: true }])).toEqual([{ is_published: true }]);
  });
  test('missing business website uses contact instead of a placeholder', () => {
    expect(publicDestination('#')).toEqual({ href: '/contact', external: false });
    expect(publicDestination('')).toEqual({ href: '/contact', external: false });
    expect(publicDestination('https://www.jwrealestate.co.th').href).toBe('https://www.jwrealestate.co.th/');
  });
  test('empty social accounts and generic platform homepages are not actionable', () => {
    expect(managedSocialLink('')).toBeNull();
    expect(managedSocialLink('https://facebook.com')).toBeNull();
    expect(managedSocialLink('https://www.facebook.com/JwRealestateCoLtd/')).toBe('https://www.facebook.com/JwRealestateCoLtd/');
  });
  test('phone comes from managed content without a loading-time sample number', () => {
    expect(managedPhone('')).toBeNull();
    expect(managedPhone('+66 2 XXX XXXX')).toBeNull();
    expect(managedPhone('02-5661111')).toEqual({ display: '02-5661111', href: 'tel:025661111' });
  });
  test('16 records do not become a 17-plus completed-project claim', () => {
    expect(publicAchievementCount(Array(16).fill({}))).toBeNull();
  });
  test('zero award records do not become an at-least-one award claim', () => {
    expect(publicAchievementCount([])).toBeNull();
  });
});