import { Link } from "react-router-dom";

export default function Upcoming() {
  return (
    <div className="min-h-screen bg-white text-[#171717] font-sans antialiased">
      
      {/* FLOATING NAVBAR */}
      <header className="fixed top-4 inset-x-4 max-w-5xl mx-auto h-12 rounded-full border-none bg-white/80 backdrop-blur-md shadow-2xs z-50 flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 bg-transparent border-none cursor-pointer p-0 text-decoration-none">
          <div className="h-6 w-6 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-xs select-none">
            P
          </div>
          <span className="font-semibold text-[#171717] text-sm tracking-tight select-none">Plugr</span>
        </Link>
        
        {/* Centered Navigation Links */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-6">
          <Link to="/" className="text-xs font-semibold text-[#60646c] hover:text-[#171717] transition-colors">Overview</Link>
          <Link to="/" className="text-xs font-semibold text-[#60646c] hover:text-[#171717] transition-colors">Packages</Link>
          <Link to="/" className="text-xs font-semibold text-[#60646c] hover:text-[#171717] transition-colors">Showcase</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link 
            to="/upcoming"
            className="px-3 py-1 text-xs font-semibold rounded-full border border-[#171717] bg-[#171717] text-white transition-all"
          >
            Upcoming
          </Link>
          <a 
            href="https://github.com/shravan7572/new-project" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#dcdee0] bg-white hover:bg-[#f0f0f3] px-3 py-1 text-xs font-semibold transition-all text-[#60646c] hover:text-[#171717]"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* ROADMAP CONTENT */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-[120px] pb-[96px] text-left min-h-[80vh]">
        
        <div className="border-b border-[#dcdee0] pb-8 mb-10 space-y-3">
          <span className="inline-flex rounded-full bg-[#f0f0f3] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#171717]">
            Roadmap
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717]">
            Upcoming Scaffolds
          </h1>
          <p className="text-sm text-[#60646c] max-w-xl leading-relaxed">
            We are actively developing templates for features you request. Here is what is planned next for the Plugr CLI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Payments */}
          <div className="rounded-[12px] border border-[#dcdee0] bg-white p-6 flex flex-col justify-between shadow-2xs min-h-[200px]">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-[#171717]">Stripe Payments</h3>
                <span className="text-[9px] uppercase tracking-wider font-semibold bg-[#f0f0f3] px-2 py-0.5 rounded text-[#171717]">Q3 2026</span>
              </div>
              <p className="text-xs text-[#60646c] leading-relaxed">
                Drop pre-configured Stripe checkout sessions, customer webhooks, and subscription helpers directly into your Express backend routes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#dcdee0] font-mono-code text-[11px] text-[#999999]">
              <span>npx getplugr add payments</span>
            </div>
          </div>

          {/* Card 2: Uploads */}
          <div className="rounded-[12px] border border-[#dcdee0] bg-white p-6 flex flex-col justify-between shadow-2xs min-h-[200px]">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-[#171717]">File Storage</h3>
                <span className="text-[9px] uppercase tracking-wider font-semibold bg-[#f0f0f3] px-2 py-0.5 rounded text-[#171717]">Q3 2026</span>
              </div>
              <p className="text-xs text-[#60646c] leading-relaxed">
                Scaffold complete local Multer file uploads or remote storage adapters for AWS S3 and Cloudinary out of the box.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#dcdee0] font-mono-code text-[11px] text-[#999999]">
              <span>npx getplugr add upload</span>
            </div>
          </div>

          {/* Card 3: WebSockets */}
          <div className="rounded-[12px] border border-[#dcdee0] bg-white p-6 flex flex-col justify-between shadow-2xs min-h-[200px]">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-[#171717]">Real-Time WebSockets</h3>
                <span className="text-[9px] uppercase tracking-wider font-semibold bg-[#f0f0f3] px-2 py-0.5 rounded text-[#171717]">Q4 2026</span>
              </div>
              <p className="text-xs text-[#60646c] leading-relaxed">
                Set up clean Socket.io WebSocket servers, client connection managers, and route event dispatches in minutes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#dcdee0] font-mono-code text-[11px] text-[#999999]">
              <span>npx getplugr add ws</span>
            </div>
          </div>

          {/* Card 4: SQL Connectors */}
          <div className="rounded-[12px] border border-[#dcdee0] bg-white p-6 flex flex-col justify-between shadow-2xs min-h-[200px]">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold text-[#171717]">SQL Database Connectors</h3>
                <span className="text-[9px] uppercase tracking-wider font-semibold bg-[#f0f0f3] px-2 py-0.5 rounded text-[#171717]">Q4 2026</span>
              </div>
              <p className="text-xs text-[#60646c] leading-relaxed">
                Inject Prisma schemas, Drizzle models, and connection pool configurations for PostgreSQL, MySQL, and SQLite databases.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#dcdee0] font-mono-code text-[11px] text-[#999999]">
              <span>npx getplugr add db</span>
            </div>
          </div>

        </div>

        <div className="mt-12">
          <Link 
            to="/"
            className="inline-flex items-center h-10 px-6 bg-[#000000] text-white text-xs font-semibold rounded-[8px] hover:bg-[#1a1a1a] transition-all cursor-pointer shadow-xs text-decoration-none"
          >
            Back to Home
          </Link>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-white pt-[96px] pb-8">
        {/* Columns container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-8">
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
                  <a href="https://www.npmjs.com/package/getplugr" target="_blank" rel="noreferrer" className="text-[#60646c] hover:text-black">npm</a>
                </li>
                <li>
                  <a href="https://github.com/shravan7572/new-project" target="_blank" rel="noreferrer" className="text-[#60646c] hover:text-black">GitHub</a>
                </li>
                <li>
                  <Link to="/upcoming" className="text-[#60646c] hover:text-black text-xs font-normal">Roadmap</Link>
                </li>
              </ul>
            </div>
            
            {/* Connect */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717]">Connect</h4>
              <ul className="space-y-2 text-xs">
                <li><a href='https://x.com/shravann3107?s=11' className="text-[#60646c] hover:text-black">Twitter</a></li>
                <li><a href='https://www.linkedin.com/in/shravan7572' className="text-[#60646c] hover:text-black">LinkedIn</a></li>
                <li><span className="text-[#60646c]">Contact</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Edge-to-Edge Divider Line */}
        <div className="w-full border-t border-[#dcdee0]"></div>

        {/* Attribution container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
          <div className="flex items-center justify-between text-[11px] text-[#999999] uppercase font-semibold tracking-wider select-none">
            <span>&copy; 2026 Plugr CLI.</span>
            <span>Built by Shravan Choudhary</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
