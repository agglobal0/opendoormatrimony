import React, { useState, useEffect } from 'react';
import { Church, ShieldCheck, Sparkles, CheckCircle2, X, ArrowRight, Lock, Award, Heart, Check, CreditCard } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MembershipPaywallModal({ onClose, onSuccess }) {
  const { refreshProfile } = useAuth();
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('plan-gold');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await api.get('/membership/plans');
        if (res.data && res.data.success) {
          setPlans(res.data.data || []);
        }
      } catch (err) {
        console.error('Error loading membership plans:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const handleUpgrade = async () => {
    setUpgrading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/membership/upgrade', { plan_id: selectedPlanId });
      if (res.data && res.data.success) {
        setSuccessData(res.data.data);
        if (refreshProfile) {
          await refreshProfile();
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to activate membership. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  const handleContinueToInterest = () => {
    if (onSuccess) {
      onSuccess(successData);
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white p-6 sm:p-7 relative shrink-0 border-b border-gold-500/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="space-y-1.5 text-center sm:text-left pr-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 text-[11px] font-bold">
              <Church size={13} />
              <span>The Open Door Church Matrimonial Ministry</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">
              Membership Required to Express Interest
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              To protect member safety and ensure sincere, family-committed proposals, a church matrimonial membership plan is required to initiate connections.
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {successData ? (
            <div className="p-6 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-xl text-emerald-950">
                  {successData.plan_name} Activated Successfully!
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Your church matrimonial membership is now active. You have been granted connection privileges and full access to candidate introductions.
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleContinueToInterest}
                  className="px-8 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-soft transition-colors"
                >
                  Continue & Send Express Interest →
                </button>
              </div>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 text-center font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Plans Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {plans.map((p) => {
                  const isSelected = selectedPlanId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-gold-500 bg-gold-50/40 shadow-soft scale-[1.02]'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-gold-500 text-navy-950 shadow-xs">
                          Recommended
                        </span>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-sm text-navy-950">{p.name}</h4>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-gold-600 bg-gold-500 text-navy-950' : 'border-slate-300'}`}>
                            {isSelected && <Check size={10} strokeWidth={3} />}
                          </div>
                        </div>

                        <div>
                          <span className="font-serif text-2xl font-black text-navy-950">₹{p.price_inr.toLocaleString()}</span>
                          <span className="text-[11px] text-slate-500 font-medium"> / {p.duration_months} Months</span>
                        </div>

                        <p className="text-[10px] text-slate-500 leading-snug">{p.tagline}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-200/80 mt-3 space-y-1.5 text-[11px] text-slate-700">
                        {p.features.slice(0, 3).map((f, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-gold-600 font-bold">✓</span>
                            <span className="leading-tight">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bureau Blessing & Guarantee Guarantee */}
              <div className="p-4 rounded-2xl bg-navy-50/70 border border-navy-100 flex items-start gap-3 text-xs text-navy-900">
                <ShieldCheck size={20} className="text-gold-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-navy-950">Church Bureau Confidentiality & Pastoral Guidance</span>
                  <p className="text-[11px] text-slate-600">
                    100% of membership contributions support church matrimonial ministry coordination, pastoral reference verification, and family introduction facilitation.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-400 text-center sm:text-left">
                  Instant activation via Online UPI / NetBanking / Bureau Desk
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpgrade}
                    disabled={upgrading}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-gold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles size={14} />
                    <span>{upgrading ? 'Activating Plan...' : 'Activate Membership & Connect'}</span>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
