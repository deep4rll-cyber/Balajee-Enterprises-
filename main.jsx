import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Menu, X, Volume2, Languages, UserRound, ArrowUpRight, ChevronDown,
  MessageCircle, Package, Truck, ShieldCheck, Calculator, Newspaper,
  Search, SlidersHorizontal, CircleHelp, CheckCircle2, Clock3, MapPin,
  Phone, Mail, Instagram, Facebook, Youtube, Hammer, Building2, Sparkles,
  ChartNoAxesCombined, Settings, LogOut, LockKeyhole, Plus, Pencil, Trash2,
  ExternalLink, Wheat, Ruler, Weight, Droplets, Blocks, Headphones, PlayCircle
} from "lucide-react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, firebaseConfigured } from "./firebase";
import "./styles.css";

const translations = {
  hi: {
    home:"होम", products:"उत्पाद", calculator:"मटेरियल कैलकुलेटर", compare:"ब्रांड तुलना",
    news:"निर्माण अपडेट", about:"हमारे बारे में", contact:"संपर्क",
    portal:"मिस्त्री / ग्राहक लॉगिन", listen:"सुनें", heroEyebrow:"कोडरमा • बरकट्ठा • झारखंड",
    heroTitle:"मजबूत नींव, भरोसेमंद सामग्री।", heroText:"सीमेंट, सरिया और निर्माण सामग्री — सही सलाह, भरोसेमंद सप्लाई और आपकी साइट की जरूरत के मुताबिक।",
    explore:"उत्पाद देखें", quote:"रेट पूछें", promise:"आपकी साइट के लिए भरोसेमंद साथी",
    ready:"रेडी स्टॉक", quality:"गुणवत्ता पर ध्यान", local:"स्थानीय सप्लाई",
    catalogTitle:"हर निर्माण के लिए सही सामग्री", catalogSub:"ज़रूरत चुनें, उपलब्धता पूछें और अपनी साइट के लिए कोटेशन लें।",
    all:"सभी", cement:"सीमेंट", steel:"सरिया", hardware:"हार्डवेयर", chemicals:"वॉटरप्रूफिंग",
    ask:"कोटेशन लें", stock:"उपलब्धता पूछें", stockReady:"रेडी स्टॉक", order:"ऑर्डर पर",
    calculatorTitle:"साइट का शुरुआती मटेरियल अनुमान", calculatorSub:"प्लॉट एरिया और काम के प्रकार के आधार पर अनुमान देखें। अंतिम मात्रा इंजीनियर से कन्फर्म करें।",
    area:"क्षेत्रफल (वर्ग फुट)", work:"काम का प्रकार", slab:"RCC स्लैब", room:"कमरा / फ्लोर", plaster:"प्लास्टर", foundation:"नींव",
    calculate:"अनुमान निकालें", estimate:"अनुमानित मात्रा", bags:"सीमेंट बैग", steelKg:"सरिया (लगभग kg)", sand:"बालू (लगभग घन फुट)", aggregate:"गिट्टी (लगभग घन फुट)",
    compareTitle:"सीमेंट चुनने में सही जानकारी", compareSub:"तकनीकी गुण सीमेंट के प्रकार, ग्रेड और निर्माता की डेटा शीट के अनुसार बदलते हैं।",
    brand:"ब्रांड", type:"उपलब्धता / प्रकार", use:"उपयोग के लिए सलाह", spec:"तकनीकी जानकारी",
    newsTitle:"निर्माण जगत के अपडेट", newsSub:"साइट पर काम आने वाली जानकारी और उपयोगी गाइड।",
    read:"लेख सुनें", learn:"और जानें", aboutTitle:"सिर्फ सामग्री नहीं, भरोसा भी", aboutText:"Balajee Enterprises में हमारा लक्ष्य है कि घर बनाने वाले परिवारों, मिस्त्रियों और ठेकेदारों को सही सामग्री चुनने और समय पर सप्लाई पाने में मदद मिले।",
    contactTitle:"अपनी साइट की जरूरत बताइए", contactSub:"रेट, उपलब्धता या डिलीवरी के बारे में बात करें।", name:"आपका नाम", mobile:"मोबाइल नंबर", need:"आपको क्या चाहिए?", send:"WhatsApp पर पूछें",
    footerLine:"Building Futures With Quality Materials", quick:"क्विक लिंक", disclaimer:"दिखाई गई उत्पाद सूची उदाहरण के लिए है। वास्तविक रेट और स्टॉक की पुष्टि फोन/WhatsApp पर करें।",
    admin:"एडमिन", loginTitle:"डीलरशिप एडमिन लॉगिन", email:"ईमेल", password:"पासवर्ड", login:"लॉगिन करें", dashboard:"डैशबोर्ड", logout:"लॉगआउट",
    adminNotice:"Firebase सेटअप करने के बाद एडमिन लॉगिन उपलब्ध होगा।", adminIntro:"उत्पाद और समाचार मैनेजमेंट", demo:"डेमो मोड", search:"उत्पाद खोजें…",
    noResults:"कोई उत्पाद नहीं मिला।", leadTitle:"त्वरित पूछताछ", close:"बंद करें", tutorials:"वीडियो गाइड", delivery:"डिलीवरी सहायता", support:"साइट की जरूरत के अनुसार सलाह"
  },
  en: {
    home:"Home", products:"Products", calculator:"Material calculator", compare:"Brand comparison",
    news:"Construction updates", about:"About us", contact:"Contact",
    portal:"Mason / Customer Login", listen:"Listen", heroEyebrow:"Koderma • Barkattha • Jharkhand",
    heroTitle:"Stronger foundations. Trusted materials.", heroText:"Cement, TMT steel and construction essentials—with practical guidance, dependable supply and support for your site.",
    explore:"Explore products", quote:"Ask for rates", promise:"A reliable partner for your project",
    ready:"Ready stock", quality:"Quality focused", local:"Local supply",
    catalogTitle:"The right materials for every build", catalogSub:"Choose what you need, check availability and request a quote for your site.",
    all:"All", cement:"Cement", steel:"TMT steel", hardware:"Hardware", chemicals:"Waterproofing",
    ask:"Request quote", stock:"Check availability", stockReady:"Ready stock", order:"Order based",
    calculatorTitle:"A starting estimate for your site", calculatorSub:"Estimate quantities by area and work type. Confirm final quantities with your engineer.",
    area:"Area (sq ft)", work:"Type of work", slab:"RCC slab", room:"Room / floor", plaster:"Plaster", foundation:"Foundation",
    calculate:"Calculate estimate", estimate:"Estimated quantities", bags:"Cement bags", steelKg:"TMT steel (approx kg)", sand:"Sand (approx cu ft)", aggregate:"Aggregate (approx cu ft)",
    compareTitle:"Choose cement with better information", compareSub:"Technical properties vary by cement type, grade and manufacturer data sheet.",
    brand:"Brand", type:"Supply / type", use:"Typical guidance", spec:"Technical notes",
    newsTitle:"Construction updates", newsSub:"Useful information and practical guides for your site.",
    read:"Listen to article", learn:"Learn more", aboutTitle:"More than materials. A relationship built on trust.", aboutText:"Balajee Enterprises aims to help homeowners, masons and contractors choose suitable materials and coordinate supply for their projects.",
    contactTitle:"Tell us what your site needs", contactSub:"Ask about rates, availability or delivery.", name:"Your name", mobile:"Mobile number", need:"What do you need?", send:"Enquire on WhatsApp",
    footerLine:"Building Futures With Quality Materials", quick:"Quick links", disclaimer:"Products shown are examples. Confirm current rates and stock by phone or WhatsApp.",
    admin:"Admin", loginTitle:"Dealership admin login", email:"Email", password:"Password", login:"Sign in", dashboard:"Dashboard", logout:"Sign out",
    adminNotice:"Admin login becomes available after Firebase setup.", adminIntro:"Manage products and news", demo:"Demo mode", search:"Search products…",
    noResults:"No products found.", leadTitle:"Quick enquiry", close:"Close", tutorials:"Video guides", delivery:"Delivery support", support:"Guidance for your site needs"
  }
};

