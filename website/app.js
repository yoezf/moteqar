/* =====================================================================
   CONTENT — edit here. To add a language, add a key to D with the same
   shape as D.en. Language-independent data (ids, icons, tech) is below.
   ===================================================================== */
// Admin backend (../admin). On localhost the page talks to the local admin; for the live site put its address in PROD_API
// (for example "https://admin.moteqar.id"). Empty = the page uses only the content bundled below and the form stays in preview mode.
const PROD_API = "";
const API_BASE = ["localhost", "127.0.0.1"].includes(location.hostname) ? "http://localhost:8088" : PROD_API === "same-origin" ? location.origin : PROD_API; // "same-origin": landing page and admin share one domain
// Where the contact form posts. Default is the admin; a Formspree URL (https://formspree.io/f/xxxxxxxx) also works.
const FORM_ENDPOINT = API_BASE ? API_BASE + "/api/leads" : "";
const LOGIN_URL = API_BASE ? API_BASE + "/login" : ""; // the Masuk / Sign in button goes to the shared login page (admins and clients); hidden when there is no admin address
// Real contact details. Leave a value empty to show the "to be announced" placeholder. whatsapp = digits with country code, social = full URL.
const CONTACT = { email: "Moteqar.id@gmail.com", whatsapp: "089657908809", social: "https://instagram.com/moteqar.id" };
/* ---------- Analytics (off until configured; never runs on localhost) ---------- */
// plausible: true -> Plausible (cookieless, no consent banner needed). ga4: "G-XXXXXXXXXX" -> Google Analytics 4 (uses cookies).
const ANALYTICS = { plausible: false, ga4: "" };
const analyticsOn = !["localhost", "127.0.0.1"].includes(location.hostname);
if (analyticsOn && ANALYTICS.plausible) {
  window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
  const s = document.createElement("script"); s.defer = true; s.dataset.domain = location.hostname; s.src = "https://plausible.io/js/script.js"; document.head.appendChild(s);
}
if (analyticsOn && ANALYTICS.ga4) {
  window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
  const s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + ANALYTICS.ga4; document.head.appendChild(s);
  gtag("js", new Date()); gtag("config", ANALYTICS.ga4);
}
function track(name, props = {}) {
  if (!analyticsOn) return;
  try { if (ANALYTICS.plausible) plausible(name, { props }); if (ANALYTICS.ga4) gtag("event", name.toLowerCase().replace(/\W+/g, "_"), props); } catch {}
}
const waNum = () => CONTACT.whatsapp.replace(/\D/g, "").replace(/^0/, "62"); // 08xx -> 628xx for wa.me
const cLink = (k, ph) => { const v = CONTACT[k]; if (!v) return ph; const n = waNum();
  return k === "email" ? `<a href="mailto:${v}">${v}</a>` : k === "whatsapp" ? `<a href="https://wa.me/${n}" target="_blank" rel="noopener">${v}</a>` : `<a href="${v}" target="_blank" rel="noopener">${v.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/^https?:\/\/(www\.)?/, "")}</a>`; };

const SVC = [ // order matches D.<lang>.services.items; icons are Heroicons solid names (icons.js)
  { id: "website",  icon: "globe-alt" },
  { id: "webapp",   icon: "squares-2x2" },
  { id: "mobile",   icon: "device-phone-mobile" },
  { id: "software", icon: "cpu-chip" },
  { id: "design",   icon: "paint-brush" },
  { id: "support",  icon: "wrench-screwdriver" },
];
// Demonstration projects. Order matches D.<lang>.portfolio.items
const PRJ = [
  { slug: "hormone-growth-kasir", svc: "software", kind: "case", pdf: "portfolio/portofolio-kasir.pdf",
    dir: "kasir", cover: "02-dasbor",
    shots: ["01-masuk", "02-dasbor", "03-kasir-hp", "04-bayar", "05-layar-dapur", "06-stok", "07-menu-terlaris", "08-laba-rugi", "09-pengawasan-kasir", "10-dasbor-hp"], tech: ["Aplikasi web", "Android (uji)", "Printer Bluetooth", "Scan barcode"] },
  { slug: "hormone-growth-sekolah", svc: "webapp", kind: "case", pdf: "portfolio/portofolio-sekolah.pdf",
    dir: "sekolah", cover: "02-dasbor",
    shots: ["01-masuk", "02-dasbor", "03-input-nilai", "04-kehadiran", "05-absen-wajah", "06-daftar-wajah", "07-jadwal", "08-pengumuman", "09-siswa", "10-laporan-akademik", "11-rapor-siswa", "12-rapor-pdf", "13-rekap-pdf", "14-prompt-kustom", "15-portal-orang-tua", "16-portal-hp", "17-dasbor-hp", "18-super-admin", "19-daftar-sekolah"], tech: ["Aplikasi web", "Rapor PDF", "Absensi wajah", "Multi-sekolah"] },
  { slug: "rujak-bangkok-premium", svc: "website", kind: "live", url: "https://rujakbangkokpremium.com/", dir: "rujak", cover: "01-beranda", tech: ["Website responsif", "Peta outlet (Leaflet)", "Cloudflare", "Artikel blog"] },
  { slug: "undangan-digital-pernikahan", svc: "website", kind: "live", url: "https://wedding-arifmira.online/", dir: "undangan", cover: "01-sampul", tech: ["Tailwind CSS", "JavaScript", "Google Maps", "Musik latar"] },
  { slug: "absensi-gps-apps-script", svc: "software", kind: "live", dir: "absensi", cover: "00-sampul", tech: ["Google Apps Script", "Aplikasi web", "GPS (lokasi)", "Login admin"] },
];
// Heroicons solid names for the illustrative tiles
const TRUST_ICONS = ["paint-brush", "code-bracket-square", "arrow-trending-up", "lifebuoy"];
const WHY_ICONS = ["briefcase", "sparkles", "computer-desktop", "square-3-stack-3d", "chat-bubble-left-right", "shield-check"];
const FAM_ICONS = ["magnifying-glass", "clock", "pencil-square"];
const PLAN_ICONS = { starter: "rocket-launch", business: "building-office-2", custom: "puzzle-piece" };
// Hero icon cards: each cycles through one icon per headline word (same order, 2.2s each); the card's offset makes them show different apps at once.
const STEP = 2.2; // seconds each rotating word / icon stays
const CYCLE_ICONS = ["rocket-launch", "globe-alt", "building-storefront", "academic-cap", "heart", "calendar-days", "banknotes", "device-phone-mobile", "clipboard-document-check", "cog-8-tooth"];
const CYCLE_OFFSETS = [3, 0, 6, 8]; // f2 (blue card) has 0, so it matches the headline word
const PLAN_IDS = ["starter", "business", "custom"];
const BUILD = [ // "What we build" cards, order matches D.<lang>.builds.items
  { icon: "globe-alt", svc: "website" },
  { icon: "building-storefront", svc: "software" },
  { icon: "academic-cap", svc: "webapp" },
  { icon: "device-phone-mobile", svc: "mobile" },
  { icon: "clipboard-document-check", svc: "software" },
  { icon: "squares-2x2", svc: "webapp" },
  { icon: "heart", svc: "website" },
  { icon: "calendar-days", svc: "webapp" },
  { icon: "banknotes", svc: "webapp" },
];

