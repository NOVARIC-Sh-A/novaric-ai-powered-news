
import React, { useState, useEffect } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ShareIcon, CheckIcon } from './icons';
import { renderWithSuperscript } from '../utils/textUtils';
import { JsonLd } from './JsonLd';
import { useSeo } from '../hooks/useSeo';
import { useLanguage } from '../contexts/LanguageContext';

interface NovaricMediaHousePageProps {
  onBack: () => void;
}

const translations = {
  en: {
    back: 'Back',
    heroTitle1: 'Shaping Narrative For',
    heroTitle2: 'A Smarter Society™',
    heroSubtitle: 'NOVARIC® Media House',
    metaDescription: "Empower your brand with NOVARIC® Media House. Explore our services in strategic communication, digital content creation, tourism promotion, and performance analytics to enhance your visibility and influence.",
    shareThisPage: 'Share this Page',
    linkCopied: 'Link copied!',
    empowerBrandTitle: 'EMPOWER YOUR BRAND',
    empowerBrandDesc: "At NOVARIC® Media House, we help you craft, amplify, and protect your brand across every digital and strategic touchpoint. From high-impact communication strategies to identity development, content creation, tourism promotion, and performance analytics, our services enhance your visibility, credibility, and influence. Whether you're launching a campaign or building long-term recognition, we connect with your audience.",
    service1Title: 'Strategic communication planning',
    service1Desc: "At NOVARIC® Media House, we create tailored communication strategies that align with your goals and reflect your brand's voice. By analyzing your audience and channels, we develop plans that boost visibility, engagement, and long-term impact.",
    service2Title: 'Branding and identity development',
    service2Desc: "Branding is more than just a logo; it's about creating a compelling identity that truly resonates with your audience. At NOVARIC® Media House, we partner with you to develop a distinctive brand identity that includes visual design, core messaging, and strategic market positioning.",
    service3Title: 'Tourism promotion strategies',
    service3Desc: "At NOVARIC® Media House, we showcase Albania's rich culture and natural beauty through strategic tourism promotion. Using digital media, storytelling, and targeted campaigns, we boost destination visibility, support local businesses, and attract global travelers, driving sustainable tourism growth across the region.",
    service4Title: 'Digital media content creation',
    service4Desc: "Engaging content is the backbone of a strong digital presence. NOVARIC® Media House delivers tailored visuals, videos, blogs, and social media content that reflect your brand and speak to your audience. With a focus on storytelling and quality, we turn ideas into impactful digital experiences that drive growth and visibility.",
    service5Title: 'Analytics and performance tracking',
    service5Desc: "Success starts with understanding what works. Our performance tracking services provide clear insights into audience behavior, engagement, and campaign results. NOVARIC® Media House uses data-driven analysis to help you fine-tune your strategy, uncover growth opportunities, and ensure your marketing efforts deliver measurable results.",
    brochureTitle: 'OUR DIGITAL BROCHURE',
    brochureDesc: 'Explore our interactive brochure to get a comprehensive overview of our services, packages, and vision for empowering your brand.',
    brochureIframeTitle: 'NOVARIC® Media House Digital Brochure',
    projectedGrowthTitle: 'PROJECTED GROWTH FOR A TYPICAL PARTNER',
    projectedGrowthDesc: 'This data-driven visual effectively communicates the tangible benefits of our digital marketing strategies, helping to justify the investment for potential clients. The chart illustrates potential improvements across key metrics.',
    onlineVisibility: 'Online Visibility',
    audienceEngagement: 'Audience Engagement',
    websiteTraffic: 'Website Traffic',
    leadGeneration: 'Lead Generation',
    beforeNovaric: 'Before NOVARIC®',
    month3: '3 Months',
    month6: '6 Months',
    month12: '12 Months',
    pricingTitle: 'NOVARIC® SOCIAL MEDIA PACKAGE',
    pricingDesc: "Discover our refined 3-tier service plan, designed to meet your brand's needs at every stage, from establishing a strong online presence to accelerating digital growth. Whether you're just starting out, looking to strengthen your existing strategy, or ready to scale up, each tier offers tailored solutions that align with your goals, budget, and vision for success in the digital space.",
    featurePlan: 'Feature/Plan',
    essential: 'Essential',
    standard: 'Standard',
    premium: 'Premium',
    contentPosts: 'Content Posts (Static)',
    stories: 'Stories',
    captionsHashtags: 'Captions/Hashtags',
    reportingInsights: 'Reporting & Insights',
    reelsShortVideos: 'Reels/Short Videos',
    whatsappBusiness: 'WhatsApp Business Set Up',
    strategySession: 'Strategy Session',
    communityManagement: 'Community Management',
    adCampaignManagement: 'Ad Campaign Management',
    influencerOutreach: 'Influencer Outreach',
    photoVideoProduction: 'Photo/Video Production',
    websiteCreation: 'Website Creation',
    monthly: 'Monthly',
    fortnight: 'Fortnight',
    weekly: 'Weekly',
    optional: 'optional',
    included: 'Included',
    notIncluded: 'Not-included',
    contactIntro1: 'At NOVARIC® Media House, we are driven by the belief that every brand has a story worth sharing.',
    contactIntro2: 'With a blend of strategy, creativity, and digital innovation, we help businesses, institutions, and visionaries communicate with clarity, purpose, and impact.',
    contactIntro3: 'Our team brings together local insights and global standards to deliver compelling narratives that connect and inspire.',
    contactIntro4: "Whether you're launching a new brand, building a loyal community, or scaling your online presence, our solutions are tailored to fit your goals.",
    contactIntro5: "From creative content to data-driven campaigns, we're here to support your growth every step of the way.",
    contactCta: "Let's turn your vision into influence starting with a conversation.",
    contactUs: 'CONTACT US:',
    location: 'LOCATION',
    hours: 'HOURS',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    mapTitle: 'NOVARIC® Location Map',
  },
  sq: {
    back: 'Kthehu Pas',
    heroTitle1: 'Arkitektojmë Narrativën Për',
    heroTitle2: 'Një Shoqëri më të Mençur™',
    heroSubtitle: 'NOVARIC® Media House',
    metaDescription: "Fuqizoni markën tuaj me NOVARIC® Media House. Eksploroni shërbimet tona në komunikim strategjik, krijim të përmbajtjes digjitale, dhe analitikë performance për të rritur vizibilitetin dhe ndikimin tuaj.",
    shareThisPage: 'Shpërndaje Faqen',
    linkCopied: 'Linku u kopjua!',
    empowerBrandTitle: 'FUQIZONI MARKËN TUAJ',
    empowerBrandDesc: 'Në NOVARIC® Media House, ne ju ndihmojmë të krijoni, amplifikoni dhe mbroni markën tuaj në çdo pikë kontakti digjital dhe strategjik. Nga strategjitë e komunikimit me impakt të lartë te zhvillimi i identitetit, krijimi i përmbajtjes, promovimi i turizmit dhe analitika e performancës, shërbimet tona rrisin vizibilitetin, besueshmërinë dhe ndikimin tuaj. Pavarësisht nëse po lansoni një fushatë apo po ndërtoni njohje afatgjatë, ne ju lidhim me audiencën tuaj.',
    service1Title: 'Planifikimi strategjik i komunikimit',
    service1Desc: 'Në NOVARIC® Media House, ne krijojmë strategji të personalizuara komunikimi që përputhen me qëllimet tuaja dhe pasqyrojnë zërin e markës suaj. Duke analizuar audiencën dhe kanalet tuaja, ne zhvillojmë plane që rrisin vizibilitetin, angazhimin dhe ndikimin afatgjatë.',
    service2Title: 'Zhvillimi i markës dhe identitetit',
    service2Desc: "Marka është më shumë se një logo; është krijimi i një identiteti tërheqës që rezonon vërtet me audiencën tuaj. Në NOVARIC® Media House, ne partnerojmë me ju për të zhvilluar një identitet të veçantë marke që përfshin dizajn vizual, mesazhe thelbësore dhe pozicionim strategjik në treg.",
    service3Title: 'Strategjitë e promovimit të turizmit',
    service3Desc: "Në NOVARIC® Media House, ne shfaqim kulturën e pasur dhe bukurinë natyrore të Shqipërisë përmes promovimit strategjik të turizmit. Duke përdorur mediat digjitale, tregimin dhe fushatat e synuara, ne rrisim vizibilitetin e destinacionit, mbështesim bizneset lokale dhe tërheqim udhëtarë globalë, duke nxitur rritje të qëndrueshme të turizmit në rajon.",
    service4Title: 'Krijimi i përmbajtjes mediatike digjitale',
    service4Desc: 'Përmbajtja angazhuese është shtylla kurrizore e një pranie të fortë digjitale. NOVARIC® Media House ofron vizuale, video, blogje dhe përmbajtje të personalizuara për mediat sociale që pasqyrojnë markën tuaj dhe flasin me audiencën tuaj. Me një fokus te tregimi dhe cilësia, ne i kthejmë idetë në përvoja digjitale me ndikim që nxisin rritjen dhe vizibilitetin.',
    service5Title: 'Analitika dhe ndjekja e performancës',
    service5Desc: 'Suksesi fillon me kuptimin e asaj që funksionon. Shërbimet tona të ndjekjes së performancës ofrojnë njohuri të qarta mbi sjelljen e audiencës, angazhimin dhe rezultatet e fushatës. NOVARIC® Media House përdor analiza të bazuara në të dhëna për t\'ju ndihmuar të përsosni strategjinë tuaj, të zbuloni mundësi rritjeje dhe të siguroheni që përpjekjet tuaja të marketingut japin rezultate të matshme.',
    brochureTitle: 'BROSHURA JONË DIGJITALE',
    brochureDesc: 'Eksploroni broshurën tonë interaktive për të marrë një pasqyrë të plotë të shërbimeve, paketave dhe vizionit tonë për fuqizimin e markës suaj.',
    brochureIframeTitle: 'Broshura Digjitale e NOVARIC® Media House',
    projectedGrowthTitle: 'RRITJA E PROJEKTUAR PËR NJË PARTNER TIPIK',
    projectedGrowthDesc: 'Ky vizualizim i bazuar në të dhëna komunikon në mënyrë efektive përfitimet e prekshme të strategjive tona të marketingut digjital, duke ndihmuar në justifikimin e investimit për klientët e mundshëm. Grafiku ilustron përmirësimet e mundshme në metrika kyçe.',
    onlineVisibility: 'Dukshmëria Online',
    audienceEngagement: 'Angazhimi i Audiencës',
    websiteTraffic: 'Trafiku i Uebfaqes',
    leadGeneration: 'Gjenerimi i Lidhjeve (Leads)',
    beforeNovaric: 'Para NOVARIC®',
    month3: '3 Muaj',
    month6: '6 Muaj',
    month12: '12 Muaj',
    pricingTitle: 'PAKETA E MEDIAVE SOCIALE NOVARIC®',
    pricingDesc: "Zbuloni planin tonë të shërbimit të rafinuar me 3 nivele, i projektuar për të përmbushur nevojat e markës suaj në çdo fazë, nga krijimi i një pranie të fortë online deri te përshpejtimi i rritjes digjitale. Pavarësisht nëse sapo keni filluar, po kërkoni të forconi strategjinë tuaj ekzistuese, apo jeni gati për të shkallëzuar, çdo nivel ofron zgjidhje të personalizuara që përputhen me qëllimet, buxhetin dhe vizionin tuaj për sukses në hapësirën digjitale.",
    featurePlan: 'Veçoria/Plani',
    essential: 'Themelor',
    standard: 'Standard',
    premium: 'Premium',
    contentPosts: 'Postime Përmbajtjeje (Statike)',
    stories: 'Storje',
    captionsHashtags: 'Mbishkrime/Hashtagë',
    reportingInsights: 'Raportim & Njohuri',
    reelsShortVideos: 'Reels/Video të Shkurtra',
    whatsappBusiness: 'Konfigurimi i WhatsApp Business',
    strategySession: 'Sesion Strategjie',
    communityManagement: 'Menaxhimi i Komunitetit',
    adCampaignManagement: 'Menaxhimi i Fushatave Reklamuese',
    influencerOutreach: 'Kontakti me Influencerë',
    photoVideoProduction: 'Produksion Foto/Video',
    websiteCreation: 'Krijim Uebfaqeje',
    monthly: 'Mujor',
    fortnight: 'Dy-javor',
    weekly: 'Javor',
    optional: 'opsionale',
    included: 'Përfshirë',
    notIncluded: 'Nuk përfshihet',
    contactIntro1: 'Në NOVARIC® Media House, ne udhëhiqemi nga besimi se çdo markë ka një histori që ia vlen të tregohet.',
    contactIntro2: 'Me një përzierje strategjie, kreativiteti dhe inovacioni digjital, ne ndihmojmë bizneset, institucionet dhe vizionarët të komunikojnë me qartësi, qëllim dhe ndikim.',
    contactIntro3: 'Ekipi ynë bashkon njohuritë lokale dhe standardet globale për të ofruar narrativa tërheqëse që lidhin dhe frymëzojnë.',
    contactIntro4: "Pavarësisht nëse po lansoni një markë të re, po ndërtoni një komunitet besnik, apo po shkallëzoni praninë tuaj online, zgjidhjet tona janë të përshtatura për t'iu përshtatur qëllimeve tuaja.",
    contactIntro5: 'Nga përmbajtja kreative te fushatat e bazuara në të dhëna, ne jemi këtu për të mbështetur rritjen tuaj në çdo hap të rrugës.',
    contactCta: 'Le ta kthejmë vizionin tuaj në ndikim duke filluar me një bisedë.',
    contactUs: 'NA KONTAKTONI NË:',
    location: 'VENDNDODHJA',
    hours: 'ORARI',
    monday: 'E Hënë',
    tuesday: 'E Martë',
    wednesday: 'E Mërkurë',
    thursday: 'E Enjte',
    friday: 'E Premte',
    mapTitle: 'Harta e Vendndodhjes së NOVARIC®',
  }
};

