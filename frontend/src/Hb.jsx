import { Github, Mail, ArrowLeft, Code2, Zap, Shield , Instagram, Twitter, Briefcase, GraduationCap, Mic, Mic2, Brain, Bot, MapPin} from "lucide-react";
import {useNavigate} from "react-router-dom"
import bgImg from "./assets/hehe.jpg"

const Hb = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Navigation */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to homepage</span>
        </button>

        {/* Main Content Card */}
        <div className="bg-black backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden">
            <img src={bgImg} alt="avatar" className="w-full h-full object-cover"/>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Henry Bassey</h1>
              <p className="text-blue-400 font-medium">Full-Stack Developer & Creator</p>
              <span className=" flex gap-3 items-center mt-1 text-slate-300 text-xs"><MapPin className="w-4 h-4"/> Nigeria</span>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-6 mb-8">
            <p className="text-slate-300 text-lg leading-relaxed">
              Meet the mind behind this blog platform. What started as a Flask learning experiment has evolved into a showcase of
              <span className="text-blue-400 font-semibold"> full-stack development mastery</span>,
              reflecting Henry's journey toward becoming a well-rounded backend architect.
            </p>

            <p className="text-slate-300 text-lg leading-relaxed">
              With a passion for crafting secure, scalable web applications, Henry navigates the entire technology stack —
              from robust API design and authentication systems to seamless React integrations that bring ideas to life.
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 text-center">
              <Code2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Web Development</h3>
              <p className="text-slate-400 text-sm">Full-stack solutions with modern frameworks</p>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 text-center">
              <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Security Focus</h3>
              <p className="text-slate-400 text-sm">Secure application design</p>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 text-center">
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Innovation</h3>
              <p className="text-slate-400 text-sm">UI/UX design & automation solutions</p>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 text-center">
              <Bot className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Leveraging AI</h3>
              <p className="text-slate-400 text-sm">Using AI to stay at the forefront of modern development</p>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 text-center">
              <GraduationCap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Learning</h3>
              <p className="text-slate-400 text-sm">Born '07, Henry has time to develop and grow</p>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 text-center">
              <Mic2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Story Telling</h3>
              <p className="text-slate-400 text-sm">Passionate about sharing life experiences with poeple.</p>
            </div>
          </div>

          {/* Personal Touch */}
          <div className="bg-gradient-to-r from-blue-900/20 to-slate-800/20 border border-blue-700/30 rounded-xl p-6 mb-8">
            <p className="text-slate-300 leading-relaxed">
              Beyond the code, Henry explores the intersection of technology and creativity. Whether it's experimenting with
              cutting-edge UI patterns, diving deep into cybersecurity research, or building automation tools that solve
              real-world problems, this blog serves as both a technical portfolio and a creative outlet.
            </p>
          </div>

          {/* Contact Section */}
          <div className="border-t border-slate-700/50 pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Let's Connect</h3>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://henrybassey.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-slate-700/40 hover:bg-slate-600/60 border border-slate-600/50 hover:border-slate-500 rounded-lg px-4 py-3 transition-all duration-300"
              >
                <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                <span className="text-slate-300 group-hover:text-white font-medium transition-colors">
                    My portfolio
                </span>
              </a>
              <a
                href="https://github.com/whoshnri"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-blue-900/40 hover:bg-blue-800/60 border border-slate-600/50 hover:border-slate-500 rounded-lg px-4 py-3 transition-all duration-300"
              >
                <Github className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                <span className="text-slate-300 group-hover:text-white font-medium transition-colors">
                  My GitHub
                </span>
              </a>
              <a
                href="https://instagram.com/xyz_07hb"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/50 hover:border-blue-600 rounded-lg px-4 py-3 transition-all duration-300"
              >
                <Instagram className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-blue-300 group-hover:text-white font-medium transition-colors">
                  Instagram
                </span>
              </a>
              <a
                href="https://x.com/xyz_07hb"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/50 hover:border-blue-600 rounded-lg px-4 py-3 transition-all duration-300"
              >
                <Twitter className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-blue-300 group-hover:text-white font-medium transition-colors">
                  Twitter
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-slate-600/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Hb;