const D = {
en: {
  meta: {
    home: ["MOTEQAR — Software House & Digital Development", "MOTEQAR is an Indonesian software house building websites, mobile applications, and custom software that turn your ideas into reliable digital products."],
    about: ["About — MOTEQAR", "Learn about MOTEQAR, an Indonesian software house inspired by the Sundanese word Motékar: creative, resourceful, and innovative."],
    services: ["Services — MOTEQAR", "Website development, web and mobile applications, custom software, UI/UX design, and ongoing support from MOTEQAR."],
    portfolio: ["Portfolio — MOTEQAR", "Selected projects from MOTEQAR showing our approach to websites, applications, and custom software."],
    process: ["Process — MOTEQAR", "From idea to launch: MOTEQAR's four-step process of discovery, design, development, and ongoing support."],
    pricing: ["Pricing — MOTEQAR", "Flexible Starter, Business, and Custom packages. Request a quote based on your project scope."],
    contact: ["Contact — MOTEQAR", "Tell MOTEQAR about your project and request a consultation."],
    notfound: ["Page not found — MOTEQAR", "The page you are looking for does not exist."],
  },
  nav: { login: "Sign in", home: "Home", about: "About", services: "Services", portfolio: "Portfolio", process: "Process", pricing: "Pricing", contact: "Contact", cta: "Start a Project", menu: "Open menu", close: "Close menu", skip: "Skip to content", language: "Language" },
  common: { prev: "Previous", next: "Next", learn: "Learn more", back: "Back", all: "View all", placeholder: "Placeholder", more: "See details", close: "Close" },
  builds: { badge: "What we build", h: "From a company website to a full business app.", p: "Here are the kinds of digital products we build. Each one can start small and grow with your needs.", cta: "Ask about this", note: "Have something else in mind? Describe it to us and we will explain how to build it.", items: [["Company profile website", "Professional websites for businesses, schools, and organizations. Fast, responsive, and easy to update."], ["Cashier & business apps", "Orders, payments, stock, and profit reports for warungs, cafes, and restaurants, on tablets and phones."], ["School management web", "Attendance, grades, digital report cards, and a parent portal for SD and SMP."], ["Android & iOS apps", "Native or cross-platform mobile apps, from idea to release on the app stores."], ["Attendance systems", "Attendance on the web or with Google Apps Script, using QR codes or face recognition when needed."], ["Dashboards & internal tools", "Dashboards, data management, and internal systems for operations, warehouses, or industry, connected to the tools you already use."], ["Digital invitations", "Wedding, party, and holiday invitations as a shareable link: schedule, map, RSVP, guest list, and music, with your own design."], ["Wedding planner", "A checklist, budget, vendor list, and timeline to keep wedding preparations organized in one place."], ["Savings planner", "Set a goal, split it into a plan, and track progress toward a wedding, trip, or any target."]] },
  familiar: { badge: "You're not alone", h: "Sound familiar?", p: "Many business owners have a great idea, but the digital side gets complicated. We help you one step at a time.", items: [["Great product, but hard to find online?", "We build fast, search-friendly websites so the right customers can find you."], ["Manual work slowing your team down?", "Custom web apps and software replace spreadsheets and repeated tasks with reliable workflows."], ["An old website you can't update yourself?", "We add a simple content system so you can change text, photos, and pages without waiting."]] },
  story: { script: "Motékar in Aksara Sunda, the traditional Sundanese script.", badge: "Why Motékar?", h: "The story behind the name.", p1: "“Motékar” is a Sundanese word for being creative, resourceful, and always able to find a way. We spell it with a Q to give it a modern, global feel.", p2: "That is the spirit we bring to every project: curious, practical, and always looking for a smarter way to solve your problem." },
  hero: { eyebrow: "Software house & digital development", h1: ["Turning Your Ideas Into", "Digital Solutions."], note: "Tell us what you need first, and we'll help you pick the right solution.", rot: ["Company Websites.", "Cashier Apps.", "School Systems.", "Digital Invitations.", "Wedding Planners.", "Savings Planners.", "Android & iOS Apps.", "Attendance Apps.", "Industry Systems."], p: "We design and develop websites, applications, and custom software that help businesses work smarter and grow faster.", cta1: "Start Your Project", cta2: "Explore Our Work", visual: "Minimal illustration of a browser window and a mobile app screen representing web and mobile development" },
  trust: { eyebrow: "Why MOTEQAR", h: "Your Technology Partner for Digital Growth.", p: "MOTEQAR helps businesses, organizations, and entrepreneurs transform their ideas into reliable digital products through thoughtful design and modern technology.", items: [["Thoughtful Design", "Interfaces shaped around your users and your brand."], ["Reliable Development", "Clean, well-tested code built to work day after day."], ["Scalable Solutions", "Architecture that grows as your business grows."], ["Ongoing Support", "We stay available after launch to maintain and improve."]] },
  services: {
    eyebrow: "Services", h: "What We Build.", p: "From a first website to a full business system, we build digital products that fit the way you work.",
    page: { h: "Everything you need to build digital.", p: "Six focused services that cover the full life of a digital product, from design to long-term support.", cap: "What's included", ben: "Business benefits", cta: "Request this service" },
    items: [
      { title: "Website Development", short: "Professional websites, landing pages, and company profiles.", headline: "Websites that represent your business well.", intro: "Fast, responsive, and search-friendly websites for every kind of organization.", body: "We build company profile websites, landing pages, and content-driven sites with clear structure and a design that matches your brand. Where needed, we add a content management system so your team can update the site independently.", caps: ["Company profile websites", "Landing pages", "Content management (optional)", "Basic SEO and performance setup"], ben: ["A credible online presence", "Easy for customers to find you", "Simple to update and maintain"] },
      { title: "Web Application Development", short: "Custom dashboards, management systems, portals, and SaaS applications.", headline: "Web applications built around your operations.", intro: "Custom systems that replace manual work with reliable, secure workflows.", body: "From internal dashboards and management systems to customer portals and SaaS products, we design the architecture, build the application, and make it ready to grow with your usage.", caps: ["Dashboards and admin systems", "Customer and partner portals", "SaaS application development", "User roles, security, and reporting"], ben: ["Less manual work and fewer errors", "One source of truth for your data", "A foundation that scales"] },
      { title: "Mobile Application Development", short: "Modern Android and iOS application development.", headline: "Mobile apps people enjoy using.", intro: "Intuitive apps that reach your users where they spend their time.", body: "We plan, design, and build mobile applications for Android and iOS, then support them through release and ongoing updates, so your product stays aligned with your users.", caps: ["Android and iOS applications", "Cross-platform development", "API and backend integration", "Release and update support"], ben: ["Reach customers on their phones", "A consistent experience across devices", "A product that keeps evolving"] },
      { title: "Custom Software Development", short: "Tailored software that solves specific business challenges.", headline: "Software shaped around your challenges.", intro: "When off-the-shelf tools do not fit, we build software that does.", body: "We analyze how your organization works and build software around it, including integration with the systems you already use, so data flows between tools instead of being copied by hand.", caps: ["Tailored business software", "System integration and APIs", "Process automation", "Migration from legacy systems"], ben: ["Fits your real workflows", "Connects your existing tools", "Lower long-term cost than workarounds"] },
      { title: "UI/UX Design", short: "Intuitive interfaces and user-centered digital experiences.", headline: "Design that makes technology feel simple.", intro: "User-centered design grounded in how people actually behave.", body: "We turn complex requirements into clear interfaces through wireframes, prototypes, and usability testing, so your users understand the product in seconds and your team builds with confidence.", caps: ["Wireframes and prototypes", "Interface and interaction design", "Design systems", "Usability review"], ben: ["Higher user satisfaction", "Fewer expensive changes during development", "A consistent, recognizable brand"] },
      { title: "Maintenance & Support", short: "Continuous technical assistance, improvements, and system maintenance.", headline: "Support that continues after launch.", intro: "A dependable team to keep your product secure, fast, and improving.", body: "Launching is the beginning. We provide technical assistance, bug fixes, updates, and improvements so your website or application remains reliable as your business changes.", caps: ["Technical support", "Updates and security patches", "Monitoring and bug fixes", "Feature improvements"], ben: ["Less downtime and risk", "A team that knows your system", "Continuous improvement"] },
    ],
  },
  portfolio: {
    eyebrow: "Portfolio", h: "Selected Projects.", p: "A preview of how we approach different kinds of products.",
    notice: "The first two are product case studies with downloadable PDFs. The rest are live websites and apps.",
    page: { h: "Work that shows how we build.", p: "Each project shows the problem, the approach, and the main features." },
    l: { industry: "Industry", service: "Service", tech: "Technologies", view: "View project", demo: "Demonstration", caseTag: "Case study", liveTag: "Live website", visit: "Visit website", features: "Key features", status: "Status", pdf: "Download portfolio (PDF)", shots: "App screenshots", shotsNote: "Screenshots use sample data from demo setups, not client data.", shotsLive: "Screenshots show public pages only. Screens that contain business or employee data are not shown.", open: "Open full size", prev: "Previous", next: "Next", overview: "Overview", challenge: "Challenge", solution: "Solution", back: "Back to portfolio", more: "More projects", cta: "Discuss a similar project", demoNote: "This is a demonstration project created by MOTEQAR. It is not a real client project." },
    items: [
      { title: "Hormone Growth Kasir", industry: "Food & beverage (warung, cafe, restaurant)", desc: "A cashier and business app for small food businesses, from order to profit report.", hl: ["Dashboard for sales, margins, and stock alerts", "Cashier on phone or tablet: cash, QRIS (in testing), transfer, GoFood, GrabFood", "Kitchen screen with a timer per table", "Profit and loss, best sellers, and cashier monitoring"], overview: "A cashier and business app that follows daily operations, so work that is usually recorded in separate notebooks happens automatically.", challenge: "Sales were written by hand, stock and capital were unclear, and owners could not supervise staff when they were away.", solution: "One app that connects orders, kitchen tickets, payments, recipe-based stock, and profit reports. Built for tablets and phones first.", features: ["Full menu: Dashboard, Cashier, Sales, Kitchen Screen, Shift, Promos & vouchers, Sales report, Best sellers, Profit and loss, Ask AI, Expenses, Daily summary, Cashier monitoring, and Products & stock", "Touch-screen cashier with notes, toppings, and split bills", "Kitchen screen with waiting-time alerts", "Cash, transfer, delivery apps, and QRIS (in testing)", "Stock reduced automatically from recipes", "Profit report and daily summary sent to WhatsApp", "Staff roles and manager PIN for sensitive actions", "Android app in test version"], shots: [
        ["Sign in", "Sign-in page with username and password and a remember-this-device option. Sample accounts exist for owner, cashier, kitchen, and warehouse."],
        ["Owner dashboard", "Today's sales, transaction count, average per transaction, and month total, with a 7 or 14 day chart, payment methods, and a Needs attention box (margins dropping, ingredients to buy)."],
        ["Cashier on mobile", "The running order with quantity, toppings or notes, discounts, service, tax, and takeaway. Pay, Split bill, and Save open bill buttons."],
        ["Payment", "Pick cash, QRIS (in testing), bank transfer, GoFood, or GrabFood. Exact-amount and note buttons speed up entry and change is calculated automatically."],
        ["Kitchen screen", "Orders arrive per table with a colored timer (under 8 minutes, 8 to 14 minutes, 15 or more) and notes such as not spicy. The kitchen taps Ready when done."],
        ["Stock", "Ingredient stock per outlet with units. Filter to low or negative items only; each item has a Stock card and Adjust stock."],
        ["Best sellers", "Products ranked by units sold, sales, cost of goods, gross profit, and margin. Quick date ranges are available and results export to Excel (CSV)."],
        ["Profit and loss", "From net sales, cost of goods, written-off items, stock count differences, to operating costs and net profit, with percentages at each stage."],
        ["Cashier monitoring", "Tracks each cashier: transactions, cancellations, discounts, deleted open bills, and cash differences. Flags appear above set limits but are not proof; receipts and recordings should still be checked."],
        ["Dashboard on mobile", "The same dashboard adapts to phone screens so owners can check in from anywhere."]
      ],
      status: "Demo ready to try. Next step: field trial" },
      { title: "Hormone Growth Sekolah", industry: "Education (SD and SMP)", desc: "A school app for attendance, grades, digital report cards, and a parent portal in one place.", hl: ["Dashboard for student, teacher, and report card status", "Grade entry with automatic final grades", "Face attendance without storing photos", "Report card PDF with a verification code and a parent portal"], overview: "A school app that turns repetitive administration into a few clicks, from teachers to principals to parents.", challenge: "Teachers recorded attendance and grades across many files. Principals waited for report cards and could not easily check for missing grades. Parents only saw progress when report cards were handed out.", solution: "Record, calculate, approve, and share in one place. Approved report cards are locked, carry a verification code, and can be downloaded as PDF. Each user sees only their own part.", features: ["Full menu: Dashboard, Attendance, Grading, Schedule, Report cards, AI analysis, Academics, Communication (announcements), and Master data (classes, students, teachers, parents, subjects)", "Attendance with five statuses: present, sick, permitted, absent, late", "Final grades and grade categories calculated automatically", "Check for missing grades before report cards are approved", "Locked, versioned report cards with verification code and PDF", "One parent account for several children, seeing only their own data", "Optional face attendance that stores a secret code, not the photo", "Separate data for each school, with a record of changes"],
      shots: [
        ["Sign in", "Sign-in with email and password and a Remember me option. The left side lists the main benefits: tidy attendance and grades, digital report cards, and a parent portal."],
        ["School dashboard", "Today's student and teacher attendance, share of report cards approved, active students, published announcements, a 7 day attendance chart, and attendance per class."],
        ["Entering grades", "Teachers enter daily tests, midterm, and final exam per subject and class. The final grade, letter grade, and pass status are calculated instantly. An empty cell means not graded yet."],
        ["Student attendance", "Record daily attendance per class: pick a status for each student (for example Present) and add a note if needed."],
        ["Face attendance", "Choose a class, turn on the camera, and students face it one by one. Face matching happens on the device and photos are not sent to a server."],
        ["Student face list", "An admin captures 5 face samples per student with the camera. Only encrypted numeric data is stored, not photos, and it can be deleted at any time."],
        ["Weekly schedule", "Schedule per class or per teacher from Monday to Friday, with lesson times, teacher names, and break time."],
        ["Announcements", "Create announcements for a chosen audience (all parents and students, one class, students only, or parents only), as a draft or published."],
        ["Student records", "Student list with class, national and school ID numbers, and status. Includes an Excel template download, Excel import, and adding students one by one."],
        ["Academic report", "Final grade summary per class and semester, downloadable as PDF or Excel. The average is only calculated when every subject has a grade."],
        ["Student report cards", "Report cards for a class with a Draft or Approved status and version number. Open shows each student's report card."],
        ["Report card PDF", "A print-ready official report card: learning results per subject, attendance, homeroom teacher notes, signatures, version, and a verification code to confirm authenticity."],
        ["Grade summary PDF", "One class's final grades on a single sheet. Incomplete grades are left blank and the average is not calculated."],
        ["Custom prompts", "Schools write their own instructions for AI photo analysis. Prompts asking for conclusions about illness, ethnicity, religion, or other sensitive matters are rejected."],
        ["Parent portal", "Parents pick a child and semester, then view report cards, grades, attendance, schedule, and announcements. Approved report cards can be downloaded as PDF."],
        ["Portal on mobile", "The parent view adapts to phone screens with Report card, Grades, Attendance, Schedule, and Announcements tabs."],
        ["Dashboard on mobile", "The school dashboard is also comfortable on a phone: attendance, approved report cards, active students, and announcements stack vertically."],
        ["Platform admin dashboard", "For the management team: active schools, students, users, approved report cards, and schools using AI analysis."],
        ["School list", "One system for many schools. Admins register schools, see city, plan, status, and user count, and edit them."]
      ], status: "Demo ready to try with sample data" },
      { title: "Rujak Bangkok Premium Website", industry: "Food & beverage (fruit and rujak, 8 outlets in Bandung)", desc: "A brand website that shows the menu, 8 outlets with a map, and online ordering links.", hl: ["Favorite menu with prices", "Map of 8 outlets with hours and a route button", "Order through delivery apps or WhatsApp", "Company profile PDF, articles, and Google reviews"], overview: "The website for Rujak Bangkok Premium, a fresh fruit and rujak brand in Bandung and Cimahi that opened in 2019. It introduces the brand, its favorite menu with prices, and where to buy.", challenge: "Customers need to quickly find the nearest outlet, see what is popular, and order, usually from a phone, while the brand also needs to build trust through its story, halal certificate, and customer reviews.", solution: "A fast single page with the favorite menu and prices, an outlet map with addresses, opening hours, and route links, buttons to order through delivery apps or WhatsApp, a company profile download, product gallery, articles, and Google reviews.", features: ["Favorite menu with prices and best-seller labels", "Find an outlet: 8 outlets on an interactive map with address, hours, and route button", "Order online through delivery apps or ask on WhatsApp", "Brand story, values, and halal certificate number", "Company profile PDF download", "Product gallery, articles, and customer reviews from Google", "Links to Instagram, TikTok, and Threads"], status: "Live at rujakbangkokpremium.com" },
      { title: "Digital Wedding Invitation", industry: "Events & weddings", desc: "A shareable wedding invitation with an opening cover, schedule, map, RSVP form, and online gift.", hl: ["Open Invitation cover with background music", "Event schedule with an embedded map", "RSVP for attendance, guests, and wishes", "Online gift with a copy-number button"], overview: "A mobile-friendly digital wedding invitation delivered as a single link. Guests open it from a chat message and find everything about the day in one place.", challenge: "A printed invitation cannot carry a map, collect replies, or play music, and couples need to know who is coming without chasing each guest.", solution: "An invitation that opens with a cover and a personal greeting, then walks through the couple, a countdown, the ceremony and reception details with an embedded map, an RSVP form for attendance, guest count, and wishes, and an online gift section with a copy-number button.", features: ["Cover screen with a Open Invitation button and guest greeting", "Background music with an on/off toggle", "Couple profiles and a countdown to the day", "Ceremony and reception schedule with an embedded Google Map", "RSVP form: attendance, number of guests, and wishes or prayers", "Online gift with e-wallet details and a copy button", "Links to Instagram and WhatsApp"], status: "Live at wedding-arifmira.online" },
      { title: "GPS-Based Employee Attendance", industry: "Operations (outlet employees)", desc: "A web attendance app on Google Apps Script that uses GPS location, with an admin dashboard for summaries, payroll, schedules, and outlets.", hl: ["Employees check in from a phone using GPS location", "Admin dashboard with login", "Attendance calendar with export and import", "Payroll, positions, schedule, and outlet menus"], overview: "An employee attendance web app for the Rujak Bangkok Premium outlets. It runs on Google Apps Script, so it needs no server of its own, and uses the device's GPS location when employees check in.", challenge: "Outlet employees work in different places and shifts, and the owner needs attendance recorded simply, from a phone, without extra hardware or a paid system.", solution: "A lightweight page where an employee types their name and checks in, using GPS location, plus a separate password-protected admin dashboard for management. Everything runs on Google Apps Script.", features: ["Employees find their name (3 letters or more) and check in from a phone", "Attendance based on GPS location", "Admin dashboard with login and nine menus: Summary, Employees, Attendance, Requests, Needs review, Payroll, Positions, Schedule, and Outlets", "Summary: active employees, present today, late, not yet checked out, leave requests, and items to review", "Attendance calendar for any date range with export and import, plus a ranking of who is late most often", "Current payroll period and which outlets are ready for attendance", "Runs on Google Apps Script, no server to maintain"], status: "Live: employee page and admin dashboard" },
    ],
  },
  why: { eyebrow: "Why choose us", h: "More Than Just Development.", items: [["Business-oriented solutions", "We start from your goals, not from a technology list."], ["Modern development practices", "Current tools, code review, and testing built into the work."], ["Responsive and accessible interfaces", "Products that work for everyone, on every device."], ["Scalable architecture", "Foundations that handle growth without a rebuild."], ["Transparent communication", "Clear scope, regular updates, and no surprises."], ["Post-launch support", "We stay with you after the product goes live."]] },
  process: {
    eyebrow: "Process", h: "From Idea to Launch.", p: "A clear four-step process so you always know where your project stands.",
    page: { h: "A clear path from idea to launch.", p: "Four steps that keep your project transparent, predictable, and focused on your goals." },
    steps: [["Consultation", "Tell us about your needs and goals through the form or WhatsApp."], ["Quotation", "We send a written breakdown of the work, cost, and estimated timeline."], ["Development", "We design and build, and show you progress along the way so you can give feedback."], ["Revision", "We refine the work based on your feedback, then hand it over and support you after launch."]],
  },
  pricing: {
    eyebrow: "Pricing", h: "Solutions That Fit Your Needs.", p: "Every project is different, so we quote by scope instead of using fixed prices.",
    page: { h: "Packages built around your scope.", p: "Choose the package closest to your needs. We will confirm the details and prepare a written quote." },
    scope: "Typical scope", quote: "Request a Quote",
    note: "Final pricing depends on project scope, features, and requirements. We prepare a clear written quote after a short discussion.",
    plans: { starter: { name: "STARTER", title: "For landing pages and simple company websites.", scope: ["Single-page or small website", "Responsive design", "Contact form", "Basic SEO setup"] }, business: { name: "BUSINESS", title: "For professional company websites and business platforms.", scope: ["Multi-page company website", "Custom design and content structure", "Content management", "Third-party integrations"] }, custom: { name: "CUSTOM", title: "For complex applications, dashboards, and custom software.", scope: ["Web or mobile applications", "Dashboards and management systems", "System integration", "Dedicated planning and support"] } },
  },
  testi: { eyebrow: "Testimonials", h: "What Clients Say.", p: "Genuine client feedback will appear here once available. The cards below are placeholders.", items: [["Placeholder testimonial. Genuine feedback from a real client will be shown here."], ["Placeholder testimonial. Genuine feedback from a real client will be shown here."], ["Placeholder testimonial. Genuine feedback from a real client will be shown here."]], who: "Client name", role: "Company, position" },
  faq: { eyebrow: "FAQ", h: "Frequently Asked Questions.", items: [
    ["How long does development take?", "It depends on the scope. A simple website usually takes a few weeks, while a custom application takes longer. We provide a timeline estimate in the proposal before work begins."],
    ["Can I request custom features?", "Yes. Custom features are what we do best. Tell us what you need and we will recommend the best approach and explain how it affects scope."],
    ["Will the website be responsive?", "Yes. Every website we build is designed to work well on phones, tablets, and desktop screens."],
    ["Can I manage my website content?", "Yes. We can include a content management system so you can update text, images, and pages yourself, and we explain how to use it."],
    ["Do you provide maintenance?", "Yes. We offer maintenance and technical support, including updates, fixes, and improvements after launch."],
    ["Can you redesign an existing website?", "Yes. We can refresh the design, improve performance, and restructure content while keeping what already works."],
    ["How does the payment process work?", "Payment terms are agreed in the written quote, usually divided into stages tied to project milestones. Details depend on the project scope."],
  ] },
  cta: { h: "Have a Project in Mind?", p: "Let's discuss your ideas and turn them into a digital solution that works for your business.", btn: "Let's Talk About Your Project" },
  about: {
    eyebrow: "About", h: "A software house built on creativity.", quote: ["Think Beyond. ", "Create Tomorrow."],
    origin: [["The name", "Motékar", "A Sundanese word meaning creative, resourceful, and innovative. It describes how we want to work."], ["What we do", "Software, end to end", "We design and build websites, applications, and custom software for real business needs."], ["How we work", "Clear and collaborative", "Plain language, transparent scope, and regular updates from first call to launch."]],
    whoL: "Who we work with", whoP: "We build for teams of every size that want technology that works.", who: ["Small and medium businesses", "Startups", "Corporate companies", "Organizations", "Entrepreneurs", "Educational institutions"],
  },
  contact: {
    eyebrow: "Contact", h: "Let's Talk About Your Project.", p: "Tell us about your idea and what you want to achieve. We will review it and get back to you.",
    emailL: "Email", emailV: "Email address will be published here.", waL: "WhatsApp", waV: "WhatsApp number will be published here.", respL: "Response", respV: "Response time will be confirmed once the contact channel is live.",
    f: { name: "Full name", email: "Email", company: "Company name", opt: "(optional)", service: "Service required", servicePh: "Select a service", budget: "Estimated budget", budgetPh: "Select a range", details: "Project description", detailsPh: "Tell us about your project, goals, and timeline", send: "Send Inquiry", sending: "Sending...", req: "Fields marked * are required.", pkg: "Selected package" },
    services: { website: "Website Development", webapp: "Web Application Development", mobile: "Mobile Application Development", software: "Custom Software Development", design: "UI/UX Design", support: "Maintenance & Support", other: "Other / not sure yet" },
    budgets: { lt5: "Under IDR 5 million", "5-15": "IDR 5–15 million", "15-50": "IDR 15–50 million", gt50: "Above IDR 50 million", unsure: "Not sure yet" },
    v: { name: "Please enter your full name.", email: "Please enter a valid email address.", service: "Please select the service you need.", details: "Please share a few more details (at least 10 characters)." },
    ok: "Thank you. Your inquiry has been recorded and we will get back to you soon.", preview: "Preview mode: this form is not connected to an inbox yet.", bad: "Please check the highlighted fields and try again.", fail: "Something went wrong while sending. Please try again in a moment.",
  },
  nf: { h: "Page not found", p: "The page you are looking for does not exist or has moved.", btn: "Back to Home" },
  fab: { wa: "Chat on WhatsApp", title: "Chat with MOTEQAR", desc: "Tell us what you need and we will reply as soon as we can.", chat: "Open WhatsApp", soon: "WhatsApp number coming soon. Use the project form instead.", msg: "Hello MOTEQAR, I would like to ask about a project.", email: "Email us", social: "Instagram" },
  footer: { tag: "Indonesian software house building websites, mobile applications, and custom software.", pages: "Pages", services: "Services", contact: "Contact", email: "Email: to be announced", wa: "WhatsApp: to be announced", social: "Social media: to be announced", rights: "All rights reserved." },
},

id: {
  meta: {
    home: ["MOTEQAR — Software House & Pengembangan Digital", "MOTEQAR adalah software house Indonesia yang membangun website, aplikasi mobile, dan software kustom untuk mengubah ide Anda menjadi produk digital yang andal."],
    about: ["Tentang — MOTEQAR", "Kenali MOTEQAR, software house Indonesia yang terinspirasi kata Sunda Motékar: kreatif, banyak akal, dan inovatif."],
    services: ["Layanan — MOTEQAR", "Pembuatan website, aplikasi web dan mobile, software kustom, desain UI/UX, serta dukungan berkelanjutan dari MOTEQAR."],
    portfolio: ["Portofolio — MOTEQAR", "Proyek pilihan dari MOTEQAR yang menunjukkan pendekatan kami pada website, aplikasi, dan software kustom."],
    process: ["Proses — MOTEQAR", "Dari ide hingga peluncuran: proses empat langkah MOTEQAR, mulai dari discovery, desain, pengembangan, hingga dukungan."],
    pricing: ["Harga — MOTEQAR", "Paket Starter, Business, dan Custom yang fleksibel. Minta penawaran sesuai ruang lingkup proyek Anda."],
    contact: ["Kontak — MOTEQAR", "Ceritakan proyek Anda kepada MOTEQAR dan minta konsultasi."],
    notfound: ["Halaman tidak ditemukan — MOTEQAR", "Halaman yang Anda cari tidak tersedia."],
  },
  nav: { login: "Masuk", home: "Beranda", about: "Tentang", services: "Layanan", portfolio: "Portofolio", process: "Proses", pricing: "Harga", contact: "Kontak", cta: "Mulai Proyek", menu: "Buka menu", close: "Tutup menu", skip: "Lewati ke konten", language: "Bahasa" },
  common: { prev: "Sebelumnya", next: "Berikutnya", learn: "Selengkapnya", back: "Kembali", all: "Lihat semua", placeholder: "Placeholder", more: "Lihat rincian", close: "Tutup" },
  builds: { badge: "Yang bisa kami buat", h: "Dari website profil hingga aplikasi bisnis lengkap.", p: "Berikut jenis produk digital yang sering kami bangun. Setiap produk bisa dimulai kecil lalu tumbuh sesuai kebutuhan.", cta: "Tanya tentang ini", note: "Punya kebutuhan lain? Ceritakan kepada kami, nanti kami jelaskan cara membangunnya.", items: [["Website profil perusahaan", "Website profesional untuk bisnis, sekolah, dan organisasi. Cepat, responsif, dan mudah diperbarui."], ["Aplikasi kasir & usaha", "Pesanan, pembayaran, stok, dan laporan laba untuk warung, kafe, dan resto, bisa dipakai di tablet maupun HP."], ["Web pengelolaan sekolah", "Absensi, nilai, rapor digital, dan portal orang tua untuk SD dan SMP."], ["Aplikasi Android & iOS", "Aplikasi mobile native atau lintas platform, dari ide sampai rilis di toko aplikasi."], ["Sistem absensi", "Absensi berbasis web atau Google Apps Script, dengan kode QR atau pengenalan wajah bila diperlukan."], ["Dasbor & alat internal", "Dasbor, pengelolaan data, dan sistem internal untuk operasional, gudang, atau industri, terhubung dengan alat kerja yang sudah Anda pakai."], ["Undangan digital", "Undangan nikah, pesta, dan hari besar dalam satu tautan yang mudah dibagikan: jadwal, peta lokasi, konfirmasi hadir, daftar tamu, dan musik, dengan desain sesuai keinginan."], ["Planner pernikahan", "Daftar tugas, anggaran, daftar vendor, dan jadwal persiapan pernikahan dalam satu tempat supaya tidak ada yang terlewat."], ["Planner tabungan", "Tentukan target, bagi menjadi rencana, dan pantau kemajuannya untuk pernikahan, liburan, atau tujuan apa pun."]] },
  familiar: { badge: "Anda tidak sendirian", h: "Kedengaran familiar?", p: "Banyak pemilik bisnis punya ide bagus, tapi urusan digitalnya bikin pusing. Kami bantu satu per satu.", items: [["Produk bagus, tapi susah ditemukan di internet?", "Kami membangun website yang cepat dan ramah mesin pencari agar calon pelanggan menemukan Anda."], ["Pekerjaan manual memperlambat tim?", "Aplikasi web dan software kustom menggantikan spreadsheet dan tugas berulang dengan alur kerja yang andal."], ["Website lama yang tidak bisa Anda ubah sendiri?", "Kami menambahkan sistem konten sederhana agar Anda bisa mengganti teks, foto, dan halaman tanpa menunggu."]] },
  story: { script: "Motékar dalam aksara Sunda, tulisan tradisional Sunda.", badge: "Kenapa Motékar?", h: "Cerita di balik nama Motékar.", p1: "“Motékar” adalah kata Sunda yang berarti kreatif, banyak akal, dan selalu bisa menemukan jalan keluar. Kami menulisnya dengan huruf Q supaya terasa modern dan global.", p2: "Itulah semangat yang kami bawa di setiap proyek: penasaran, praktis, dan selalu mencari cara yang lebih cerdas untuk menyelesaikan masalah Anda." },
  hero: { eyebrow: "Software house & pengembangan digital", h1: ["Mengubah Ide Anda Menjadi", "Solusi Digital."], note: "Ceritakan dulu kebutuhan Anda, nanti kami bantu pilih solusi yang tepat.", rot: ["Web Profil.", "Aplikasi Kasir.", "Web Sekolah.", "Undangan Digital.", "Planner Pernikahan.", "Planner Tabungan.", "Aplikasi Android & iOS.", "Aplikasi Absensi.", "Sistem Industri."], p: "Kami merancang dan membangun website, aplikasi, dan software kustom yang membantu bisnis bekerja lebih cerdas dan tumbuh lebih cepat.", cta1: "Mulai Proyek Anda", cta2: "Lihat Karya Kami", visual: "Ilustrasi minimalis jendela browser dan layar aplikasi mobile yang mewakili pengembangan web dan mobile" },
  trust: { eyebrow: "Mengapa MOTEQAR", h: "Mitra Teknologi untuk Pertumbuhan Digital Anda.", p: "MOTEQAR membantu bisnis, organisasi, dan wirausaha mengubah ide mereka menjadi produk digital yang andal melalui desain yang matang dan teknologi modern.", items: [["Desain yang Matang", "Antarmuka yang dirancang sesuai pengguna dan merek Anda."], ["Pengembangan yang Andal", "Kode yang rapi dan teruji, dibuat untuk bekerja setiap hari."], ["Solusi yang Skalabel", "Arsitektur yang ikut berkembang bersama bisnis Anda."], ["Dukungan Berkelanjutan", "Kami tetap siap membantu setelah peluncuran."]] },
  services: {
    eyebrow: "Layanan", h: "Apa yang Kami Bangun.", p: "Dari website pertama hingga sistem bisnis lengkap, kami membangun produk digital yang sesuai cara kerja Anda.",
    page: { h: "Semua yang Anda butuhkan untuk go digital.", p: "Enam layanan terfokus yang mencakup seluruh siklus produk digital, dari desain hingga dukungan jangka panjang.", cap: "Yang termasuk", ben: "Manfaat bisnis", cta: "Minta layanan ini" },
    items: [
      { title: "Pembuatan Website", short: "Website profesional, landing page, dan company profile.", headline: "Website yang mewakili bisnis Anda dengan baik.", intro: "Website yang cepat, responsif, dan ramah mesin pencari untuk berbagai jenis organisasi.", body: "Kami membangun website company profile, landing page, dan situs berbasis konten dengan struktur yang jelas dan desain yang selaras dengan merek Anda. Bila diperlukan, kami menambahkan sistem manajemen konten agar tim Anda bisa memperbarui situs sendiri.", caps: ["Website company profile", "Landing page", "Manajemen konten (opsional)", "Pengaturan SEO dasar dan performa"], ben: ["Kehadiran online yang kredibel", "Mudah ditemukan pelanggan", "Mudah diperbarui dan dirawat"] },
      { title: "Pengembangan Aplikasi Web", short: "Dasbor kustom, sistem manajemen, portal, dan aplikasi SaaS.", headline: "Aplikasi web yang dibangun sesuai operasional Anda.", intro: "Sistem kustom yang menggantikan kerja manual dengan alur yang andal dan aman.", body: "Dari dasbor internal dan sistem manajemen hingga portal pelanggan dan produk SaaS, kami merancang arsitektur, membangun aplikasi, dan menyiapkannya agar mampu tumbuh seiring penggunaan.", caps: ["Dasbor dan sistem admin", "Portal pelanggan dan mitra", "Pengembangan aplikasi SaaS", "Peran pengguna, keamanan, dan pelaporan"], ben: ["Lebih sedikit kerja manual dan kesalahan", "Satu sumber data yang terpusat", "Fondasi yang siap berkembang"] },
      { title: "Pengembangan Aplikasi Mobile", short: "Pengembangan aplikasi Android dan iOS yang modern.", headline: "Aplikasi mobile yang menyenangkan dipakai.", intro: "Aplikasi intuitif yang menjangkau pengguna di tempat mereka beraktivitas.", body: "Kami merencanakan, merancang, dan membangun aplikasi mobile untuk Android dan iOS, lalu mendampinginya hingga rilis dan pembaruan berikutnya agar produk Anda selalu sejalan dengan penggunanya.", caps: ["Aplikasi Android dan iOS", "Pengembangan lintas platform", "Integrasi API dan backend", "Dukungan rilis dan pembaruan"], ben: ["Menjangkau pelanggan di ponsel mereka", "Pengalaman konsisten di semua perangkat", "Produk yang terus berkembang"] },
      { title: "Pengembangan Software Kustom", short: "Software yang disesuaikan untuk menyelesaikan tantangan bisnis tertentu.", headline: "Software yang dibentuk sesuai tantangan Anda.", intro: "Ketika aplikasi siap pakai tidak cocok, kami membangun software yang cocok.", body: "Kami mempelajari cara kerja organisasi Anda lalu membangun software di sekitarnya, termasuk integrasi dengan sistem yang sudah Anda pakai, sehingga data mengalir antar alat tanpa disalin manual.", caps: ["Software bisnis yang disesuaikan", "Integrasi sistem dan API", "Otomasi proses", "Migrasi dari sistem lama"], ben: ["Sesuai alur kerja nyata Anda", "Menghubungkan alat yang sudah ada", "Biaya jangka panjang lebih rendah dibanding solusi tambal sulam"] },
      { title: "Desain UI/UX", short: "Antarmuka intuitif dan pengalaman digital yang berpusat pada pengguna.", headline: "Desain yang membuat teknologi terasa sederhana.", intro: "Desain berpusat pada pengguna, berdasarkan perilaku mereka yang sebenarnya.", body: "Kami mengubah kebutuhan yang rumit menjadi antarmuka yang jelas melalui wireframe, prototipe, dan uji kegunaan, sehingga pengguna langsung paham produk Anda dan tim bisa membangun dengan percaya diri.", caps: ["Wireframe dan prototipe", "Desain antarmuka dan interaksi", "Design system", "Tinjauan kegunaan"], ben: ["Kepuasan pengguna lebih tinggi", "Lebih sedikit perubahan mahal saat pengembangan", "Merek yang konsisten dan mudah dikenali"] },
      { title: "Pemeliharaan & Dukungan", short: "Bantuan teknis berkelanjutan, peningkatan, dan pemeliharaan sistem.", headline: "Dukungan yang berlanjut setelah peluncuran.", intro: "Tim yang bisa diandalkan untuk menjaga produk Anda tetap aman, cepat, dan terus membaik.", body: "Peluncuran hanyalah awal. Kami menyediakan bantuan teknis, perbaikan bug, pembaruan, dan peningkatan agar website atau aplikasi Anda tetap andal seiring perkembangan bisnis.", caps: ["Dukungan teknis", "Pembaruan dan patch keamanan", "Pemantauan dan perbaikan bug", "Peningkatan fitur"], ben: ["Lebih sedikit downtime dan risiko", "Tim yang memahami sistem Anda", "Perbaikan yang berkelanjutan"] },
    ],
  },
  portfolio: {
    eyebrow: "Portofolio", h: "Proyek Pilihan.", p: "Gambaran singkat cara kami menggarap berbagai jenis produk.",
    notice: "Dua proyek pertama adalah studi kasus produk dengan PDF yang bisa diunduh. Sisanya adalah website dan aplikasi yang sudah live.",
    page: { h: "Karya yang menunjukkan cara kami membangun.", p: "Setiap proyek menampilkan masalah, pendekatan, dan fitur utamanya." },
    l: { industry: "Industri", service: "Layanan", tech: "Teknologi", view: "Lihat proyek", demo: "Demonstrasi", caseTag: "Studi kasus", liveTag: "Website live", visit: "Kunjungi website", features: "Fitur utama", status: "Status", pdf: "Unduh portofolio (PDF)", shots: "Tampilan aplikasi", shotsNote: "Tangkapan layar memakai data contoh dari demo, bukan data klien.", shotsLive: "Tangkapan layar hanya halaman publik. Layar yang berisi data usaha atau karyawan tidak ditampilkan.", open: "Buka ukuran penuh", prev: "Sebelumnya", next: "Berikutnya", overview: "Gambaran umum", challenge: "Tantangan", solution: "Solusi", back: "Kembali ke portofolio", more: "Proyek lainnya", cta: "Diskusikan proyek serupa", demoNote: "Ini adalah proyek demonstrasi yang dibuat MOTEQAR. Bukan proyek klien sungguhan." },
    items: [
      { title: "Hormone Growth Kasir", industry: "Makanan & minuman (warung, kafe, resto)", desc: "Aplikasi kasir dan pengelolaan usaha untuk usaha makanan kecil, dari pesanan sampai laporan laba.", hl: ["Dasbor penjualan, margin, dan peringatan stok", "Kasir di HP atau tablet: tunai, QRIS (dalam uji), transfer, GoFood, GrabFood", "Layar dapur dengan pewaktu per meja", "Laporan laba rugi, menu terlaris, dan pengawasan kasir"], overview: "Aplikasi kasir dan manajemen usaha yang mengikuti jalannya operasional harian, sehingga pekerjaan yang biasanya dicatat di buku terpisah terjadi otomatis.", challenge: "Penjualan ditulis manual, stok dan modal tidak jelas, dan pemilik sulit mengawasi karyawan saat tidak di tempat.", solution: "Satu aplikasi yang menghubungkan pesanan, tiket dapur, pembayaran, stok berbasis resep, dan laporan laba. Dirancang untuk tablet dan HP terlebih dahulu.", features: ["Menu lengkap: Dasbor, Kasir, Penjualan, Layar Dapur, Shift, Promo & voucher, Laporan penjualan, Menu terlaris, Laba rugi, Tanya AI, Pengeluaran, Ringkasan harian, Pengawasan kasir, serta Produk & stok", "Kasir layar sentuh dengan catatan, topping, dan bagi tagihan", "Layar dapur dengan pengingat waktu tunggu", "Tunai, transfer, aplikasi pesan antar, dan QRIS (dalam uji)", "Stok berkurang otomatis sesuai resep", "Laporan laba dan ringkasan harian ke WhatsApp", "Peran karyawan dan PIN manajer untuk tindakan sensitif", "Aplikasi Android dalam versi uji"], shots: [
        ["Masuk", "Halaman masuk dengan nama pengguna dan kata sandi, ada pilihan ingat perangkat. Akun contoh tersedia untuk pemilik, kasir, dapur, dan gudang."],
        ["Dasbor pemilik", "Ringkasan penjualan hari ini, jumlah transaksi, rata-rata per transaksi, dan total bulan ini, lengkap dengan grafik 7 atau 14 hari, metode bayar, dan kotak Perlu perhatian (margin turun, bahan perlu dibeli)."],
        ["Kasir di HP", "Pesanan berjalan dengan atur jumlah, topping atau catatan, diskon, service, PB1, dan bungkus. Ada tombol Bayar, Bagi tagihan, dan Simpan open bill."],
        ["Pembayaran", "Pilih tunai, QRIS (dalam uji), transfer bank, GoFood, atau GrabFood. Tombol uang pas dan pecahan mempercepat input, kembalian dihitung otomatis."],
        ["Layar dapur", "Pesanan masuk per meja dengan pewaktu berwarna (di bawah 8 menit, 8 sampai 14 menit, 15 menit atau lebih) dan catatan seperti tidak pedas. Dapur menekan Siap bila selesai."],
        ["Stok", "Stok bahan per outlet lengkap dengan satuan. Bisa disaring hanya yang menipis atau minus, dan tiap barang punya Kartu stok serta Atur stok."],
        ["Menu terlaris", "Peringkat produk menurut jumlah terjual, penjualan, HPP, laba kotor, dan margin. Rentang tanggal cepat tersedia dan hasilnya bisa diunduh ke Excel (CSV)."],
        ["Laba rugi", "Dari penjualan bersih, HPP, barang keluar, selisih hitung stok, hingga biaya operasional dan laba bersih, dengan persentase di tiap tahap."],
        ["Pengawasan kasir", "Memantau tiap kasir: transaksi, pembatalan, diskon, open bill yang dihapus, dan selisih kas. Tanda muncul bila melewati batas, tetapi bukan bukti; nota dan rekaman tetap perlu diperiksa."],
        ["Dasbor di HP", "Dasbor yang sama menyesuaikan layar ponsel, jadi pemilik bisa memantau dari mana saja."]
      ],
      status: "Demo siap dicoba. Langkah berikutnya: uji lapangan" },
      { title: "Hormone Growth Sekolah", industry: "Pendidikan (SD dan SMP)", desc: "Aplikasi sekolah untuk absensi, nilai, rapor digital, dan portal orang tua dalam satu tempat.", hl: ["Dasbor kehadiran siswa, guru, dan rapor", "Input nilai dengan nilai akhir otomatis", "Absensi wajah tanpa menyimpan foto", "Rapor PDF berkode verifikasi dan portal orang tua"], overview: "Aplikasi sekolah yang mengubah administrasi berulang menjadi beberapa klik, dari guru, kepala sekolah, hingga orang tua.", challenge: "Guru mencatat kehadiran dan nilai di banyak berkas. Kepala sekolah menunggu rapor dan sulit memeriksa nilai yang kosong. Orang tua baru tahu perkembangan anak saat rapor dibagikan.", solution: "Catat, hitung, sahkan, dan bagikan dalam satu tempat. Rapor yang sudah disahkan terkunci, memiliki kode verifikasi, dan bisa diunduh sebagai PDF. Setiap pengguna hanya melihat bagiannya.", features: ["Menu lengkap: Dasbor, Kehadiran, Penilaian, Jadwal, Rapor, Analisis AI, Akademik, Komunikasi (pengumuman), dan Data master (kelas, siswa, guru, orang tua, mata pelajaran)", "Absensi dengan lima status: hadir, sakit, izin, alpa, terlambat", "Nilai akhir dan predikat dihitung otomatis", "Pemeriksaan nilai yang belum lengkap sebelum rapor disahkan", "Rapor terkunci dan bertahap versi, dengan kode verifikasi dan PDF", "Satu akun orang tua untuk beberapa anak, hanya melihat data anaknya", "Absensi wajah opsional yang hanya menyimpan kode rahasia, bukan foto", "Data terpisah untuk setiap sekolah, dengan catatan perubahan"],
      shots: [
        ["Masuk", "Halaman masuk dengan email dan kata sandi, serta pilihan Ingat saya. Di sisi kiri tertulis manfaat utamanya: kehadiran dan nilai rapi, rapor digital, dan portal orang tua."],
        ["Dasbor sekolah", "Kehadiran siswa dan guru hari ini, persentase rapor yang sudah disahkan, jumlah siswa aktif, pengumuman terbit, grafik kehadiran 7 hari, dan kehadiran per kelas."],
        ["Input nilai", "Guru mengisi ulangan harian, UTS, dan UAS per mata pelajaran dan kelas. Nilai akhir, predikat, dan status tuntas langsung terhitung. Kolom kosong berarti belum dinilai."],
        ["Kehadiran siswa", "Catat kehadiran harian per kelas: pilih status tiap siswa (misalnya Hadir) dan tulis catatan bila perlu."],
        ["Absen dengan wajah", "Pilih kelas, nyalakan kamera, lalu siswa menghadap kamera satu per satu. Pencocokan wajah terjadi di perangkat dan foto tidak dikirim ke server."],
        ["Daftar wajah siswa", "Admin mengambil 5 sampel wajah tiap siswa lewat kamera. Yang disimpan hanya data numerik terenkripsi, bukan foto, dan bisa dihapus kapan saja."],
        ["Jadwal mingguan", "Jadwal per kelas atau per guru dari Senin sampai Jumat, lengkap dengan jam pelajaran, nama guru, dan waktu istirahat."],
        ["Pengumuman", "Buat pengumuman dengan sasaran tertentu (semua orang tua dan siswa, satu kelas, siswa saja, atau orang tua saja), berstatus draf atau terbit."],
        ["Data siswa", "Daftar siswa dengan kelas, NISN, NIS, dan status. Tersedia unduh templat Excel, impor dari Excel, dan tambah siswa satu per satu."],
        ["Laporan akademik", "Rekap nilai akhir per kelas dan semester yang bisa diunduh sebagai PDF atau Excel. Rata-rata hanya dihitung bila semua mata pelajaran sudah bernilai."],
        ["Rapor siswa", "Daftar rapor satu kelas dengan status Draf atau Disahkan dan nomor versi. Tombol Buka menampilkan rapor tiap siswa."],
        ["Rapor PDF", "Rapor resmi siap cetak: capaian belajar per mata pelajaran, kehadiran, catatan wali kelas, tanda tangan, versi, dan kode verifikasi untuk memastikan keasliannya."],
        ["Rekap nilai PDF", "Rekap nilai akhir satu kelas dalam satu lembar. Nilai yang belum lengkap dikosongkan dan rata-ratanya tidak dihitung."],
        ["Prompt kustom", "Sekolah menulis instruksi sendiri untuk analisis foto dengan AI. Prompt yang meminta kesimpulan tentang penyakit, suku, agama, atau hal sensitif lain ditolak."],
        ["Portal orang tua", "Orang tua memilih anak dan semester, lalu melihat rapor, nilai, kehadiran, jadwal, dan pengumuman. Rapor yang disahkan bisa diunduh sebagai PDF."],
        ["Portal di HP", "Tampilan orang tua menyesuaikan layar ponsel dengan tab Rapor, Nilai, Kehadiran, Jadwal, dan Pengumuman."],
        ["Dasbor di HP", "Dasbor sekolah juga nyaman dibuka di ponsel: kartu kehadiran, rapor disahkan, siswa aktif, dan pengumuman tersusun ke bawah."],
        ["Dasbor pengelola platform", "Untuk tim pengelola: jumlah sekolah aktif, siswa, pengguna, rapor disahkan, dan sekolah yang memakai Analisis AI."],
        ["Daftar sekolah", "Satu sistem untuk banyak sekolah. Pengelola mendaftarkan sekolah, melihat kota, paket, status, dan jumlah pengguna, lalu mengubahnya."]
      ], status: "Demo siap dicoba dengan data contoh" },
      { title: "Website Rujak Bangkok Premium", industry: "Makanan & minuman (rujak dan buah, 8 outlet di Bandung)", desc: "Website brand yang menampilkan menu, 8 outlet dengan peta, dan tautan pesan online.", hl: ["Menu favorit lengkap dengan harga", "Peta 8 outlet dengan jam buka dan tombol rute", "Pesan online lewat aplikasi pesan antar atau WhatsApp", "Company profile PDF, artikel, dan ulasan Google"], overview: "Website untuk Rujak Bangkok Premium, brand rujak dan buah potong segar di Bandung dan Cimahi yang berdiri sejak 2019. Memperkenalkan brand, menu favorit beserta harga, dan tempat membeli.", challenge: "Pelanggan perlu cepat menemukan outlet terdekat, melihat menu yang paling laris, lalu memesan, biasanya lewat HP. Di sisi lain, brand juga perlu membangun kepercayaan lewat cerita usaha, sertifikat halal, dan ulasan pelanggan.", solution: "Halaman cepat dengan menu favorit dan harga, peta outlet lengkap dengan alamat, jam buka, dan tautan rute, tombol pesan lewat aplikasi pesan antar atau WhatsApp, unduhan company profile, galeri produk, artikel, dan ulasan Google.", features: ["Menu favorit dengan harga dan label terlaris", "Cari outlet: 8 outlet di peta interaktif dengan alamat, jam buka, dan tombol rute", "Pesan online lewat aplikasi pesan antar atau tanya via WhatsApp", "Cerita brand, nilai-nilai, dan nomor sertifikat halal", "Unduh company profile (PDF)", "Galeri produk, artikel, dan ulasan pelanggan dari Google", "Tautan ke Instagram, TikTok, dan Threads"], status: "Sudah live di rujakbangkokpremium.com" },
      { title: "Undangan Digital Pernikahan", industry: "Acara & pernikahan", desc: "Undangan pernikahan yang mudah dibagikan, lengkap dengan sampul, jadwal, peta, RSVP, dan hadiah online.", hl: ["Sampul Buka Undangan dengan musik latar", "Jadwal acara dengan peta tertanam", "RSVP kehadiran, jumlah tamu, dan ucapan", "Hadiah online dengan tombol salin nomor"], overview: "Undangan pernikahan digital yang nyaman dibuka di HP dan dikirim lewat satu tautan. Tamu cukup membukanya dari pesan chat dan menemukan semua informasi acara di satu tempat.", challenge: "Undangan cetak tidak bisa membawa peta, mengumpulkan jawaban, atau memutar musik, dan pasangan perlu tahu siapa saja yang akan hadir tanpa menanyai tamu satu per satu.", solution: "Undangan yang dibuka dengan sampul dan sapaan untuk tamu, lalu menampilkan profil mempelai, hitung mundur, detail akad dan resepsi dengan peta tertanam, formulir RSVP untuk kehadiran, jumlah tamu, dan ucapan, serta bagian hadiah online dengan tombol salin nomor.", features: ["Layar sampul dengan tombol Buka Undangan dan sapaan untuk tamu", "Musik latar dengan tombol hidup atau mati", "Profil mempelai dan hitung mundur menuju hari acara", "Jadwal akad dan resepsi dengan Google Maps tertanam", "Formulir RSVP: kehadiran, jumlah tamu, dan ucapan atau doa", "Hadiah online dengan data e-wallet dan tombol salin", "Tautan ke Instagram dan WhatsApp"], status: "Sudah live di wedding-arifmira.online" },
      { title: "Absensi Karyawan Berbasis GPS", industry: "Operasional (karyawan outlet)", desc: "Aplikasi absensi web di Google Apps Script yang memakai lokasi GPS, lengkap dengan dasbor admin untuk ringkasan, payroll, jadwal, dan outlet.", hl: ["Karyawan absen dari HP dengan lokasi GPS", "Dasbor admin dengan login", "Kalender absensi dengan ekspor dan impor", "Menu payroll, jabatan, jadwal, dan outlet"], overview: "Aplikasi web absensi karyawan untuk outlet Rujak Bangkok Premium. Berjalan di Google Apps Script sehingga tidak butuh server sendiri, dan memakai lokasi GPS perangkat saat karyawan absen.", challenge: "Karyawan outlet bekerja di tempat dan shift yang berbeda, sementara pemilik ingin absensi tercatat dengan sederhana, dari HP, tanpa perangkat tambahan atau sistem berbayar.", solution: "Halaman ringan tempat karyawan mengetik nama lalu absen dengan lokasi GPS, ditambah dasbor admin terpisah yang dilindungi kata sandi untuk pengelola. Semuanya berjalan di Google Apps Script.", features: ["Karyawan mencari namanya (minimal 3 huruf) lalu absen dari HP", "Absensi berbasis lokasi GPS", "Dasbor admin dengan login dan sembilan menu: Ringkasan, Karyawan, Absensi, Pengajuan, Perlu Ditinjau, Payroll, Jabatan, Jadwal, dan Outlet", "Ringkasan: karyawan aktif, hadir hari ini, terlambat, belum absen pulang, pengajuan izin, dan yang perlu ditinjau", "Kalender absensi per rentang tanggal dengan ekspor dan impor, serta peringkat yang paling sering terlambat", "Periode payroll berjalan dan status outlet yang siap absensi", "Berjalan di Google Apps Script, tanpa server yang perlu dirawat"], status: "Sudah live: halaman karyawan dan dasbor admin" },
    ],
  },
  why: { eyebrow: "Mengapa memilih kami", h: "Lebih dari Sekadar Pengembangan.", items: [["Solusi berorientasi bisnis", "Kami mulai dari tujuan Anda, bukan dari daftar teknologi."], ["Praktik pengembangan modern", "Perangkat terkini, code review, dan pengujian menjadi bagian dari pekerjaan."], ["Antarmuka responsif dan mudah diakses", "Produk yang bisa dipakai semua orang di semua perangkat."], ["Arsitektur yang skalabel", "Fondasi yang siap tumbuh tanpa harus dibangun ulang."], ["Komunikasi yang transparan", "Ruang lingkup jelas, kabar berkala, tanpa kejutan."], ["Dukungan pascaluncur", "Kami tetap mendampingi setelah produk Anda tayang."]] },
  process: {
    eyebrow: "Proses", h: "Dari Ide hingga Peluncuran.", p: "Empat langkah yang jelas supaya Anda selalu tahu posisi proyek Anda.",
    page: { h: "Jalur yang jelas dari ide hingga peluncuran.", p: "Empat langkah yang menjaga proyek Anda transparan, terukur, dan fokus pada tujuan." },
    steps: [["Konsultasi", "Ceritakan kebutuhan dan tujuan proyek Anda lewat formulir atau WhatsApp."], ["Penawaran", "Kami kirim rincian pekerjaan, biaya, dan perkiraan waktu secara tertulis."], ["Pengerjaan", "Kami mendesain dan membangun, lalu menunjukkan perkembangannya agar Anda bisa memberi masukan."], ["Revisi", "Kami perbaiki sesuai masukan Anda, lalu serahkan hasilnya dan bantu setelah peluncuran."]],
  },
  pricing: {
    eyebrow: "Harga", h: "Solusi yang Sesuai Kebutuhan Anda.", p: "Setiap proyek berbeda, jadi kami memberi penawaran berdasarkan ruang lingkup, bukan harga tetap.",
    page: { h: "Paket yang disesuaikan dengan ruang lingkup Anda.", p: "Pilih paket yang paling dekat dengan kebutuhan Anda. Kami akan memastikan detailnya dan menyiapkan penawaran tertulis." },
    scope: "Cakupan umum", quote: "Minta Penawaran",
    note: "Harga akhir bergantung pada ruang lingkup proyek, fitur, dan kebutuhan. Kami menyiapkan penawaran tertulis yang jelas setelah diskusi singkat.",
    plans: { starter: { name: "STARTER", title: "Untuk landing page dan website perusahaan sederhana.", scope: ["Satu halaman atau website kecil", "Desain responsif", "Formulir kontak", "Pengaturan SEO dasar"] }, business: { name: "BUSINESS", title: "Untuk website perusahaan profesional dan platform bisnis.", scope: ["Website perusahaan multi-halaman", "Desain dan struktur konten kustom", "Manajemen konten", "Integrasi pihak ketiga"] }, custom: { name: "CUSTOM", title: "Untuk aplikasi kompleks, dasbor, dan software kustom.", scope: ["Aplikasi web atau mobile", "Dasbor dan sistem manajemen", "Integrasi sistem", "Perencanaan dan dukungan khusus"] } },
  },
  testi: { eyebrow: "Testimoni", h: "Kata Klien Kami.", p: "Testimoni klien yang sebenarnya akan tampil di sini setelah tersedia. Kartu di bawah ini masih placeholder.", items: [["Testimoni placeholder. Masukan asli dari klien sungguhan akan ditampilkan di sini."], ["Testimoni placeholder. Masukan asli dari klien sungguhan akan ditampilkan di sini."], ["Testimoni placeholder. Masukan asli dari klien sungguhan akan ditampilkan di sini."]], who: "Nama klien", role: "Perusahaan, jabatan" },
  faq: { eyebrow: "FAQ", h: "Pertanyaan yang Sering Diajukan.", items: [
    ["Berapa lama proses pengembangannya?", "Tergantung ruang lingkupnya. Website sederhana biasanya memakan waktu beberapa minggu, sedangkan aplikasi kustom lebih lama. Estimasi waktu kami sampaikan di proposal sebelum pekerjaan dimulai."],
    ["Bisakah saya meminta fitur khusus?", "Bisa. Fitur khusus adalah keahlian kami. Ceritakan kebutuhan Anda, dan kami akan merekomendasikan pendekatan terbaik serta menjelaskan pengaruhnya terhadap ruang lingkup."],
    ["Apakah website-nya responsif?", "Ya. Setiap website yang kami bangun dirancang agar nyaman dipakai di ponsel, tablet, maupun layar desktop."],
    ["Bisakah saya mengelola konten website sendiri?", "Bisa. Kami dapat menyertakan sistem manajemen konten sehingga Anda bisa memperbarui teks, gambar, dan halaman sendiri, dan kami jelaskan cara memakainya."],
    ["Apakah Anda menyediakan pemeliharaan?", "Ya. Kami menyediakan pemeliharaan dan dukungan teknis, termasuk pembaruan, perbaikan, dan peningkatan setelah peluncuran."],
    ["Bisakah Anda mendesain ulang website yang sudah ada?", "Bisa. Kami dapat menyegarkan tampilan, meningkatkan performa, dan menata ulang konten, sambil mempertahankan bagian yang sudah berjalan baik."],
    ["Bagaimana proses pembayarannya?", "Ketentuan pembayaran disepakati dalam penawaran tertulis, biasanya dibagi dalam beberapa tahap sesuai tonggak proyek. Rinciannya bergantung pada ruang lingkup proyek."],
  ] },
  cta: { h: "Punya Proyek di Pikiran Anda?", p: "Mari diskusikan ide Anda dan ubah menjadi solusi digital yang bermanfaat bagi bisnis Anda.", btn: "Ayo Bahas Proyek Anda" },
  about: {
    eyebrow: "Tentang", h: "Software house yang dibangun di atas kreativitas.", quote: ["Think Beyond. ", "Create Tomorrow."],
    origin: [["Asal nama", "Motékar", "Kata dalam bahasa Sunda yang berarti kreatif, banyak akal, dan inovatif. Itulah cara kerja yang kami inginkan."], ["Yang kami kerjakan", "Software dari hulu ke hilir", "Kami merancang dan membangun website, aplikasi, dan software kustom untuk kebutuhan bisnis yang nyata."], ["Cara kerja kami", "Jelas dan kolaboratif", "Bahasa yang mudah dipahami, ruang lingkup yang transparan, dan kabar berkala sejak percakapan pertama hingga peluncuran."]],
    whoL: "Siapa yang kami layani", whoP: "Kami membangun untuk tim dari berbagai ukuran yang menginginkan teknologi yang benar-benar berfungsi.", who: ["Usaha kecil dan menengah", "Startup", "Perusahaan korporasi", "Organisasi", "Wirausaha", "Institusi pendidikan"],
  },
  contact: {
    eyebrow: "Kontak", h: "Mari Bahas Proyek Anda.", p: "Ceritakan ide Anda dan apa yang ingin dicapai. Kami akan meninjaunya dan menghubungi Anda kembali.",
    emailL: "Email", emailV: "Alamat email akan dipublikasikan di sini.", waL: "WhatsApp", waV: "Nomor WhatsApp akan dipublikasikan di sini.", respL: "Waktu respons", respV: "Waktu respons akan dikonfirmasi setelah kanal kontak aktif.",
    f: { name: "Nama lengkap", email: "Email", company: "Nama perusahaan", opt: "(opsional)", service: "Layanan yang dibutuhkan", servicePh: "Pilih layanan", budget: "Perkiraan anggaran", budgetPh: "Pilih kisaran", details: "Deskripsi proyek", detailsPh: "Ceritakan proyek, tujuan, dan target waktu Anda", send: "Kirim Permintaan", sending: "Mengirim...", req: "Kolom bertanda * wajib diisi.", pkg: "Paket terpilih" },
    services: { website: "Pembuatan Website", webapp: "Pengembangan Aplikasi Web", mobile: "Pengembangan Aplikasi Mobile", software: "Pengembangan Software Kustom", design: "Desain UI/UX", support: "Pemeliharaan & Dukungan", other: "Lainnya / belum yakin" },
    budgets: { lt5: "Di bawah Rp 5 juta", "5-15": "Rp 5–15 juta", "15-50": "Rp 15–50 juta", gt50: "Di atas Rp 50 juta", unsure: "Belum yakin" },
    v: { name: "Mohon isi nama lengkap Anda.", email: "Mohon masukkan alamat email yang valid.", service: "Mohon pilih layanan yang dibutuhkan.", details: "Mohon tulis sedikit lebih banyak detail (minimal 10 karakter)." },
    ok: "Terima kasih. Permintaan Anda sudah tercatat dan kami akan segera menghubungi Anda.", preview: "Mode pratinjau: formulir ini belum terhubung ke kotak masuk.", bad: "Periksa kolom yang ditandai lalu coba lagi.", fail: "Terjadi kendala saat mengirim. Silakan coba lagi sebentar lagi.",
  },
  nf: { h: "Halaman tidak ditemukan", p: "Halaman yang Anda cari tidak ada atau sudah dipindahkan.", btn: "Kembali ke Beranda" },
  fab: { wa: "Chat WhatsApp", title: "Chat dengan MOTEQAR", desc: "Ceritakan kebutuhan Anda, kami balas secepatnya.", chat: "Buka WhatsApp", soon: "Nomor WhatsApp segera diumumkan. Gunakan formulir proyek untuk sementara.", msg: "Halo MOTEQAR, saya ingin bertanya tentang proyek.", email: "Kirim email", social: "Instagram" },
  footer: { tag: "Software house Indonesia yang membangun website, aplikasi mobile, dan software kustom.", pages: "Halaman", services: "Layanan", contact: "Kontak", email: "Email: segera diumumkan", wa: "WhatsApp: segera diumumkan", social: "Media sosial: segera diumumkan", rights: "Hak cipta dilindungi." },
},
};

