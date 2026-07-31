import React, { useState, useEffect } from 'react'
import { 
  Terminal, 
  Copy, 
  Check, 
  Key, 
  Mail, 
  Database, 
  Cpu, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  Send,
  Info,
  Heart
} from 'lucide-react'

// Code snippets to display in the Code Viewer
const CODE_SNIPPETS = {
  jwtTs: `// src/config/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};`,
  dbTs: `// src/models/mongoconnector.ts
import mongoose from "mongoose";

export const connectdb = async () => {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    console.error("Unable to connect DB: MONGO_URL is missing in env.");
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB database connected successfully.");
  } catch (e) {
    console.error("Unable to connect to database:", e);
    process.exit(1);
  }
};`,
  userModelTs: `// src/models/usermodel.ts
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = model("User", userSchema);`,
  authMiddlewareTs: `// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid authentication token." });
  }
};`,
  betterAuthTs: `// src/config/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URL!);
const db = client.db("plugr-auth");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true
  }
});`,
  nodemailerTransporterTs: `// src/transporter/transporter.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT || "2525"),
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});`,
  nodemailerSendTs: `// src/emailsource/sendEmail.ts
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
};`,
  brevoTransporterTs: `// src/transporter/transporter.ts
import * as sibSdk from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const apiInstance = new sibSdk.TransactionalEmailsApi();
const apiKey = process.env.BREVO_API_KEY || "";
apiInstance.setApiKey(sibSdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);

export { apiInstance };`,
  brevoSendTs: `// src/emailsource/sendEmail.ts
import { apiInstance } from "../transporter/transporter.js";
import * as sibSdk from "@getbrevo/brevo";

interface SendEmailOptions {
  to: string;
  subject: string;
  textContent: string;
  htmlContent?: string;
  senderName?: string;
  senderEmail?: string;
}

export const sendEmail = async ({ to, subject, textContent, htmlContent, senderName, senderEmail }: SendEmailOptions) => {
  const sendSmtpEmail = new sibSdk.SendSmtpEmail();
  
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent || textContent;
  sendSmtpEmail.textContent = textContent;
  sendSmtpEmail.sender = { 
    name: senderName || process.env.BREVO_SENDER_NAME || "Plugr App", 
    email: senderEmail || process.env.BREVO_SENDER_EMAIL || "noreply@example.com" 
  };
  sendSmtpEmail.to = [{ email: to }];

  return apiInstance.sendTransacEmail(sendSmtpEmail);
};`
}

