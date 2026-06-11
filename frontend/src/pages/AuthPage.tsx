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

const forgotSchema = z.object({
  email: z.string().email("Invalid email format"),
  newPassword: z.string().min(8, "Password must be at least 8 characters")
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
type ForgotFormValues = z.infer<typeof forgotSchema>;

const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-[#C9A84C] rounded-full blur-[1px]"
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
  const colors = ['#E2E8F0', '#DC2626', '#D97706', '#16A34A', '#1B4332'];
  const activeColor = colors[score === 0 ? 0 : score];

  return (
    <div className="flex gap-1 mt-2">
      {[1, 2, 3, 4].map(idx => (
        <div key={idx} className="h-1 flex-1 rounded-full transition-all duration-300" 
             style={{ backgroundColor: idx <= score ? activeColor : 'rgba(27,67,50,0.1)' }} />
      ))}
    </div>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
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

  const forgotForm = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '', newPassword: '' }
  });

  const onLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post(`/auth/login`, {
        email: data.email, 
        password: data.password 
      });

      const result = response.data;
      
      localStorage.setItem('sucihome_token', result.token);
      localStorage.setItem('token', result.token);
      localStorage.setItem('sparkclean_token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      toast.success("Welcome back! Redirecting...", {
        style: { background: '#1B4332', color: '#FFFFFF', fontWeight: 'semibold' }
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
        localStorage.setItem('sucihome_token', result.token);
        localStorage.setItem('token', result.token);
        localStorage.setItem('sparkclean_token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      toast.success("Account created! Please log in.", {
        style: { background: '#1B4332', color: '#FFFFFF', fontWeight: 'semibold' },
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
    setIsForgot(true);
  };

  const onForgotSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    try {
      await api.post(`/auth/reset-password`, { email: data.email, newPassword: data.newPassword });
      toast.success("Password reset successful! Please login.", { style: { background: '#1B4332', color: '#FFFFFF', fontWeight: 'semibold' } });
      setIsForgot(false);
      forgotForm.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Form input classes
  const inputClass = "w-full bg-[#F5F0E8]/40 border border-[#EDE8DC] rounded-xl py-3.5 pl-11 pr-4 text-[#2D4A35] placeholder-[#5C6B5E]/50 focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-all duration-200 font-['Inter'] shadow-inner hover:border-[#1B4332]/40";
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1B4332]";
  const errorClass = "text-red-600 text-xs font-['Inter'] mt-1 ml-1 font-medium";

  const shakeVariants = {
    shake: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
    <div className="min-h-screen w-full flex bg-[#F5F0E8] font-['Inter'] overflow-hidden">
      
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden md:flex relative w-[60%] flex-col justify-between overflow-hidden border-r border-[#EDE8DC]">
        {/* Cinematic Background Image/Video representation */}
        <div className="absolute inset-0 w-full h-full bg-black">
          <img 
            src="/images/login-page.jpeg" 
            alt="Premium Home Cleaning"
            className="w-full h-full object-cover opacity-60"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,43,31,0.85), rgba(13,43,31,0.3))' }} />
        </div>
        
        <Particles />

        <div className="relative z-20 flex-1 flex flex-col justify-between p-12 lg:p-20">
          <div>
            <div className="mb-16">
              <div style={{
                display    : 'flex',
                alignItems : 'center',
                gap        : '10px',
              }}>
                <img
                  src  ="/logo.png"
                  alt  ="SuciHome"
                  loading="lazy"
                  decoding="async"
                  style={{
                    height : '48px',
                    width  : 'auto',
                    filter : 'brightness(0) invert(1)',
                  }}
                />
                <span style={{
                  color      : '#FFFFFF',
                  fontSize   : '24px',
                  fontWeight : '700',
                  fontFamily : 'Instrument Serif, serif',
                }}>
                  SuciHome
                </span>
              </div>
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
            <div className="flex gap-8 text-sm font-medium text-white/80 mb-8 border-b border-white/20 pb-8">
              <div className="flex items-center gap-2"><span className="text-[#C9A84C]">✦</span> 500+ Happy Customers</div>
              <div className="flex items-center gap-2"><span className="text-[#C9A84C]">✦</span> Same-Day Booking</div>
              <div className="flex items-center gap-2"><span className="text-[#C9A84C]">✦</span> Verified Staff</div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/60 text-xs tracking-widest uppercase">India's Cleanest Choice</p>
                <p className="text-[#C9A84C]/80 text-[10px] mt-1">Serving India since 2026</p>
              </div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <ChevronDown className="w-6 h-6 text-[#C9A84C]" />
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
        <div className="md:hidden absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1B4332] to-transparent opacity-50" />
        
        <div className="w-full max-w-md z-10 relative">
          
          <div className="md:hidden">
            <div style={{
              display        : 'flex',
              alignItems     : 'center',
              justifyContent : 'center',
              gap            : '10px',
              marginBottom   : '24px',
            }}>
              <img
                src  ="/logo.png"
                alt  ="SuciHome"
                loading="lazy"
                decoding="async"
                style={{
                  height : '48px',
                  width  : 'auto',
                  filter : 'none',
                }}
              />
              <span style={{
                color      : '#1B4332',
                fontSize   : '24px',
                fontWeight : '700',
                fontFamily : 'Instrument Serif, serif',
              }}>
                SuciHome
              </span>
            </div>
          </div>

          {/* Form Card */}
          <div className="backdrop-blur-xl bg-white border border-[#EDE8DC] rounded-3xl p-8 shadow-xl relative overflow-hidden">
            
            {/* Top Shine */}
            <div className="absolute top-0 left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-[#1B4332]/25 to-transparent" />

            <div className="flex justify-center mb-8">
              <div className="flex bg-[#1B4332]/5 p-1 rounded-xl">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isLogin ? 'bg-[#1B4332] text-white shadow-md' : 'text-[#5C6B5E] hover:text-[#2D4A35]'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${!isLogin ? 'bg-[#1B4332] text-white shadow-md' : 'text-[#5C6B5E] hover:text-[#2D4A35]'}`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <h2 className="text-3xl font-['Instrument_Serif'] text-[#2D4A35] text-center mb-1">
              {isForgot ? 'Reset password' : isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-[#5C6B5E] text-sm text-center mb-8">
              {isForgot ? 'Enter your email and a new password' : isLogin ? 'Book your next clean in seconds' : 'Join 500+ happy homeowners'}
            </p>

            <AnimatePresence mode="wait">
              {isForgot ? (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4">
                    <div>
                      <div className="relative">
                        <Mail className={iconClass} />
                        <input {...forgotForm.register('email')} type="email" placeholder="your@email.com" className={inputClass} />
                      </div>
                      {forgotForm.formState.errors.email && <p className={errorClass}>{forgotForm.formState.errors.email.message}</p>}
                    </div>
                    <div>
                      <div className="relative">
                        <Lock className={iconClass} />
                        <input {...forgotForm.register('newPassword')} type={showPass ? "text" : "password"} placeholder="New Password" className={inputClass} />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5C6B5E] hover:text-[#1B4332] transition-colors">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <PasswordStrength password={forgotForm.watch('newPassword')} />
                      {forgotForm.formState.errors.newPassword && <p className={errorClass}>{forgotForm.formState.errors.newPassword.message}</p>}
                    </div>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full h-[52px] mt-6 bg-[#1B4332] text-white font-semibold rounded-xl hover:bg-[#0D2B1F] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-md"
                    >
                      {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Reset Password"}
                    </button>
                    <button type="button" onClick={() => setIsForgot(false)} className="w-full text-[#5C6B5E] text-sm hover:text-[#2D4A35] mt-4 transition-colors">
                      Back to Login
                    </button>
                  </form>
                </motion.div>
              ) : isLogin ? (
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
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5C6B5E] hover:text-[#1B4332] transition-colors">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="flex justify-between mt-1">
                        <div>{loginForm.formState.errors.password && <p className={errorClass}>{loginForm.formState.errors.password.message}</p>}</div>
                        <button type="button" onClick={handleForgotPass} className="text-[#1B4332] text-[13px] hover:underline mt-1 font-medium">Forgot password?</button>
                      </div>
                    </div>
 
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full h-[52px] mt-6 bg-[#1B4332] text-white font-semibold rounded-xl hover:bg-[#0D2B1F] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-md"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <><span className="text-white group-hover:animate-pulse">✦</span> Login to SuciHome</>
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
                  className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar"
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
                        <div className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center border-r border-[#EDE8DC] pr-2">
                          <span className="text-xs text-[#2D4A35]/80 font-semibold bg-[#1B4332]/10 px-1.5 py-0.5 rounded">+91</span>
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
                        <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5C6B5E] hover:text-[#1B4332] transition-colors">
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
                        <div className="w-5 h-5 border border-[#EDE8DC] rounded peer-checked:bg-[#1B4332] peer-checked:border-[#1B4332] transition-colors flex items-center justify-center">
                          <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                        </div>
                      </label>
                      <span className="text-xs text-[#5C6B5E]">I agree to Terms & Privacy Policy</span>
                    </div>
                    {signupForm.formState.errors.terms && <p className={errorClass}>{signupForm.formState.errors.terms.message}</p>}
                    
                    {signupForm.formState.errors.root && <p className={errorClass}>{signupForm.formState.errors.root.message}</p>}
 
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full h-[52px] bg-[#1B4332] text-white font-semibold rounded-xl hover:bg-[#0D2B1F] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-md"
                    >
                      {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Create My Account"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
 
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-[1px] bg-[#EDE8DC]" />
              <span className="text-xs text-[#5C6B5E] uppercase tracking-wider font-semibold">or continue with</span>
              <div className="flex-1 h-[1px] bg-[#EDE8DC]" />
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
                  background     : '#FFFFFF',
                  border         : '1px solid #EDE8DC',
                  borderRadius   : '12px',
                  color          : '#2D4A35',
                  fontSize       : '15px',
                  fontWeight     : '500',
                  cursor         : 'pointer',
                  display        : 'flex',
                  alignItems     : 'center',
                  justifyContent : 'center',
                  gap            : '12px',
                  transition     : 'all 0.2s',
                  boxShadow      : '0 2px 8px rgba(0,0,0,0.02)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = '1px solid #1B4332'
                  e.currentTarget.style.background = 'rgba(27,67,50,0.02)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '1px solid #EDE8DC'
                  e.currentTarget.style.background = '#FFFFFF'
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
 
            <div className="mt-8 text-center text-sm text-[#5C6B5E]">
              {isLogin ? (
                <>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-[#1B4332] hover:underline font-semibold">Sign up</button></>
              ) : (
                <>Already have an account? <button onClick={() => setIsLogin(true)} className="text-[#1B4332] hover:underline font-semibold">Login</button></>
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