const pricingData = [
    { feature: 'contentPosts', essential: '12/month', standard: '20/month', premium: '25+/month' },
    { feature: 'stories', essential: '15/month', standard: '30/month', premium: '40+/month' },
    { feature: 'captionsHashtags', essential: true, standard: true, premium: true },
    { feature: 'reportingInsights', essential: 'monthly', standard: 'fortnight', premium: 'weekly' },
    { feature: 'reelsShortVideos', essential: false, standard: '2/month', premium: '4-6 / month' },
    { feature: 'whatsappBusiness', essential: false, standard: true, premium: true },
    { feature: 'strategySession', essential: false, standard: true, premium: true },
    { feature: 'communityManagement', essential: false, standard: false, premium: true },
    { feature: 'adCampaignManagement', essential: 'optional (150€/mo)', standard: 'optional (150€/mo)', premium: true },
    { feature: 'influencerOutreach', essential: false, standard: false, premium: true },
    { feature: 'photoVideoProduction', essential: false, standard: false, premium: '1 Shoot/mo' },
    { feature: 'websiteCreation', essential: false, standard: false, premium: false },
];

const growthData = [
    { metric: 'onlineVisibility', baseline: 20, month3: 40, month6: 65, month12: 85 },
    { metric: 'audienceEngagement', baseline: 15, month3: 35, month6: 55, month12: 75 },
    { metric: 'websiteTraffic', baseline: 25, month3: 50, month6: 70, month12: 90 },
    { metric: 'leadGeneration', baseline: 10, month3: 25, month6: 45, month12: 60 },
];

const SectionTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <h2 className={`text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 text-center mb-4 ${className}`}>
    {children}
  </h2>
);

const ServiceItem: React.FC<{ number: string; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
  <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 py-8 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
    <div className="flex items-center gap-6 sm:gap-8">
      <span className="text-7xl font-bold text-slate-200 dark:text-slate-700 select-none">{number}</span>
      <div className="h-full w-px bg-slate-200 dark:bg-slate-700 hidden sm:block self-stretch"></div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{children}</p>
    </div>
  </div>
);

const IncludedIcon = () => (
    <svg className="w-6 h-6 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="7" />
    </svg>
);

const NotIncludedIcon = () => (
    <svg className="w-6 h-6 text-slate-400 dark:text-slate-500 mx-auto" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="2">
        <circle cx="10" cy="10" r="7" />
    </svg>
);

const GrowthChart: React.FC<{
  title: string;
  data: { baseline: number; month3: number; month6: number; month12: number };
  labels: { before: string; m3: string; m6: string; m12: string };
}> = ({ title, data, labels }) => {
    const bars = [
        { label: labels.before, value: data.baseline, color: 'bg-slate-400 dark:bg-slate-600' },
        { label: labels.m3, value: data.month3, color: 'bg-red-300 dark:bg-red-700' },
        { label: labels.m6, value: data.month6, color: 'bg-red-400 dark:bg-red-600' },
        { label: labels.m12, value: data.month12, color: 'bg-red-500 dark:bg-red-500' },
    ];

    return (
        <div className="w-full">
            <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">{title}</h4>
            <div className="space-y-3">
                {bars.map((bar, index) => (
                    <div key={index} className="flex items-center gap-2 sm:gap-4" aria-label={`${bar.label}: ${bar.value}%`}>
                        <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 w-16 sm:w-28 text-right flex-shrink-0">{bar.label}</span>
                        <div className="flex-grow bg-slate-200 dark:bg-slate-700 rounded-full h-6 sm:h-8">
                            <div
                                className={`${bar.color} h-6 sm:h-8 rounded-full flex items-center justify-end pr-2 text-white font-bold text-xs sm:text-sm transition-all duration-700 ease-out`}
                                style={{ width: `${bar.value}%` }}
                                role="progressbar"
                                aria-valuenow={bar.value}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                {bar.value > 10 && `${bar.value}%`}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const NovaricMediaHousePage: React.FC<NovaricMediaHousePageProps> = ({ onBack }) => {
    const { language, toggleLanguage } = useLanguage();
    const [isCopied, setIsCopied] = useState(false);
    const content = translations[language];

    // SEO
    const pageTitle = language === 'sq' 
        ? 'NOVARIC® Media House | Media Sociale & Përmbajtje Digjitale' 
        : 'NOVARIC® Media House | Social Media & Digital Content';
    const pageDescription = content.metaDescription;
    const pageImageUrl = "https://novaric.wpcomstaging.com/wp-content/uploads/2025/10/Nora-AI.jpeg";
    const locale = language === 'sq' ? 'sq_AL' : 'en_US';

    useSeo(pageTitle, pageDescription, pageImageUrl, window.location.href, locale);
    
    const handleShare = async () => {
        const shareData = {
          title: pageTitle,
          text: pageDescription,
          url: window.location.href,
        };
    
        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (error) {
            console.error('Gabim gjatë shpërndjes:', error);
          }
        } else if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2500);
            } catch (err) {
                console.error('Nuk mund të kopjohej URL: ', err);
            }
        } else {
            alert('Funksioni i shpërndarjes nuk mbështetet në këtë shfletues.');
        }
    };
    
    const renderPricingCell = (value: string | boolean) => {
        if (typeof value === 'boolean') {
            return value ? <IncludedIcon /> : <NotIncludedIcon />;
        }
        
        let translatedValue = value;
        if (value === 'monthly') translatedValue = content.monthly;
        if (value === 'fortnight') translatedValue = content.fortnight;
        if (value === 'weekly') translatedValue = content.weekly;

        if (value.startsWith('optional')) {
            return <div className="text-center"><NotIncludedIcon /><span className="text-xs block mt-1">{content.optional} (150€/mo)</span></div>;
        }
        if (value) {
            return <div className="flex items-center justify-center gap-2 font-semibold"><IncludedIcon /><span>{translatedValue}</span></div>
        }
        return <NotIncludedIcon />;
    };
    
    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "NOVARIC® Media House",
        "image": pageImageUrl,
        "url": window.location.href,
        "telephone": "+355 (0) 222 55 999",
        "email": "contact@media.novaric.al",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "NOVARIC Building, Nd. 2 H. 6, Rruga Studenti",
          "addressLocality": "Shkoder",
          "postalCode": "4001",
          "addressCountry": "AL"
        },
        "openingHours": "Mo-Fr 09:00-17:00",
        "description": pageDescription,
        "provider": {
          "@type": "Organization",
          "name": "NOVARIC® Sh.A.",
          "url": "https://novaric.al/"
        }
    };

  return (
    <main className="flex-grow bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <JsonLd data={jsonLdData} />
      <header className="relative h-[80vh] min-h-[500px] flex items-end justify-center text-white text-center pb-16" style={{ 
          backgroundImage: `url('${pageImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="relative z-10 p-4">
          <h1 className="text-5xl md:text-7xl font-extrabold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
            {renderWithSuperscript(content.heroTitle1)}
            <br />
            {renderWithSuperscript(content.heroTitle2)}
          </h1>
          <p className="text-2xl md:text-3xl font-light mt-4" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>
            {renderWithSuperscript(content.heroSubtitle)}
          </p>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-12 sm:py-16">
        
        <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
            <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold rounded-md shadow-sm transition"
            >
                &larr; <span className="ml-2">{content.back}</span>
            </button>
            <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-full p-1">
                <button 
                    onClick={() => language !== 'en' && toggleLanguage()}
                    className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'en' ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    EN
                </button>
                 <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                 <button 
                    onClick={() => language !== 'sq' && toggleLanguage()}
                    className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${language === 'sq' ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    AL
                </button>
            </div>
        </div>

        <section className="max-w-4xl mx-auto mb-16">
            <SectionTitle>{content.empowerBrandTitle}</SectionTitle>
            <p className="text-center text-slate-600 dark:text-slate-300 mt-4 max-w-3xl mx-auto leading-relaxed">
                {content.empowerBrandDesc}
            </p>
            <div className="mt-8">
                <ServiceItem number="01" title={content.service1Title}>{content.service1Desc}</ServiceItem>
                <ServiceItem number="02" title={content.service2Title}>{content.service2Desc}</ServiceItem>
                <ServiceItem number="03" title={content.service3Title}>{content.service3Desc}</ServiceItem>
                <ServiceItem number="04" title={content.service4Title}>{content.service4Desc}</ServiceItem>
                <ServiceItem number="05" title={content.service5Title}>{content.service5Desc}</ServiceItem>
            </div>
        </section>

        <section className="max-w-4xl mx-auto mb-16">
            <SectionTitle>{content.brochureTitle}</SectionTitle>
            <p className="text-center text-slate-600 dark:text-slate-300 mt-4 max-w-3xl mx-auto leading-relaxed">
                {content.brochureDesc}
            </p>
            <div className="mt-8 rounded-lg shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div style={{ position: 'relative', paddingTop: 'max(60%, 324px)', width: '100%', height: 0 }}>
                    <iframe
                        style={{ position: 'absolute', border: 'none', width: '100%', height: '100%', left: 0, top: 0 }}
                        src="https://online.fliphtml5.com/uykng/xvte/"
                        frameBorder="0"
                        allowFullScreen={true}
                        title={content.brochureIframeTitle}
                    ></iframe>
                </div>
            </div>
        </section>
        
        <section className="max-w-4xl mx-auto mb-16">
            <SectionTitle>{content.projectedGrowthTitle}</SectionTitle>
            <p className="text-center text-slate-600 dark:text-slate-300 mt-4 max-w-3xl mx-auto leading-relaxed">
                {content.projectedGrowthDesc}
            </p>
            <div className="mt-10 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 space-y-8">
                {growthData.map(item => (
                    <GrowthChart
                        key={item.metric}
                        title={content[item.metric as keyof typeof content]}
                        data={{ baseline: item.baseline, month3: item.month3, month6: item.month6, month12: item.month12 }}
                        labels={{
                            before: content.beforeNovaric,
                            m3: content.month3,
                            m6: content.month6,
                            m12: content.month12,
                        }}
                    />
                ))}
            </div>
        </section>

        <section className="bg-slate-50 dark:bg-slate-800/50 py-16 -mx-4 px-4 sm:rounded-lg mb-16">
            <div className="max-w-6xl mx-auto">
                 <SectionTitle>{renderWithSuperscript(content.pricingTitle)}</SectionTitle>
                 <p className="text-center text-slate-600 dark:text-slate-300 mt-4 max-w-3xl mx-auto leading-relaxed">
                    {content.pricingDesc}
                </p>
                <div className="mt-10 overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
                        <thead className="bg-slate-100 dark:bg-slate-700">
                            <tr>
                                <th className="p-4 text-left font-bold text-lg">{content.featurePlan}</th>
                                <th className="p-4 text-center font-bold text-lg">{content.essential}<span className="block text-sm font-normal">(€650/mo)</span></th>
                                <th className="p-4 text-center font-bold text-lg">{content.standard}<span className="block text-sm font-normal">(€950/mo)</span></th>
                                <th className="p-4 text-center font-bold text-lg text-primary-600 dark:text-primary-400">{content.premium}<span className="block text-sm font-normal text-slate-600 dark:text-slate-300">(€1,150/mo)</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {pricingData.map((row) => (
                                <tr key={row.feature}>
                                    <td className="p-4 font-semibold">{translations[language][row.feature as keyof typeof translations.en]}</td>
                                    <td className="p-4 text-center">{renderPricingCell(row.essential)}</td>
                                    <td className="p-4 text-center">{renderPricingCell(row.standard)}</td>
                                    <td className="p-4 text-center">{renderPricingCell(row.premium)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2"><IncludedIcon /> {content.included}</div>
                    <div className="flex items-center gap-2"><NotIncludedIcon /> {content.notIncluded}</div>
                </div>
            </div>
        </section>

        <section className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="prose dark:prose-invert">
                    <p>{content.contactIntro1}</p>
                    <p>{content.contactIntro2}</p>
                    <p>{content.contactIntro3}</p>
                    <p>{content.contactIntro4}</p>
                    <p>{content.contactIntro5}</p>
                    <p className="font-bold text-lg">{content.contactCta}</p>
                </div>

                <div className="relative">
                    {isCopied && (
                        <div
                            className="absolute -top-12 left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-sm font-semibold rounded-md shadow-lg whitespace-nowrap"
                            role="status"
                        >
                            <CheckIcon className="w-4 h-4 inline mr-1.5" />
                            {content.linkCopied}
                        </div>
                    )}
                    <button
                        onClick={handleShare}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-6 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        aria-label={content.shareThisPage}
                    >
                        <ShareIcon className="w-5 h-5" />
                        {content.shareThisPage}
                    </button>

                    <div className="rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 mb-6 overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5653.808616159176!2d19.510752399999998!3d42.06706079999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134e015fefc8c72b%3A0xe4a0f26f8468e1d3!2sNOVARIC%C2%AE%20Sh.A.!5e1!3m2!1sen!2s!4v1760540637069!5m2!1sen!2s"
                            className="w-full h-96"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={content.mapTitle}
                        ></iframe>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold mb-2">{content.contactUs}</h3>
                            <div className="space-y-2">
                                <p className="flex items-center"><PhoneIcon className="w-5 h-5 mr-3 text-primary-500"/>+355 (0) 222 55 999</p>
                                <p className="flex items-center"><PhoneIcon className="w-5 h-5 mr-3 text-primary-500"/>+355 (0) 6920 51475</p>
                                <p className="flex items-center"><EnvelopeIcon className="w-5 h-5 mr-3 text-primary-500"/><a href="mailto:contact@media.novaric.al" className="hover:underline break-all">contact@media.novaric.al</a></p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2 flex items-center"><MapPinIcon className="w-5 h-5 mr-3 text-primary-500"/>{content.location}</h3>
                            <p>NOVARIC Building, Nd. 2 H. 6, Rruga Studenti, Shkoder, Shkoder 4001 Albania</p>
                        </div>
                         <div>
                            <h3 className="text-xl font-bold mb-2">{content.hours}</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                <span>{content.monday}</span> <span className="font-mono">09:00 - 17:00</span>
                                <span>{content.tuesday}</span> <span className="font-mono">09:00 - 17:00</span>
                                <span>{content.wednesday}</span> <span className="font-mono">09:00 - 17:00</span>
                                <span>{content.thursday}</span> <span className="font-mono">09:00 - 17:00</span>
                                <span>{content.friday}</span> <span className="font-mono">09:00 - 17:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </div>
    </main>
  );
};