function App() {
  const [selectedPm, setSelectedPm] = useState<'npm' | 'pnpm' | 'yarn' | 'bun'>('pnpm')
  const [copiedText, setCopiedText] = useState<string | null>(null)
  
  // Terminal Simulator State
  const [termState, setTermState] = useState<'idle' | 'running' | 'langSelect' | 'authSelect' | 'emailSelect' | 'installing' | 'completed'>('idle')
  const [termType, setTermType] = useState<'auth' | 'email'>('auth')
  const [termLang, setTermLang] = useState<'typescript' | 'javascript' | null>(null)
  const [termFeature, setTermFeature] = useState<'JWT' | 'Better-auth' | 'Nodemailer' | 'Brevo' | null>(null)
  const [termOutput, setTermOutput] = useState<string[]>([])
  
  // Features Tabs State
  const [activeTab, setActiveTab] = useState<'auth' | 'email'>('auth')
  const [activeAuthSubTab, setActiveAuthSubTab] = useState<'jwt' | 'better-auth'>('better-auth')
  const [activeEmailSubTab, setActiveEmailSubTab] = useState<'nodemailer' | 'brevo'>('nodemailer')
  const [activeCodeFile, setActiveCodeFile] = useState<string>('betterAuthTs')
  
  // Auth Form Simulation State
  const [simEmail, setSimEmail] = useState('')
  const [simPassword, setSimPassword] = useState('')
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  
  // Email Form Simulation State
  const [simTo, setSimTo] = useState('')
  const [simSubject, setSimSubject] = useState('')
  const [simMessage, setSimMessage] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [sentEmails, setSentEmails] = useState<Array<{to: string, subject: string, message: string, date: string}>>([])

  // Copy text helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(id)
    setTimeout(() => setCopiedText(null), 2000)
  }

  // CLI Simulator Actions
  const runSimulator = (type: 'auth' | 'email') => {
    setTermType(type)
    setTermState('langSelect')
    setTermLang(null)
    setTermFeature(null)
    setTermOutput([
      `$ npx getplugr add ${type}`,
      `🔌 Welcome to Plugr! — Scaffolding backend features`,
      ``
    ])
  }

  const selectLang = (lang: 'typescript' | 'javascript') => {
    setTermLang(lang)
    setTermOutput(prev => [
      ...prev,
      `? Choose language: ${lang === 'typescript' ? '❯ TypeScript' : '❯ JavaScript'}`,
      ``
    ])
    setTermState(termType === 'auth' ? 'authSelect' : 'emailSelect')
  }

  const selectFeature = (feature: 'JWT' | 'Better-auth' | 'Nodemailer' | 'Brevo') => {
    setTermFeature(feature)
    setTermOutput(prev => [
      ...prev,
      `? Choose ${termType === 'auth' ? 'auth type' : 'email provider'}: ❯ ${feature}`,
      ``
    ])
    setTermState('installing')
  }

  // Simulate installation steps
  useEffect(() => {
    if (termState !== 'installing') return

    let currentStep = 0
    const langSuffix = termLang === 'typescript' ? 'ts' : 'js'
    
    const steps = [
      `→ Copying template files...`,
      `  - Copying config files to src/config/...`,
      termType === 'auth' && termFeature === 'JWT' 
        ? `  - Copying models to src/models/...` 
        : ``,
      `  - Copying controllers and middleware to src/...`,
      `✓ Copied files successfully.`,
      `→ Detecting package manager in project...`,
      `✓ Found lockfile! Detected package manager: ${selectedPm}`,
      `→ Running installation command:`,
      termType === 'auth' 
        ? (termFeature === 'JWT' 
            ? `  ${selectedPm} add jsonwebtoken bcryptjs mongoose dotenv cors ${termLang === 'typescript' ? `&& ${selectedPm} add -D @types/jsonwebtoken @types/bcryptjs` : ''}` 
            : `  ${selectedPm} add better-auth mongodb dotenv cors`)
        : (termFeature === 'Nodemailer'
            ? `  ${selectedPm} add nodemailer dotenv ${termLang === 'typescript' ? `&& ${selectedPm} add -D @types/nodemailer` : ''}`
            : `  ${selectedPm} add @getbrevo/brevo dotenv`),
      `Installing packages... (this may take a few seconds)`,
      `✓ Packages installed successfully.`,
      `🎉 ${termFeature} added to your project!`,
      ``,
      `Then add this integration to your index.${langSuffix}:`,
      termType === 'auth' 
        ? `  app.use("/api/auth", authRoutes)` 
        : `  import { sendEmail } from "./src/emailsource/sendEmail.js"`
    ].filter(Boolean)

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setTermOutput(prev => [...prev, steps[currentStep] as string])
        currentStep++
      } else {
        clearInterval(interval)
        setTermState('completed')
      }
    }, 450)

    return () => clearInterval(interval)
  }, [termState])

  const getCLICommand = () => {
    switch (selectedPm) {
      case 'npm': return 'npx getplugr add auth'
      case 'pnpm': return 'pnpm dlx getplugr add auth'
      case 'yarn': return 'yarn dlx getplugr add auth'
      case 'bun': return 'bunx getplugr add auth'
    }
  }

  // Handle simulated login
  const handleSimulateLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!simEmail || !simPassword) return
    setAuthStatus('loading')
    setTimeout(() => {
      setAuthStatus('success')
    }, 1500)
  }

  // Handle simulated email send
  const handleSimulateEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!simTo || !simSubject || !simMessage) return
    setEmailStatus('sending')
    setTimeout(() => {
      const newEmail = {
        to: simTo,
        subject: simSubject,
        message: simMessage,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setSentEmails(prev => [newEmail, ...prev])
      setEmailStatus('sent')
      // Reset form
      setSimTo('')
      setSimSubject('')
      setSimMessage('')
      setTimeout(() => setEmailStatus('idle'), 2000)
    }, 1500)
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-grid opacity-[0.4] pointer-events-none z-0"></div>
      
      {/* Radial glowing background elements */}
      <div className="fixed -top-40 left-1/4 w-96 h-96 bg-purple-500/10 blur-[150px] rounded-full pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="fixed top-1/2 right-1/4 w-96 h-96 bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none z-0 animate-pulse-slow"></div>

      {/* Navigation Header */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-zinc-900/80 bg-zinc-950/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="font-bold text-white text-lg">P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-md tracking-tight">Plugr</span>
              <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-[0.15em] -mt-1">CLI Showcase</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#hero" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Home</a>
            <a href="#simulator" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Simulator</a>
            <a href="#showcase" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#docs" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Setup Code</a>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/shravan7572/new-project" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold transition-all hover:border-zinc-700 text-zinc-300"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* HERO SECTION */}
          <section id="hero" className="text-center py-10 sm:py-16">
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Sparkles className="w-3 h-3" />
                <span>Zero-dependency Feature Injector</span>
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6 max-w-3xl mx-auto leading-[1.1]">
              Backend features. <br />
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                One command away.
              </span>
            </h1>
            
            <p className="text-md sm:text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Inject fully functional Auth and Email modules directly into your existing Express apps. Works seamlessly with Node, TS, JS, and all package managers.
            </p>

            {/* Terminal Copy Command Box */}
            <div className="max-w-xl mx-auto mb-14">
              <div className="flex justify-center mb-3">
                <div className="inline-flex p-1 rounded-full bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-sm">
                  {(['npm', 'pnpm', 'yarn', 'bun'] as const).map(pm => (
                    <button
                      key={pm}
                      onClick={() => setSelectedPm(pm)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        selectedPm === pm 
                          ? 'bg-purple-600 text-white shadow-md' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md p-4 pr-16 shadow-xl">
                <Terminal className="w-5 h-5 text-purple-400 mr-3 shrink-0" />
                <span className="font-mono text-sm sm:text-base text-zinc-300 overflow-x-auto text-left whitespace-nowrap scrollbar-none flex-1">
                  {getCLICommand()}
                </span>
                <button
                  onClick={() => handleCopy(getCLICommand()!, 'cli')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all"
                >
                  {copiedText === 'cli' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </section>

          {/* INTERACTIVE TERMINAL SIMULATOR */}
          <section id="simulator" className="py-12 border-t border-zinc-900">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Interactive CLI Simulator</h2>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                Test-drive the CLI behavior in real-time. Pick a module to inject and choose your stack.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Simulator Options Column */}
              <div className="lg:col-span-1 space-y-4">
                <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-5 backdrop-blur-sm">
                  <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span>Choose Simulation</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => runSimulator('auth')}
                      disabled={termState === 'running' || termState === 'installing'}
                      className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${
                        termType === 'auth' && termState !== 'idle'
                          ? 'border-purple-500/50 bg-purple-500/5 text-white'
                          : 'border-zinc-800/80 bg-zinc-950/40 hover:bg-zinc-900/30 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-zinc-900 text-purple-400">
                          <Key className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Inject Auth Module</p>
                          <p className="text-xs text-zinc-500">JWT or Better-auth + MongoDB</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0 opacity-60" />
                    </button>

                    <button
                      onClick={() => runSimulator('email')}
                      disabled={termState === 'running' || termState === 'installing'}
                      className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${
                        termType === 'email' && termState !== 'idle'
                          ? 'border-purple-500/50 bg-purple-500/5 text-white'
                          : 'border-zinc-800/80 bg-zinc-950/40 hover:bg-zinc-900/30 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-zinc-900 text-emerald-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Inject Email Module</p>
                          <p className="text-xs text-zinc-500">Nodemailer or Brevo APIs</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0 opacity-60" />
                    </button>
                  </div>
                </div>

                {termState !== 'idle' && (
                  <button
                    onClick={() => setTermState('idle')}
                    className="w-full py-3 px-4 rounded-xl border border-zinc-850 bg-zinc-900/20 hover:bg-zinc-900/40 text-xs font-semibold text-zinc-400 hover:text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Simulator</span>
                  </button>
                )}
              </div>

              {/* Terminal Screen Column */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden font-mono text-sm min-h-[380px] flex flex-col">
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/60 border-b border-zinc-900">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <span className="text-xs text-zinc-500 font-semibold select-none">plugr-cli --simulator</span>
                    <div className="w-12"></div>
                  </div>
                  
                  {/* Terminal Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between text-left overflow-y-auto max-h-[400px]">
                    <div className="space-y-2">
                      {termState === 'idle' ? (
                        <div className="text-center py-20 text-zinc-500">
                          <Terminal className="w-10 h-10 mx-auto mb-3 opacity-20" />
                          <p>Click "Inject Auth" or "Inject Email" to start simulation</p>
                        </div>
                      ) : (
                        termOutput.map((line, idx) => (
                          <p key={idx} className={
                            line.startsWith('$') ? 'text-purple-400' :
                            line.startsWith('✓') ? 'text-emerald-400 font-semibold' :
                            line.startsWith('🔌') || line.startsWith('🎉') ? 'text-white font-bold' :
                            line.startsWith('? ') ? 'text-amber-400 font-medium' :
                            line.startsWith('→') ? 'text-blue-400' : 'text-zinc-300'
                          }>
                            {line}
                          </p>
                        ))
                      )}

                      {/* Lang Select Options In Terminal */}
                      {termState === 'langSelect' && (
                        <div className="pl-4 py-2 space-y-2">
                          <p className="text-zinc-500 italic">// Click to select language:</p>
                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={() => selectLang('typescript')}
                              className="px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/40 transition-all font-semibold"
                            >
                              [1] TypeScript
                            </button>
                            <button 
                              onClick={() => selectLang('javascript')}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-all font-semibold"
                            >
                              [2] JavaScript
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Auth Options In Terminal */}
                      {termState === 'authSelect' && (
                        <div className="pl-4 py-2 space-y-2">
                          <p className="text-zinc-500 italic">// Click to select authentication method:</p>
                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={() => selectFeature('Better-auth')}
                              className="px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/40 transition-all font-semibold"
                            >
                              [1] Better-auth (Recommended)
                            </button>
                            <button 
                              onClick={() => selectFeature('JWT')}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-all font-semibold"
                            >
                              [2] Custom JWT Tokens
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Email Options In Terminal */}
                      {termState === 'emailSelect' && (
                        <div className="pl-4 py-2 space-y-2">
                          <p className="text-zinc-500 italic">// Click to select email service provider:</p>
                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={() => selectFeature('Nodemailer')}
                              className="px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/40 transition-all font-semibold"
                            >
                              [1] Nodemailer (SMTP)
                            </button>
                            <button 
                              onClick={() => selectFeature('Brevo')}
                              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-all font-semibold"
                            >
                              [2] Brevo API (Transactional SDK)
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Cursor Blink */}
                      {termState !== 'idle' && termState !== 'completed' && termState !== 'langSelect' && termState !== 'authSelect' && termState !== 'emailSelect' && (
                        <span className="inline-block w-2 h-4 bg-zinc-400 animate-pulse ml-1"></span>
                      )}
                    </div>

                    {termState === 'completed' && (
                      <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500 font-semibold select-none">
                        <span>Simulation finished</span>
                        <span className="text-emerald-400">Exit code: 0</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* VISUAL FEATURE SHOWCASE */}
          <section id="showcase" className="py-16 border-t border-zinc-900">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Interactive Showcase</h2>
                <p className="text-sm text-zinc-400 max-w-md">
                  Inspect the front-end mockup integration and view the exact codebase structure generated by the CLI.
                </p>
              </div>

              {/* Main Feature Tabs */}
              <div className="flex gap-1.5 p-1 bg-zinc-900/60 rounded-xl border border-zinc-800/80 self-start">
                <button
                  onClick={() => { setActiveTab('auth'); setActiveCodeFile('betterAuthTs') }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                    activeTab === 'auth' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Authentication</span>
                </button>
                <button
                  onClick={() => { setActiveTab('email'); setActiveCodeFile('nodemailerTransporterTs') }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                    activeTab === 'email' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Service</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
              
              {/* Play Area / Demo Visual mockup (Col span 2) */}
              <div className="lg:col-span-2 rounded-2xl border border-zinc-850 bg-zinc-900/10 p-6 flex flex-col justify-between backdrop-blur-sm">
                
                {/* Auth Demonstration Mockup */}
                {activeTab === 'auth' && (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Mock Integration UI</span>
                        <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded font-semibold">Live Sandbox</span>
                      </div>
                      
                      {/* Auth Subtoggle */}
                      <div className="flex gap-2 mb-6">
                        <button
                          onClick={() => { setActiveAuthSubTab('better-auth'); setActiveCodeFile('betterAuthTs') }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            activeAuthSubTab === 'better-auth'
                              ? 'border-purple-500/50 bg-purple-500/5 text-purple-300'
                              : 'border-zinc-850 bg-zinc-950/40 text-zinc-500 hover:text-zinc-400'
                          }`}
                        >
                          Better-Auth Schema
                        </button>
                        <button
                          onClick={() => { setActiveAuthSubTab('jwt'); setActiveCodeFile('jwtTs') }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            activeAuthSubTab === 'jwt'
                              ? 'border-purple-500/50 bg-purple-500/5 text-purple-300'
                              : 'border-zinc-850 bg-zinc-950/40 text-zinc-500 hover:text-zinc-400'
                          }`}
                        >
                          Custom JWT Setup
                        </button>
                      </div>
                    </div>

                    {/* Simulated Auth Form */}
                    <div className="border border-zinc-800 bg-zinc-950/90 rounded-2xl p-5 shadow-lg max-w-sm mx-auto w-full my-4">
                      <h4 className="text-center font-bold text-md text-white mb-4">Express Auth Sandbox</h4>
                      <form onSubmit={handleSimulateLogin} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1.5 text-left">Email Address</label>
                          <input 
                            type="email" 
                            value={simEmail}
                            onChange={(e) => setSimEmail(e.target.value)}
                            placeholder="admin@example.com" 
                            className="w-full text-xs bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-lg px-3 py-2 text-zinc-200 outline-none transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1.5 text-left">Password</label>
                          <input 
                            type="password" 
                            value={simPassword}
                            onChange={(e) => setSimPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full text-xs bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-lg px-3 py-2 text-zinc-200 outline-none transition-all"
                            required
                          />
                        </div>
                        
                        <button 
                          type="submit" 
                          disabled={authStatus === 'loading'}
                          className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          {authStatus === 'loading' ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Verifying Credentials...</span>
                            </>
                          ) : authStatus === 'success' ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Welcome Back!</span>
                            </>
                          ) : (
                            <span>Submit Request</span>
                          )}
                        </button>
                      </form>

                      {authStatus === 'success' && (
                        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs text-left">
                          <p className="font-semibold mb-1">Backend Connection Sim:</p>
                          <p className="text-[10px] text-zinc-400 font-mono overflow-x-auto truncate">
                            {activeAuthSubTab === 'jwt' 
                              ? '→ Res: 200 OK { token: "ey...zK" } (Session verified via Mongoose)'
                              : '→ Res: 200 OK { session: { user } } (BetterAuth verified via MongoDB Adapter)'
                            }
                          </p>
                          <button 
                            onClick={() => { setAuthStatus('idle'); setSimEmail(''); setSimPassword('') }} 
                            className="mt-2 text-[10px] text-purple-400 hover:text-white transition-all underline font-semibold cursor-pointer"
                          >
                            Reset Form
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="text-zinc-500 text-xs flex items-center gap-1.5 bg-zinc-950/30 border border-zinc-900 p-3.5 rounded-xl text-left">
                      <Info className="w-4 h-4 text-purple-400 shrink-0" />
                      <p>
                        {activeAuthSubTab === 'jwt'
                          ? "Custom JWT setup adds user controllers, validation middleware, and Mongo configuration."
                          : "Better-Auth sets up the standard server handler config and DB adapter connections."
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Email Demonstration Mockup */}
                {activeTab === 'email' && (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Email SMTP/API Simulator</span>
                        <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-0.5 rounded font-semibold font-mono">Live</span>
                      </div>
                      
                      {/* Email Subtoggle */}
                      <div className="flex gap-2 mb-6">
                        <button
                          onClick={() => { setActiveEmailSubTab('nodemailer'); setActiveCodeFile('nodemailerTransporterTs') }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            activeEmailSubTab === 'nodemailer'
                              ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-300'
                              : 'border-zinc-850 bg-zinc-950/40 text-zinc-500 hover:text-zinc-400'
                          }`}
                        >
                          Nodemailer (SMTP)
                        </button>
                        <button
                          onClick={() => { setActiveEmailSubTab('brevo'); setActiveCodeFile('brevoTransporterTs') }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            activeEmailSubTab === 'brevo'
                              ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-300'
                              : 'border-zinc-850 bg-zinc-950/40 text-zinc-500 hover:text-zinc-400'
                          }`}
                        >
                          Brevo API SDK
                        </button>
                      </div>
                    </div>

                    {/* Simulated Email Form */}
                    <div className="border border-zinc-800 bg-zinc-950/90 rounded-2xl p-5 shadow-lg max-w-sm mx-auto w-full my-4">
                      <h4 className="text-center font-bold text-md text-white mb-4">Send Mail Sandbox</h4>
                      <form onSubmit={handleSimulateEmail} className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 text-left">To</label>
                          <input 
                            type="email" 
                            value={simTo}
                            onChange={(e) => setSimTo(e.target.value)}
                            placeholder="user@mailbox.com" 
                            className="w-full text-xs bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-zinc-200 outline-none transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 text-left">Subject</label>
                          <input 
                            type="text" 
                            value={simSubject}
                            onChange={(e) => setSimSubject(e.target.value)}
                            placeholder="Verify your email" 
                            className="w-full text-xs bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-zinc-200 outline-none transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 text-left">Message</label>
                          <textarea 
                            value={simMessage}
                            onChange={(e) => setSimMessage(e.target.value)}
                            placeholder="Hi! Here is your code: 123456" 
                            className="w-full text-xs bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-zinc-200 outline-none transition-all h-16 resize-none"
                            required
                          />
                        </div>
                        
                        <button 
                          type="submit" 
                          disabled={emailStatus === 'sending'}
                          className="w-full py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          {emailStatus === 'sending' ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending Dispatch...</span>
                            </>
                          ) : emailStatus === 'sent' ? (
                            <>
                              <Send className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Dispatched!</span>
                            </>
                          ) : (
                            <span>Send Email</span>
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Inbox Sent Items simulation */}
                    <div className="mt-4 border-t border-zinc-900 pt-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 text-left">Inbox logs ({sentEmails.length})</p>
                      {sentEmails.length === 0 ? (
                        <p className="text-zinc-600 text-xs py-4 text-center">No emails sent yet</p>
                      ) : (
                        <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                          {sentEmails.map((mail, idx) => (
                            <div key={idx} className="bg-zinc-950/70 border border-zinc-900 rounded-lg p-2.5 text-left text-xs">
                              <div className="flex justify-between text-zinc-500 text-[10px] font-mono mb-1">
                                <span>To: {mail.to}</span>
                                <span>{mail.date}</span>
                              </div>
                              <p className="font-semibold text-zinc-300 truncate">{mail.subject}</p>
                              <p className="text-zinc-400 text-[10px] line-clamp-1 mt-0.5">{mail.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Code viewer (Col span 3) */}
              <div className="lg:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden shadow-xl">
                
                {/* Code Tabs Header */}
                <div className="px-4 py-3 bg-zinc-900/60 border-b border-zinc-900 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex gap-2">
                    {activeTab === 'auth' ? (
                      activeAuthSubTab === 'better-auth' ? (
                        <button 
                          onClick={() => setActiveCodeFile('betterAuthTs')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activeCodeFile === 'betterAuthTs' 
                              ? 'bg-zinc-800 text-white border border-zinc-700' 
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          auth.ts
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => setActiveCodeFile('jwtTs')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeCodeFile === 'jwtTs' 
                                ? 'bg-zinc-800 text-white border border-zinc-700' 
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            jwt.ts
                          </button>
                          <button 
                            onClick={() => setActiveCodeFile('dbTs')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeCodeFile === 'dbTs' 
                                ? 'bg-zinc-800 text-white border border-zinc-700' 
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            connector.ts
                          </button>
                          <button 
                            onClick={() => setActiveCodeFile('userModelTs')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeCodeFile === 'userModelTs' 
                                ? 'bg-zinc-800 text-white border border-zinc-700' 
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            user.ts
                          </button>
                          <button 
                            onClick={() => setActiveCodeFile('authMiddlewareTs')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeCodeFile === 'authMiddlewareTs' 
                                ? 'bg-zinc-800 text-white border border-zinc-700' 
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            auth.ts
                          </button>
                        </>
                      )
                    ) : (
                      activeEmailSubTab === 'nodemailer' ? (
                        <>
                          <button 
                            onClick={() => setActiveCodeFile('nodemailerTransporterTs')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeCodeFile === 'nodemailerTransporterTs' 
                                ? 'bg-zinc-800 text-white border border-zinc-700' 
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            transporter.ts
                          </button>
                          <button 
                            onClick={() => setActiveCodeFile('nodemailerSendTs')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeCodeFile === 'nodemailerSendTs' 
                                ? 'bg-zinc-800 text-white border border-zinc-700' 
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            sendEmail.ts
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => setActiveCodeFile('brevoTransporterTs')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeCodeFile === 'brevoTransporterTs' 
                                ? 'bg-zinc-800 text-white border border-zinc-700' 
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            transporter.ts
                          </button>
                          <button 
                            onClick={() => setActiveCodeFile('brevoSendTs')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              activeCodeFile === 'brevoSendTs' 
                                ? 'bg-zinc-800 text-white border border-zinc-700' 
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            sendEmail.ts
                          </button>
                        </>
                      )
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleCopy(CODE_SNIPPETS[activeCodeFile as keyof typeof CODE_SNIPPETS], 'code')}
                    className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
                  >
                    {copiedText === 'code' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Window */}
                <div className="flex-1 p-6 font-mono text-xs text-zinc-300 overflow-y-auto text-left leading-relaxed bg-[#0b0c10] min-h-[350px]">
                  <pre className="whitespace-pre-wrap select-all">
                    {CODE_SNIPPETS[activeCodeFile as keyof typeof CODE_SNIPPETS]}
                  </pre>
                </div>
              </div>

            </div>
          </section>

          {/* SETUP DETAILS & DOCUMENTATION */}
          <section id="docs" className="py-16 border-t border-zinc-900">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">CLI Integration details</h2>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                Plugr automates the file layout scaffolding. Below is where they go.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-6 flex flex-col justify-between backdrop-blur-sm hover:border-zinc-800 transition-all">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Database Connector</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Automatically connects Mongoose or MongoDB MongoClient dependencies, checking for MONGO_URL configuration strings in your project environment variables.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-6 flex flex-col justify-between backdrop-blur-sm hover:border-zinc-800 transition-all">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Validation Middleware</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Saves pre-configured JSON Web Token decoding handlers in your middleware folder. Protect routers using a clean, reusable session check.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-900 bg-zinc-900/10 p-6 flex flex-col justify-between backdrop-blur-sm hover:border-zinc-800 transition-all">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Destination Adapters</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Detects the presence of a `./src` folder structure. Copied files adapt immediately to root or subdirectory paths avoiding folders pollution.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-zinc-900 bg-zinc-950/80 overflow-hidden py-10 mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 select-none">
          <span>&copy; 2026 Plugr CLI. Open-source under MIT License.</span>
          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-purple-500 fill-purple-500/20 animate-pulse" />
            <span>for the node community</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