/* =====================================================================
   APP — one page, anchor navigation (#home, #about, #services, ...)
   Icons are inline Heroicons from icons.js, so no icon script is needed.
   ===================================================================== */
const DEFAULT_LANG = "id"; // Indonesian first; a visitor who picks English keeps it (saved in localStorage)
const $ = id => document.getElementById(id);
const safe = (fn, d) => { try { return fn(); } catch { return d; } };
let lang = safe(() => localStorage.getItem("mq-lang"), null);
if (!D[lang]) lang = DEFAULT_LANG;
let T = D[lang], menuOpen = false, active = "home";

// ic() = outline UI icon, ics() = solid illustrative icon. Size comes from CSS on i.hi.
const svgIcon = (inner, attrs, cls) => `<i class="hi ${cls}" aria-hidden="true"><svg viewBox="0 0 24 24" ${attrs}>${inner || ""}</svg></i>`;
// Brand glyphs (Heroicons has none): WhatsApp and Instagram, drawn as outlines to match the other icons.
HI_O.whatsapp = '<path stroke-linecap="round" stroke-linejoin="round" d="M3.2 20.8l1.3-4.6A8.7 8.7 0 1 1 8 19.6l-4.8 1.2z"/><path stroke-linecap="round" stroke-linejoin="round" d="M9.1 8.3c-.3.5-.2 1.500.9 2.900 1.100 1.400 2.200 2.100 3.100 2.300.7.100 1.200-.200 1.500-.700l-1.700-1-.7.600c-.7-.3-1.400-1-1.800-1.800l.6-.700-.9-1.600c-.4 0-.7.100-1 .0z"/>';
HI_O.instagram = '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".9" fill="currentColor" stroke="none"/>';
const ic = (n, cls = "") => svgIcon(HI_O[n], 'fill="none" stroke="currentColor" stroke-width="2"', cls);
const ics = (n, cls = "") => svgIcon(HI_S[n], 'fill="currentColor"', cls);
const BRAND = `<strong class="nm">MOTE<em class="bq" aria-hidden="true"><b class="k">K</b><b class="q">Q</b><b class="qy">Q</b></em>AR</strong><span>.</span>`;
const NAV = ["services", "portfolio", "process", "pricing"]; // also the section ids

