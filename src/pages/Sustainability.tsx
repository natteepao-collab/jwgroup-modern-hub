import { useTranslation } from 'react-i18next';
import { Leaf, Recycle, Sun, Droplets, TreePine, Heart, Users, Globe, Target, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';

const Sustainability = () => {
  const { t } = useTranslation();

  const initiatives = [
    { icon: Sun, title: t('sustainability.cleanEnergy'), description: t('sustainability.cleanEnergyDesc') },
    { icon: Recycle, title: t('sustainability.recycling'), description: t('sustainability.recyclingDesc') },
    { icon: Droplets, title: t('sustainability.waterMgmt'), description: t('sustainability.waterMgmtDesc') },
    { icon: TreePine, title: t('sustainability.greenSpaces'), description: t('sustainability.greenSpacesDesc') },
  ];

  const sdgGoals = [
    { number: 3, title: t('sustainability.sdg3'), color: 'bg-green-500' },
    { number: 7, title: t('sustainability.sdg7'), color: 'bg-yellow-500' },
    { number: 11, title: t('sustainability.sdg11'), color: 'bg-orange-500' },
    { number: 12, title: t('sustainability.sdg12'), color: 'bg-amber-600' },
    { number: 13, title: t('sustainability.sdg13'), color: 'bg-emerald-600' },
    { number: 15, title: t('sustainability.sdg15'), color: 'bg-lime-600' },
  ];

  const stats = [
    { value: '40%', label: t('sustainability.carbonReduction') },
    { value: '100+', label: t('sustainability.treesPlanted') },
    { value: '30%', label: t('sustainability.renewableEnergy') },
    { value: '50%', label: t('sustainability.waterSavings') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t('sustainability.title')}
        description={t('sustainability.seoDesc')}
        canonicalUrl="/sustainability"
      />
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-emerald-800/80 to-teal-900/90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <Leaf key={i} className="absolute text-green-400/20 animate-float" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 0.5}s` }} size={40 + i * 10} />
          ))}
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <Leaf className="w-5 h-5 text-green-400" />
            <span className="text-white/90 text-sm font-medium">{t('sustainability.sustainableDev')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-display">
            {t('sustainability.title')}
            <span className="block text-green-400 mt-2">{t('sustainability.subtitle')}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">{t('sustainability.heroDesc')}</p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-primary mb-4">
                <Target className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">{t('sustainability.ourVision')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-display">{t('sustainability.visionTitle')}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">{t('sustainability.visionDesc1')}</p>
              <p className="text-muted-foreground leading-relaxed">{t('sustainability.visionDesc2')}</p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800" alt="Sustainability Vision" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <Globe className="w-8 h-8 mb-2" />
                <p className="text-sm font-semibold">Net Zero 2040</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-display">{stat.value}</div>
                <p className="text-muted-foreground text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Leaf className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">{t('sustainability.ourInitiatives')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display">{t('sustainability.initiativesTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {initiatives.map((item, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-0">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-display">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ESG Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">ESG Framework</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('sustainability.esgDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-2 bg-green-500" />
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-6"><Leaf className="w-7 h-7 text-green-600" /></div>
                <h3 className="text-2xl font-bold text-foreground mb-4 font-display">Environment</h3>
                <p className="text-lg font-semibold text-green-600 mb-3">{t('sustainability.environment')}</p>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  {[t('sustainability.envItem1'), t('sustainability.envItem2'), t('sustainability.envItem3'), t('sustainability.envItem4')].map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-2 bg-blue-500" />
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6"><Users className="w-7 h-7 text-blue-600" /></div>
                <h3 className="text-2xl font-bold text-foreground mb-4 font-display">Social</h3>
                <p className="text-lg font-semibold text-blue-600 mb-3">{t('sustainability.social')}</p>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  {[t('sustainability.socialItem1'), t('sustainability.socialItem2'), t('sustainability.socialItem3'), t('sustainability.socialItem4')].map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-2 bg-purple-500" />
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6"><Award className="w-7 h-7 text-purple-600" /></div>
                <h3 className="text-2xl font-bold text-foreground mb-4 font-display">Governance</h3>
                <p className="text-lg font-semibold text-purple-600 mb-3">{t('sustainability.governance')}</p>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  {[t('sustainability.govItem1'), t('sustainability.govItem2'), t('sustainability.govItem3'), t('sustainability.govItem4')].map((item, i) => (
                    <li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SDG Goals Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">UN Sustainable Development Goals</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('sustainability.sdgDesc')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sdgGoals.map((goal) => (
              <div key={goal.number} className={`${goal.color} rounded-xl p-6 text-white text-center hover:scale-105 transition-transform cursor-pointer shadow-lg`}>
                <div className="text-3xl font-bold mb-2">{goal.number}</div>
                <p className="text-xs font-medium leading-tight">{goal.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-display">{t('sustainability.ctaTitle')}</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">{t('sustainability.ctaDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">{t('sustainability.viewReport')}</Button>
            <Button variant="outline" size="lg" className="px-8" asChild>
              <Link to="/contact">{t('nav.contactUs')}</Link>
            </Button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 0.4; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Sustainability;
