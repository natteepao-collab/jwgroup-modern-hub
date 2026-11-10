import type { i18n } from 'i18next';

const copy = {
  th: { scope: 'อสังหาริมทรัพย์ โรงแรม โรงพยาบาลสัตว์ ผลิตภัณฑ์เพื่อสุขภาพ และรับเหมาก่อสร้าง', portfolio: 'ธุรกิจและผลงาน', portfolioDesc: 'รู้จักธุรกิจในเครือและผลงานของ JW Group', reviewsPrevious: 'รีวิวก่อนหน้า', reviewsNext: 'รีวิวถัดไป', cookieTitle: 'เราใช้คุกกี้', cookieDescription: 'เลือกการใช้คุกกี้ของคุณ', settings: 'ตั้งค่าความเป็นส่วนตัว', accept: 'ยอมรับทั้งหมด', reject: 'ปฏิเสธทั้งหมด', save: 'บันทึกการตั้งค่า', required: 'จำเป็น' },
  en: { scope: 'Real estate, hospitality, veterinary care, health products and construction', portfolio: 'Businesses and work', portfolioDesc: 'Explore the businesses and work of JW Group', reviewsPrevious: 'Previous review', reviewsNext: 'Next review', cookieTitle: 'Cookies', cookieDescription: 'Choose your cookie preferences', settings: 'Privacy settings', accept: 'Accept all', reject: 'Reject all', save: 'Save preferences', required: 'Required' },
  cn: { scope: '房地产、酒店、宠物医疗、健康产品和建筑', portfolio: '业务与项目', portfolioDesc: '了解 JW Group 的业务与项目', reviewsPrevious: '上一条评价', reviewsNext: '下一条评价', cookieTitle: 'Cookie', cookieDescription: '选择您的 Cookie 偏好', settings: '隐私设置', accept: '全部接受', reject: '全部拒绝', save: '保存设置', required: '必要' },
  jp: { scope: '不動産、ホテル、動物医療、健康製品、建設', portfolio: '事業と実績', portfolioDesc: 'JW Group の事業と実績', reviewsPrevious: '前のレビュー', reviewsNext: '次のレビュー', cookieTitle: 'Cookie', cookieDescription: 'Cookie の設定を選択', settings: 'プライバシー設定', accept: 'すべて許可', reject: 'すべて拒否', save: '設定を保存', required: '必須' },
  kr: { scope: '부동산, 호텔, 동물 의료, 건강 제품 및 건설', portfolio: '사업과 프로젝트', portfolioDesc: 'JW Group의 사업과 프로젝트', reviewsPrevious: '이전 리뷰', reviewsNext: '다음 리뷰', cookieTitle: '쿠키', cookieDescription: '쿠키 설정을 선택하세요', settings: '개인정보 설정', accept: '모두 허용', reject: '모두 거부', save: '설정 저장', required: '필수' },
  ru: { scope: 'Недвижимость, гостиницы, ветеринария, товары для здоровья и строительство', portfolio: 'Направления и проекты', portfolioDesc: 'Бизнес и проекты JW Group', reviewsPrevious: 'Предыдущий отзыв', reviewsNext: 'Следующий отзыв', cookieTitle: 'Файлы cookie', cookieDescription: 'Выберите настройки cookie', settings: 'Настройки конфиденциальности', accept: 'Принять все', reject: 'Отклонить все', save: 'Сохранить', required: 'Обязательные' },
};

export function registerPublicRefinement(instance: i18n) {
  for (const [language, values] of Object.entries(copy)) {
    instance.addResourceBundle(language, 'translation', { refinement: values }, true, true);
  }
}