/* ---------- Shell ---------- */
const FLAG = { // inline SVG flags, no emoji
  id: `<span class="flag" aria-hidden="true"><svg viewBox="0 0 3 2" preserveAspectRatio="none"><path fill="#fff" d="M0 0h3v2H0z"/><path fill="#E70011" d="M0 0h3v1H0z"/></svg></span>`,
  en: `<span class="flag" aria-hidden="true"><svg viewBox="0 0 60 30" preserveAspectRatio="none"><path fill="#012169" d="M0 0h60v30H0z"/><path stroke="#fff" stroke-width="6" d="M0 0l60 30M60 0L0 30"/><path stroke="#C8102E" stroke-width="3" d="M0 0l60 30M60 0L0 30"/><path stroke="#fff" stroke-width="10" d="M30 0v30M0 15h60"/><path stroke="#C8102E" stroke-width="6" d="M30 0v30M0 15h60"/></svg></span>`,
};
const langSwitch = () => `<div class="lang" role="group" aria-label="${T.nav.language}">${["en", "id"].map(l => `<button type="button" data-lang="${l}" aria-pressed="${l === lang}" lang="${l}">${FLAG[l]}${l.toUpperCase()}</button>`).join("")}</div>`;

function setActive(k) {
  active = k;
  document.querySelectorAll("[data-nav]").forEach(a => a.setAttribute("aria-current", a.dataset.nav === k));
}
function renderNav() {
  $("nav").innerHTML = `<div class="wrap">
    <a class="brand" href="#home" aria-label="MOTEQAR — ${T.nav.home}">${BRAND}</a>
    <nav class="links" aria-label="Primary">${NAV.map(k => `<a href="#${k}" data-nav="${k}">${T.nav[k]}</a>`).join("")}</nav>
    <div class="right">${langSwitch()}${LOGIN_URL ? `<a class="btn-login" href="${LOGIN_URL}">${ic("lock-closed")}<span>${T.nav.login}</span></a>` : ""}
      <button class="menu-btn" id="menuBtn" type="button" aria-expanded="${menuOpen}" aria-controls="mobile" aria-label="${menuOpen ? T.nav.close : T.nav.menu}">${ic(menuOpen ? "x-mark" : "bars-3")}</button></div>
  </div>`;
  // Mobile menu lives outside <header>: backdrop-filter on the header would trap its position:fixed.
  const m = $("mobile");
  m.classList.toggle("open", menuOpen);
  m.innerHTML = `${NAV.map(k => `<a href="#${k}" data-nav="${k}">${T.nav[k]}</a>`).join("")}${LOGIN_URL ? `<a class="btn btn-soft" href="${LOGIN_URL}">${ic("lock-closed")}<span>${T.nav.login}</span></a>` : ""}`;
  setActive(active);
  onScroll();
}
function renderFooter() {
  const f = T.footer;
  $("footer").innerHTML = `<div class="wrap"><div class="fgrid">
    <div><a class="brand" href="#home">${BRAND}</a><p class="muted small" style="margin-top:16px;max-width:300px">${f.tag}</p></div>
    <div><h4>${f.contact}</h4><div class="fsocial">${[
      CONTACT.email && ["envelope", `mailto:${CONTACT.email}`, "Email"],
      CONTACT.whatsapp && ["whatsapp", `https://wa.me/${waNum()}`, "WhatsApp"],
      CONTACT.social && ["instagram", CONTACT.social, "Instagram"],
    ].filter(Boolean).map(([i, h, l]) => `<a href="${h}"${h.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${ic(i)}<span>${l}</span></a>`).join("")}</div></div>
  </div><div class="fbot"><span>&copy; ${new Date().getFullYear()} MOTEQAR. ${f.rights}</span></div></div>`;
}

/* ---------- Illustrations ---------- */
const spark = c => `<svg class="spark ${c}" viewBox="0 0 56 56" aria-hidden="true"><path d="M8 36C13 20 27 11 46 13" fill="none" stroke="#F5C542" stroke-width="5" stroke-linecap="round"/><path d="M12 48c4-6 9-9 16-10" fill="none" stroke="#F5C542" stroke-width="5" stroke-linecap="round"/></svg>`;
const coverSrc = i => PRJ[i].coverUrl || (PRJ[i].dir ? `portfolio/${PRJ[i].dir}/${PRJ[i].cover}.webp` : "");
const thumb = i => `<div class="thumb">${coverSrc(i) ? `<img src="${coverSrc(i)}" alt="" loading="lazy">` : ""}<span class="badge">${PRJ[i].kind === "case" ? T.portfolio.l.caseTag : PRJ[i].kind === "live" ? T.portfolio.l.liveTag : T.portfolio.l.demo}</span></div>`;

/* ---------- Sections ---------- */
const head = (badge, h, p, cls = "") => `<div class="head rv ${cls}"><span class="badge">${badge}</span><h2>${h}</h2>${p ? `<p>${p}</p>` : ""}</div>`;
const btn = (href, cls, label, icon, attrs = "") => `<a class="btn ${cls}" href="${href}" ${attrs}>${label}${icon ? ic(icon) : ""}</a>`;
const notice = txt => `<p class="note rv" role="note">${ic("information-circle")}<span>${txt}</span></p>`;
const section = (id, cls, inner) => `<section ${id ? `id="${id}"` : ""} class="${cls}"><div class="wrap">${inner}</div></section>`;
const list = items => `<ul class="ticks">${items.map(c => `<li>${ic("check")}${c}</li>`).join("")}</ul>`;
const d = i => `style="--d:${i}"`; // stagger index for the reveal animation

// Hero art, kept calm on purpose: one soft blob with thin outlines, a faint dot grid and a few yellow marks.
const abBurst = (c, w = 4) => `<g class="dr3" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"><path d="M0 0L-5 -24M20 4L36 -14M-22 12L-42 0"/></g>`;
const HERO_ART = `<svg class="hero-art d" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <defs><linearGradient id="hb1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F1F5FF"/><stop offset="1" stop-color="#DCE6FF"/></linearGradient><pattern id="hd1" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="2.2" fill="#B9CCF7"/></pattern></defs>
  <rect x="40" y="90" width="176" height="132" fill="url(#hd1)" opacity=".75"/>
  <rect x="990" y="330" width="154" height="110" fill="url(#hd1)" opacity=".6"/>
  <g class="soft"><path d="M120 250C100 130 250 52 430 40C650 28 910 40 1060 112C1170 166 1170 320 1060 392C930 470 650 480 430 462C250 446 130 370 120 250Z" fill="url(#hb1)"/></g>
  <g class="soft s2" fill="none" stroke="#C9D8FA" stroke-width="1.8"><path transform="translate(-26 10)" d="M120 250C100 130 250 52 430 40C650 28 910 40 1060 112C1170 166 1170 320 1060 392C930 470 650 480 430 462C250 446 130 370 120 250Z"/><path transform="translate(24 -12)" d="M120 250C100 130 250 52 430 40C650 28 910 40 1060 112C1170 166 1170 320 1060 392C930 470 650 480 430 462C250 446 130 370 120 250Z"/></g>
  <path class="dr" pathLength="1" d="M190 120C214 96 246 88 276 94" fill="none" stroke="#F5C542" stroke-width="6" stroke-linecap="round"/>
  <g transform="translate(900 128)">${abBurst("#F5C542", 5)}</g>
  <g transform="translate(1110 196) scale(.8)">${abBurst("#F5C542", 5)}</g>
  <g transform="translate(112 356) rotate(180) scale(.8)">${abBurst("#F5C542", 5)}</g>
</svg>
<svg class="hero-art m" viewBox="0 0 343 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <defs><linearGradient id="hb2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F1F5FF"/><stop offset="1" stop-color="#DCE6FF"/></linearGradient><pattern id="hd2" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.8" fill="#B9CCF7"/></pattern></defs>
  <rect x="6" y="40" width="108" height="72" fill="url(#hd2)" opacity=".7"/>
  <rect x="236" y="320" width="100" height="72" fill="url(#hd2)" opacity=".55"/>
  <g class="soft"><path d="M14 214C6 110 78 44 172 38C268 32 336 100 332 216C328 330 262 396 168 396C78 396 20 330 14 214Z" fill="url(#hb2)"/></g>
  <g class="soft s2" fill="none" stroke="#C9D8FA" stroke-width="1.6"><path transform="translate(-6 8)" d="M14 214C6 110 78 44 172 38C268 32 336 100 332 216C328 330 262 396 168 396C78 396 20 330 14 214Z"/><path transform="translate(6 -8)" d="M14 214C6 110 78 44 172 38C268 32 336 100 332 216C328 330 262 396 168 396C78 396 20 330 14 214Z"/></g>
  <path class="dr" pathLength="1" d="M26 74C42 54 66 48 88 52" fill="none" stroke="#F5C542" stroke-width="5" stroke-linecap="round"/>
  <g transform="translate(300 96) scale(.7)">${abBurst("#F5C542", 5)}</g>
  <g transform="translate(34 330) rotate(180) scale(.7)">${abBurst("#F5C542", 5)}</g>
</svg>`;

