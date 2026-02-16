import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Info, Eye, Network, UserCircle, Award, MapPin, ExternalLink, User, Quote } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Building2, Hotel, Stethoscope, Leaf } from 'lucide-react';
import OrganizationChart from '@/components/OrganizationChart';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { SEO } from '@/components/SEO';

// No hardcoded imports - all images from database

const AboutHistory = () => {
  const { t, i18n } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const currentLang = i18n.language;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch content from database
  const { data: historyContents } = useQuery({
    queryKey: ['about-history-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .like('section_key', 'about_history%');

      if (error) throw error;
      return data;
    }
  });

  // Fetch images from database
  const { data: historyImages } = useQuery({
    queryKey: ['about-history-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .like('section_key', 'about_history%');

      if (error) throw error;
      return data;
    }
  });

  const getContent = (sectionKey: string) => {
    const content = historyContents?.find(c => c.section_key === sectionKey);
    if (!content) return { title: '', content: '' };

    const titleKey = `title_${currentLang === 'th' ? 'th' : currentLang === 'cn' ? 'cn' : 'en'}` as keyof typeof content;
    const contentKey = `content_${currentLang === 'th' ? 'th' : currentLang === 'cn' ? 'cn' : 'en'}` as keyof typeof content;

    return {
      title: (content[titleKey] as string) || content.title_th || '',
      content: (content[contentKey] as string) || content.content_th || ''
    };
  };

  const getImage = (sectionKey: string) => {
    const image = historyImages?.find(img => img.section_key === sectionKey);
    return image?.image_url || null;
  };

  const streetViewUrl = "https://www.google.com/maps/place/JW+Group+Head+Office/@13.9272703,100.5999695,3a,75y,40.45h,90t/data=!3m7!1e1!3m5!1sKCRm7M3QP13vFoNxDC3Tcw!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0%26panoid%3DKCRm7M3QP13vFoNxDC3Tcw%26yaw%3D40.44574!7i16384!8i8192!4m6!3m5!1s0x30e2826bc528edb1:0x1a95b4253779ef2c!8m2!3d13.9273592!4d100.600054!16s%2Fg%2F1vhkgzvf?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D";

  // Get content with fallbacks
  const titleContent = getContent('about_history_title');
  const foundedContent = getContent('about_history_founded');
  const growthContent = getContent('about_history_growth');

  // Gallery images from database (5 images)
  const galleryImages = [
    { src: getImage('about_history_bento_1'), alt: 'JW GROUP Building 1', title: 'สำนักงานใหญ่' },
    { src: getImage('about_history_bento_2'), alt: 'JW GROUP Building 2', title: 'มุมมองอาคาร' },
    { src: getImage('about_history_bento_3'), alt: 'JW GROUP Building 3', title: 'สถาปัตยกรรม' },
    { src: getImage('about_history_bento_4'), alt: 'JW GROUP Building 4', title: 'พื้นที่สำนักงาน' },
    { src: getImage('about_history_bento_5'), alt: 'JW GROUP Building 5', title: 'บริเวณรอบอาคาร' },
  ].filter(img => img.src && img.src !== 'placeholder');

  const heroImage = galleryImages[0]?.src;

  if (galleryImages.length === 0) {
    return (
      <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center py-16">
          <div className="text-muted-foreground mb-4">กรุณาอัปโหลดรูปภาพในหน้า Admin Panel</div>
          <a href="/admin" className="text-primary underline">ไปที่หน้า Admin</a>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Hero Section with Main Image */}
      {heroImage && (
        <div className="relative mb-12 rounded-3xl overflow-hidden group cursor-pointer" onClick={() => setSelectedImage(heroImage)}>
          <img
            src={heroImage}
            alt="JW GROUP Headquarters"
            className="w-full h-72 md:h-96 lg:h-[28rem] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-10 bg-primary rounded-full" />
              <span className="text-primary font-medium text-sm uppercase tracking-widest">Since 2007</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-foreground mb-3">
              {titleContent.title || 'JW GROUP'}
            </h2>
            <p className="text-secondary-foreground/90 text-base md:text-lg max-w-2xl">
              {titleContent.content || 'จากรากฐานอสังหาริมทรัพย์ สู่ผู้นำธุรกิจไลฟ์สไตล์ครบวงจร'}
            </p>
          </div>
        </div>
      )}

      {/* Story Content */}
      <div className="space-y-10">
        {/* Founded Section */}
        <div className="relative pl-6 border-l-2 border-primary/30">
          <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary -translate-x-[9px]" />
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Building2 className="w-4 h-4" />
              {foundedContent.title || 'ก่อตั้งปี 2550'}
            </span>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              {foundedContent.content || 'ก่อตั้งขึ้นเมื่อปี 2550 โดยเริ่มต้นจากความเชี่ยวชาญในธุรกิจอสังหาริมทรัพย์ ด้วยปณิธานแน่วแน่ของผู้บริหารที่ต้องการสร้างสรรค์ที่อยู่อาศัยซึ่งไม่เพียงแค่สวยงาม แต่ต้องตอบโจทย์การใช้งานจริง และใช้สอยพื้นที่ให้เกิดประโยชน์สูงสุด เพื่อส่งมอบคุณค่าที่ยั่งยืนให้กับผู้อยู่อาศัย'}
            </p>
          </div>
        </div>

        {/* Growth Section */}
        <div className="relative pl-6 border-l-2 border-primary/30">
          <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary -translate-x-[9px]" />
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Award className="w-4 h-4" />
              {growthContent.title || 'การเติบโต'}
            </span>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              {growthContent.content || 'จากความสำเร็จในทุกโครงการที่ผ่านมา นำไปสู่การเติบโตและขยายขอบเขตธุรกิจอย่างต่อเนื่อง ปัจจุบัน JW GROUP คือกลุ่มธุรกิจชั้นนำที่ครอบคลุมทั้งด้านอสังหาริมทรัพย์ โรงแรม ธุรกิจโรงพยาบาลสัตว์ และผลิตภัณฑ์เพื่อสุขภาพ โดยยังคงยึดมั่นในภารกิจสำคัญ คือการสร้างสรรค์นวัตกรรมเพื่อยกระดับคุณภาพชีวิตที่ดีกว่าให้กับทุกคน'}
            </p>
          </div>
        </div>

        {/* Professional Bento Gallery */}
        {galleryImages.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-primary rounded-full" />
              <span className="text-sm font-medium text-primary tracking-wide uppercase">สำนักงานใหญ่</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {/* Large featured image - spans 2 cols and 2 rows */}
              {galleryImages[0] && (
                <div
                  className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => galleryImages[0]?.src && setSelectedImage(galleryImages[0].src)}
                >
                  <img
                    src={galleryImages[0].src!}
                    alt={galleryImages[0].alt}
                    className="w-full h-full min-h-[300px] md:min-h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-secondary-foreground font-medium text-sm md:text-base">{galleryImages[0].title}</p>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Eye className="w-5 h-5 text-foreground" />
                  </div>
                </div>
              )}

              {/* Medium images - each spans 1 col */}
              {galleryImages.slice(1, 3).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => image.src && setSelectedImage(image.src)}
                >
                  <img
                    src={image.src!}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-secondary-foreground font-medium text-xs md:text-sm">{image.title}</p>
                  </div>
                </div>
              ))}

              {/* Bottom row - 2 smaller images */}
              {galleryImages.slice(3, 5).map((image, index) => (
                <div
                  key={index + 3}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => image.src && setSelectedImage(image.src)}
                >
                  <img
                    src={image.src!}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-secondary-foreground font-medium text-xs md:text-sm">{image.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Street View Button */}
        <div className="flex justify-center pt-6">
          <Button
            variant="outline"
            size="lg"
            className="gap-3 group px-8 py-6 text-base border-primary/30 hover:border-primary hover:bg-primary/5"
            onClick={() => window.open(streetViewUrl, '_blank', 'noopener,noreferrer')}
          >
            <MapPin className="w-5 h-5 text-primary" />
            <span>ดูสำนักงานใหญ่ 360°</span>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
          </Button>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <img
              src={selectedImage}
              alt="Gallery Image"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AboutVision = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const missions = [
    {
      icon: Building2,
      title: "นำเสนอผลิตภัณฑ์และบริการคุณภาพสูง",
      description: "มุ่งมั่นสร้างสรรค์ผลิตภัณฑ์และบริการที่เหนือความคาดหมาย"
    },
    {
      icon: Leaf,
      title: "พัฒนานวัตกรรมอย่างต่อเนื่อง",
      description: "ไม่หยุดพัฒนาเพื่อตอบโจทย์ความต้องการที่เปลี่ยนแปลง"
    },
    {
      icon: Award,
      title: "สร้างคุณค่าให้กับลูกค้าและสังคม",
      description: "ดำเนินธุรกิจอย่างมีความรับผิดชอบต่อสังคมและสิ่งแวดล้อม"
    }
  ];

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Vision Section */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <span className="text-sm font-medium text-primary tracking-wide uppercase">Vision</span>
        </div>

        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary/30 to-transparent rounded-full hidden md:block" />
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            วิสัยทัศน์
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-light">
            เป็นกลุ่มธุรกิจชั้นนำที่สร้างสรรค์<span className="text-primary font-medium">นวัตกรรม</span>และ<span className="text-primary font-medium">คุณค่าที่ยั่งยืน</span>ให้กับสังคม
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-12">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="w-2 h-2 rounded-full bg-primary/50" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Mission Section */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <span className="text-sm font-medium text-primary tracking-wide uppercase">Mission</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
          พันธกิจ
        </h2>

        <div className="space-y-4">
          {missions.map((mission, index) => (
            <div
              key={index}
              className="group flex gap-5 p-5 rounded-2xl bg-gradient-to-r from-muted/50 to-transparent hover:from-primary/5 hover:to-primary/10 transition-all duration-300 border border-transparent hover:border-primary/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <mission.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-medium text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                  {mission.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {mission.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div className="mt-16 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/10">
        <h3 className="text-lg font-semibold text-foreground mb-6 text-center">ค่านิยมองค์กร</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "ซื่อสัตย์", value: "Integrity" },
            { label: "นวัตกรรม", value: "Innovation" },
            { label: "คุณภาพ", value: "Quality" },
            { label: "ยั่งยืน", value: "Sustainability" }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <p className="text-lg md:text-xl font-semibold text-primary">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AboutStructure = () => {
  return <OrganizationChart />;
};

const AboutTeam = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedExecutive, setSelectedExecutive] = useState<string | null>(null);

  // Fetch only top 3 executives (Chairman + 2 Managing Directors)
  const { data: executives, isLoading } = useQuery({
    queryKey: ['executives-top-leadership'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('executives')
        .select('*')
        .lte('position_order', 3)
        .order('position_order', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const chairman = executives?.find(e => e.is_chairman);
  const managingDirectors = executives?.filter(e => !e.is_chairman) || [];

  return (
    <div ref={ref} className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-primary rounded-full" />
        <span className="text-sm font-medium text-primary tracking-wide uppercase">Leadership</span>
      </div>

      <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
        ทีมผู้บริหาร
      </h2>
      <p className="text-muted-foreground mb-10">
        ผู้นำองค์กรที่ขับเคลื่อน JW GROUP สู่ความสำเร็จ
      </p>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Chairman - Hero Card */}
          {chairman && (
            <div
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
              onMouseEnter={() => setHoveredId(chairman.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedExecutive(selectedExecutive === chairman.id ? null : chairman.id)}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
              </div>

              <div className="relative flex flex-col md:flex-row gap-6 p-6 md:p-8">
                {/* Image with Glow Effect */}
                <div className="relative flex-shrink-0 mx-auto md:mx-0">
                  <div className={cn(
                    "absolute inset-0 rounded-2xl bg-primary/30 blur-xl transition-opacity duration-500",
                    hoveredId === chairman.id ? "opacity-100" : "opacity-0"
                  )} />
                  {chairman.image_url ? (
                    <img
                      src={chairman.image_url}
                      alt={chairman.name}
                      className={cn(
                        "relative w-36 h-36 md:w-48 md:h-48 rounded-2xl object-cover shadow-xl transition-transform duration-500",
                        hoveredId === chairman.id ? "scale-105" : "scale-100"
                      )}
                    />
                  ) : (
                    <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-2xl bg-muted flex items-center justify-center">
                      <User className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  {/* Position Badge */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-lg whitespace-nowrap">
                    ประธานกรรมการบริษัท
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-center md:text-left mt-6 md:mt-0">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {chairman.name}
                  </h3>
                  <p className="text-primary font-medium text-lg mb-4">{chairman.title}</p>

                  {chairman.quote && (
                    <div className={cn(
                      "relative transition-all duration-500 overflow-hidden",
                      selectedExecutive === chairman.id ? "max-h-96 opacity-100" : "max-h-20 md:max-h-24"
                    )}>
                      <Quote className="absolute -left-2 -top-2 w-8 h-8 text-primary/20" />
                      <blockquote className="text-muted-foreground italic pl-6 text-base md:text-lg leading-relaxed">
                        "{chairman.quote}"
                      </blockquote>
                    </div>
                  )}

                  {chairman.description && (
                    <p className={cn(
                      "text-sm text-muted-foreground mt-4 transition-all duration-500",
                      selectedExecutive === chairman.id ? "opacity-100" : "opacity-70"
                    )}>
                      {chairman.description}
                    </p>
                  )}

                  {/* Click hint */}
                  <p className="text-xs text-muted-foreground/50 mt-4 md:hidden">
                    แตะเพื่อดูเพิ่มเติม
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Managing Directors - Twin Cards */}
          {managingDirectors.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {managingDirectors.map((director, index) => (
                <div
                  key={director.id}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer",
                    hoveredId === director.id
                      ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-xl shadow-primary/5 scale-[1.02]"
                      : "bg-muted/30 border-border/50 hover:border-primary/20"
                  )}
                  style={{ animationDelay: `${index * 150}ms` }}
                  onMouseEnter={() => setHoveredId(director.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setSelectedExecutive(selectedExecutive === director.id ? null : director.id)}
                >
                  {/* Animated gradient background */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-0 transition-opacity duration-500",
                    hoveredId === director.id && "opacity-100"
                  )} />

                  <div className="relative p-5 md:p-6">
                    <div className="flex gap-4 items-start">
                      {/* Image */}
                      <div className="relative flex-shrink-0">
                        {director.image_url ? (
                          <img
                            src={director.image_url}
                            alt={director.name}
                            className={cn(
                              "w-20 h-20 md:w-28 md:h-28 rounded-xl object-cover shadow-lg transition-all duration-500",
                              hoveredId === director.id ? "shadow-xl shadow-primary/20" : ""
                            )}
                          />
                        ) : (
                          <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl bg-muted flex items-center justify-center">
                            <User className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        {/* Decorative ring */}
                        <div className={cn(
                          "absolute inset-0 rounded-xl border-2 border-primary/50 transition-all duration-500",
                          hoveredId === director.id ? "scale-110 opacity-100" : "scale-100 opacity-0"
                        )} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <span className={cn(
                          "inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 transition-colors duration-300",
                          hoveredId === director.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        )}>
                          กรรมการผู้จัดการ
                        </span>
                        <h3 className={cn(
                          "text-lg md:text-xl font-semibold mb-1 transition-colors duration-300 line-clamp-1",
                          hoveredId === director.id ? "text-primary" : "text-foreground"
                        )}>
                          {director.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {director.description || director.title}
                        </p>
                      </div>
                    </div>

                    {/* Expanded content */}
                    <div className={cn(
                      "overflow-hidden transition-all duration-500",
                      selectedExecutive === director.id ? "max-h-40 mt-4 pt-4 border-t border-border/50" : "max-h-0"
                    )}>
                      {director.quote && (
                        <blockquote className="text-sm text-muted-foreground italic">
                          "{director.quote}"
                        </blockquote>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">
                        {director.description}
                      </p>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className={cn(
                    "absolute top-0 right-0 w-16 h-16 transition-transform duration-500",
                    hoveredId === director.id ? "translate-x-0 translate-y-0" : "translate-x-8 -translate-y-8"
                  )}>
                    <div className="absolute top-0 right-0 w-full h-full bg-primary/10 rounded-bl-3xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {(!executives || executives.length === 0) && !isLoading && (
            <div className="text-center py-12 rounded-2xl bg-muted/30 border border-dashed border-border">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">ยังไม่มีข้อมูลทีมผู้บริหาร</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};



const About = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const seoTitle = t('about.title') || "เกี่ยวกับเรา";
  const seoDesc = t('about.subtitle') || "JW Group - ความเป็นมา วิสัยทัศน์ และโครงสร้างองค์กร";

  const navItems = [
    { path: '/about/history', labelKey: 'about.history', icon: Info },
    { path: '/about/structure', labelKey: 'about.structure', icon: Network },
    { path: '/about/team', labelKey: 'about.team', icon: UserCircle },
    { path: '/about/awards', labelKey: 'about.awards', icon: Award },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="pt-24 min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonicalUrl="/about"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28">
              {/* Header */}
              <div className="mb-6 relative">
                <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-primary to-primary/30 rounded-full" />
                <h2 className="text-xl font-bold text-foreground mb-1 pl-4">เกี่ยวกับเรา</h2>
                <p className="text-sm text-muted-foreground pl-4">ข้อมูลองค์กร JW Group</p>
              </div>

              {/* Navigation Items */}
              <nav className="relative">
                {/* Decorative Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent hidden lg:block" />

                <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-2 px-2 lg:mx-0 lg:px-0">
                  {navItems.map((item, index) => {
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "group relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 min-w-max lg:min-w-0 border backdrop-blur-sm",
                          active
                            ? "bg-gradient-to-r from-secondary via-secondary/95 to-secondary/90 border-primary/30 shadow-xl shadow-primary/15 lg:translate-x-1"
                            : "bg-card/80 hover:bg-card border-border/60 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
                        )}
                      >
                        {/* Icon Container with Premium Gradient */}
                        <div className={cn(
                          "relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 overflow-hidden",
                          active
                            ? "bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/40 scale-105"
                            : "bg-gradient-to-br from-muted to-muted/70 group-hover:from-primary group-hover:to-accent group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:scale-110"
                        )}>
                          {/* Shine overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/10 to-primary-foreground/20" />
                          <item.icon className={cn(
                            "relative h-5 w-5 z-10 transition-all duration-300",
                            active
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-primary-foreground"
                          )} strokeWidth={1.8} />

                          {/* Active glow ring */}
                          {active && (
                            <span className="absolute inset-0 rounded-xl ring-2 ring-primary-foreground/20 animate-pulse" />
                          )}
                        </div>

                        {/* Label with Premium Typography */}
                        <div className="flex flex-col gap-0.5">
                          <span className={cn(
                            "text-[15px] font-bold tracking-wide transition-colors duration-300 whitespace-nowrap lg:whitespace-normal",
                            active
                              ? "text-primary-foreground"
                              : "text-foreground group-hover:text-primary"
                          )}>
                            {t(item.labelKey)}
                          </span>
                        </div>

                        {/* Premium Arrow Indicator */}
                        <svg
                          className={cn(
                            "hidden lg:block w-5 h-5 ml-auto transition-all duration-300",
                            active
                              ? "opacity-100 text-primary translate-x-0"
                              : "opacity-0 text-muted-foreground -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary"
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>

                        {/* Active indicator bar */}
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-lg shadow-primary/50 hidden lg:block" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Quick Stats with Premium Styling */}
              <div className="hidden lg:block mt-8 p-5 bg-gradient-to-br from-secondary/5 via-primary/5 to-accent/5 rounded-2xl border border-primary/15 shadow-inner">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-2 rounded-xl bg-card/50">
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">17+</p>
                    <p className="text-xs text-muted-foreground font-medium mt-1">ปีแห่งประสบการณ์</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-card/50">
                    <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">4</p>
                    <p className="text-xs text-muted-foreground font-medium mt-1">กลุ่มธุรกิจหลัก</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border/50">
              <Routes>
                <Route path="history" element={<AboutHistory />} />
                <Route path="vision" element={<AboutVision />} />
                <Route path="structure" element={<AboutStructure />} />
                <Route path="team" element={<AboutTeam />} />
                {/* Awards moved to detailed page */}
                <Route path="*" element={<AboutHistory />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default About;