const sampleProducts = [
  { id:"ut", name:"UltraTech Cement", category:"cement", tier:1, availability:"ready", descriptionHi:"मजबूती और भरोसे के लिए लोकप्रिय सीमेंट विकल्प।", descriptionEn:"A widely used cement option for general construction.", tags:["सामान्य निर्माण","ग्रेड की पुष्टि करें"], tagsEn:["General construction","Confirm grade"], icon:"cement" },
  { id:"acc", name:"ACC Cement", category:"cement", tier:1, availability:"ready", descriptionHi:"घर निर्माण और RCC काम के लिए उपलब्धता पूछें।", descriptionEn:"Ask about availability for home building and RCC work.", tags:["RCC उपयोग","डेटा शीट देखें"], tagsEn:["RCC use","Check data sheet"], icon:"cement" },
  { id:"dalmia", name:"Dalmia Cement", category:"cement", tier:1, availability:"ready", descriptionHi:"आपके काम के अनुसार सही सीमेंट प्रकार चुनें।", descriptionEn:"Choose the cement type that matches your project.", tags:["काम के अनुसार","तकनीकी सलाह"], tagsEn:["Use-specific","Technical guidance"], icon:"cement" },
  { id:"tmt", name:"Primary TMT Bars", category:"steel", tier:1, availability:"ready", descriptionHi:"8mm से 16mm तक — ग्रेड और लंबाई की पुष्टि करें।", descriptionEn:"8mm to 16mm sizes—confirm grade and length.", tags:["8–16 mm","ग्रेड सत्यापित करें"], tagsEn:["8–16 mm","Verify grade"], icon:"steel" },
  { id:"jk", name:"JK Lakshmi Cement", category:"cement", tier:2, availability:"order", descriptionHi:"डिपो डिस्पैच और उपलब्धता ऑर्डर पर।", descriptionEn:"Depot dispatch and availability on order.", tags:["ऑर्डर पर","फ्रेश सप्लाई पूछें"], tagsEn:["Order based","Ask for fresh supply"], icon:"cement" },
  { id:"nuvoco", name:"Nuvoco Cement", category:"cement", tier:2, availability:"order", descriptionHi:"आपकी साइट और काम के अनुसार सप्लाई विकल्प।", descriptionEn:"Supply options according to site and project needs.", tags:["ऑर्डर पर","उपलब्धता पूछें"], tagsEn:["Order based","Check availability"], icon:"cement" },
  { id:"bangur", name:"Bangur Cement", category:"cement", tier:2, availability:"order", descriptionHi:"वर्तमान स्टॉक और डिलीवरी समय पूछें।", descriptionEn:"Ask about current stock and delivery timelines.", tags:["ऑर्डर पर","रेट की पुष्टि करें"], tagsEn:["Order based","Confirm price"], icon:"cement" },
  { id:"birla", name:"MP Birla Cement", category:"cement", tier:2, availability:"order", descriptionHi:"डिपो उपलब्धता के अनुसार ऑर्डर सप्लाई।", descriptionEn:"Order supply subject to depot availability.", tags:["ऑर्डर पर","डिपो डिस्पैच"], tagsEn:["Order based","Depot dispatch"], icon:"cement" },
  { id:"vibrator", name:"25mm Pencil Vibrator Needle", category:"hardware", tier:3, availability:"order", descriptionHi:"कंक्रीट कम्पैक्शन के लिए सही मशीन के साथ इस्तेमाल करें।", descriptionEn:"For concrete compaction; use with a compatible vibrator unit.", tags:["25 mm","उचित उपयोग जरूरी"], tagsEn:["25 mm","Use correctly"], icon:"hardware" },
  { id:"waterproof", name:"Waterproofing Solutions", category:"chemicals", tier:3, availability:"order", descriptionHi:"Sika/Fosroc जैसे ब्रांड के विकल्प और सही उपयोग पूछें।", descriptionEn:"Ask about options from brands such as Sika/Fosroc and their correct use.", tags:["वॉटरप्रूफिंग","निर्माता निर्देश पढ़ें"], tagsEn:["Waterproofing","Follow manufacturer instructions"], icon:"chemical" },
  { id:"wire", name:"Binding Wire", category:"hardware", tier:3, availability:"ready", descriptionHi:"सरिया बांधने के लिए निर्माण साइट की जरूरी सामग्री।", descriptionEn:"An essential site item for tying reinforcement bars.", tags:["साइट एसेंशियल","स्टॉक पूछें"], tagsEn:["Site essential","Check stock"], icon:"hardware" },
  { id:"cover", name:"Concrete Cover Blocks", category:"hardware", tier:3, availability:"ready", descriptionHi:"डिजाइन के अनुसार कंक्रीट कवर बनाए रखने के लिए।", descriptionEn:"Helps maintain concrete cover as specified in the design.", tags:["कवर बनाए रखें","सही साइज चुनें"], tagsEn:["Maintain cover","Choose correct size"], icon:"hardware" }
];