const secHero = () => `<section class="hero" id="home"><div class="wrap">
  <div class="blob">
    ${HERO_ART}
    ${CYCLE_OFFSETS.map((o, i) => `<span class="float cyc f${i + 1}" aria-hidden="true">${CYCLE_ICONS.map((n, k) => `<span style="animation-delay:${(k + o) % CYCLE_ICONS.length * STEP}s">${ics(n)}</span>`).join("")}</span>`).join("")}
    <span class="badge in1">${T.hero.eyebrow}</span>
    <h1><span class="ln in2">${T.hero.h1[0]}</span><br><span class="rot in3" style="--dur:${(T.hero.rot.length + 1) * STEP}s" aria-hidden="true">${[T.hero.h1[1], ...T.hero.rot].map((w, i) => `<span style="animation-delay:${i * STEP}s"><em class="mark">${w}</em></span>`).join("")}</span><span class="sr">${[T.hero.h1[1], ...T.hero.rot].join(", ")}</span></h1>
  </div>
  <div class="hero-row in4"><p class="lead">${T.hero.p}</p>
    <div class="hero-cta"><div class="row">${btn("#portfolio", "btn-soft", T.hero.cta2)}</div><p class="small muted">${T.hero.note}</p></div></div>
</div></section>`;

const secFamiliar = () => section("", "tint fam", `${head(T.familiar.badge, `<span class="mark">${T.familiar.h}</span>`, T.familiar.p)}
  <div class="grid3">${T.familiar.items.map((x, i) => `<article class="card rv" ${d(i)}><div class="top"><span class="num">0${i + 1}</span><div class="ico sm">${ics(FAM_ICONS[i])}</div></div><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join("")}</div>`);

const secTrust = () => section("", "", `${head(T.trust.eyebrow, T.trust.h, T.trust.p, "center")}
  <div class="grid4">${T.trust.items.map((x, i) => `<article class="card rv" ${d(i)}><div class="ico">${ics(TRUST_ICONS[i])}</div><h3>${x[0]}</h3><p class="muted" style="font-size:.96rem">${x[1]}</p></article>`).join("")}</div>`);

const secAbout = () => section("about", "tint", `<div class="story"><div class="rv"><span class="badge">${T.story.badge}</span><h2 style="margin:16px 0 20px">${T.story.h}</h2><p class="lead">${T.story.p1}</p><p class="muted">${T.story.p2}</p><div class="aksara"><span class="aksara-glyph" lang="su">ᮙᮧᮒᮦᮊᮁ</span><small>${T.story.script}</small></div></div><div class="wm rv" aria-hidden="true">${[..."MOTE"].map((ch, i) => `<span class="l" style="--i:${i}">${ch}</span>`).join("")}<span class="slot" style="--i:4"><b class="k">K</b><b class="q">Q</b><b class="qy">Q</b></span>${[..."AR"].map((ch, i) => `<span class="l" style="--i:${i + 5}">${ch}</span>`).join("")}</div></div>
  <div class="head rv" style="margin:72px 0 32px"><span class="badge">${T.why.eyebrow}</span><h2>${T.why.h}</h2></div>
  <div class="why slider" style="margin-top:0">${T.why.items.map((x, i) => `<article class="card rv" ${d(i % 3)}><span class="ico xs">${ics(WHY_ICONS[i])}</span><div><h3>${x[0]}</h3><p>${x[1]}</p></div></article>`).join("")}</div>`);

const secPortfolio = () => section("portfolio", "tint", `${head(T.portfolio.eyebrow, T.portfolio.h, T.portfolio.p)}
  <div class="grid2 slider port">${PRJ.map((p, i) => { const it = T.portfolio.items[i], l = T.portfolio.l; return `<article class="card proj rv" ${d(i % 2)}>${thumb(i)}<div class="body">
    <h3>${it.title}</h3><div class="meta"><span><b>${l.industry}:</b> ${it.industry}</span></div>
    <ul class="hl">${it.hl.map(h => `<li>${ic("check")}<span>${h}</span></li>`).join("")}</ul><div class="chips">${p.tech.map(t => `<span class="chip">${t}</span>`).join("")}</div>
    <button class="link" type="button" data-proj="${i}">${l.view}${ic("arrow-right")}</button></div></article>`; }).join("")}</div>${notice(T.portfolio.notice)}`);

const secProcess = () => section("process", "", `<div class="flow">
  <div class="flow-intro rv"><span class="badge">${T.process.eyebrow}</span><h2>${T.process.h}</h2><p>${T.process.p}</p></div>
  <ol class="flow-steps">${T.process.steps.map((x, i) => `<li class="fstep s${i + 1} rv" ${d(i)} tabindex="0"><span class="fnum">0${i + 1}</span><h3>${x[0]}</h3><p>${x[1]}</p></li>`).join("")}</ol></div>`);

const secPricing = () => section("pricing", "tint", `${head(T.pricing.eyebrow, T.pricing.h, T.pricing.p)}
  <div class="grid3 slider">${PLAN_IDS.map((id, i) => { const p = T.pricing.plans[id]; return `<article class="card plan rv" ${d(i)}><div class="top"><span class="nm">${p.name}</span><div class="ico sm">${ics(PLAN_ICONS[id] || "sparkles")}</div></div><h3>${p.title}</h3><h4>${T.pricing.scope}</h4>${list(p.scope)}
    ${btn("#contact", "btn-white", T.pricing.quote, "arrow-right", `data-package="${id}"`)}</article>`; }).join("")}</div>${notice(T.pricing.note)}`);

const secTesti = () => section("", "", `${head(T.testi.eyebrow, T.testi.h, T.testi.p)}
  <div class="grid3">${T.testi.items.map((q, i) => `<figure class="card quote rv" ${d(i)}><span class="qmark" aria-hidden="true">“</span><q>${q[0]}</q><figcaption class="who"><span class="av"></span><span><b>${T.testi.who}</b><small>${T.testi.role}</small></span></figcaption></figure>`).join("")}</div>`);

const FAQ_PER = 3; // questions shown at once; the page rotates through the rest
const secFaq = () => { const it = T.faq.items, n = Math.ceil(it.length / FAQ_PER); return section("faq", "", `${head(T.faq.eyebrow, T.faq.h, "", "center")}
  <div class="faq rv" id="faqbox">${Array.from({ length: n }, (_, p) => `<div class="fpage${p ? "" : " on"}">${it.slice(p * FAQ_PER, (p + 1) * FAQ_PER).map(x => `<div class="qa"><button type="button" class="q" aria-expanded="false">${x[0]}${ic("plus")}</button><div class="ans"><div><p>${x[1]}</p></div></div></div>`).join("")}</div>`).join("")}</div>
  <div class="fdots" role="group" aria-label="FAQ">${Array.from({ length: n }, (_, p) => `<button type="button" data-fp="${p}" aria-label="${p + 1} / ${n}" aria-pressed="${!p}"></button>`).join("")}</div>`); };

const secCta = () => `<section style="padding:56px 0"><div class="wrap"><div class="cta-card rv"><span class="cta-ico" aria-hidden="true">${ics("rocket-launch")}</span><div class="cta-txt"><h2>${T.cta.h}</h2><p>${T.cta.p}</p></div>${btn("#contact", "btn-primary", T.cta.btn, "arrow-up-right")}</div></div></section>`;

// The contact form lives in a popup (#cdlg), opened by every "#contact" link and by the floating button.
const contactDialog = () => { const c = T.contact, f = c.f; return `<button class="x" type="button" data-cclose aria-label="${T.common.close}">${ic("x-mark")}</button>
  <div class="db"><span class="badge" style="width:fit-content">${c.eyebrow}</span><h3 id="cdlg-title" style="font-size:1.7rem">${c.h}</h3><p class="muted">${c.p}</p>
  <form id="cf" class="cform" novalidate>
      <p class="pkg">${ic("cube")}<span>${f.pkg}: <b></b></span></p>
      <input type="hidden" name="package" value="">
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="fields">
        <div class="field"><label for="name">${f.name} *</label><input id="name" name="name" autocomplete="name" required><span class="err" id="e-name" aria-live="polite"></span></div>
        <div class="field"><label for="email">${f.email} *</label><input id="email" name="email" type="email" autocomplete="email" required><span class="err" id="e-email" aria-live="polite"></span></div>
        <div class="field"><label for="company">${f.company} <small>${f.opt}</small></label><input id="company" name="company" autocomplete="organization"></div>
        <div class="field"><label for="service">${f.service} *</label><select id="service" name="service" required><option value="">${f.servicePh}</option>${Object.entries(c.services).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select><span class="err" id="e-service" aria-live="polite"></span></div>
        <div class="field full"><label for="budget">${f.budget} <small>${f.opt}</small></label><select id="budget" name="budget"><option value="">${f.budgetPh}</option>${Object.entries(c.budgets).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select></div>
        <div class="field full"><label for="details">${f.details} *</label><textarea id="details" name="details" required placeholder="${f.detailsPh}"></textarea><span class="err" id="e-details" aria-live="polite"></span></div>
      </div>
      <div class="foot-row"><span class="muted small">${f.req}</span><button class="btn btn-primary" id="send" type="submit"><span>${f.send}</span>${ic("paper-airplane")}</button></div>
      <div class="msg ok" id="m-ok" role="status">${ic("check-circle")}<span>${c.ok}${FORM_ENDPOINT ? "" : `<br><small>${c.preview}</small>`}</span></div>
      <div class="msg bad" id="m-bad" role="alert">${ic("exclamation-circle")}<span id="m-bad-t">${c.bad}</span></div>
    </form>
  <p class="muted small">${c.respL}: ${c.respV}</p></div>`; };
function openContact() { const d = $("cdlg"); if (!d.open) d.showModal(); }
const fabHtml = () => { const F = T.fab, wa = CONTACT.whatsapp ? `https://wa.me/${waNum()}?text=${encodeURIComponent(F.msg)}` : "";
  return `<div class="wa-pop" id="waPop" role="dialog" aria-label="${F.title}" hidden><b>${F.title}</b><p>${F.desc}</p>
    ${wa ? `<a class="btn btn-wa" href="${wa}" target="_blank" rel="noopener">${ic("whatsapp")}<span>${F.chat}</span></a>` : `<p class="small muted">${F.soon}</p>`}
    <div class="alts">${CONTACT.email ? `<a href="mailto:${CONTACT.email}">${ic("envelope")}<span>${F.email}</span></a>` : ""}${CONTACT.social ? `<a href="${CONTACT.social}" target="_blank" rel="noopener">${ic("instagram")}<span>${F.social}</span></a>` : ""}</div></div>
  <button class="fab-wa" id="fabWa" type="button" aria-expanded="false" aria-controls="waPop" aria-label="${F.wa}">${ic("whatsapp")}</button>
  <button class="fab-pill" type="button" data-open-contact>${ic("paper-airplane")}<span>${T.nav.cta}</span></button>`; };
function setWa(open) { const p = $("waPop"), b = $("fabWa"); if (!p) return; p.hidden = !open; b.setAttribute("aria-expanded", open); b.classList.toggle("open", open); }

const secBuild = () => { const card = (x, i, clone) => `<article class="card"${clone ? ' aria-hidden="true"' : ""}><div class="ico">${ics(BUILD[i].icon)}</div><h3>${x[0]}</h3><p>${x[1]}</p></article>`;
  // Two copies side by side: the track slides left by exactly one copy, so the loop never shows a jump. Pauses on hover.
  return section("services", "", `${head(T.builds.badge, T.builds.h, T.builds.p)}
  <div class="marquee rv" role="group" aria-label="${T.builds.h}"><div class="marquee-track">${[0, 1].map(k => T.builds.items.map((x, i) => card(x, i, k)).join("")).join("")}</div></div>
  ${notice(T.builds.note)}`); };

/* ---------- Render ---------- */
// Keyframes depend on how many words rotate, so they are written here: fade in 0.4s, hold to 2.1s, gone by 2.5s of each word's own turn.
function setRotKeyframes(total) {
  let st = $("rotkf"); if (!st) { st = document.createElement("style"); st.id = "rotkf"; document.head.appendChild(st); }
  const p = x => (x / total * 100).toFixed(2);
  st.textContent = `@keyframes rot{0%{opacity:0;translate:0 .5em}${p(.4)}%,${p(2.1)}%{opacity:1;translate:0 0}${p(2.5)}%,100%{opacity:0;translate:0 -.5em}}`;
}
let io;
function render() {
  T = D[lang];
  const [title, desc] = T.meta.home;
  document.documentElement.lang = lang;
  document.title = title;
  document.querySelector('meta[name="description"]').setAttribute("content", desc);
  for (const [sel, v] of [['property="og:title"', title], ['property="og:description"', desc], ['name="twitter:title"', title], ['name="twitter:description"', desc]]) document.querySelector(`meta[${sel}]`).setAttribute("content", v);
  document.querySelector('meta[property="og:locale"]').setAttribute("content", lang === "id" ? "id_ID" : "en_US");
  $("skip").textContent = T.nav.skip;
  $("main").innerHTML = [secHero, secBuild, secAbout, secPortfolio, secProcess, secPricing, secFaq].map(f => f()).join("");
  setRotKeyframes((T.hero.rot.length + 1) * STEP);
  $("cdlg").innerHTML = contactDialog(); $("fab").innerHTML = fabHtml();
  renderNav(); renderFooter();
  io && io.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .08 });
  $("main").querySelectorAll(".rv").forEach(el => io.observe(el));
  bindForm(); bindSliders(); bindFaq();
}

