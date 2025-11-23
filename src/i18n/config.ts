import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  th: {
    translation: {
      nav: {
        about: 'เกี่ยวกับเรา',
        business: 'ธุรกิจของเรา',
        news: 'ข่าวสาร',
        careers: 'ร่วมงานกับเรา',
        contact: 'ติดต่อเรา',
        privacy: 'นโยบายความเป็นส่วนตัว',
      },
      about: {
        history: 'ประวัติ JW Group',
        vision: 'วิสัยทัศน์และพันธกิจ',
        structure: 'โครงสร้างองค์กร',
        team: 'ทีมผู้บริหาร',
        awards: 'รางวัลและความสำเร็จ',
      },
      hero: {
        headline: 'JW Group',
        subheadline: 'กลุ่มธุรกิจครบวงจรที่มุ่งมั่นสร้างสรรค์นวัตกรรมและคุณภาพชีวิตที่ดีกว่า',
        ctaLearn: 'รู้จัก JW Group',
        ctaBusiness: 'ดูธุรกิจของเรา',
      },
      aboutSection: {
        title: 'เกี่ยวกับ JW Group',
        description: 'JW Group เป็นกลุ่มธุรกิจชั้นนำที่มีความหลากหลายในหลายอุตสาหกรรม ตั้งแต่อสังหาริมทรัพย์ โรงแรม สัตวแพทย์ ไปจนถึงผลิตภัณฑ์เพื่อสุขภาพ เรามุ่งมั่นในการนำเสนอบริการและผลิตภัณฑ์คุณภาพสูงสุดเพื่อตอบสนองความต้องการของลูกค้า',
        yearsLabel: 'ปีของความเชี่ยวชาญ',
        businessLabel: 'ธุรกิจหลัก',
        visionLabel: 'วิสัยทัศน์',
      },
      business: {
        title: 'ธุรกิจของเรา',
        subtitle: 'กลุ่มธุรกิจที่หลากหลายภายใต้ JW Group',
        viewWebsite: 'เยี่ยมชมเว็บไซต์',
        learnMore: 'ดูเพิ่มเติม',
        realEstate: {
          name: 'JW Real Estates',
          description: 'ผู้นำด้านอสังหาริมทรัพย์ระดับพ็รีเมียม ให้บริการที่พักอาศัยและพาณิชย์คุณภาพสูง',
        },
        hotel: {
          name: '12 The Residence Hotel',
          description: 'โรงแรมบูติกหรูหราที่ให้บริการระดับโลก พร้อมสิ่งอำนวยความสะดวกครบครัน',
        },
        pet: {
          name: '3DPet Hospital & Hotel',
          description: 'โรงพยาบาลสัตว์และโรงแรมสัตว์เลี้ยงที่ทันสมัยที่สุด ดูแลสัตว์เลี้ยงของคุณด้วยมาตรฐานสูงสุด',
        },
        wellness: {
          name: 'JW Herbal & Wellness',
          description: 'ผลิตภัณฑ์สมุนไพรและสุขภาพคุณภาพสูง เพื่อสุขภาพและความงามที่ยั่งยืน',
        },
      },
      news: {
        title: 'ข่าวสารล่าสุด',
        viewAll: 'ดูข่าวทั้งหมด',
        companyNews: 'ข่าวบริษัท',
        pressRelease: 'ข่าวประชาสัมพันธ์',
        readMore: 'อ่านเพิ่มเติม',
      },
      careers: {
        title: 'ร่วมงานกับเรา',
        description: 'เข้าร่วมทีมงานมืออาชีพของเรา และเติบโตไปพร้อมกับองค์กร',
        viewPositions: 'ดูตำแหน่งงาน',
        positions: 'ตำแหน่งงานทั้งหมด',
        benefits: 'สวัสดิการ',
        apply: 'สมัครงาน',
      },
      contact: {
        title: 'ติดต่อเรา',
        address: 'ที่อยู่',
        phone: 'โทรศัพท์',
        email: 'อีเมล',
        form: {
          name: 'ชื่อ-นามสกุล',
          email: 'อีเมล',
          phone: 'เบอร์โทรศัพท์',
          subject: 'หัวข้อ',
          message: 'ข้อความ',
          send: 'ส่งข้อความ',
        },
      },
      footer: {
        quickLinks: 'ลิงก์ทางลัด',
        followUs: 'ติดตามเรา',
        copyright: '© 2024 JW Group. สงวนลิขสิทธิ์',
        privacy: 'นโยบายความเป็นส่วนตัว',
        terms: 'ข้อกำหนดและเงื่อนไข',
        pdpa: 'นโยบายคุ้มครองข้อมูลส่วนบุคคล',
      },
      common: {
        learnMore: 'เรียนรู้เพิ่มเติม',
        readMore: 'อ่านเพิ่มเติม',
        viewAll: 'ดูทั้งหมด',
        back: 'กลับ',
      },
    },
  },
  en: {
    translation: {
      nav: {
        about: 'About Us',
        business: 'Our Business',
        news: 'News',
        careers: 'Careers',
        contact: 'Contact',
        privacy: 'Privacy Policy',
      },
      about: {
        history: 'JW Group History',
        vision: 'Vision & Mission',
        structure: 'Organization Structure',
        team: 'Management Team',
        awards: 'Awards & Achievements',
      },
      hero: {
        headline: 'JW Group',
        subheadline: 'Comprehensive business group committed to creating innovation and better quality of life',
        ctaLearn: 'About JW Group',
        ctaBusiness: 'Our Business',
      },
      aboutSection: {
        title: 'About JW Group',
        description: 'JW Group is a leading diversified business group spanning multiple industries from real estate, hotels, veterinary services to health products. We are committed to delivering the highest quality services and products to meet customer needs.',
        yearsLabel: 'Years of Expertise',
        businessLabel: 'Core Businesses',
        visionLabel: 'Vision',
      },
      business: {
        title: 'Our Business',
        subtitle: 'Diverse businesses under JW Group',
        viewWebsite: 'Visit Website',
        learnMore: 'Learn More',
        realEstate: {
          name: 'JW Real Estates',
          description: 'Leading premium real estate provider offering high-quality residential and commercial properties',
        },
        hotel: {
          name: '12 The Residence Hotel',
          description: 'Luxury boutique hotel with world-class service and comprehensive facilities',
        },
        pet: {
          name: '3DPet Hospital & Hotel',
          description: 'State-of-the-art veterinary hospital and pet hotel providing the highest standard of pet care',
        },
        wellness: {
          name: 'JW Herbal & Wellness',
          description: 'Premium herbal and health products for sustainable health and beauty',
        },
      },
      news: {
        title: 'Latest News',
        viewAll: 'View All News',
        companyNews: 'Company News',
        pressRelease: 'Press Release',
        readMore: 'Read More',
      },
      careers: {
        title: 'Join Our Team',
        description: 'Join our professional team and grow with the organization',
        viewPositions: 'View Positions',
        positions: 'All Positions',
        benefits: 'Benefits',
        apply: 'Apply Now',
      },
      contact: {
        title: 'Contact Us',
        address: 'Address',
        phone: 'Phone',
        email: 'Email',
        form: {
          name: 'Full Name',
          email: 'Email',
          phone: 'Phone Number',
          subject: 'Subject',
          message: 'Message',
          send: 'Send Message',
        },
      },
      footer: {
        quickLinks: 'Quick Links',
        followUs: 'Follow Us',
        copyright: '© 2024 JW Group. All rights reserved',
        privacy: 'Privacy Policy',
        terms: 'Terms & Conditions',
        pdpa: 'PDPA Policy',
      },
      common: {
        learnMore: 'Learn More',
        readMore: 'Read More',
        viewAll: 'View All',
        back: 'Back',
      },
    },
  },
  cn: {
    translation: {
      nav: {
        about: '关于我们',
        business: '我们的业务',
        news: '新闻',
        careers: '加入我们',
        contact: '联系我们',
        privacy: '隐私政策',
      },
      about: {
        history: 'JW集团历史',
        vision: '愿景与使命',
        structure: '组织结构',
        team: '管理团队',
        awards: '奖项与成就',
      },
      hero: {
        headline: 'JW集团',
        subheadline: '致力于创造创新和更好生活质量的综合商业集团',
        ctaLearn: '了解JW集团',
        ctaBusiness: '我们的业务',
      },
      aboutSection: {
        title: '关于JW集团',
        description: 'JW集团是一家领先的多元化商业集团，业务涵盖房地产、酒店、兽医服务到健康产品等多个行业。我们致力于提供最高质量的服务和产品，满足客户需求。',
        yearsLabel: '年经验',
        businessLabel: '核心业务',
        visionLabel: '愿景',
      },
      business: {
        title: '我们的业务',
        subtitle: 'JW集团旗下多元化业务',
        viewWebsite: '访问网站',
        learnMore: '了解更多',
        realEstate: {
          name: 'JW房地产',
          description: '领先的优质房地产提供商，提供高质量的住宅和商业物业',
        },
        hotel: {
          name: '12 The Residence酒店',
          description: '世界级服务和综合设施的豪华精品酒店',
        },
        pet: {
          name: '3DPet医院及酒店',
          description: '最先进的兽医医院和宠物酒店，提供最高标准的宠物护理',
        },
        wellness: {
          name: 'JW草药与健康',
          description: '优质草药和健康产品，促进可持续健康和美容',
        },
      },
      news: {
        title: '最新消息',
        viewAll: '查看所有新闻',
        companyNews: '公司新闻',
        pressRelease: '新闻稿',
        readMore: '阅读更多',
      },
      careers: {
        title: '加入我们的团队',
        description: '加入我们的专业团队，与组织共同成长',
        viewPositions: '查看职位',
        positions: '所有职位',
        benefits: '福利',
        apply: '立即申请',
      },
      contact: {
        title: '联系我们',
        address: '地址',
        phone: '电话',
        email: '电子邮件',
        form: {
          name: '全名',
          email: '电子邮件',
          phone: '电话号码',
          subject: '主题',
          message: '消息',
          send: '发送消息',
        },
      },
      footer: {
        quickLinks: '快速链接',
        followUs: '关注我们',
        copyright: '© 2024 JW集团。保留所有权利',
        privacy: '隐私政策',
        terms: '条款与条件',
        pdpa: 'PDPA政策',
      },
      common: {
        learnMore: '了解更多',
        readMore: '阅读更多',
        viewAll: '查看全部',
        back: '返回',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'th',
    fallbackLng: 'th',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
