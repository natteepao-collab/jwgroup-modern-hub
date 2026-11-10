import { z } from 'zod';

export const applicationSchema = z.object({
  full_name: z.string().trim().min(2, 'กรุณากรอกชื่อ-นามสกุล').max(100),
  email: z.string().trim().email('กรุณากรอก email ที่ถูกต้อง').max(255),
  phone: z.string().trim().min(9, 'กรุณากรอกเบอร์โทรศัพท์').max(20)
    .regex(/^\+?[0-9\s()-]+$/, 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง'),
  education: z.string().max(500).optional(),
  experience: z.string().max(2000).optional(),
  cover_letter: z.string().max(3000).optional(),
});

export function validResume(file: { type: string; size: number }) {
  const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  return allowed.includes(file.type) && file.size <= 5 * 1024 * 1024;
}

export function requiredContactFields(data: { name: string; email: string; message: string }) {
  return Boolean(data.name.trim() && data.email.trim() && data.message.trim());
}