/* FAQ: shows 3 questions, swaps to the next 3 every 9s; paused while hovered, focused or any answer is open. */
let faqTimer;
function bindFaq() {
  clearInterval(faqTimer);
  const box = $("faqbox"), pages = [...box.children], dots = [...document.querySelectorAll(".fdots button")];
  let cur = 0;
  const show = p => { cur = (p + pages.length) % pages.length; pages.forEach((e, k) => e.classList.toggle("on", k === cur)); dots.forEach((d, k) => d.setAttribute("aria-pressed", k === cur)); };
  dots.forEach((d, k) => d.addEventListener("click", () => show(k)));
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  faqTimer = setInterval(() => { if (!box.matches(":hover, :focus-within") && !box.querySelector(".qa.open")) show(cur + 1); }, 9000);
}

/* Mobile card sliders: CSS does the scrolling, this only draws the position dots. */
let slideTimers = [];
function bindSliders() {
  slideTimers.forEach(clearInterval); slideTimers = [];
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches, TICK = 3.5; // seconds between moves
  document.querySelectorAll(".slider").forEach(el => {
    const arrows = el.classList.contains("port"), nav = document.createElement("div");
    nav.className = "sdots" + (arrows ? " always" : ""); el.after(nav);
    let seen = false, hovering = false, held = false, ht;
    const n = () => el.children.length;
    const step = () => (n() > 1 ? el.children[1].offsetLeft - el.children[0].offsetLeft : 0);
    const max = () => el.scrollWidth - el.clientWidth;
    const pos = () => (max() > 2 && step() ? Math.round(max() / step()) + 1 : 1); // how many distinct stops
    const idx = () => Math.min(pos() - 1, Math.round(el.scrollLeft / (step() || 1)));
    const go = dir => { // dir: +1 next, -1 previous; wraps around at the ends
      const at = el.scrollLeft;
      const left = dir > 0 ? (at >= max() - 8 ? 0 : Math.min(max(), (idx() + 1) * step())) : (at <= 8 ? max() : Math.max(0, (idx() - 1) * step()));
      el.scrollTo({ left, behavior: "smooth" });
    };
    const upd = () => [...nav.querySelectorAll(".sd i")].forEach((d, k) => d.classList.toggle("on", k === idx()));
    const pause = () => nav.classList.toggle("paused", !seen || hovering || held);
    const ring = () => nav.querySelector(".ring circle:not(.track)");
    const restart = () => { const c = ring(); if (c) { c.style.animation = "none"; void c.getBoundingClientRect(); c.style.animation = ""; } };
    const build = () => {
      nav.innerHTML = (arrows ? `<button type="button" class="sarrow prev" aria-label="${T.common.prev}">${ic("arrow-right")}</button>` : "") + `<span class="sd" aria-hidden="true">${"<i></i>".repeat(pos())}</span>` + (arrows ? `<button type="button" class="sarrow next" aria-label="${T.common.next}">${ic("arrow-right")}<svg class="ring" viewBox="0 0 52 52" aria-hidden="true"><circle class="track" cx="26" cy="26" r="23"/><circle cx="26" cy="26" r="23"/></svg></button>` : "");
      nav.querySelector(".prev")?.addEventListener("click", () => { go(-1); restart(); });
      nav.querySelector(".next")?.addEventListener("click", () => { go(1); restart(); });
      // The ring fills once per TICK; each time it completes the slider moves, so the ring is the visible countdown.
      if (arrows && !calm) ring().addEventListener("animationiteration", () => go(1));
      pause(); upd();
    };
    el.addEventListener("scroll", upd, { passive: true });
    let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(build, 200); });
    nav.style.setProperty("--tick", TICK + "s");
    build();
    if (calm) return;
    new IntersectionObserver(es => { seen = es[0].isIntersecting; pause(); }).observe(el);
    const hold = () => { held = true; clearTimeout(ht); ht = setTimeout(() => { held = false; pause(); }, 6000); pause(); };
    ["pointerdown", "wheel", "focusin"].forEach(t => el.addEventListener(t, hold, { passive: true }));
    [el, nav].forEach(x => { x.addEventListener("mouseenter", () => { hovering = true; pause(); }); x.addEventListener("mouseleave", () => { hovering = false; pause(); }); });
    if (!arrows) slideTimers.push(setInterval(() => { if (seen && !held && max() > 2) go(1); }, TICK * 1000)); // mobile sliders without a ring
  });
}

