import { useAuthStore } from '../store/auth.store';
import { useTheme } from '@/shared/theme/useTheme';
import { GlassCard } from '@/shared/ui/GlassCard';
import { Moon, Sun, Loader2 } from 'lucide-react';

export const LoginScreen = () => {
    const { signIn, isLoading, error } = useAuthStore();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center overflow-hidden bg-[#f0f2f5] dark:bg-[#0a0e17] transition-colors duration-700">

            <div className="absolute top-[-15%] left-[-15%] w-[55vw] h-[55vw] md:w-[750px] md:h-[750px] 
                      bg-orange-500/60 dark:bg-orange-400/50 
                      rounded-full blur-[140px] md:blur-[220px] animate-pulse 
                      mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

            <div className="absolute bottom-[-15%] right-[-15%] w-[55vw] h-[55vw] md:w-[750px] md:h-[750px]
                      bg-blue-600/60 dark:bg-cyan-500/50 
                      rounded-full blur-[140px] md:blur-[220px] animate-pulse delay-2000
                      mix-blend-multiply dark:mix-blend-screen pointer-events-none" />

            <GlassCard className="relative z-10 w-full max-w-[450px] p-12 mx-4
                          border-white/60 dark:border-white/10 
                          bg-white/30 dark:bg-slate-900/60 
                          shadow-[0_8px_32px_0_rgba(31,38,135,0.20)] backdrop-blur-xl">

                <button
                    onClick={toggleTheme}
                    className="absolute top-5 right-5 p-2 rounded-full 
                     bg-white/40 hover:bg-white/60 dark:bg-slate-800/50 dark:hover:bg-slate-700/80
                     transition-all text-slate-700 dark:text-slate-300 backdrop-blur-md shadow-sm"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="text-center mb-10 mt-2">
                    <h1 className="text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight drop-shadow-sm">
                        Bienvenido
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-4 text-sm font-medium tracking-wide uppercase opacity-80">
                        Universal Roadside Quoter
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-md flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium animate-shake">
                        <span className="bg-red-500 rounded-full p-1 text-white">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </span>
                        {error}
                    </div>
                )}

                <button
                    onClick={signIn}
                    disabled={isLoading}
                    className="group w-full flex items-center justify-center gap-4 py-4 px-6 rounded-2xl
            bg-slate-900 dark:bg-white 
            text-white dark:text-slate-900 font-bold text-lg
            hover:bg-slate-800 dark:hover:bg-slate-200 hover:scale-[1.02] hover:shadow-xl
            transition-all duration-300 active:scale-[0.98]
            shadow-lg shadow-slate-900/10
            disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin h-6 w-6" />
                    ) : (
                        <>
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.2 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Acceder con Google</span>
                        </>
                    )}
                </button>

                <div className="mt-8 text-center">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium opacity-50 uppercase tracking-widest">
                        Acceso Corporativo Seguro • v0.1
                    </p>
                </div>
            </GlassCard>
        </div>
    );
};