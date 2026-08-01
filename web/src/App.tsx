import { useState } from 'react'
import { ArrowRight, Copy, Check, Terminal } from 'lucide-react'

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

function App() {
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
      
      {/* STICKY NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-50 h-14 border-b border-[#dcdee0] bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-[#171717] text-white flex items-center justify-center font-bold text-xs">
              P
            </div>
            <span className="font-semibold text-[#171717] text-sm tracking-tight">Plugr</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#hero" className="text-xs font-semibold text-[#60646c] hover:text-[#171717] transition-colors">Overview</a>
            <a href="#packages" className="text-xs font-semibold text-[#60646c] hover:text-[#171717] transition-colors">Packages</a>
            <a href="#showcase" className="text-xs font-semibold text-[#60646c] hover:text-[#171717] transition-colors">Showcase</a>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/shravan7572/new-project" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded border border-[#dcdee0] bg-white hover:bg-[#f0f0f3] px-3 py-1.5 text-xs font-semibold transition-all text-[#60646c] hover:text-[#171717]"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section id="hero" className="hero-backdrop pt-[130px] pb-[96px] border-b border-[#dcdee0] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-10">
          
          {/* Logo Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f0f3] border border-[#dcdee0] text-xs font-semibold text-[#171717]">
              <span className="h-4.5 w-4.5 rounded bg-[#171717] text-white flex items-center justify-center font-bold text-[10px]">P</span>
              <span>Plugr CLI v0.0.9</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold text-[#171717] tracking-tight leading-[1.02] max-w-3xl mx-auto font-sans">
            Drop features.<br />Ship faster.
          </h1>
          
          <p className="text-base sm:text-lg text-[#60646c] max-w-xl mx-auto leading-relaxed">
            One command drops production-ready auth, email, and payments into your existing Express project.
          </p>

          {/* PM selector bar in Cursor look */}
          <div className="max-w-md mx-auto space-y-3">
            <div className="flex justify-center mb-1">
              <div className="inline-flex p-0.5 rounded border border-[#dcdee0] bg-[#f0f0f3]">
                {(['npm', 'pnpm', 'yarn', 'bun'] as const).map(pm => (
                  <button
                    key={pm}
                    onClick={() => setSelectedPm(pm)}
                    className={`px-3 py-1 rounded text-xs transition-all font-semibold cursor-pointer ${
                      selectedPm === pm 
                        ? 'bg-white text-zinc-900 shadow-xs border border-[#dcdee0]/40' 
                        : 'text-zinc-550 hover:text-zinc-800'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex items-center rounded border border-[#dcdee0] bg-white p-3 pr-12 shadow-2xs">
              <Terminal className="w-4 h-4 text-zinc-400 mr-2.5 shrink-0" />
              <span className="font-mono text-xs text-zinc-700 overflow-x-auto text-left whitespace-nowrap scrollbar-none flex-1">
                {getCLICommand()}
              </span>
              <button
                onClick={() => handleCopy(getCLICommand()!, 'cli')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded bg-white border border-[#dcdee0] hover:border-zinc-300 text-zinc-400 hover:text-[#171717] transition-all cursor-pointer shadow-3xs"
              >
                {copiedText === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={() => handleCopy(getCLICommand()!, "hero-copy")}
              className="h-11 px-6 bg-[#000000] text-white text-sm font-semibold rounded-[8px] hover:bg-[#1a1a1a] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>{copiedText === 'hero-copy' ? 'Copied command!' : 'Get started free'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Terminal Mockup - Real, tabbed, customizable look */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="rounded-[12px] border border-[#dcdee0] bg-white shadow-lg overflow-hidden text-left font-mono-code text-xs">
              {/* Window bar with tabs */}
              <div className="px-4 py-0 bg-[#f0f0f3] border-b border-[#dcdee0] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 select-none mr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#dcdee0]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#dcdee0]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#dcdee0]"></div>
                  </div>
                  <button 
                    onClick={() => setHeroTab('auth')}
                    className={`py-2 px-3 text-[11px] font-semibold border-b-2 cursor-pointer transition-colors ${
                      heroTab === 'auth' ? 'border-[#171717] text-[#171717]' : 'border-transparent text-[#999999]'
                    }`}
                  >
                    npx getplugr add auth
                  </button>
                  <button 
                    onClick={() => setHeroTab('email')}
                    className={`py-2 px-3 text-[11px] font-semibold border-b-2 cursor-pointer transition-colors ${
                      heroTab === 'email' ? 'border-[#171717] text-[#171717]' : 'border-transparent text-[#999999]'
                    }`}
                  >
                    npx getplugr add email
                  </button>
                </div>
                <span className="text-[10px] text-[#999999] font-semibold hidden sm:inline">bash</span>
              </div>
              {/* Code window contents */}
              <div className="p-5 space-y-1.5 bg-[#ffffff] text-[#171717] min-h-[140px] transition-all">
                {heroTab === 'auth' ? (
                  <>
                    <p className="text-[#60646c]"><span className="text-[#999999] font-semibold">$</span> npx getplugr add auth</p>
                    <p className="text-[#171717]"><span className="text-[#60646c]">✔</span> Choose language: <span className="font-semibold">TypeScript</span></p>
                    <p className="text-[#171717]"><span className="text-[#60646c]">✔</span> Choose auth type: <span className="font-semibold">JWT</span></p>
                    <p className="text-[#60646c]">→ Copying template files...</p>
                    <p className="text-[#171717] font-semibold"><span className="text-[#171717]">✔</span> Auth added to your project!</p>
                  </>
                ) : (
                  <>
                    <p className="text-[#60646c]"><span className="text-[#999999] font-semibold">$</span> npx getplugr add email</p>
                    <p className="text-[#171717]"><span className="text-[#60646c]">✔</span> Choose language: <span className="font-semibold">TypeScript</span></p>
                    <p className="text-[#171717]"><span className="text-[#60646c]">✔</span> Choose email provider: <span className="font-semibold">Nodemailer (SMTP)</span></p>
                    <p className="text-[#60646c]">→ Copying template files...</p>
                    <p className="text-[#171717] font-semibold"><span className="text-[#171717]">✔</span> Email templates added to your project!</p>
                  </>
                )}
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
      <footer className="bg-white py-[96px]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col gap-16">
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-left">
            {/* Product */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717]">Product</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="text-[#60646c]">CLI feature injector</span></li>
                <li><span className="text-[#60646c]">Modular Templates</span></li>
                <li><span className="text-[#999999]">Better Auth (Scaffolded)</span></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717]">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="https://www.npmjs.com/package/getplugr" target="_blank" rel="noreferrer" className="text-[#0d74ce] hover:underline">npm</a>
                </li>
                <li>
                  <a href="https://github.com/shravan7572/new-project" target="_blank" rel="noreferrer" className="text-[#0d74ce] hover:underline">GitHub</a>
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
                <li><span className="text-[#60646c]">Twitter</span></li>
                <li><span className="text-[#60646c]">Discord</span></li>
                <li><span className="text-[#60646c]">Support</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom attribution */}
          <div className="border-t border-[#dcdee0] pt-8 flex items-center justify-between text-[11px] text-[#999999] uppercase font-semibold tracking-wider select-none">
            <span>&copy; 2026 Plugr CLI.</span>
            <span>Built by Shravan Choudhary</span>
          </div>

        </div>
      </footer>

    </div>
  )
}

export default App