/* ---------- Project dialog ---------- */
const shotsHtml = (i, shots, l) => `<h4>${l.shots}</h4><div class="shots-wrap"><div class="shots" id="shots">${shots.map((x, k) => `<figure><a href="portfolio/${PRJ[i].dir}/${PRJ[i].shots[k]}.webp" target="_blank" rel="noopener" title="${l.open}"><img src="portfolio/${PRJ[i].dir}/${PRJ[i].shots[k]}.webp" alt="${x[0]}" loading="lazy"></a><figcaption><b>${k + 1}/${shots.length} · ${x[0]}</b>${x[1]}</figcaption></figure>`).join("")}</div>
  <button class="snav prev" type="button" data-snav="-1" aria-label="${l.prev}">${ic("arrow-right")}</button><button class="snav next" type="button" data-snav="1" aria-label="${l.next}">${ic("arrow-right")}</button></div><p class="muted small">${PRJ[i].kind === "live" ? l.shotsLive : l.shotsNote}</p>`;
function openProject(i) {
  const p = T.portfolio.items[i], l = T.portfolio.l, s = SVC.findIndex(x => x.id === PRJ[i].svc);
  const sec = (h, t) => (t ? `<h4>${h}</h4><p>${t}</p>` : "");
  $("dlg").innerHTML = `<button class="x" type="button" data-close aria-label="${T.common.close}">${ic("x-mark")}</button>
    <div class="dh">${thumb(i)}</div>
    <div class="db"><h3 id="dlg-title" style="font-size:1.7rem">${p.title}</h3>
      <div class="chips">${p.industry ? `<span class="chip">${p.industry}</span>` : ""}${s >= 0 ? `<span class="chip">${T.services.items[s].title}</span>` : ""}</div>
      ${sec(l.overview, p.overview)}${sec(l.challenge, p.challenge)}${sec(l.solution, p.solution)}
      ${PRJ[i].tech.length ? `<h4>${l.tech}</h4><div class="chips">${PRJ[i].tech.map(t => `<span class="chip">${t}</span>`).join("")}</div>` : ""}
      ${!p.features && p.hl?.length ? `<h4>${l.features}</h4>${list(p.hl)}` : ""}
      ${p.features ? `<h4>${l.features}</h4>${list(p.features)}` : ""}
      ${p.shots ? shotsHtml(i, p.shots, l) : ""}
      ${p.status ? `<p class="status-line">${ic("clock")}<span><b>${l.status}:</b> ${p.status}</span></p>` : ""}
      ${PRJ[i].kind === "case" ? (PRJ[i].pdf ? `<div class="row">${btn(PRJ[i].pdf, "btn-soft", l.pdf, "arrow-down-tray", "download")}</div>` : "") : PRJ[i].kind === "live" ? (PRJ[i].url ? `<div class="row">${btn(PRJ[i].url, "btn-soft", l.visit, "arrow-up-right", `target="_blank" rel="noopener"`)}</div>` : "") : `<p class="muted small">${l.demoNote}</p>`}
      <div class="row">${btn("#contact", "btn-primary", l.cta, "arrow-right", `data-service="${PRJ[i].svc}" data-close`)}</div></div>`;
  $("dlg").querySelectorAll("[data-snav]").forEach(b => b.addEventListener("click", () => { const r = $("shots"); r.scrollBy({ left: +b.dataset.snav * r.clientWidth, behavior: "smooth" }); }));
  $("dlg").showModal();
}
$("dlg").addEventListener("click", e => { if (e.target === $("dlg")) $("dlg").close(); }); // click on backdrop
$("cdlg").addEventListener("click", e => { if (e.target === $("cdlg")) $("cdlg").close(); });