const sampleNews = [
  { categoryHi:"साइट गाइड", categoryEn:"Site guide", titleHi:"RCC ढलाई से पहले की 5 जरूरी जांच", titleEn:"5 checks before an RCC pour", summaryHi:"शटरिंग, सरिया कवर, वाइब्रेटर, कंक्रीट की स्वीकृति और क्योरिंग की तैयारी पहले जांचें।", summaryEn:"Check formwork, reinforcement cover, vibrator readiness, concrete acceptance and curing preparation.", icon:"check" },
  { categoryHi:"मानसून तैयारी", categoryEn:"Monsoon readiness", titleHi:"बारिश के मौसम में निर्माण सामग्री कैसे रखें", titleEn:"How to store materials during monsoon", summaryHi:"सीमेंट को सूखी, ऊंची जगह पर रखें; पैकेट जमीन और दीवार से दूर रखें और पहले आया स्टॉक पहले उपयोग करें।", summaryEn:"Store cement in a dry raised area, away from floors and walls, and use older stock first.", icon:"cloud" },
  { categoryHi:"तकनीकी जानकारी", categoryEn:"Technical basics", titleHi:"कंक्रीट में वाइब्रेटर का सही इस्तेमाल", titleEn:"Using a concrete vibrator correctly", summaryHi:"ओवर-वाइब्रेशन से बचें और उपकरण निर्माता व इंजीनियर की साइट प्रक्रिया का पालन करें।", summaryEn:"Avoid over-vibration and follow the equipment maker's guidance and site method statement.", icon:"tool" }
];

