import { test, expect } from 'bun:test';
import { applicationSchema, validResume, requiredContactFields } from './applicationValidation.ts';
const applicant = { full_name: 'ผู้ทดสอบ', email: 'qa@example.invalid', phone: '025661111' };
test('blank applicant name is not a real name', () => {
  expect(applicationSchema.safeParse({ ...applicant, full_name: '  ' }).success).toBe(false);
  expect(applicationSchema.safeParse(applicant).success).toBe(true);
});
test('telephone rejects letters without restricting country codes', () => {
  expect(applicationSchema.safeParse({ ...applicant, phone: 'abcdefghi' }).success).toBe(false);
  expect(applicationSchema.safeParse({ ...applicant, phone: '+66 2-566-1111' }).success).toBe(true);
});
test('existing five megabyte resume limit is retained', () => {
  expect(validResume({ type: 'application/pdf', size: 5 * 1024 * 1024 })).toBe(true);
  expect(validResume({ type: 'application/pdf', size: 5 * 1024 * 1024 + 1 })).toBe(false);
});
test('existing resume formats exclude plain text', () => {
  expect(validResume({ type: 'text/plain', size: 20 })).toBe(false);
  expect(validResume({ type: 'application/msword', size: 20 })).toBe(true);
  expect(validResume({ type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 20 })).toBe(true);
});
test('required contact message rejects whitespace', () => {
  expect(requiredContactFields({ name: '  ', email: 'qa@example.invalid', message: 'hello' })).toBe(false);
  expect(requiredContactFields({ name: 'ผู้ทดสอบ', email: 'qa@example.invalid', message: '  ' })).toBe(false);
  expect(requiredContactFields({ name: 'ผู้ทดสอบ', email: 'qa@example.invalid', message: 'hello' })).toBe(true);
});