import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check, Terminal, ArrowUpRight } from 'lucide-react'

// Code snippets to display in the Code Showcase and features
const CODE_SNIPPETS = {
  authMiddleware: `// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt.js";

export const authMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      error: "Access denied. No token provided." 
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ 
      error: "Invalid authentication token." 
    });
  }
};`,
  emailSendTs: `// src/emailsource/sendEmail.ts
import { transporter } from "../transporter/transporter.js";

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: SendEmailOptions) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Plugr App" <noreply@example.com>',
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

/*
// Example: Background Contact Form Notification in Express Router
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  
  // Send 200 instantly so client request finishes immediately
  res.status(200).json({ success: true });

  // Dispatched in the background so the UI feels instantly fast
  sendEmail({
    replyTo: email,
    to: "profile-owner@example.com",
    subject: \`New message from \${name}\`,
    html: \`
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> \${name}</p>
      <p><strong>Email:</strong> \${email}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>\${message}</p>
    \`,
  }).catch(err => {
    console.error("Failed to send contact email:", err);
  });
});
*/`,
  step1: `npx getplugr add auth`,
  step1Email: `npx getplugr add email`,
  step2: `? Choose language: TypeScript
? Choose auth type: JWT`,
  step2Email: `? Choose language: TypeScript
? Choose email provider: Nodemailer`,
  step3: `→ Copying template files...
✔ Auth added to your project!

Next steps:
1. Run: pnpm install jsonwebtoken bcryptjs mongoose dotenv cors express zod
2. Run: pnpm install -D @types/jsonwebtoken @types/bcryptjs @types/node @types/express @types/cors
3. Add: app.use("/api/auth", authRoutes) to your index.ts`,
  step3Email: `→ Copying template files...
✔ Email templates added to your project!

Next steps:
1. Run: pnpm install nodemailer dotenv
2. Run: pnpm install -D @types/nodemailer @types/node
3. Add: import { sendEmail } from "./src/emailsource/sendEmail.js"`
}

function Dashboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [selectedPm, setSelectedPm] = useState<'npm' | 'pnpm' | 'yarn' | 'bun'>('pnpm')
  const [heroTab, setHeroTab] = useState<'auth' | 'email'>('auth')
  const [activeCodeShowcase, setActiveCodeShowcase] = useState<'auth' | 'email' | 'payments'>('auth')

  // Copy text helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(id)
    setTimeout(() => setCopiedText(null), 2000)
  }

  // Syntax highlighter for dark card and code showcase (uses VS Code Dark-like tokens)
  const highlightCode = (code: string) => {
    let escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    // Comments
    escaped = escaped.replace(/(\/\/.*)/g, '<span class="text-[#888888] font-normal">$1</span>');
    escaped = escaped.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-[#888888] font-normal">$1</span>');
    
    // Strings
    escaped = escaped.replace(/(["'`])(.*?)\1/g, '<span class="text-[#a5d6ff] font-normal">$1$2$1</span>');
    
    // Keywords
    const keywords = ['import', 'export', 'const', 'let', 'async', 'await', 'return', 'from', 'try', 'catch', 'if', 'else', 'new', 'as', 'interface', 'type'];
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-[#ff7b72] font-semibold">$1</span>');
    });

    // Types
    const types = ['string', 'number', 'boolean', 'void', 'any', 'Request', 'Response', 'NextFunction', 'Schema', 'User', 'MongoClient', 'SendEmailOptions'];
    types.forEach(t => {
      const regex = new RegExp(`\\b(${t})\\b`, 'g');
      escaped = escaped.replace(regex, '<span class="text-[#79c0ff] font-normal">$1</span>');
    });

    // Numbers
    escaped = escaped.replace(/\b(\d+)\b/g, '<span class="text-[#d2a8ff] font-normal">$1</span>');

    return <code dangerouslySetInnerHTML={{ __html: escaped }} />;
  };

  const getCLICommand = () => {
    switch (selectedPm) {
      case 'npm': return `npx getplugr add ${heroTab}`
      case 'pnpm': return `pnpm dlx getplugr add ${heroTab}`
      case 'yarn': return `yarn dlx getplugr add ${heroTab}`
      case 'bun': return `bunx getplugr add ${heroTab}`
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#171717] font-sans antialiased">
      
      {/* FLOATING NAVBAR */}
      <header className="fixed top-4 inset-x-4 max-w-5xl mx-auto h-12 rounded-full bg-white/75 backdrop-blur-xl z-50 grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-5 overflow-visible">
        <a href="#hero" className="flex items-center gap-2.5 no-underline shrink-0">
          <div className="h-6 w-6 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-xs select-none shrink-0">
            P
          </div>
          <span className="font-semibold text-[#171717] text-sm tracking-tight select-none hidden sm:inline">Plugr</span>
        </a>
        
        {/* Centered Navigation Links */}
        <nav className="hidden md:flex items-center justify-center gap-6 min-w-0">
          <a href="#hero" className="text-xs font-semibold text-[#60646c] hover:text-[#171717] transition-colors whitespace-nowrap">Overview</a>
          <a href="#packages" className="text-xs font-semibold text-[#60646c] hover:text-[#171717] transition-colors whitespace-nowrap">Packages</a>
          <a href="#showcase" className="text-xs font-semibold text-[#60646c] hover:text-[#171717] transition-colors whitespace-nowrap">Showcase</a>
        </nav>

        <div className="flex items-center gap-2 shrink-0 justify-self-end">
          <Link 
            to="/upcoming"
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-[#f0f0f3]/80 hover:bg-[#e8e8ec] text-[#60646c] hover:text-[#171717] transition-all no-underline whitespace-nowrap"
          >
            Upcoming
          </Link>
          <a 
            href="https://github.com/shravan7572/new-project" 
            target="_blank" 
            rel="noreferrer"
            aria-label="GitHub"
            className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#f0f0f3]/80 hover:bg-[#e8e8ec] transition-all text-[#60646c] hover:text-[#171717] no-underline shrink-0 overflow-visible"
          >
            <svg className="w-[18px] h-[18px] fill-current overflow-visible" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section id="hero" className="hero-backdrop relative overflow-hidden border-b border-[#dcdee0]">
        <div className="hero-grid absolute inset-0 pointer-events-none" aria-hidden="true" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-[132px] pb-[96px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">

            {/* Left Column */}
            <div className="lg:col-span-7 text-left">
              {/* Messaging block — kept airy and separate from actions */}
              <div className="space-y-5 mb-12 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-[#dcdee0]/70 text-[11px] font-semibold text-[#60646c]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  v0.0.9 on npm
                </div>

                <h1 className="hero-headline text-[2.625rem] sm:text-[3.125rem] text-[#171717]">
                  Drop features.
                  <br />
                  <span className="hero-headline-accent text-[#52525b]">Ship faster.</span>
                </h1>

                <p className="hero-lead text-[16px] sm:text-[17px] text-[#60646c] max-w-md">
                  Auth, email, and database modules — copied straight into your Express project in seconds.
                </p>
              </div>

              {/* Single install card — PM selector + command in one place */}
              <div className="max-w-md rounded-2xl border border-[#dcdee0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-[#f0f0f3] bg-[#fafbfc]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Install</span>
                  <div className="inline-flex p-0.5 rounded-md border border-[#dcdee0]/80 bg-white">
                    {(['npm', 'pnpm', 'yarn', 'bun'] as const).map(pm => (
                      <button
                        key={pm}
                        onClick={() => setSelectedPm(pm)}
                        className={`px-2.5 py-1 rounded-[5px] text-[11px] transition-all font-semibold cursor-pointer ${
                          selectedPm === pm
                            ? 'bg-[#171717] text-white'
                            : 'text-[#999999] hover:text-[#60646c]'
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-4">
                  <Terminal className="w-4 h-4 text-[#999999] shrink-0" />
                  <span className="font-mono-code text-[13px] text-[#171717] overflow-x-auto whitespace-nowrap scrollbar-none flex-1">
                    {getCLICommand()}
                  </span>
                  <button
                    onClick={() => handleCopy(getCLICommand()!, 'cli')}
                    className="h-9 px-3.5 bg-[#171717] hover:bg-[#2a2a2a] text-white text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    {copiedText === 'cli' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="px-4 py-3 border-t border-[#f0f0f3] bg-[#fafbfc] flex items-center justify-between gap-3">
                  <p className="text-[11px] text-[#999999]">
                    Free · No account · Installs in project root
                  </p>
                  <a
                    href="https://www.npmjs.com/package/getplugr"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#60646c] hover:text-[#171717] transition-colors shrink-0"
                  >
                    View on npm
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Terminal Mockup */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end w-full lg:pt-2">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-100/40 via-transparent to-violet-100/30 rounded-3xl blur-2xl pointer-events-none" aria-hidden="true" />

              <div className="w-full max-w-[440px] rounded-2xl border border-[#2a2a2e] bg-[#0c0c0e] shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.05)_inset] overflow-hidden text-left font-mono-code text-xs relative z-10">
                <div className="px-4 py-3 bg-[#161618] border-b border-white/[0.06] flex items-center justify-between font-sans">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center gap-1.5 select-none shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <span className="text-[10px] text-[#666] font-medium truncate hidden sm:inline">~/my-express-app</span>
                  </div>
                  <span className="text-[10px] text-[#555] font-semibold uppercase tracking-wider shrink-0">zsh</span>
                </div>

                <div className="px-3 pt-2 pb-0 bg-[#121214] border-b border-white/[0.04] flex gap-1 font-sans">
                  <button
                    onClick={() => setHeroTab('auth')}
                    className={`px-3 py-2 text-[10px] font-semibold rounded-t-md cursor-pointer transition-colors ${
                      heroTab === 'auth'
                        ? 'bg-[#0c0c0e] text-white border-t border-x border-white/[0.08]'
                        : 'text-[#666] hover:text-[#999]'
                    }`}
                  >
                    auth
                  </button>
                  <button
                    onClick={() => setHeroTab('email')}
                    className={`px-3 py-2 text-[10px] font-semibold rounded-t-md cursor-pointer transition-colors ${
                      heroTab === 'email'
                        ? 'bg-[#0c0c0e] text-white border-t border-x border-white/[0.08]'
                        : 'text-[#666] hover:text-[#999]'
                    }`}
                  >
                    email
                  </button>
                </div>

                <div className="p-5 bg-[#0c0c0e] text-[#e4e4e7] min-h-[168px] space-y-1.5 leading-relaxed transition-all">
                  {heroTab === 'auth' ? (
                    <>
                      <p><span className="text-[#666]">$</span> <span className="text-[#a5d6ff]">npx getplugr add auth</span></p>
                      <p className="text-[#888] pt-1">? Choose language: <span className="text-white font-medium">TypeScript</span></p>
                      <p className="text-[#888]">? Choose auth type: <span className="text-white font-medium">JWT</span></p>
                      <p className="text-[#666] pt-1">→ Copying template files...</p>
                      <p className="text-emerald-400 font-semibold pt-1">✔ Auth added to your project!</p>
                    </>
                  ) : (
                    <>
                      <p><span className="text-[#666]">$</span> <span className="text-[#a5d6ff]">npx getplugr add email</span></p>
                      <p className="text-[#888] pt-1">? Choose language: <span className="text-white font-medium">TypeScript</span></p>
                      <p className="text-[#888]">? Choose email provider: <span className="text-white font-medium">Nodemailer (SMTP)</span></p>
                      <p className="text-[#666] pt-1">→ Copying template files...</p>
                      <p className="text-emerald-400 font-semibold pt-1">✔ Email templates added to your project!</p>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF BAR */}
      <section className="bg-[#f0f0f3] py-8 text-center border-b border-[#dcdee0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <p className="text-xs font-semibold text-[#60646c] uppercase tracking-wider">
            Used by developers building with Express, TypeScript, MongoDB
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-[#171717] select-none">
            <span>Express</span>
            <span className="text-[#dcdee0]">•</span>
            <span>MongoDB</span>
            <span className="text-[#dcdee0]">•</span>
            <span>TypeScript</span>
            <span className="text-[#dcdee0]">•</span>
            <span>Better Auth</span>
            <span className="text-[#dcdee0]">•</span>
            <span>Nodemailer</span>
            <span className="text-[#dcdee0]">•</span>
            <span>Brevo SDK</span>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3 steps, NOT numbered decoratively - actual sequence matters) */}
      <section className="py-[96px] bg-white border-b border-[#dcdee0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-left">
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-[#171717]">How it works</h2>
            <p className="text-sm text-[#60646c] mt-2">Zero boilerplate configuration in three steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="rounded-[12px] bg-[#171717] text-white p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-[#999999] uppercase">Step 01</span>
                <h3 className="text-sm font-semibold text-white mt-2 mb-3">Run the command</h3>
                <p className="text-xs text-[#999999] leading-relaxed">
                  Call the CLI feature injector directly inside your Express project root folder.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#dcdee0]/10 font-mono-code text-[11px] text-[#a5d6ff] break-all">
                {heroTab === 'auth' ? CODE_SNIPPETS.step1 : CODE_SNIPPETS.step1Email}
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-[12px] bg-[#171717] text-white p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-[#999999] uppercase">Step 02</span>
                <h3 className="text-sm font-semibold text-white mt-2 mb-3">Answer 2 questions</h3>
                <p className="text-xs text-[#999999] leading-relaxed">
                  Select your target coding language and desired configuration stack adapter.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#dcdee0]/10 font-mono-code text-[11px] text-[#ff7b72] whitespace-pre-line">
                {heroTab === 'auth' ? CODE_SNIPPETS.step2 : CODE_SNIPPETS.step2Email}
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-[12px] bg-[#171717] text-white p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-[#999999] uppercase">Step 03</span>
                <h3 className="text-sm font-semibold text-white mt-2 mb-3">Files dropped</h3>
                <p className="text-xs text-[#999999] leading-relaxed">
                  Templates copy directly to your project root. Copy integration routes and start coding.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#dcdee0]/10 font-mono-code text-[10px] text-[#a5d6ff] truncate">
                {highlightCode('✔ Files copied successfully')}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FEATURES GRID (2-up desktop, 1-up mobile) */}
      <section id="packages" className="py-[96px] bg-[#f0f0f3] border-b border-[#dcdee0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-left">
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-[#171717]">Available Packages</h2>
            <p className="text-sm text-[#60646c] mt-2">Production-ready modules injected with full type safety.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1 — JWT Auth */}
            <div className="rounded-[12px] border border-[#dcdee0] bg-white p-6 flex flex-col justify-between shadow-2xs">
              <div className="space-y-3">
                <span className="inline-flex rounded-full bg-[#f0f0f3] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#171717]">JWT Authentication</span>
                <h3 className="text-base font-semibold text-[#171717]">JWT Auth</h3>
                <p className="text-xs text-[#60646c] leading-relaxed">
                  Complete JWT auth flow dropped into your project.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#dcdee0] font-mono-code text-[11px] text-[#60646c] space-y-1">
                <p>📂 src/</p>
                <p>  ├── 📂 models/ (usermodel)</p>
                <p>  ├── 📂 middleware/ (authmiddleware)</p>
                <p>  ├── 📂 controllers/ (authcontroller)</p>
                <p>  ├── 📂 routes/ (authroutes)</p>
                <p>  └── 📂 config/ (jwt_secret)</p>
              </div>
            </div>

            {/* Card 2 — Better Auth */}
            <div className="rounded-[12px] border border-[#dcdee0] bg-white p-6 flex flex-col justify-between shadow-2xs">
              <div className="space-y-3">
                <span className="inline-flex rounded-full bg-[#f0f0f3] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#171717]">Modular Adapter</span>
                <h3 className="text-base font-semibold text-[#171717]">Better Auth</h3>
                <p className="text-xs text-[#60646c] leading-relaxed">
                  Session-based auth with zero boilerplate.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#dcdee0] font-mono-code text-[11px] text-[#60646c] space-y-1">
                <p>📂 src/</p>
                <p>  ├── 📂 config/ (betterauth client)</p>
                <p>  ├── 📂 middleware/ (session handler)</p>
                <p>  └── 📂 routes/ (auth credentials)</p>
              </div>
            </div>

            {/* Card 3 — Plugr Email */}
            <div className="rounded-[12px] border border-[#dcdee0] bg-white p-6 flex flex-col justify-between shadow-2xs">
              <div className="space-y-3">
                <span className="inline-flex rounded-full bg-[#f0f0f3] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#171717]">Email Transporters</span>
                <h3 className="text-base font-semibold text-[#171717]">Plugr Email</h3>
                <p className="text-xs text-[#60646c] leading-relaxed">
                  Scaffold complete SMTP transporters (Nodemailer) or API configurations (Brevo SDK).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#dcdee0] font-mono-code text-[11px] text-[#60646c] space-y-1">
                <p>📂 src/</p>
                <p>  ├── 📂 transporter/ (nodemailer/brevo config)</p>
                <p>  └── 📂 emailsource/ (sendEmail helper)</p>
                <p>✔ Includes background dispatch code examples</p>
              </div>
            </div>

            {/* Card 4 — MongoDB Ready */}
            <div className="rounded-[12px] border border-[#dcdee0] bg-white p-6 flex flex-col justify-between shadow-2xs">
              <div className="space-y-3">
                <span className="inline-flex rounded-full bg-[#f0f0f3] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#171717]">Database Connector</span>
                <h3 className="text-base font-semibold text-[#171717]">MongoDB Ready</h3>
                <p className="text-xs text-[#60646c] leading-relaxed">
                  Mongoose models and connection config included.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#dcdee0] font-mono-code text-[11px] text-[#60646c] space-y-1">
                <p>✔ mongoose.connect(process.env.MONGO_URL)</p>
                <p>✔ automatic process.exit(1) on errors</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CODE SHOWCASE (dark band - Fully interactive auth & email) */}
      <section id="showcase" className="bg-[#171717] py-[96px] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left panel: feature list */}
          <div className="lg:col-span-4 flex flex-col justify-between text-left space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-semibold tracking-wider text-[#999999] uppercase">Code Showcase</span>
              <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">Interactive code outputs</h2>
              <p className="text-xs text-[#999999] leading-relaxed">
                Inspect the raw configuration and helper scripts Plugr injected into your local directory.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => { setActiveCodeShowcase('auth') }}
                className={`w-full py-2.5 px-4 rounded-[8px] text-xs font-semibold text-left transition-all cursor-pointer ${
                  activeCodeShowcase === 'auth'
                    ? 'bg-[#ffffff] text-[#171717]'
                    : 'bg-transparent text-[#999999] hover:text-white'
                }`}
              >
                Authentication
              </button>
              <button
                onClick={() => { setActiveCodeShowcase('email') }}
                className={`w-full py-2.5 px-4 rounded-[8px] text-xs font-semibold text-left transition-all cursor-pointer ${
                  activeCodeShowcase === 'email'
                    ? 'bg-[#ffffff] text-[#171717]'
                    : 'bg-transparent text-[#999999] hover:text-white'
                }`}
              >
                Emailing Service
              </button>
              <div className="w-full py-2.5 px-4 rounded-[8px] text-xs text-[#999999] text-left select-none flex justify-between items-center bg-transparent opacity-60">
                <span>Payments</span>
                <span className="text-[9px] uppercase tracking-wider font-semibold bg-[#dcdee0]/10 px-2 py-0.5 rounded text-[#999999]">Soon</span>
              </div>
            </div>
          </div>

          {/* Right panel: live code block */}
          <div className="lg:col-span-8 flex flex-col rounded-[12px] border border-[#dcdee0]/10 bg-[#0c0c0e] overflow-hidden">
            <div className="px-4 py-2.5 bg-[#171717] border-b border-[#dcdee0]/10 flex justify-between items-center text-[11px] select-none text-[#999999] font-mono-code">
              <span>{activeCodeShowcase === 'auth' ? 'auth.middleware.ts' : 'sendEmail.ts'}</span>
              <button
                onClick={() => handleCopy(
                  activeCodeShowcase === 'auth' ? CODE_SNIPPETS.authMiddleware : CODE_SNIPPETS.emailSendTs, 
                  'showcase-copy'
                )}
                className="py-1 px-2.5 rounded border border-[#dcdee0]/10 hover:border-[#dcdee0]/20 bg-transparent text-white font-mono-code text-[11px] hover:text-[#fafafa] transition-colors cursor-pointer"
              >
                {copiedText === 'showcase-copy' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto text-left font-mono-code text-xs leading-relaxed bg-[#0a0a0c] max-h-[380px]">
              <pre className="whitespace-pre scroll-x-auto">
                {highlightCode(activeCodeShowcase === 'auth' ? CODE_SNIPPETS.authMiddleware : CODE_SNIPPETS.emailSendTs)}
              </pre>
            </div>
          </div>

        </div>
      </section>

      {/* 6. CTA BAND */}
      <section className="bg-white py-[96px] border-b border-[#dcdee0] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-[#171717]">
            Stop setting up. Start shipping.
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleCopy("npx getplugr add auth", "cta-copy-auth")}
              className="h-12 px-8 bg-[#000000] text-white text-xs font-semibold rounded-[8px] hover:bg-[#1a1a1a] transition-all shadow-xs flex items-center gap-2 cursor-pointer font-mono-code w-full sm:w-auto justify-center"
            >
              <span>{copiedText === 'cta-copy-auth' ? 'Copied command!' : 'npx getplugr add auth'}</span>
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleCopy("npx getplugr add email", "cta-copy-email")}
              className="h-12 px-8 bg-[#000000] text-white text-xs font-semibold rounded-[8px] hover:bg-[#1a1a1a] transition-all shadow-xs flex items-center gap-2 cursor-pointer font-mono-code w-full sm:w-auto justify-center"
            >
              <span>{copiedText === 'cta-copy-email' ? 'Copied command!' : 'npx getplugr add email'}</span>
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-[#999999] font-medium tracking-wide">
            Free. No account. Works with your existing project.
          </p>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-white pt-[96px] pb-8">
        {/* Columns container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-left">
            {/* Product */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717]">Product</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#hero" className="text-[#60646c] hover:text-[#171717] transition-colors">CLI feature injector</a></li>
                <li><a href="#packages" className="text-[#60646c] hover:text-[#171717] transition-colors">Modular Templates</a></li>
                <li><a href="#showcase" className="text-[#60646c] hover:text-[#171717] transition-colors">Code Showcase</a></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717]">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="https://www.npmjs.com/package/getplugr" target="_blank" rel="noreferrer" className="text-[#60646c]  hover:text-black" >npm</a>
                </li>
                <li>
                  <a href="https://github.com/shravan7572/new-project" target="_blank" rel="noreferrer" className="text-[#60646c] hover:text-black">GitHub</a>
                </li>
                <li>
                  <span className="text-[#999999]">Docs (coming soon)</span>
                </li>
              </ul>
            </div>
            
            {/* Connect */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717]">Connect</h4>
              <ul className="space-y-2 text-xs">
                <li><a  href='https://x.com/shravann3107?s=11' target='_blank' className="text-[#60646c] hover:text-black">Twitter</a></li>
                <li><a  href='https://www.linkedin.com/in/shravan7572/' target='_blank'  className="text-[#60646c] hover:text-black">LinkedIn</a></li>
                <li><a  href='https://devvboard.vercel.app/shravan  '  className="text-[#60646c] hover:text-black">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Edge-to-Edge Divider Line */}
        <div className="w-full border-t border-[#dcdee0]"></div>

        {/* Attribution container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
          <div className="flex items-center justify-between text-[9px] text-[#999999] uppercase font-semibold tracking-wider select-none">
            <span>&copy; 2026 Plugr CLI.</span>
            <span>Built by Shravan Choudhary</span>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Dashboard
