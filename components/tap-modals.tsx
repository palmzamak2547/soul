import { ArrowLeft, ArrowRight, CheckCircle, LockKey, Sparkle, Trophy, X } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { demoBadges } from "./tap-data";

export function MemoryDetailModal({ memory, memoriesCount, currentIndex, onClose, onNext, onPrev, onOpenBadges, selectedBadgeIds }: { memory: any, memoriesCount: number, currentIndex: number, onClose: () => void, onNext: () => void, onPrev: () => void, onOpenBadges: () => void, selectedBadgeIds: string[] }) {
  const isLocked = memory.state === "locked";
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    modalRef.current?.focus();
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[var(--navy)]/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl relative outline-none focus-visible:ring-4 ring-[var(--pink)]/50 flex flex-col max-h-[90vh]"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors focus-visible:ring-2 ring-[var(--pink)] outline-none"
          aria-label="ปิด"
        >
          <X size={20} weight="bold" className="text-[var(--ink)]" />
        </button>

        <div className="h-48 md:h-64 shrink-0 relative bg-[var(--cream)] overflow-hidden">
          <div className="absolute inset-0 opacity-60 mix-blend-multiply bg-gradient-to-br from-[var(--blush)] via-[#f3d9e4] to-[var(--pink)]" />
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_50%)]" 
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--ink)] p-6">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-white/80 backdrop-blur-md shadow-sm ${isLocked ? 'text-[var(--muted)]' : 'text-[var(--pink)]'}`}>
              {isLocked ? <LockKey size={26} weight="duotone" /> : <Sparkle size={26} weight="duotone" />}
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 text-center overflow-y-auto">
          <span className={`text-[12px] font-mono font-bold tracking-[0.15em] uppercase mb-2 block ${isLocked ? 'text-[var(--muted)]' : 'text-[var(--pink-strong)]'}`}>
            {memory.type} · {memory.date}
          </span>
          <h2 id="modal-title" className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[var(--ink)] mb-4">
            {memory.title}
          </h2>
          
          <div className="max-w-md mx-auto">
            {isLocked ? (
              <div className="bg-[var(--cream)] rounded-2xl p-6 border border-[var(--border-subtle)] mt-2">
                <p className="font-body text-[16px] text-[var(--muted)] leading-relaxed mb-4">
                  {memory.lockedReason}
                </p>
                <div className="flex items-center justify-between text-[14px] font-bold text-[var(--ink)] mb-3 pb-3 border-b border-[var(--border-subtle)]">
                  <span>Badge Progress</span>
                  <span className="text-[var(--pink-strong)]">{selectedBadgeIds.length} <span className="text-[var(--muted-soft)]">/ 6</span></span>
                </div>
                <button 
                  onClick={onOpenBadges}
                  className="w-full bg-white hover:bg-[#fdf2f6] border border-[var(--pink)]/20 text-[var(--pink-strong)] font-body font-bold py-3 rounded-xl transition-colors shadow-sm"
                >
                  ดูเหรียญที่ต้องสะสม
                </button>
              </div>
            ) : (
              <p className="font-body text-[17px] md:text-[18px] text-[var(--muted)] leading-relaxed">
                {memory.details || memory.copy}
              </p>
            )}
          </div>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-[var(--border-subtle)] pt-8">
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={onPrev}
                disabled={currentIndex === 0}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-[var(--border-subtle)] hover:bg-[var(--cream)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus-visible:ring-2 ring-[var(--pink)] outline-none"
                aria-label="ความทรงจำก่อนหน้า"
              >
                <ArrowLeft size={18} weight="bold" className="text-[var(--ink)]" />
              </button>
              <button 
                onClick={onNext}
                disabled={currentIndex === memoriesCount - 1}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-[var(--border-subtle)] hover:bg-[var(--cream)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus-visible:ring-2 ring-[var(--pink)] outline-none"
                aria-label="ความทรงจำถัดไป"
              >
                <ArrowRight size={18} weight="bold" className="text-[var(--ink)]" />
              </button>
            </div>
            <button 
              onClick={onClose}
              className="bg-[var(--ink)] hover:bg-[var(--pink)] text-white font-body font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md sm:ml-4 w-full sm:w-auto focus-visible:ring-2 ring-offset-2 ring-[var(--pink)] outline-none"
            >
              กลับสู่เส้นทางความทรงจำ
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function BadgeCollectionModal({ selectedBadgeIds, onToggleBadge, onClose }: { selectedBadgeIds: string[], onToggleBadge: (id: string) => void, onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    modalRef.current?.focus();
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[100] flex flex-col justify-end md:items-center md:justify-center bg-[var(--navy)]/95 backdrop-blur-md p-0 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        ref={modalRef}
        tabIndex={-1}
        className="w-full max-w-4xl bg-[var(--paper)] md:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl relative outline-none flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-5 border-b border-[var(--border-subtle)] flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10 shrink-0">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--ink)]">Badge Collection</h2>
            <p className="text-[var(--muted)] font-body text-sm mt-0.5">คลิกที่เหรียญเพื่อจำลองการปลดล็อก</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-[var(--cream)] px-4 py-1.5 rounded-full">
              <span className="text-[12px] font-mono font-bold tracking-wider text-[var(--pink-strong)] uppercase">Progress</span>
              <strong className="font-display text-xl text-[var(--ink)]">{selectedBadgeIds.length} <span className="text-[var(--muted-soft)]">/ 6</span></strong>
            </div>
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors focus-visible:ring-2 ring-[var(--pink)] outline-none"
            >
              <X size={20} weight="bold" className="text-[var(--ink)]" />
            </button>
          </div>
        </div>
        
        <div className="p-6 md:p-8 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {demoBadges.map(badge => {
              const isSelected = selectedBadgeIds.includes(badge.id);
              const isInitiallyLocked = badge.type === "locked";
              
              return (
                <button
                  key={badge.id}
                  onClick={() => onToggleBadge(badge.id)}
                  className={`relative p-5 md:p-6 rounded-2xl text-left transition-all duration-300 outline-none focus-visible:ring-2 ring-[var(--pink)] border 
                    ${isSelected ? 'bg-[var(--blush)] border-[var(--pink)]/30 shadow-sm' : 'bg-white border-[var(--border-subtle)] hover:shadow-card hover:border-[var(--pink)]/20'}
                  `}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? 'bg-[var(--pink)] text-white shadow-md shadow-[var(--pink)]/20' : 'bg-[var(--cream)] text-[var(--muted)]'}`}>
                      {isInitiallyLocked && !isSelected ? <LockKey size={22} weight="bold" /> : <Trophy size={22} weight="duotone" />}
                    </div>
                    {isSelected && (
                      <div className="text-[var(--pink)]">
                        <CheckCircle size={24} weight="fill" />
                      </div>
                    )}
                  </div>
                  <h3 className={`font-display text-lg font-bold mb-1 ${isSelected ? 'text-[var(--ink)]' : 'text-[var(--muted)]'}`}>{badge.name}</h3>
                  <p className="font-body text-[13px] leading-relaxed text-[var(--muted-soft)] min-h-[40px]">
                    {isInitiallyLocked && !isSelected ? `เงื่อนไข: ${badge.lockedCondition}` : badge.description}
                  </p>
                </button>
              );
            })}
          </div>
          
          <div className="mt-8 bg-[var(--cream)] rounded-2xl p-6 text-center border border-[var(--border-subtle)]">
            <div className="flex sm:hidden items-center justify-center gap-3 mb-4 bg-white/50 px-4 py-2 rounded-full w-max mx-auto">
              <span className="text-[12px] font-mono font-bold tracking-wider text-[var(--pink-strong)] uppercase">Progress</span>
              <strong className="font-display text-xl text-[var(--ink)]">{selectedBadgeIds.length} <span className="text-[var(--muted-soft)]">/ 6</span></strong>
            </div>
            
            {selectedBadgeIds.length === 6 ? (
              <div className="flex flex-col items-center">
                <span className="inline-flex items-center gap-2 text-[var(--success)] font-bold font-body bg-[var(--success)]/10 px-5 py-2.5 rounded-full text-[14px] mb-4">
                  <CheckCircle size={20} weight="fill" /> ปลดล็อกครบถ้วนแล้ว
                </span>
                <p className="text-[var(--muted)] font-body text-[15px]">คุณสามารถรับสิทธิ์สร้างของที่ระลึกดิจิทัล Pink Sky ได้ที่หน้าแรก</p>
              </div>
            ) : (
              <p className="text-[var(--muted)] font-body text-[15px]">
                เหลืออีก <strong className="text-[var(--ink)]">{6 - selectedBadgeIds.length}</strong> เหรียญ เพื่อปลดล็อกสิทธิ์สร้างของที่ระลึกดิจิทัล
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
