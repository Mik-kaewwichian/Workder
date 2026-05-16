'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Crown,
  Gem,
  Globe2,
  LayoutGrid,
  MessageSquareQuote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
  Heart,
  Gift,
  Building2,
  User,
  BriefcaseBusiness,
  MapPin,
  X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import EmployerDashboard from '../features/employer/components/Dashboard';
import { getAuthSession, type AuthSession } from '../features/auth/lib/auth';

export default function Home() {
  const router = useRouter();
  const [currentPromo, setCurrentPromo] = useState(0);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobTickerItem | null>(null);
  const [reviewTab, setReviewTab] = useState<'employer' | 'worker'>('worker');
  const promoContainerRef = useRef<HTMLDivElement>(null);

  type JobTickerItem = {
    title: string;
    budget: string;
    tag: string;
    details: string;
    responsibilities: string[];
    benefits: string[];
  };

  const heroHighlights = [
    {
      title: 'โค้ดโปรใหม่: WELCOME50',
      description: 'รับส่วนลดค่าธรรมเนียม 50% สำหรับงานแรกของคุณ',
      cta: 'ใช้โปรตอนนี้',
      href: '/work',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      title: 'เริ่มงานไวกว่าเดิม',
      description: 'กรอกข้อมูลโปรไฟล์ให้ครบ เพื่อปลดล็อกงานที่ตรงทักษะมากขึ้น',
      cta: 'ไปที่ MyJob',
      href: '/dashboard',
      color: 'from-indigo-600 to-blue-500',
    },
    {
      title: 'สมัคร Safezone วันนี้',
      description: 'ยืนยันตัวตน เพิ่มความน่าเชื่อถือ และรับงานคุณภาพสูง',
      cta: 'ดู Safezone',
      href: '/safezone',
      color: 'from-pink-600 to-rose-500',
    },
    {
      title: 'อัปเกรดเป็น Premium',
      description: 'เห็นงานก่อนใคร พร้อมสิทธิประโยชน์พิเศษสำหรับสมาชิก',
      cta: 'ดูแพ็กเกจ Premium',
      href: '/premium',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  useEffect(() => {
    setSession(getAuthSession());
  }, []);

  // Admin Redirect Logic
  useEffect(() => {
    if ((session?.role as string) === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [session, router]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroHighlights.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [session, heroHighlights.length]);

  const jobTicker: JobTickerItem[] = [
    {
      title: 'Senior React Developer',
      budget: '฿80k - 120k',
      tag: 'งานด่วน',
      details: 'พัฒนาเว็บแอปขนาดใหญ่ด้วย React/Next.js ร่วมกับทีม Product และ Backend แบบ Agile',
      responsibilities: ['พัฒนา UI ที่รองรับผู้ใช้จำนวนมาก', 'เชื่อมต่อ API และจัดการ state', 'รีวิวโค้ดและช่วยวางมาตรฐานทีม'],
      benefits: ['ทำงาน Hybrid', 'งบอุปกรณ์ 25,000 บาท', 'โบนัสตามผลงาน'],
    },
    {
      title: 'UX/UI Designer for App',
      budget: '฿45k - 60k',
      tag: 'ระยะไกล',
      details: 'ออกแบบประสบการณ์และหน้าจอแอปมือถือ ตั้งแต่ research, wireframe ถึง high-fidelity prototype',
      responsibilities: ['ทำ user flow และ prototype', 'ทดสอบ usability', 'ส่งมอบ design system ให้ทีม dev'],
      benefits: ['Remote 100%', 'เวลางานยืดหยุ่น', 'งบเรียนคอร์สเพิ่มเติม'],
    },
    {
      title: 'Takecare of the Children',
      budget: '฿80k - 120k',
      tag: 'Safezone',
      details: 'ดูแลเด็กช่วงหลังเลิกเรียนและวันหยุด เน้นความปลอดภัยและการเสริมพัฒนาการตามช่วงวัย',
      responsibilities: ['ดูแลกิจวัตรประจำวัน', 'พาเด็กทำกิจกรรมสร้างสรรค์', 'รายงานผู้ปกครองทุกวัน'],
      benefits: ['Safezone Verified', 'ประกันอุบัติเหตุ', 'ค่าล่วงเวลา'],
    },
    {
      title: 'Python Backend Engineer',
      budget: '฿70k - 100k',
      tag: 'งานประจำ',
      details: 'พัฒนา API และระบบประมวลผลข้อมูลด้วย Python (FastAPI) พร้อมดูแลประสิทธิภาพระบบ',
      responsibilities: ['ออกแบบ API และ database schema', 'เขียน test และ CI pipeline', 'ดูแล logging และ monitoring'],
      benefits: ['กองทุนสำรองเลี้ยงชีพ', 'ประกันสุขภาพกลุ่ม', 'โบนัสรายปี'],
    },
    {
      title: 'Digital Marketing Manager',
      budget: '฿50k - 80k',
      tag: 'Premium',
      details: 'วางกลยุทธ์การตลาดดิจิทัลครบช่องทางเพื่อเพิ่มยอดขายและ conversion ให้เติบโตอย่างต่อเนื่อง',
      responsibilities: ['วางแผนแคมเปญรายไตรมาส', 'บริหารงบโฆษณา', 'วิเคราะห์ผลและปรับกลยุทธ์'],
      benefits: ['ตำแหน่ง Priority', 'ค่าคอมมิชชั่นจากเป้าหมาย', 'สิทธิ์เข้าถึงลูกค้า Premium'],
    },
    {
      title: 'Elderly Care Assistant',
      budget: '฿40k - 60k',
      tag: 'Safezone',
      details: 'ดูแลผู้สูงอายุที่บ้าน ให้ความช่วยเหลือกิจวัตรประจำวันและสังเกตอาการสุขภาพเบื้องต้น',
      responsibilities: ['ช่วยจัดยาและอาหาร', 'ช่วยเคลื่อนไหวอย่างปลอดภัย', 'รายงานอาการให้ครอบครัว'],
      benefits: ['Safezone Verified', 'มีอบรมก่อนเริ่มงาน', 'ค่าพาหนะ'],
    },
    {
      title: '3D Artist for Game Asset',
      budget: '฿30k/project',
      tag: 'สัญญาจ้าง',
      details: 'สร้างโมเดล 3D และ texture สำหรับเกมแนวแฟนตาซี พร้อมจัดไฟล์สำหรับ Unity/Unreal',
      responsibilities: ['สร้าง character/props', 'ทำ optimize polycount', 'ส่งมอบไฟล์ตาม pipeline เกม'],
      benefits: ['จ่ายรายโปรเจกต์', 'ทำงานระยะสั้น', 'ขยายสัญญาได้ตามผลงาน'],
    },
    {
      title: 'Video Editor & Motion',
      budget: '฿25k - 40k',
      tag: 'งานด่วน',
      details: 'ตัดต่อวิดีโอและทำ motion graphic สำหรับสื่อโฆษณาออนไลน์ให้เสร็จตามกำหนดเวลา',
      responsibilities: ['ตัดต่อคลิป short-form', 'ทำ motion title', 'ปรับไฟล์ให้ตรง spec แต่ละแพลตฟอร์ม'],
      benefits: ['เริ่มงานได้ทันที', 'ค่าเร่งงานพิเศษ', 'รับงานต่อเนื่องทุกเดือน'],
    },
    {
      title: 'DevOps Engineer',
      budget: '฿90k - 140k',
      tag: 'ระยะไกล',
      details: 'ดูแลโครงสร้างพื้นฐาน cloud และ pipeline deployment เพื่อให้ระบบเสถียรและ scale ได้',
      responsibilities: ['สร้าง CI/CD', 'จัดการ Kubernetes และ observability', 'ดูแล security baseline'],
      benefits: ['Remote ต่างประเทศ', 'On-call allowance', 'งบสอบใบรับรอง Cloud'],
    },
    {
      title: 'Content Writer (SEO)',
      budget: '฿20k - 35k',
      tag: 'พาร์ทไทม์',
      details: 'เขียนบทความ SEO และคอนเทนต์เว็บไซต์ที่ตอบโจทย์แบรนด์และค้นหาเจอง่ายใน Google',
      responsibilities: ['วาง keyword plan', 'เขียนและรีไรต์บทความ', 'ติดตามอันดับและ CTR'],
      benefits: ['ทำงานพาร์ทไทม์', 'รับงานตามชิ้น', 'ทำงานจากที่ไหนก็ได้'],
    },
    {
      title: 'Personal Driver (VIP)',
      budget: '฿35k - 50k',
      tag: 'Safezone',
      details: 'ขับรถรับส่งผู้บริหารตามแผนงานรายวัน เน้นความสุภาพ ตรงเวลา และความปลอดภัยสูงสุด',
      responsibilities: ['ดูแลสภาพรถให้พร้อมใช้งาน', 'วางเส้นทางล่วงหน้า', 'รักษาความลับของผู้โดยสาร'],
      benefits: ['Safezone Verified', 'มี OT และค่าเดินทาง', 'วันหยุดชดเชย'],
    },
    {
      title: 'Full Stack Developer (Lead)',
      budget: '฿150k+',
      tag: 'Premium',
      details: 'นำทีมพัฒนาระบบ Full Stack ตั้งแต่การออกแบบสถาปัตยกรรมถึง deploy production',
      responsibilities: ['กำหนด technical roadmap', 'โค้ชทีม dev', 'ตัดสินใจด้าน architecture และ scalability'],
      benefits: ['ค่าตอบแทนระดับผู้เชี่ยวชาญ', 'หุ้นหรือ incentive เพิ่มเติม', 'สิทธิ์เข้าถึงโปรเจกต์ระดับองค์กร'],
    },
  ];

  const testimonials = {
    worker: [
      {
        name: "Sarah K.",
        role: "Freelance Designer",
        comment: "ระบบจับคู่งานแม่นยำมาก! ได้งานที่ตรงกับสกิลจริงๆ ไม่ต้องเสียเวลาหานาน แถมได้รับเงินตรงเวลา",
        rating: 5,
        image: "from-blue-100 to-cyan-100"
      },
      {
        name: "James T.",
        role: "Software Engineer",
        comment: "ชอบฟีเจอร์ Premium มาก ช่วยให้เข้าถึงงาน High-value ได้ก่อนใคร รายได้เพิ่มขึ้น 2 เท่า",
        rating: 5,
        image: "from-indigo-100 to-purple-100"
      },
      {
        name: "Pimchanok L.",
        role: "Content Creator",
        comment: "Safezone ช่วยให้มั่นใจเวลาทำงานกับลูกค้าใหม่ๆ ไม่โดนโกงแน่นอน แนะนำเลยค่ะ",
        rating: 4,
        image: "from-pink-100 to-rose-100"
      }
    ],
    employer: [
      {
        name: "Methee P.",
        role: "Project Manager",
        comment: "หาคนทำงานฝีมือดีได้ไวมาก ระบบคัดกรองช่วยประหยัดเวลาสัมภาษณ์ไปได้เยอะเลย",
        rating: 5,
        image: "from-amber-100 to-orange-100"
      },
      {
        name: "Jenny L.",
        role: "Startup Founder",
        comment: "ประทับใจระบบจ่ายเงินที่ปลอดภัย (Escrow) งานไม่เสร็จไม่ต้องจ่าย สบายใจทั้งสองฝ่าย",
        rating: 5,
        image: "from-emerald-100 to-green-100"
      },
      {
        name: "Somchai V.",
        role: "SME Owner",
        comment: "จ้างพนักงานพาร์ทไทม์ช่วงอีเวนท์ได้คนคุณภาพดี บริการรวดเร็ว ตอบโจทย์ธุรกิจมาครับ",
        rating: 4,
        image: "from-slate-100 to-gray-100"
      }
    ]
  };

  const promotions = [
    { title: "ลดค่าธรรมเนียม 50%", desc: "สำหรับลูกค้าใหม่เดือนนี้", color: "from-blue-500 to-cyan-500" },
    { title: "แนะนำเพื่อนรับ 500฿", desc: "ทั่งคนชวนและคนถูกชวน", color: "from-purple-500 to-pink-500" },
    { title: "คอร์สเรียนฟรี!", desc: "Upskill ทักษะดิจิทัล", color: "from-orange-400 to-red-500" },
    { title: "Package: Enterprise", desc: "ลดสูงสุด 30% รายปี", color: "from-slate-800 to-slate-900" },
    { title: "Flash Deal: Boost Post", desc: "โปรโมทงานเพียง 99฿", color: "from-yellow-400 to-amber-500" },
  ];

  const sponsors = [
    { title: "Cloud Services", sub: "ลดต้นทุน 50% สำหรับ Startup", color: "bg-gradient-to-r from-blue-500 to-cyan-500", icon: <Globe2 className="h-8 w-8 text-white/80" /> },
    { title: "Invest Future", sub: "ร่วมลงทุนในธุรกิจน่าจับตามอง", color: "bg-gradient-to-r from-purple-500 to-pink-500", icon: <TrendingUp className="h-8 w-8 text-white/80" /> },
    { title: "Secure Pay", sub: "ระบบชำระเงินที่ปลอดภัยที่สุด", color: "bg-gradient-to-r from-green-400 to-emerald-600", icon: <ShieldCheck className="h-8 w-8 text-white/80" /> },
    { title: "Global Talent", sub: "หาคนเก่งจากทั่วโลก", color: "bg-gradient-to-r from-orange-400 to-red-500", icon: <Globe2 className="h-8 w-8 text-white/80" /> },
    { title: "Tech Accelerator", sub: "โครงการบ่มเพาะธุรกิจ", color: "bg-gradient-to-r from-pink-500 to-rose-600", icon: <Zap className="h-8 w-8 text-white/80" /> },
    { title: "AI Solutions", sub: "ยกระดับธุรกิจด้วย AI", color: "bg-gradient-to-r from-indigo-500 to-violet-600", icon: <Sparkles className="h-8 w-8 text-white/80" /> },
    { title: "Green Energy", sub: "พลังงานสะอาดเพื่ออนาคต", color: "bg-gradient-to-r from-teal-400 to-green-500", icon: <Zap className="h-8 w-8 text-white/80" /> },
    { title: "Space Tech", sub: "เทคโนโลยีอวกาศ", color: "bg-gradient-to-r from-slate-700 to-slate-900", icon: <Globe2 className="h-8 w-8 text-white/80" /> },
  ];

  // Auto-scroll logic for Promotions
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotions.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promotions.length]);

  // Effect to trigger scroll when currentPromo changes
  useEffect(() => {
    if (promoContainerRef.current) {
      const cardWidth = window.innerWidth < 768 ? 320 : 512;
      const gap = 24;
      const scrollPosition = currentPromo * (cardWidth + gap);

      promoContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentPromo]);

  const scrollToPromo = (index: number) => {
    setCurrentPromo(index);
  };

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'งานด่วน': return 'bg-red-100 text-red-600 border-red-200';
      case 'พาร์ไทม์': return 'bg-green-100 text-green-600 border-green-200';
      case 'งานประจำ': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Safezone': return 'bg-pink-50 text-pink-600 border-pink-200 ring-1 ring-pink-300 shadow-sm shadow-pink-100';
      case 'Premium': return 'bg-gradient-to-r from-amber-200 to-yellow-400 text-slate-900 border-yellow-500 shadow-lg shadow-yellow-500/20 font-bold';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getJobIcon = (tag: string) => {
    if (tag === 'Premium') return <Gem className="h-5 w-5 animate-pulse text-yellow-600" />;
    if (tag === 'Safezone') return <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />;
    return <Briefcase className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />;
  };

  const getJobIconBg = (tag: string) => {
    if (tag === 'Premium') return 'bg-yellow-100';
    if (tag === 'Safezone') return 'bg-pink-100';
    return 'bg-blue-50 group-hover:bg-blue-600 transition-colors';
  };

  if ((session?.role as string) === 'admin') {
    return null;
  }

  if (session?.role === 'employer') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
        <Navbar />
        <div className="pt-2 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
          <EmployerDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white overflow-hidden">

      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-white"></div>
      <div className="fixed top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[100px] animate-pulse"></div>
      <div className="fixed bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-[100px] animate-pulse delay-1000"></div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-10 pb-10 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-sm font-medium text-blue-700 backdrop-blur-md mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Future of Work Platform {new Date().getFullYear()}
          </div>

          <h1 className="mx-auto max-w-5xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl leading-tight">
            งานที่ใช่ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-300% animate-gradient">ในพริบตา</span> <br />
            รายได้ไร้ขีดจำกัด
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-600 leading-relaxed">
            สัมผัสประสบการณ์การหางานและจ้างงานรูปแบบใหม่ ด้วยระบบ AI Matching อัจฉริยะ
            ที่เชื่อมต่อคุณกับโอกาสที่ดีที่สุดทั่วโลก ภายในเสี้ยววินาที
          </p>

          {session ? (
            <div className="mx-auto mt-8 max-w-6xl">
              <p className="text-sm md:text-base font-semibold text-slate-700 mb-4">
                ยินดีต้อนรับกลับมา <span className="text-blue-700">{session.userId}</span> 🎉
              </p>

              <div className="relative rounded-3xl overflow-hidden border border-white/60 shadow-xl bg-white/70 backdrop-blur-sm">
                <div
                  className="flex h-[220px] md:h-[240px] transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${currentHeroSlide * 100}%)` }}
                >
                  {heroHighlights.map((slide) => (
                    <Link
                      key={slide.title}
                      href={slide.href}
                      className={`min-w-full h-full bg-gradient-to-r ${slide.color} p-6 md:p-8 text-white text-left flex flex-col justify-center`}
                    >
                      <p className="text-xs uppercase tracking-wide text-white/80">แนะนำสำหรับคุณ</p>
                      <h3 className="text-xl md:text-2xl font-bold mt-1">{slide.title}</h3>
                      <p className="text-sm md:text-base text-white/90 mt-2">{slide.description}</p>
                      <span className="inline-flex items-center gap-2 mt-4 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
                        {slide.cta}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
                  {heroHighlights.map((slide, index) => (
                    <button
                      key={`${slide.title}-dot`}
                      type="button"
                      onClick={() => setCurrentHeroSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${currentHeroSlide === index ? 'w-8 bg-white' : 'w-2.5 bg-white/60 hover:bg-white/80'}`}
                      aria-label={`slide-${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mx-auto mt-12 max-w-3xl relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 opacity-30 blur-lg transition duration-500 group-hover:opacity-60"></div>
            <div className="relative flex items-center rounded-full bg-white/90 p-2 shadow-xl ring-1 ring-slate-900/5 backdrop-blur-xl">
              <div className="flex-1 flex items-center gap-3 pl-6">
                <Search className="h-6 w-6 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาตำแหน่ง, ทักษะ หรือบริษัทในฝัน..."
                  className="w-full bg-transparent py-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <button className="hidden sm:flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:scale-105">
                <Search className="h-5 w-5" />
                ค้นหา
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-scrolling Job Ticker */}
      <section id="jobs" className="py-12 overflow-hidden border-y border-white/50 bg-white/30 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            งานที่แนะนำ
          </h2>
          <Link href="/work" className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1">
            ดูงานทั้งหมด <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="flex w-full">
          <div className="flex min-w-full shrink-0 gap-8 animate-marquee pause-on-hover py-4 pl-4">
            {[...jobTicker, ...jobTicker].map((job, i) => (
              <div
                key={i}
                onClick={() => {
                  if (!session) {
                    router.push('/login');
                    return;
                  }
                  setSelectedJob(job);
                }}
                className={`flex-shrink-0 w-80 rounded-2xl bg-white p-5 shadow-lg border transition-all group hover:-translate-y-1 ${session ? 'cursor-pointer' : 'cursor-not-allowed opacity-90'} ${job.tag === 'Premium' ? 'border-yellow-400 shadow-yellow-200' : job.tag === 'Safezone' ? 'border-pink-300 shadow-pink-100' : 'border-slate-100 hover:border-blue-300 shadow-blue-100/50'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`rounded-lg p-2 ${getJobIconBg(job.tag)}`}>
                    {getJobIcon(job.tag)}
                  </div>
                  {job.tag === 'Premium' ? (
                    <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      <Gem className="h-3 w-3" /> อัปเกรด
                    </div>
                  ) : job.tag === 'Safezone' ? (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${getTagStyle(job.tag)}`}>
                      <Heart className="h-3 w-3 fill-pink-600" /> {job.tag}
                    </div>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTagStyle(job.tag)}`}>
                      {job.tag}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 truncate">{job.title}</h4>
                <p className="text-sm text-slate-500 mt-1">{job.budget}</p>
                <p className="text-xs text-blue-600 mt-2 font-semibold">คลิกเพื่อดูรายละเอียดงาน</p>
                {job.tag === 'Premium' && <p className="text-xs text-amber-500 mt-2 font-medium flex items-center gap-1"><Star className="h-3 w-3 fill-amber-500" /> Premium Member</p>}
                {job.tag === 'Safezone' && <p className="text-xs text-pink-600 mt-2 font-medium flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Verified Safe</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors/Ads */}
      <section className="py-12 bg-white/30 border-b border-white/50">
        <div className="flex overflow-x-auto pb-6 px-6 gap-6 justify-start scrollbar-hide">
          {sponsors.map((sponsor, i) => (
            <div key={i} className={`shrink-0 w-72 h-40 rounded-xl ${sponsor.color} relative overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105 group`}>
              <div className="absolute top-[-20%] right-[-20%] rounded-full w-32 h-32 bg-white/20 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10 h-full flex flex-col justify-end p-5 text-white">
                <div className="mb-auto opacity-80 bg-white/20 w-fit p-2 rounded-lg backdrop-blur-sm">
                  {sponsor.icon}
                </div>
                <h3 className="font-bold text-lg leading-tight">{sponsor.title}</h3>
                <p className="text-xs text-white/90 mt-1">{sponsor.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotions Carousel */}
      <section className="py-10 bg-white/50 backdrop-blur-sm overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">โปรโมชั่นร้อนแรง</h2>
          </div>
          <div className="flex gap-2">
            {promotions.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToPromo(i)}
                className={`h-2 rounded-full transition-all ${currentPromo === i ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-blue-300'}`}
              />
            ))}
          </div>
        </div>
        <div
          ref={promoContainerRef}
          className="flex overflow-x-auto pb-8 px-6 gap-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {promotions.map((promo, i) => (
            <div key={i} className={`shrink-0 w-80 md:w-[32rem] rounded-2xl p-8 bg-gradient-to-br ${promo.color} text-white shadow-lg snap-center hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden group`}>
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[200px]">
                <div>
                  <h3 className="text-3xl font-bold mb-3">{promo.title}</h3>
                  <p className="text-white/90 text-lg">{promo.desc}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <button className="rounded-full bg-white/20 px-6 py-3 text-base font-semibold backdrop-blur-sm hover:bg-white/30 transition-colors">
                    รับสิทธิ์ทันที
                  </button>
                  <ArrowRight className="h-6 w-6 text-white/80 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Safezone & Premium Container */}
      <div className="space-y-4 py-8">
        {/* Safezone Registration CTA */}
        <section id="safezone" className="px-6">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
              <Heart className="h-64 w-64 text-pink-600 fill-pink-600" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-600 mb-4">
                  <ShieldCheck className="h-4 w-4" /> Safezone Verified
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-pink-900 mb-2">สมัครเป็นพาร์ทเนอร์ Safezone</h2>
                <p className="text-pink-700 max-w-xl text-base">
                  สร้างความมั่นใจให้ผู้ว่าจ้าง ด้วยตราสัญลักษณ์ Safezone พร้อมสิทธิพิเศษในการเข้าถึงงานระดับ VIP
                  และระบบดูแลความปลอดภัยตลอด 24 ชม.
                </p>
              </div>
              <button onClick={() => window.location.href = '/safezone/register'} className="shrink-0 rounded-full bg-pink-600 px-8 py-3 text-white font-bold shadow-lg shadow-pink-300 hover:bg-pink-700 hover:-translate-y-1 transition-all">
                สมัคร Safezone เลย
              </button>
            </div>
          </div>
        </section>

        {/* Premium Access Section */}
        <section id="premium" className="px-6">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] overflow-hidden relative shadow-xl shadow-blue-900/10 bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-8 md:p-10"></div>
            <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 pointer-events-none">
              <Crown className="h-64 w-64 text-amber-500 fill-amber-500" />
            </div>
            <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 mb-4 border border-amber-500/20 shadow-sm shadow-amber-900/50">
                  <Crown className="h-4 w-4" /> Premium Member
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  อัปเกรดเป็น <span className="text-amber-400">PREMIUM MEMBER</span>
                </h2>
                <p className="text-slate-300 max-w-xl text-base">
                  เข้าถึงงาน Exclusive และทีมซัพพอร์ตส่วนตัว 24/7 พร้อมสิทธิประโยชน์มากมายสำหรับสมาชิกระดับพรีเมียม
                </p>
              </div>
              <button onClick={() => window.location.href = '/premium'} className="shrink-0 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-8 py-3 text-base font-bold text-slate-900 shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform flex items-center gap-2">
                อัปเกรดทันที <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        <section id="Map" className="px-6">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-8 md:p-10 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute top-[35%] w-full h-4 bg-blue-200/50 transform -rotate-1"></div>
              <div className="absolute top-[65%] w-full h-3 bg-blue-200/50 transform rotate-1"></div>
              <div className="absolute left-[30%] h-full w-4 bg-blue-200/50 transform rotate-6"></div>
              <div className="absolute left-[70%] h-full w-3 bg-blue-200/50 transform -rotate-3"></div>
              <div className="absolute top-[20%] left-[20%] text-pink-500 animate-bounce" style={{ animationDuration: '2s' }}>
                <MapPin className="h-8 w-8 fill-current drop-shadow-sm" />
              </div>
              <div className="absolute top-[60%] left-[50%] text-blue-500 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                <MapPin className="h-6 w-6 fill-current drop-shadow-sm" />
              </div>
              <div className="absolute top-[30%] right-[20%] text-amber-500 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}>
                <MapPin className="h-10 w-10 fill-current drop-shadow-sm" />
              </div>
              <div className="absolute bottom-[20%] left-[10%] text-green-500 animate-bounce" style={{ animationDuration: '2.2s', animationDelay: '0.2s' }}>
                <MapPin className="h-5 w-5 fill-current drop-shadow-sm" />
              </div>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-600 mb-4 shadow-sm">
                  <MapPin className="h-4 w-4" /> แผนที่งาน
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">ค้นหางานใกล้บ้านคุณ</h2>
                <p className="text-blue-700 max-w-xl text-base">
                  สำรวจโอกาสงานที่อยู่รอบตัวคุณ ด้วยแผนที่แบบเรียลไทม์
                  ดูพิกัดงานและประเภทงานได้ทันที
                </p>
              </div>
              <button onClick={() => window.location.href = '/map'} className="shrink-0 rounded-full bg-blue-600 px-8 py-3 text-white font-bold shadow-lg shadow-blue-300 hover:bg-blue-700 hover:-translate-y-1 transition-all z-20">
                ดูแผนที่งาน
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Dual-Sided Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900">เสียงตอบรับจากผู้ใช้งานจริง</h2>
            <p className="mt-4 text-slate-600">มากกว่า 100,000+ คนที่ไว้วางใจให้เราดูแลเส้นทางอาชีพ</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-slate-100 p-1 rounded-full flex relative">
              <div className={`absolute top-1 bottom-1 w-[50%] bg-white rounded-full shadow-sm transition-all duration-300 ease-spring ${reviewTab === 'employer' ? 'translate-x-full' : 'translate-x-0'}`}></div>
              <button
                onClick={() => setReviewTab('worker')}
                className={`relative z-10 px-8 py-3 rounded-full text-base font-bold transition-colors ${reviewTab === 'worker' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  ฝั่งคนทำงาน
                </div>
              </button>
              <button
                onClick={() => setReviewTab('employer')}
                className={`relative z-10 px-8 py-3 rounded-full text-base font-bold transition-colors ${reviewTab === 'employer' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness className="h-5 w-5" />
                  ฝั่งผู้ว่าจ้าง
                </div>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials[reviewTab].map((testi, i) => (
              <div key={i} className="rounded-3xl bg-slate-50 p-8 border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-2 group cursor-pointer">
                <div className="flex gap-1 mb-4">
                  {[...Array(testi.rating)].map((_, r) => (
                    <Star key={r} className={`h-5 w-5 fill-current ${reviewTab === 'worker' ? 'text-blue-400' : 'text-amber-400'}`} />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic leading-relaxed min-h-[4.5rem]">"{testi.comment}"</p>
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${testi.image} flex items-center justify-center font-bold text-xl text-slate-700 shadow-inner`}>
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{testi.name}</h4>
                    <p className={`text-sm font-medium ${reviewTab === 'worker' ? 'text-blue-500' : 'text-amber-600'}`}>{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedJob ? (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setSelectedJob(null)}>
          <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-100 shadow-2xl p-6 md:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-blue-600">รายละเอียดงาน</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{selectedJob.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedJob.budget} • {selectedJob.tag}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 transition-colors"
                aria-label="close-job-detail"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-5 text-slate-700 leading-relaxed">{selectedJob.details}</p>

            <div className="mt-6 grid md:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-2">หน้าที่รับผิดชอบ</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  {selectedJob.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                <h4 className="text-sm font-bold text-blue-900 mb-2">สิทธิประโยชน์</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  {selectedJob.benefits.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {!session?.profileCompleted ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-800">ยังไม่ได้กรอกข้อมูลส่วนตัว</p>
                <p className="text-sm text-amber-700 mt-1">กรอกข้อมูลส่วนตัวหรือลงทะเบียนก่อน เพื่อเริ่มสมัครงานได้</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJob(null);
                      router.push('/dashboard');
                    }}
                    className="rounded-full border border-amber-300 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                  >
                    กรอกข้อมูลส่วนตัว
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJob(null);
                      router.push('/profile/register');
                    }}
                    className="rounded-full border border-amber-300 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                  >
                    ลงทะเบียน
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!session?.profileCompleted) {
                    return;
                  }
                  setSelectedJob(null);
                  router.push('/dashboard');
                }}
                disabled={!session?.profileCompleted}
                className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                สมัครงานนี้
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Footer Minimal */}
      <footer id="about" className="py-8 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} WORKDER Platform. Designed for the Future.</p>
      </footer>
    </div>
  );
}