const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "";
const waLink = (message) => `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
const hasWhatsApp = Boolean(waNumber.trim());
const productMessage = (p, lang) => lang==="hi" ? `नमस्ते Balajee Enterprises, मुझे ${p.name} का रेट और उपलब्धता जाननी है।` : `Hello Balajee Enterprises, please share the price and availability of ${p.name}.`;

function speak(text, lang) {
  if (!("speechSynthesis" in window)) { alert(lang==="hi" ? "इस ब्राउज़र में ऑडियो सुविधा उपलब्ध नहीं है।" : "Speech playback is not supported in this browser."); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang==="hi" ? "hi-IN" : "en-IN";
  utterance.rate = 0.94;
  window.speechSynthesis.speak(utterance);
}
function LogoMark() {
  return <div className="logo-mark" aria-hidden="true"><span>BE</span><i className="laurel">✦</i></div>;
}
function App() {
  const [lang, setLang] = useState("hi");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("1000");
  const [work, setWork] = useState("slab");
  const [estimate, setEstimate] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [form, setForm] = useState({name:"", mobile:"", need:"सीमेंट और सरिया"});
  const [firebaseProducts, setFirebaseProducts] = useState([]);
  const [firebaseNews, setFirebaseNews] = useState([]);
  const [user, setUser] = useState(null);
  const [adminAllowed, setAdminAllowed] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [route, setRoute] = useState(window.location.pathname);
  const t = translations[lang];
  const isAdminRoute = route.startsWith("/admin");
  const products = firebaseProducts.length ? firebaseProducts : sampleProducts;
  const news = firebaseNews.length ? firebaseNews : sampleNews;

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    if (!firebaseConfigured) return;
    const unsub = onAuthStateChanged(auth, async (current) => {
      setUser(current);
      if (!current) { setAdminAllowed(false); return; }
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const snap = await getDoc(doc(db, "admins", current.uid));
        setAdminAllowed(snap.exists());
      } catch { setAdminAllowed(false); }
    });
    return unsub;
  }, []);
  useEffect(() => {
    if (!firebaseConfigured) return;
    (async () => {
      try {
        const [p, n] = await Promise.all([getDocs(collection(db,"products")), getDocs(collection(db,"news"))]);
        setFirebaseProducts(p.docs.map(d => ({id:d.id,...d.data()})));
        setFirebaseNews(n.docs.map(d => ({id:d.id,...d.data()})));
      } catch (e) { console.warn("Firebase catalog not loaded:", e.message); }
    })();
  }, []);
  const filteredProducts = useMemo(() => products.filter(p => {
    const c = category==="all" || p.category===category;
    const text = `${p.name} ${p.descriptionHi||""} ${p.descriptionEn||""}`.toLowerCase();
    return c && text.includes(query.toLowerCase());
  }), [products, category, query]);
  function navigate(path) {
    history.pushState({}, "", path);
    setRoute(path);
    setMobileMenu(false);
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function calc() {
    const a = Math.max(0, Number(area)||0);
    const factor = work==="slab" ? 1 : work==="room" ? .72 : work==="plaster" ? .16 : 1.35;
    setEstimate({
      bags: Math.ceil(a * factor / 100),
      steel: Math.round(a * (work==="slab" ? 3.5 : work==="foundation" ? 4.2 : work==="room" ? 2.5 : .15)),
      sand: Math.round(a * (work==="plaster" ? .035 : work==="foundation" ? .12 : .075)),
      aggregate: Math.round(a * (work==="slab" ? .09 : work==="foundation" ? .13 : work==="room" ? .06 : 0))
    });
  }
  async function login(e) {
    e.preventDefault(); setAdminError(""); setAdminLoading(true);
    if (!firebaseConfigured) { setAdminError(t.adminNotice); setAdminLoading(false); return; }
    try {
      const result = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      const { doc, getDoc } = await import("firebase/firestore");
      const snap = await getDoc(doc(db, "admins", result.user.uid));
      if (!snap.exists()) { await signOut(auth); setAdminError(lang==="hi" ? "इस अकाउंट को एडमिन अनुमति नहीं मिली है।" : "This account is not allowlisted as an admin."); }
      else { setAdminAllowed(true); setUser(result.user); }
    } catch { setAdminError(lang==="hi" ? "लॉगिन नहीं हो पाया। ईमेल/पासवर्ड जांचें।" : "Sign-in failed. Check your email and password."); }
    finally { setAdminLoading(false); }
  }
  async function logout() { if (auth) await signOut(auth); setUser(null); setAdminAllowed(false); }
  function sendContact(e) {
    e.preventDefault();
    const message = lang==="hi"
      ? `नमस्ते Balajee Enterprises, मेरा नाम ${form.name} है। मोबाइल: ${form.mobile}। जरूरत: ${form.need}। कृपया रेट और उपलब्धता बताएं।`
      : `Hello Balajee Enterprises, my name is ${form.name}. Mobile: ${form.mobile}. Requirement: ${form.need}. Please share rates and availability.`;
    if (hasWhatsApp) window.open(waLink(message), "_blank", "noopener,noreferrer");
    else setActiveModal({type:"notice", title:lang==="hi"?"WhatsApp नंबर सेट नहीं है":"WhatsApp number not configured", text:lang==="hi"?"अपनी .env.local फाइल में VITE_WHATSAPP_NUMBER सेट करें।":"Set VITE_WHATSAPP_NUMBER in your .env.local file."});
  }
  const navItems = [["home", "#home"],["products","#products"],["calculator","#calculator"],["compare","#compare"],["news","#news"],["about","#about"],["contact","#contact"]];
  if (isAdminRoute) {
    return <div className="admin-shell">
      <header className="admin-top"><button className="brand-button" onClick={()=>navigate("/")}><LogoMark/><span><b>BALAJEE ENTERPRISES</b><small>{t.footerLine}</small></span></button><button className="text-button" onClick={()=>navigate("/")}>← {t.home}</button></header>
      {!adminAllowed ? <main className="login-wrap"><div className="login-card"><div className="login-icon"><LockKeyhole size={25}/></div><p className="eyebrow">{t.admin}</p><h1>{t.loginTitle}</h1><p className="muted">{firebaseConfigured ? (lang==="hi"?"अपने अधिकृत डीलरशिप अकाउंट से साइन इन करें।":"Sign in with your authorized dealership account.") : t.adminNotice}</p><form onSubmit={login} className="stack-form"><label>{t.email}<input type="email" required value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} autoComplete="username"/></label><label>{t.password}<input type="password" required value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} autoComplete="current-password"/></label>{adminError&&<p className="form-error">{adminError}</p>}<button className="btn btn-primary full" disabled={adminLoading}>{adminLoading?t.login+"…":t.login}</button></form><p className="tiny muted">🔒 {lang==="hi"?"सुरक्षा: केवल Firestore admins allowlist वाले अकाउंट को प्रवेश मिलता है।":"Security: access requires a matching Firestore admins allowlist document."}</p><div className="language-inline"><button onClick={()=>setLang("hi")}>हिन्दी</button><span>·</span><button onClick={()=>setLang("en")}>English</button></div></div></main>
      : <main className="admin-content"><div className="admin-heading"><div><p className="eyebrow">{t.dashboard}</p><h1>{t.adminIntro}</h1></div><button className="btn btn-outline" onClick={logout}><LogOut size={16}/>{t.logout}</button></div><div className="admin-stats"><div className="admin-stat"><Package/><strong>{products.length}</strong><span>{lang==="hi"?"कैटलॉग उत्पाद":"Catalog products"}</span></div><div className="admin-stat"><Newspaper/><strong>{news.length}</strong><span>{lang==="hi"?"न्यूज़ कार्ड":"News cards"}</span></div><div className="admin-stat"><ShieldCheck/><strong>{lang==="hi"?"सक्रिय":"Active"}</strong><span>{lang==="hi"?"एडमिन अनुमति":"Admin authorization"}</span></div></div><div className="admin-panel"><h2>{lang==="hi"?"कैटलॉग स्थिति":"Catalog status"}</h2><p className="muted">{lang==="hi"?"यह स्टार्टर डैशबोर्ड Firebase से उत्पाद/समाचार पढ़ता है। संपादन फॉर्म को सुरक्षित सर्वर-साइड सत्यापन के साथ जोड़ना अगला चरण है।":"This starter dashboard reads products/news from Firebase. Connect editing forms with trusted server-side validation as the next step."}</p><div className="admin-list">{products.slice(0,8).map(p=><div key={p.id} className="admin-list-row"><span><b>{p.name}</b><small>{p.category} · {p.availability||"—"}</small></span><span className="pill">{p.price|| (lang==="hi"?"रेट पूछें":"Ask for rate")}</span></div>)}</div></div><div className="admin-panel"><h2>{lang==="hi"?"अगले सेटअप चरण":"Next setup steps"}</h2><ol><li>Firestore में `products` और `news` collections बनाएं।</li><li>`admins/{user?.uid}` डॉक्यूमेंट मौजूद रखें।</li><li>सार्वजनिक लीड फॉर्म के लिए App Check और Cloud Function जोड़ें।</li></ol></div></main>}
    </div>;
  }
  return <div className="site-shell" lang={lang}>
    <div className="top-strip"><div className="container top-inner"><span><MapPin size={13}/> Koderma & Barkattha, Jharkhand</span><span className="top-promise"><ShieldCheck size={13}/> {t.promise}</span><button className="admin-link" onClick={()=>navigate("/admin-login")}><LockKeyhole size={12}/>{t.admin}</button></div></div>
    <header className="site-header"><div className="container header-inner">
      <button className="brand-button" onClick={()=>navigate("/")} aria-label="Balajee Enterprises home"><LogoMark/><span className="brand-copy"><b>BALAJEE <em>ENTERPRISES</em></b><small>{t.footerLine}</small></span></button>
      <nav className={`main-nav ${mobileMenu?"is-open":""}`} aria-label="Main navigation">{navItems.map(([key,href])=><a key={key} href={href} onClick={e=>{e.preventDefault();document.querySelector(href)?.scrollIntoView({behavior:"smooth"});setMobileMenu(false)}}>{t[key]}</a>)}</nav>
      <div className="header-actions"><button className="audio-button" onClick={()=>speak(`${t.heroTitle}. ${t.heroText}`,lang)} aria-label={t.listen}><Volume2 size={17}/><span>{t.listen}</span></button><button className="lang-toggle" onClick={()=>setLang(lang==="hi"?"en":"hi")}><Languages size={16}/>{lang==="hi"?"EN":"हिंदी"}</button><button className="btn btn-dark header-portal" onClick={()=>setActiveModal({type:"portal"})}><UserRound size={15}/><span>{t.portal}</span></button><button className="mobile-menu" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu?<X/>:<Menu/>}</button></div>
    </div></header>
    <main>
      <section className="hero" id="home"><div className="hero-grid"></div><div className="container hero-inner"><div className="hero-copy"><div className="eyebrow light"><span className="eyebrow-dot"></span>{t.heroEyebrow}</div><h1>{t.heroTitle.split(". ").length>1 ? <>{t.heroTitle.split(". ")[0]}.<br/>{t.heroTitle.split(". ").slice(1).join(". ")}</> : t.heroTitle}</h1><p>{t.heroText}</p><div className="hero-buttons"><a className="btn btn-gold" href="#products">{t.explore}<ArrowUpRight size={17}/></a><button className="btn btn-glass" onClick={()=>document.querySelector("#contact").scrollIntoView({behavior:"smooth"})}><MessageCircle size={17}/>{t.quote}</button></div><div className="hero-trust"><span><CheckCircle2 size={16}/>{t.ready}</span><span><CheckCircle2 size={16}/>{t.quality}</span><span><CheckCircle2 size={16}/>{t.local}</span></div></div><div className="hero-visual"><div className="visual-glow"></div><div className="hero-emblem"><div className="emblem-ring"><div className="emblem-inner"><span className="emblem-be">BE</span><span className="emblem-rule"></span><span className="emblem-sub">BUILD • TRUST • LAST</span></div></div><div className="emblem-laurel left">❧</div><div className="emblem-laurel right">❧</div></div><div className="floating-tag tag-top"><span className="tag-icon"><ShieldCheck size={18}/></span><span><b>{lang==="hi"?"गुणवत्ता पहले":"Quality first"}</b><small>{lang==="hi"?"सही सामग्री, सही सलाह":"Right materials, sound guidance"}</small></span></div><div className="floating-tag tag-bottom"><span className="tag-icon"><Truck size={18}/></span><span><b>{lang==="hi"?"सप्लाई सपोर्ट":"Supply support"}</b><small>{lang==="hi"?"साइट की जरूरत के अनुसार":"For your site requirements"}</small></span></div></div></div><div className="hero-bottom"><div className="container hero-bottom-inner"><span><span className="gold-line"></span>{lang==="hi"?"घर बनाने के हर कदम पर साथ":"With you at every step of building"}</span><span className="scroll-cue">{lang==="hi"?"नीचे देखें":"Scroll to explore"} <ChevronDown size={15}/></span></div></div></section>
      <section className="trust-band"><div className="container trust-grid"><div className="trust-item"><span className="trust-icon"><Package/></span><span><b>{lang==="hi"?"निर्माण सामग्री":"Building materials"}</b><small>{lang==="hi"?"एक ही जगह पर विकल्प":"Options in one place"}</small></span></div><div className="trust-item"><span className="trust-icon"><Hammer/></span><span><b>{lang==="hi"?"साइट के लिए उपयोगी सलाह":"Practical site guidance"}</b><small>{lang==="hi"?"काम के मुताबिक सुझाव":"Advice for your work"}</small></span></div><div className="trust-item"><span className="trust-icon"><MessageCircle/></span><span><b>{lang==="hi"?"सीधी पूछताछ":"Direct enquiries"}</b><small>{lang==="hi"?"रेट और स्टॉक कन्फर्म करें":"Confirm rates and stock"}</small></span></div><div className="trust-item"><span className="trust-icon"><MapPin/></span><span><b>{lang==="hi"?"स्थानीय क्षेत्र पर फोकस":"Local area focus"}</b><small>Koderma • Barkattha</small></span></div></div></section>
      <section className="section products-section" id="products"><div className="container"><div className="section-heading"><div><p className="eyebrow">{lang==="hi"?"उत्पाद कैटलॉग":"PRODUCT CATALOG"}</p><h2>{t.catalogTitle}</h2><p className="section-sub">{t.catalogSub}</p></div><div className="catalog-tools"><label className="search-box"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/></label></div></div><div className="filter-row">{[["all",t.all],["cement",t.cement],["steel",t.steel],["hardware",t.hardware],["chemicals",t.chemicals]].map(([id,label])=><button key={id} onClick={()=>setCategory(id)} className={`filter-chip ${category===id?"active":""}`}>{label}</button>)}</div><div className="product-grid">{filteredProducts.map((p,i)=><article className="product-card" key={p.id}><div className={`product-art art-${p.category}`}><span className="tier-pill">{p.tier===1?(lang==="hi"?"टियर 1":"TIER 1"):p.tier===2?(lang==="hi"?"टियर 2":"TIER 2"):(lang==="hi"?"टियर 3":"TIER 3")}</span><div className="product-illustration">{p.category==="cement"?<div className="cement-bag"><span>BE</span><b>{p.name.split(" ")[0].toUpperCase()}</b><small>CEMENT</small></div>:p.category==="steel"?<div className="steel-bars"><i></i><i></i><i></i><i></i></div>:p.category==="chemicals"?<div className="chemical-bottle"><span>+</span></div>:<div className="hardware-shape"><Blocks size={57}/></div>}</div><span className={`stock-dot ${p.availability==="ready"?"in-stock":""}`}></span></div><div className="product-content"><div className="product-topline"><span className="category-label">{t[p.category]||p.category}</span><span className={`availability ${p.availability==="ready"?"ready":""}`}>{p.availability==="ready"?t.stockReady:t.order}</span></div><h3>{p.name}</h3><p>{lang==="hi"?(p.descriptionHi||p.descriptionEn):(p.descriptionEn||p.descriptionHi)}</p><div className="product-tags">{(lang==="hi"?(p.tags||[]):(p.tagsEn||p.tags||[])).slice(0,2).map(tag=><span key={tag}>{tag}</span>)}</div><div className="product-footer"><div className="rate"><small>{lang==="hi"?"आज का भाव":"Current rate"}</small><b>{p.price||t.quote}</b></div><button className="icon-cta" aria-label={`${t.ask}: ${p.name}`} onClick={()=>{setActiveModal({type:"product",product:p});}}><ArrowUpRight size={18}/></button></div><button className="product-quote" onClick={()=>{setActiveModal({type:"product",product:p});}}>{t.ask}<ArrowUpRight size={15}/></button></div></article>)}</div>{filteredProducts.length===0&&<div className="empty-state">{t.noResults}</div>}<div className="catalog-note"><ShieldCheck size={18}/><span>{t.disclaimer}</span></div></div></section>
      <section className="section calculator-section" id="calculator"><div className="container calculator-layout"><div className="calculator-copy"><p className="eyebrow">{lang==="hi"?"स्मार्ट साइट टूल":"SMART SITE TOOL"}</p><h2>{t.calculatorTitle}</h2><p className="section-sub">{t.calculatorSub}</p><div className="calculator-perks"><div><Calculator/><span>{lang==="hi"?"त्वरित अनुमान":"Quick estimate"}</span></div><div><Ruler/><span>{lang==="hi"?"एरिया आधारित":"Area based"}</span></div><div><CircleHelp/><span>{lang==="hi"?"इंजीनियर से पुष्टि":"Engineer review"}</span></div></div></div><div className="calculator-card"><div className="calc-card-head"><span className="calc-icon"><Calculator/></span><div><h3>{lang==="hi"?"मटेरियल कैलकुलेटर":"Material calculator"}</h3><p>{lang==="hi"?"अनुमान के लिए जानकारी भरें":"Enter details for an indicative estimate"}</p></div></div><div className="calc-form"><label>{t.area}<div className="input-with-unit"><input type="number" min="1" value={area} onChange={e=>setArea(e.target.value)}/><span>sq ft</span></div></label><label>{t.work}<select value={work} onChange={e=>{setWork(e.target.value);setEstimate(null)}}><option value="slab">{t.slab}</option><option value="room">{t.room}</option><option value="plaster">{t.plaster}</option><option value="foundation">{t.foundation}</option></select></label><button className="btn btn-primary full" onClick={calc}>{t.calculate}<ArrowUpRight size={17}/></button></div>{estimate&&<div className="estimate-results"><h4>{t.estimate}</h4><div className="estimate-grid"><div><Package/><b>{estimate.bags}</b><span>{t.bags}</span></div><div><Weight/><b>{estimate.steelKg}</b><span>{t.steelKg}</span></div><div><Wheat/><b>{estimate.sand}</b><span>{t.sand}</span></div><div><Blocks/><b>{estimate.aggregate}</b><span>{t.aggregate}</span></div></div><p className="tiny muted">{lang==="hi"?"यह केवल प्रारंभिक योजना अनुमान है; डिजाइन, मिक्स और साइट स्थिति से मात्रा बदल सकती है।":"Planning estimate only; design, mix and site conditions can change quantities."}</p><button className="text-link" onClick={()=>{setForm({...form,need:`${area} sq ft ${work} material estimate`});document.querySelector("#contact").scrollIntoView({behavior:"smooth"})}}>{lang==="hi"?"इस अनुमान पर कोटेशन पूछें":"Request a quote for this estimate"} <ArrowUpRight size={14}/></button></div>}</div></div></section>
      <section className="section compare-section" id="compare"><div className="container"><div className="section-heading"><div><p className="eyebrow">{lang==="hi"?"सही चुनाव करें":"MAKE AN INFORMED CHOICE"}</p><h2>{t.compareTitle}</h2><p className="section-sub">{t.compareSub}</p></div><span className="section-symbol"><ChartNoAxesCombined size={30}/></span></div><div className="comparison-wrap"><table className="comparison-table"><thead><tr><th>{t.brand}</th><th>{t.type}</th><th>{t.use}</th><th>{t.spec}</th></tr></thead><tbody>{[["UltraTech","OPC / PPC (confirm bag label)",lang==="hi"?"सामान्य निर्माण; डिजाइन के अनुसार":"General construction per design",lang==="hi"?"ग्रेड व डेटा शीट जांचें":"Check grade and data sheet"],["ACC","OPC / PPC (confirm bag label)",lang==="hi"?"निर्माता निर्देश और इंजीनियर की सलाह":"Manufacturer guidance and engineer advice",lang==="hi"?"सेटिंग समय मिक्स पर निर्भर":"Setting depends on mix"],["Dalmia","Product-specific",lang==="hi"?"काम के प्रकार के अनुसार चुनाव":"Select for the intended application",lang==="hi"?"तकनीकी शीट देखें":"Consult technical sheet"],["JK Lakshmi / Nuvoco / Bangur / MP Birla","Availability on order",lang==="hi"?"वर्तमान उत्पाद और ग्रेड कन्फर्म करें":"Confirm current product and grade",lang==="hi"?"ब्रांड के बीच गुणों की सीधी रैंकिंग नहीं":"No blanket brand ranking"]].map((r,i)=><tr key={r[0]}><td><b>{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td><td><span className="spec-chip">{r[3]}</span></td></tr>)}</tbody></table></div><p className="tiny muted compare-disclaimer"><CircleHelp size={14}/>{lang==="hi"?"हाइड्रेशन हीट, सेटिंग टाइम और क्रैक रेजिस्टेंस सीमेंट प्रकार, मिक्स डिजाइन, तापमान और क्योरिंग पर निर्भर करते हैं। उत्पाद डेटा शीट और योग्य इंजीनियर की सलाह को प्राथमिकता दें।":"Heat of hydration, setting time and crack resistance depend on cement type, mix design, temperature and curing. Refer to the product data sheet and a qualified engineer."}</p></div></section>
      <section className="section news-section" id="news"><div className="container"><div className="section-heading"><div><p className="eyebrow">{lang==="hi"?"ज्ञान • गाइड • अपडेट":"KNOWLEDGE • GUIDES • UPDATES"}</p><h2>{t.newsTitle}</h2><p className="section-sub">{t.newsSub}</p></div><button className="btn btn-outline" onClick={()=>speak(news.map(n=>lang==="hi"?`${n.titleHi}. ${n.summaryHi}`:`${n.titleEn}. ${n.summaryEn}`).join(". "),lang)}><Volume2 size={16}/>{lang==="hi"?"सभी अपडेट सुनें":"Listen to updates"}</button></div><div className="news-grid">{news.map((n,i)=><article className="news-card" key={n.id||i}><div className={`news-art news-art-${i%3}`}><span className="news-category">{lang==="hi"?(n.categoryHi||n.categoryEn):(n.categoryEn||n.categoryHi)}</span><div className="news-art-icon">{i%3===0?<ShieldCheck size={54}/>:i%3===1?<Droplets size={54}/>:<Hammer size={54}/>}</div><span className="news-number">0{i+1}</span></div><div className="news-content"><h3>{lang==="hi"?(n.titleHi||n.titleEn):(n.titleEn||n.titleHi)}</h3><p>{lang==="hi"?(n.summaryHi||n.summaryEn):(n.summaryEn||n.summaryHi)}</p><div className="news-actions"><button className="text-link" onClick={()=>setActiveModal({type:"news",news:n})}>{t.learn}<ArrowUpRight size={15}/></button><button className="listen-link" onClick={()=>speak(`${lang==="hi"?(n.titleHi||n.titleEn):(n.titleEn||n.titleHi)}. ${lang==="hi"?(n.summaryHi||n.summaryEn):(n.summaryEn||n.summaryHi)}`,lang)}><Volume2 size={15}/>{t.read}</button></div></div></article>)}</div><div className="news-source-note"><Newspaper size={16}/>{lang==="hi"?"यहां फिलहाल उपयोगी सामान्य गाइड हैं, लाइव RSS फीड नहीं। ताज़ा स्थानीय भाव/नीतियों की पुष्टि आधिकारिक स्रोत से करें।":"These are general practical guides, not a live RSS feed. Verify current local prices and policy updates with official sources."}</div></div></section>
      <section className="about-section" id="about"><div className="container about-layout"><div className="about-visual"><div className="about-frame"><div className="about-monogram">BE</div><div className="about-lines"><span></span><span></span><span></span></div><div className="about-stamp"><ShieldCheck size={21}/><span>{lang==="hi"?"भरोसे की नींव":"Built on trust"}</span></div></div><div className="about-corner"></div></div><div className="about-copy"><p className="eyebrow">{lang==="hi"?"हमारी प्रतिबद्धता":"OUR COMMITMENT"}</p><h2>{t.aboutTitle}</h2><p>{t.aboutText}</p><div className="about-values"><div><span>01</span><b>{lang==="hi"?"सही जानकारी":"Clear information"}</b><small>{lang==="hi"?"उत्पाद और रेट की पुष्टि":"Verify product and pricing"}</small></div><div><span>02</span><b>{lang==="hi"?"उपयोगी सलाह":"Practical guidance"}</b><small>{lang==="hi"?"काम के अनुसार सामग्री":"Materials for the job"}</small></div><div><span>03</span><b>{lang==="hi"?"स्थानीय सहयोग":"Local support"}</b><small>{lang==="hi"?"साइट की जरूरत पर बातचीत":"Discuss site requirements"}</small></div></div><button className="btn btn-primary" onClick={()=>document.querySelector("#contact").scrollIntoView({behavior:"smooth"})}>{lang==="hi"?"हमसे बात करें":"Talk to our team"}<ArrowUpRight size={17}/></button></div></div></section>
      <section className="tutorial-strip"><div className="container tutorial-inner"><div className="tutorial-icon"><PlayCircle size={32}/></div><div><p className="eyebrow light">{t.tutorials}</p><h2>{lang==="hi"?"साइट पर काम आएं छोटे, उपयोगी गाइड":"Short, useful guides for your site"}</h2><p>{lang==="hi"?"वाइब्रेटर का उपयोग, सीमेंट स्टोरेज और कंक्रीट क्योरिंग जैसी बुनियादी बातें।":"Basics such as vibrator use, cement storage and concrete curing."}</p></div><button className="btn btn-glass" onClick={()=>setActiveModal({type:"tutorial"})}>{lang==="hi"?"गाइड देखें":"Explore guides"}<ArrowUpRight size={17}/></button></div></section>
      <section className="section contact-section" id="contact"><div className="container contact-layout"><div className="contact-copy"><p className="eyebrow">{lang==="hi"?"संपर्क करें":"GET IN TOUCH"}</p><h2>{t.contactTitle}</h2><p className="section-sub">{t.contactSub}</p><div className="contact-points"><div><span><MapPin/></span><div><b>{lang==="hi"?"सेवा क्षेत्र":"Service area"}</b><p>Koderma • Barkattha, Jharkhand</p></div></div><div><span><MessageCircle/></span><div><b>{lang==="hi"?"WhatsApp पूछताछ":"WhatsApp enquiries"}</b><p>{lang==="hi"?"रेट, स्टॉक और डिलीवरी पर बात करें":"Discuss rates, stock and delivery"}</p></div></div><div><span><Clock3/></span><div><b>{lang==="hi"?"स्टॉक और रेट":"Stock and rates"}</b><p>{lang==="hi"?"ऑर्डर से पहले वर्तमान उपलब्धता कन्फर्म करें":"Confirm current availability before ordering"}</p></div></div></div></div><form className="contact-form" onSubmit={sendContact}><h3>{t.leadTitle}</h3><label>{t.name}<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder={lang==="hi"?"नाम लिखें":"Enter your name"}/></label><label>{t.mobile}<input required type="tel" pattern="[0-9+() -]{8,18}" value={form.mobile} onChange={e=>setForm({...form,mobile:e.target.value})} placeholder={lang==="hi"?"मोबाइल नंबर लिखें":"Enter mobile number"}/></label><label>{t.need}<textarea required rows="3" value={form.need} onChange={e=>setForm({...form,need:e.target.value})} placeholder={lang==="hi"?"उत्पाद, मात्रा और डिलीवरी स्थान":"Product, quantity and delivery location"}/></label><button className="btn btn-primary full" type="submit"><MessageCircle size={17}/>{t.send}</button><p className="tiny muted">{lang==="hi"?"आपकी पूछताछ WhatsApp में खुलेगी; भेजने से पहले संदेश जांच सकते हैं।":"Your enquiry opens in WhatsApp so you can review it before sending."}</p></form></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-main"><div className="footer-brand"><button className="brand-button footer-brand-button" onClick={()=>navigate("/")}><LogoMark/><span className="brand-copy"><b>BALAJEE <em>ENTERPRISES</em></b><small>{t.footerLine}</small></span></button><p>{lang==="hi"?"निर्माण सामग्री के लिए आपका स्थानीय सहयोगी।":"Your local partner for construction materials."}</p><div className="social-links"><a href="#contact" aria-label="Contact"><MessageCircle/></a><a href="#contact" aria-label="Location"><MapPin/></a><button onClick={()=>speak(t.footerLine,lang)} aria-label="Listen"><Volume2/></button></div></div><div className="footer-links"><h4>{t.quick}</h4>{navItems.slice(0,5).map(([key,href])=><a key={key} href={href}>{t[key]}</a>)}</div><div className="footer-links"><h4>{lang==="hi"?"सेवाएं":"Services"}</h4><a href="#products">{t.cement} & {t.steel}</a><a href="#calculator">{t.calculator}</a><a href="#compare">{t.compare}</a><a href="#news">{t.tutorials}</a></div><div className="footer-contact"><h4>{t.contact}</h4><p><MapPin size={15}/> Koderma / Barkattha, Jharkhand</p><p><MessageCircle size={15}/> {lang==="hi"?"WhatsApp पर पूछताछ":"WhatsApp enquiry"}</p><button className="footer-admin" onClick={()=>navigate("/admin-login")}><LockKeyhole size={14}/>{t.admin} login</button></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Balajee Enterprises</span><span>{t.footerLine}</span><span className="footer-disclaimer">{t.disclaimer}</span></div></footer>
    <button className="floating-whatsapp" onClick={()=>{if(hasWhatsApp)window.open(waLink(lang==="hi"?"नमस्ते, मुझे निर्माण सामग्री के रेट और उपलब्धता जाननी है।":"Hello, I'd like to ask about construction material rates and availability."),"_blank","noopener,noreferrer");else setActiveModal({type:"notice",title:"WhatsApp",text:lang==="hi"?"VITE_WHATSAPP_NUMBER सेट करें।":"Configure VITE_WHATSAPP_NUMBER."})}} aria-label="WhatsApp enquiry"><MessageCircle size={22}/><span>{lang==="hi"?"पूछें":"Enquire"}</span></button>
    {activeModal&&<div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setActiveModal(null)}}><div className="modal-card" role="dialog" aria-modal="true" aria-label={t.leadTitle}><button className="modal-close" onClick={()=>setActiveModal(null)} aria-label={t.close}><X/></button>{activeModal.type==="product"?<><div className={`modal-product-art art-${activeModal.product.category}`}><Package size={35}/></div><p className="eyebrow">{t.quote}</p><h2>{activeModal.product.name}</h2><p className="muted">{lang==="hi"?(activeModal.product.descriptionHi||activeModal.product.descriptionEn):(activeModal.product.descriptionEn||activeModal.product.descriptionHi)}</p><div className="modal-details"><span>{lang==="hi"?"उपलब्धता":"Availability"}</span><b>{activeModal.product.availability==="ready"?t.stockReady:t.order}</b><span>{lang==="hi"?"भाव":"Rate"}</span><b>{activeModal.product.price||t.quote}</b></div>{hasWhatsApp?<a className="btn btn-primary full" href={waLink(productMessage(activeModal.product,lang))} target="_blank" rel="noreferrer"><MessageCircle size={17}/>{t.ask}</a>:<p className="form-error">{lang==="hi"?"WhatsApp ऑर्डर के लिए .env.local में VITE_WHATSAPP_NUMBER सेट करें।":"Set VITE_WHATSAPP_NUMBER in .env.local to enable WhatsApp orders."}</p>}</>:activeModal.type==="news"?<><p className="eyebrow">{lang==="hi"?(activeModal.news.categoryHi||activeModal.news.categoryEn):(activeModal.news.categoryEn||activeModal.news.categoryHi)}</p><h2>{lang==="hi"?(activeModal.news.titleHi||activeModal.news.titleEn):(activeModal.news.titleEn||activeModal.news.titleHi)}</h2><p className="modal-body-copy">{lang==="hi"?(activeModal.news.summaryHi||activeModal.news.summaryEn):(activeModal.news.summaryEn||activeModal.news.summaryHi)}</p><div className="tip-box"><ShieldCheck/>{lang==="hi"?"काम शुरू करने से पहले साइट इंजीनियर और निर्माता के निर्देशों की पुष्टि करें।":"Confirm site-engineer guidance and manufacturer instructions before starting work."}</div><button className="btn btn-outline full" onClick={()=>speak(`${activeModal.news.titleHi||activeModal.news.titleEn}. ${activeModal.news.summaryHi||activeModal.news.summaryEn}`,lang)}><Volume2 size={16}/>{t.read}</button></>:activeModal.type==="portal"?<><div className="modal-product-art"><UserRound size={34}/></div><p className="eyebrow">{lang==="hi"?"ग्राहक पोर्टल":"CUSTOMER PORTAL"}</p><h2>{t.portal}</h2><p className="muted">{lang==="hi"?"मिस्त्री, ठेकेदार और ग्राहक रेट व उपलब्धता पूछने के लिए सीधे संपर्क कर सकते हैं। ग्राहक लॉगिन/क्रेडिट सुविधा अगले चरण में सुरक्षित रूप से जोड़ी जा सकती है।":"Masons, contractors and customers can enquire directly about rates and stock. Customer accounts and credit features can be added in a secure next phase."}</p><button className="btn btn-primary full" onClick={()=>{setActiveModal(null);document.querySelector("#contact").scrollIntoView({behavior:"smooth"})}}><MessageCircle size={16}/>{lang==="hi"?"पूछताछ करें":"Make an enquiry"}</button><button className="text-link modal-admin-link" onClick={()=>{setActiveModal(null);navigate("/admin-login")}}>{t.admin} login <ArrowUpRight size={14}/></button></>:activeModal.type==="tutorial"?<><p className="eyebrow">{t.tutorials}</p><h2>{lang==="hi"?"साइट के लिए उपयोगी गाइड":"Practical site guides"}</h2><div className="tutorial-list">{[["सीमेंट का सही स्टोरेज","Store cement in a dry, raised place."],["कंक्रीट वाइब्रेटर का उपयोग","Use compatible equipment and avoid over-vibration."],["कंक्रीट की क्योरिंग","Follow the specified curing method and duration."]].map(([hi,en])=><div key={hi}><PlayCircle/><span><b>{lang==="hi"?hi:en}</b><small>{lang==="hi"?en:hi}</small></span><button onClick={()=>speak(lang==="hi"?`${hi}. ${en}`:`${en} ${hi}`,lang)}><Volume2 size={16}/></button></div>)}</div><p className="tiny muted">{lang==="hi"?"ये टेक्स्ट गाइड हैं, अभी एम्बेडेड वीडियो नहीं।":"These are text guides; embedded video hosting is not configured yet."}</p></>:<><p className="eyebrow">{activeModal.title}</p><h2>{activeModal.title}</h2><p>{activeModal.text}</p><button className="btn btn-primary full" onClick={()=>setActiveModal(null)}>{t.close}</button></>}</div></div>}
  </div>;
}
createRoot(document.getElementById("root")).render(<App/>);