/* ---------- Contact form ---------- */
function setPackage(name) {
  const f = $("cf"); if (!f) return;
  f.elements.package.value = name;
  f.querySelector(".pkg").classList.toggle("show", !!name);
  f.querySelector(".pkg b").textContent = name;
}
function bindForm() {
  const form = $("cf"), v = T.contact.v;
  const rules = {
    name: x => x.trim().length >= 2 || v.name,
    email: x => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.trim()) || v.email,
    service: x => !!x || v.service,
    details: x => x.trim().length >= 10 || v.details,
  };
  const check = el => {
    const r = rules[el.name]; if (!r) return true;
    const res = r(el.value), box = el.closest(".field");
    box.classList.toggle("invalid", res !== true);
    $("e-" + el.name).textContent = res === true ? "" : res;
    el.setAttribute("aria-invalid", res !== true);
    if (res !== true) el.setAttribute("aria-describedby", "e-" + el.name); else el.removeAttribute("aria-describedby");
    return res === true;
  };
  form.addEventListener("input", e => { if (e.target.closest(".field.invalid")) check(e.target); });
  form.addEventListener("submit", async e => {
    e.preventDefault();
    $("m-ok").classList.remove("show"); $("m-bad").classList.remove("show");
    const els = [...form.elements].filter(el => rules[el.name]);
    const ok = els.map(check).every(Boolean);
    if (!ok) { $("m-bad-t").textContent = T.contact.bad; $("m-bad").classList.add("show"); els.find(el => el.getAttribute("aria-invalid") === "true").focus(); return; }
    const b = $("send");
    b.disabled = true; b.innerHTML = `<span>${T.contact.f.sending}</span>${ic("arrow-path", "spin")}`;
    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
        if (!res.ok) throw new Error(res.status);
      } else await new Promise(r => setTimeout(r, 900));
      track("Lead Submit", { service: form.elements.service?.value || "" });
      form.reset(); setPackage(""); $("m-ok").classList.add("show");
    } catch {
      $("m-bad-t").textContent = T.contact.fail; $("m-bad").classList.add("show");
    }
    b.disabled = false; b.innerHTML = `<span>${T.contact.f.send}</span>${ic("paper-airplane")}`;
  });
}

/* ---------- Language ---------- */
function setLang(l) {
  if (!D[l] || l === lang) return;
  if ($("dlg").open) $("dlg").close();
  const f = $("cf"), saved = f && Object.fromEntries(new FormData(f)); // keep typed values across languages
  const y = scrollY, root = document.documentElement;
  lang = l; safe(() => localStorage.setItem("mq-lang", l));
  $("main").classList.add("instant"); // re-rendered content appears at once instead of replaying entrance animations
  render();
  if (saved) { Object.entries(saved).forEach(([k, val]) => { const el = $("cf").elements[k]; if (el) el.value = val; }); setPackage(saved.package); }
  root.style.scrollBehavior = "auto"; scrollTo(0, y); root.style.scrollBehavior = "";
}

/* ---------- Menu ---------- */
function syncMenuBtn() {
  const b = $("menuBtn");
  b.setAttribute("aria-expanded", menuOpen);
  b.setAttribute("aria-label", menuOpen ? T.nav.close : T.nav.menu);
  b.innerHTML = ic(menuOpen ? "x-mark" : "bars-3");
}
function setMenu(open, focus = true) {
  menuOpen = open;
  $("mobile").classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
  syncMenuBtn();
  if (focus) (open ? $("mobile").querySelector("a") : $("menuBtn")).focus();
}

/* ---------- Events ---------- */
document.addEventListener("click", e => {
  const t = e.target;
  const lb = t.closest("[data-lang]"); if (lb) return setLang(lb.dataset.lang);
  const fq = t.closest(".faq .q"); if (fq) { const qa = fq.parentElement; fq.setAttribute("aria-expanded", qa.classList.toggle("open")); return; }
  if (t.closest("#menuBtn")) return setMenu(!menuOpen);
  const pj = t.closest("[data-proj]"); if (pj) return openProject(+pj.dataset.proj);
  const ds = t.closest("[data-service]"); if (ds) { $("service").value = ds.dataset.service; setPackage(""); }
  const dp = t.closest("[data-package]"); if (dp) setPackage(T.pricing.plans[dp.dataset.package].name);
  if (t.closest("[data-close]")) $("dlg").close();
  if (t.closest("[data-cclose]")) return $("cdlg").close();
  if (t.closest("#fabWa")) return setWa($("waPop").hidden);
  if (!t.closest("#waPop")) setWa(false);
  if (t.closest('a[href="#contact"], [data-open-contact]')) {
    e.preventDefault(); setWa(false);
    if (menuOpen) setMenu(false, false);
    return openContact();
  }
  if (menuOpen && t.closest("#mobile a")) setMenu(false, false); // anchor default then scrolls
});
document.addEventListener("click", e => { // analytics only, runs alongside the handler above
  const t = e.target;
  if (t.closest('a[href="#contact"], [data-open-contact]')) track("Contact Open");
  else if (t.closest('a[href^="https://wa.me"]')) track("WhatsApp Click");
  else if (t.closest(".btn-login, .mobile .btn-soft[href], footer a[href$=\"/portal/login\"]")) track("Login Click");
  else if (t.closest("a[download]")) track("PDF Download", { file: t.closest("a[download]").getAttribute("href") });
  else if (t.closest("[data-proj]")) track("Project View", { project: PRJ[+t.closest("[data-proj]").dataset.proj].slug });
  else if (t.closest("[data-lang]")) track("Language", { lang: t.closest("[data-lang]").dataset.lang });
}, true);
document.addEventListener("keydown", e => {
  if (e.key === "Escape") setWa(false);
  if (!menuOpen) return;
  if (e.key === "Escape") return setMenu(false);
  if (e.key === "Tab") { // keep keyboard focus inside the open menu
    const f = [...document.querySelectorAll("#mobile a, #mobile button, #menuBtn")];
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
matchMedia("(min-width: 881px)").addEventListener("change", e => { if (e.matches && menuOpen) setMenu(false, false); });
const onScroll = () => {
  $("nav").classList.toggle("scrolled", scrollY > 8);
  // Active menu item = last menu section whose top has passed 45% of the viewport (sections follow NAV order).
  let cur = "home";
  for (const k of NAV) { const el = $(k); if (el && el.getBoundingClientRect().top <= innerHeight * .45) cur = k; }
  if (cur !== active) setActive(cur);
};
addEventListener("scroll", onScroll, { passive: true });

render();
/* ---------- Content from the admin (optional) ----------
   When the admin API answers, its builds, FAQ, plans and portfolio replace the bundled ones. Details the admin does not store
   (challenge, solution, screenshots, PDF) are kept from the bundled item with the same Indonesian title. If the API is
   unreachable the page simply keeps the bundled content. */
const BUNDLED = { prj: PRJ.map(p => ({ ...p })), id: D.id.portfolio.items.slice(), en: D.en.portfolio.items.slice() };
function applySite(s) {
  if (s.builds?.length) {
    BUILD.length = 0; s.builds.forEach(b => BUILD.push({ icon: b.icon, svc: "website" }));
    for (const l of ["id", "en"]) D[l].builds.items = s.builds.map(b => b[l]);
  }
  if (s.faq?.length) for (const l of ["id", "en"]) D[l].faq.items = s.faq.map(q => q[l]);
  if (s.plans?.length) {
    PLAN_IDS.length = 0;
    s.plans.forEach(p => { PLAN_IDS.push(p.code); for (const l of ["id", "en"]) D[l].pricing.plans[p.code] = { ...D[l].pricing.plans[p.code], name: p.name, title: p[l].title, scope: p[l].scope }; });
  }
  if (s.portfolio?.length) {
    PRJ.length = 0; const items = { id: [], en: [] };
    s.portfolio.forEach(a => {
      const j = BUNDLED.id.findIndex(x => x.title === a.id.title), b = j >= 0 ? BUNDLED.prj[j] : {};
      PRJ.push({ svc: "website", ...b, kind: a.kind, url: a.url || undefined, tech: a.tech || [], coverUrl: a.cover });
      for (const l of ["id", "en"]) items[l].push({ ...(j >= 0 ? BUNDLED[l][j] : {}), title: a[l].title, industry: a[l].industry || "", overview: a[l].overview || "", hl: a[l].highlights || [] });
    });
    D.id.portfolio.items = items.id; D.en.portfolio.items = items.en;
  }
}
const siteSig = () => JSON.stringify([BUILD, PLAN_IDS, PRJ, D.id.builds.items, D.en.builds.items, D.id.faq.items, D.en.faq.items, D.id.pricing.plans, D.en.pricing.plans, D.id.portfolio.items, D.en.portfolio.items]);
function reflow() { // same idea as setLang: redraw without replaying entrance animations, keep scroll and typed values
  const f = $("cf"), saved = f && Object.fromEntries(new FormData(f)), y = scrollY, root = document.documentElement;
  $("main").classList.add("instant"); render();
  if (saved) { Object.entries(saved).forEach(([k, val]) => { const el = $("cf").elements[k]; if (el) el.value = val; }); setPackage(saved.package); }
  root.style.scrollBehavior = "auto"; scrollTo(0, y); root.style.scrollBehavior = "";
}
if (API_BASE) {
  fetch(API_BASE + "/api/site", { headers: { Accept: "application/json" } })
    .then(r => (r.ok ? r.json() : null))
    .then(s => { if (!s || $("dlg").open || $("cdlg").open) return; const before = siteSig(); applySite(s); if (siteSig() !== before) reflow(); }) // redraw only when the admin content differs, so the first paint is not thrown away
    .catch(() => {}); // offline or admin not running: keep the bundled content
}
if (location.hash === "#contact") openContact();
else if (location.hash.length > 1) { const el = $(location.hash.slice(1)); if (el) el.scrollIntoView(); } // deep link on load
