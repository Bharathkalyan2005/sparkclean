import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User, Phone, Check, ChevronDown } from 'lucide-react';
import api from '../lib/axiosInstance';

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Invalid phone (min 10 digits)"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be 8+ characters"),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, "Must accept terms")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-[#0AFFE6] rounded-full blur-[1px]"
        style={{ width: Math.random() * 4 + 2, height: Math.random() * 4 + 2 }}
        initial={{ x: `${Math.random() * 100}vw`, y: '100vh', opacity: Math.random() * 0.5 + 0.2 }}
        animate={{ y: '-10vh' }}
        transition={{ duration: Math.random() * 15 + 15, repeat: Infinity, ease: 'linear', delay: Math.random() * -20 }}
      />
    ))}
  </div>
);

const PasswordStrength = ({ password }: { password?: string }) => {
  const getStrength = (pass: string = '') => {
    if (pass.length === 0) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.match(/[A-Z]/) || pass.match(/[0-9]/)) score += 1;
    if (pass.match(/[^A-Za-z0-9]/)) score += 1;
    if (pass.length >= 12) score += 1;
    return score;
  };

  const score = getStrength(password);
  const colors = ['#333', '#FF4444', '#FFBB00', '#00FF00', '#0AFFE6'];
  const activeColor = colors[score === 0 ? 0 : score];

  return (
    <div className="flex gap-1 mt-2">
      {[1, 2, 3, 4].map(idx => (
        <div key={idx} className="h-1 flex-1 rounded-full transition-all duration-300" 
             style={{ backgroundColor: idx <= score ? activeColor : 'rgba(255,255,255,0.1)' }} />
      ))}
    </div>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shakeLogin, setShakeLogin] = useState(false);
  const [shakeSignup, setShakeSignup] = useState(false);
  const navigate = useNavigate();

  // Check for local storage token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  useEffect(() => {
    // Add external fonts just for this page exactly as requested
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', phone: '', email: '', password: '', confirmPassword: '', terms: false }
  });

  const onLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post(`/auth/login`, {
        email: data.email, 
        password: data.password 
      });

      const result = response.data;
      
      localStorage.setItem('sparkclean_token', result.token);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      toast.success("Welcome back! Redirecting...", {
        style: { background: '#0AFFE6', color: '#000', fontWeight: 'bold' }
      });
      
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect') || '/';
      setTimeout(() => navigate(redirect), 800);
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Network error.';
      if (errorMsg.includes('Invalid')) {
           loginForm.setError('password', { message: 'Incorrect password or email. Try again.' });
      } else {
           loginForm.setError('email', { message: errorMsg });
      }
      setShakeLogin(true);
      setTimeout(() => setShakeLogin(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post(`/auth/register`, {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone
      });

      const result = response.data;

      // If backend actually logs in after register, save token. Otherwise just show success.
      if (result.token) {
        localStorage.setItem('sparkclean_token', result.token);
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      toast.success("Account created! Please log in.", {
        style: { background: '#0AFFE6', color: '#000', fontWeight: 'bold' },
        duration: 4000
      });
      setTimeout(() => setIsLogin(true), 2000);
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      if (errorMsg.includes('already in use')) {
        signupForm.setError('email', { message: 'Account exists. Try logging in.' });
      } else {
        signupForm.setError('root', { message: errorMsg });
      }
      setShakeSignup(true);
      setTimeout(() => setShakeSignup(false), 500);
    } finally {
      setIsLoading(false);
    }
  };


  const handleForgotPass = async (e: React.MouseEvent) => {
    e.preventDefault();
    const email = loginForm.getValues('email');
    if (!email) {
      loginForm.setError('email', { message: "Enter your email first" });
      return;
    }
    
    // Stub for Local API
    toast.error("Forgot password API endpoint not fully connected yet.");
    // if (error) {
    //   toast.error(error.message);
    // } else {
    //   toast.success("Reset link sent to your email", { style: { background: '#0AFFE6', color: '#000' } });
    // }
  };

  // Form input classes
  const inputClass = "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(10,255,230,0.2)] rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#0AFFE6] focus:ring-1 focus:ring-[#0AFFE6] transition-all duration-200 font-['Inter'] shadow-[0_0_0_rgba(10,255,230,0)] hover:border-[rgba(10,255,230,0.4)]";
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0AFFE6]";
  const errorClass = "text-[#FF4444] text-xs font-['Inter'] mt-1 ml-1 font-medium";

  const shakeVariants = {
    shake: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
    <div className="min-h-screen w-full flex bg-[#0A0A0A] font-['Inter'] overflow-hidden">
      
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden md:flex relative w-[60%] flex-col justify-between overflow-hidden border-r border-[#0AFFE6]/10">
        {/* Cinematic Background Image/Video representation */}
        <div className="absolute inset-0 w-full h-full bg-black">
          <img 
            src="/images/login-page.jpeg" 
            alt="Premium Home Cleaning"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent)' }} />
        </div>
        
        <Particles />

        <div className="relative z-20 flex-1 flex flex-col justify-between p-12 lg:p-20">
          <div>
            <div className="flex items-center gap-2 mb-16">
              <img src="/logo-primary-cropped.png" alt="SparkClean Logo" className="h-8 w-auto" />
              <span className="text-white font-bold tracking-wider text-xl font-['Syne']">SparkClean</span>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl lg:text-7xl font-['Instrument_Serif'] text-white max-w-2xl leading-tight"
            >
              A cleaner home starts with one click.
            </motion.h1>
          </div>

          <div>
            <div className="flex gap-8 text-sm font-medium text-white/80 mb-8 border-b border-white/10 pb-8">
              <div className="flex items-center gap-2"><span className="text-[#0AFFE6]">✦</span> 500+ Happy Customers</div>
              <div className="flex items-center gap-2"><span className="text-[#0AFFE6]">✦</span> Same-Day Booking</div>
              <div className="flex items-center gap-2"><span className="text-[#0AFFE6]">✦</span> Verified Staff</div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/60 text-xs tracking-widest uppercase">India's Cleanest Choice</p>
                <p className="text-[#0AFFE6]/60 text-[10px] mt-1">Serving India since 2026</p>
              </div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <ChevronDown className="w-6 h-6 text-[#0AFFE6]" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <motion.div 
        className="w-full md:w-[40%] flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 relative"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Mobile Header indicator */}
        <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0AFFE6] to-transparent opacity-50" />
        
        <div className="w-full max-w-md z-10 relative">
          
          <div className="md:hidden flex flex-col items-center justify-center mb-10">
            <img src="/logo-primary-cropped.png" alt="SparkClean Logo" className="h-10 w-auto mb-2" />
            <span className="text-white font-bold tracking-wider text-xl font-['Syne']">SparkClean</span>
          </div>

          {/* Form Card */}
          <div className="backdrop-blur-xl bg-black/40 border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            
            {/* Top Shine */}
            <div className="absolute top-0 left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-[#0AFFE6]/50 to-transparent" />

            <div className="flex justify-center mb-8">
              <div className="flex bg-white/5 p-1 rounded-xl">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isLogin ? 'bg-[#0AFFE6]/10 text-[#0AFFE6] shadow-[inset_0_0_10px_rgba(10,255,230,0.2)]' : 'text-[#A0A0A0] hover:text-white'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${!isLogin ? 'bg-[#0AFFE6]/10 text-[#0AFFE6] shadow-[inset_0_0_10px_rgba(10,255,230,0.2)]' : 'text-[#A0A0A0] hover:text-white'}`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <h2 className="text-3xl font-['Instrument_Serif'] text-white text-center mb-1">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-[#A0A0A0] text-sm text-center mb-8">
              {isLogin ? 'Book your next clean in seconds' : 'Join 500+ India homeowners'}
            </p>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={shakeLogin ? "shake" : { opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  variants={shakeVariants}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <div>
                      <div className="relative">
                        <Mail className={iconClass} />
                        <input {...loginForm.register('email')} type="email" placeholder="your@email.com" className={inputClass} />
                      </div>
                      {loginForm.formState.errors.email && <p className={errorClass}>{loginForm.formState.errors.email.message}</p>}
                    </div>

                    <div>
                      <div className="relative">
                        <Lock className={iconClass} />
                        <input {...loginForm.register('password')} type={showPass ? "text" : "password"} placeholder="Password" className={inputClass} />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="flex justify-between mt-1">
                        <div>{loginForm.formState.errors.password && <p className={errorClass}>{loginForm.formState.errors.password.message}</p>}</div>
                        <button type="button" onClick={handleForgotPass} className="text-[#0AFFE6] text-[13px] hover:underline mt-1">Forgot password?</button>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full h-[52px] mt-6 bg-[#0AFFE6] text-black font-semibold rounded-xl hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(10,255,230,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : (
                        <><span className="text-black group-hover:animate-pulse">✦</span> Login to SparkClean</>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={shakeSignup ? "shake" : { opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  variants={shakeSignup ? shakeVariants : undefined}
                  transition={{ duration: 0.3 }}
                  className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
                >
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <div>
                      <div className="relative">
                        <User className={iconClass} />
                        <input {...signupForm.register('fullName')} type="text" placeholder="Full Name" className={inputClass} />
                      </div>
                      {signupForm.formState.errors.fullName && <p className={errorClass}>{signupForm.formState.errors.fullName.message}</p>}
                    </div>

                    <div>
                      <div className="relative">
                        <Phone className={iconClass} />
                        <div className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center border-r border-white/20 pr-2">
                          <span className="text-xs text-white/80 font-semibold bg-white/10 px-1.5 py-0.5 rounded">+91</span>
                        </div>
                        <input {...signupForm.register('phone')} type="tel" placeholder="Phone Number" className={`${inputClass} pl-[90px]`} />
                      </div>
                      {signupForm.formState.errors.phone && <p className={errorClass}>{signupForm.formState.errors.phone.message}</p>}
                    </div>

                    <div>
                      <div className="relative">
                        <Mail className={iconClass} />
                        <input {...signupForm.register('email')} type="email" placeholder="Email Address" className={inputClass} />
                      </div>
                      {signupForm.formState.errors.email && <p className={errorClass}>{signupForm.formState.errors.email.message}</p>}
                    </div>

                    <div>
                      <div className="relative">
                        <Lock className={iconClass} />
                        <input {...signupForm.register('password')} type={showConfirmPass ? "text" : "password"} placeholder="Password" className={inputClass} />
                        <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                          {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <PasswordStrength password={signupForm.watch('password')} />
                      {signupForm.formState.errors.password && <p className={errorClass}>{signupForm.formState.errors.password.message}</p>}
                    </div>

                    <div>
                      <div className="relative">
                        <Lock className={iconClass} />
                        <input {...signupForm.register('confirmPassword')} type={showConfirmPass ? "text" : "password"} placeholder="Confirm Password" className={inputClass} />
                      </div>
                      {signupForm.formState.errors.confirmPassword && <p className={errorClass}>{signupForm.formState.errors.confirmPassword.message}</p>}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <label className="relative flex items-center cursor-pointer">
                        <input type="checkbox" {...signupForm.register('terms')} className="sr-only peer" />
                        <div className="w-5 h-5 border border-white/20 rounded peer-checked:bg-[#0AFFE6] peer-checked:border-[#0AFFE6] transition-colors flex items-center justify-center">
                          <Check className="w-3 h-3 text-black opacity-0 peer-checked:opacity-100" />
                        </div>
                      </label>
                      <span className="text-xs text-[#A0A0A0]">I agree to Terms & Privacy Policy</span>
                    </div>
                    {signupForm.formState.errors.terms && <p className={errorClass}>{signupForm.formState.errors.terms.message}</p>}
                    
                    {signupForm.formState.errors.root && <p className={errorClass}>{signupForm.formState.errors.root.message}</p>}

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full h-[52px] bg-[#0AFFE6] text-black font-semibold rounded-xl hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(10,255,230,0.4)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : "Create My Account"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="text-xs text-[#A0A0A0] uppercase tracking-wider font-semibold">or continue with</span>
              <div className="flex-1 h-[1px] bg-white/10" />
            </div>

            <button
                onClick={() => {
                  const params = new URLSearchParams(window.location.search);
                  const redirect = params.get('redirect') || '/';
                  localStorage.setItem('auth_redirect', redirect);
                  window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
                }}
                style={{
                  width          : '100%',
                  padding        : '14px',
                  background     : 'rgba(255,255,255,0.04)',
                  border         : '1px solid rgba(255,255,255,0.12)',
                  borderRadius   : '12px',
                  color          : '#FFFFFF',
                  fontSize       : '15px',
                  fontWeight     : '500',
                  cursor         : 'pointer',
                  display        : 'flex',
                  alignItems     : 'center',
                  justifyContent : 'center',
                  gap            : '12px',
                  transition     : 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = '1px solid rgba(10,255,230,0.3)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

            <div className="mt-8 text-center text-sm text-[#A0A0A0]">
              {isLogin ? (
                <>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-[#0AFFE6] hover:underline font-medium">Sign up</button></>
              ) : (
                <>Already have an account? <button onClick={() => setIsLogin(true)} className="text-[#0AFFE6] hover:underline font-medium">Login</button></>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
    </GoogleOAuthProvider>
  );
};

export default AuthPage;


