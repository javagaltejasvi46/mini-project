import React, { useState, useEffect } from 'react';
import { api } from '../api';

const MODEL_LABELS = { tabnet_cause: 'Cause Classifier', tabnet_delay: 'Delay Regressor', tabnet_combined: 'Combined Model', gnn: 'GNN Spatial' };
const MODEL_ICONS = { tabnet_cause: 'target', tabnet_delay: 'timer', tabnet_combined: 'psychology', gnn: 'hub' };

const PredictiveHub = () => {
  const [models, setModels] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [modelsRes, statsRes] = await Promise.allSettled([
        api.modelPerformance(),
        api.feedbackStats(),
      ]);
      if (modelsRes.status === 'fulfilled') setModels(modelsRes.value);
      if (statsRes.status === 'fulfilled') setFeedbackStats(statsRes.value);
      setLoading(false);
    };
    load();
  }, []);

  const hasModels = models.length > 0;
  const metrics = feedbackStats?.metrics || {};

  return (
    <main className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-[3rem] leading-none font-black tracking-[-0.02em] text-on-surface mb-2">Predictive Hub</h1>
          <p className="text-on-surface-variant text-sm max-w-xl">
            {hasModels
              ? `${models.length} ML model${models.length > 1 ? 's' : ''} active · Reinforcement learning feedback loop running`
              : 'Train models and submit feedback to see performance metrics here.'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant/15">
          <span className="material-symbols-outlined text-secondary-container text-xl">schedule</span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.1em] text-outline font-semibold">Last Refresh</span>
            <span className="text-sm font-medium text-on-surface">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Model performance cards — 8 cols */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-surface-container-high rounded-xl border border-outline-variant/15 overflow-hidden">
              <div className="bg-[#353436]/60 backdrop-blur-[24px] px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">model_training</span>
                  <h2 className="font-semibold text-on-surface tracking-tight">ML Model Performance</h2>
                </div>
                {hasModels && (
                  <span className="bg-secondary-fixed-dim/20 text-secondary-fixed-dim text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-semibold border border-secondary-fixed-dim/30">
                    {models.length} Active
                  </span>
                )}
              </div>

              {!hasModels ? (
                <div className="p-8 text-center text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-4xl block mb-3 text-outline">model_training</span>
                  No model performance data yet. Train models and submit feedback to populate this section.
                </div>
              ) : (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {models.map((model, i) => (
                    <div key={i} className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/10 hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <span className="material-symbols-outlined text-primary text-[18px]">{MODEL_ICONS[model.model_type] || 'analytics'}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-on-surface">{MODEL_LABELS[model.model_type] || model.model_type}</p>
                          <p className="text-[10px] text-outline uppercase tracking-wider">{model.model_type}</p>
                        </div>
                      </div>

                      {model.accuracy != null && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-on-surface-variant">Accuracy</span>
                            <span className="text-secondary-fixed-dim font-semibold">{(model.accuracy * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-secondary-fixed-dim rounded-full transition-all duration-700" style={{ width: `${model.accuracy * 100}%` }}></div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {model.mae != null && (
                          <div>
                            <p className="text-outline uppercase tracking-wider mb-0.5">MAE</p>
                            <p className="text-on-surface font-semibold">{model.mae.toFixed(1)} min</p>
                          </div>
                        )}
                        {model.avg_user_rating != null && (
                          <div>
                            <p className="text-outline uppercase tracking-wider mb-0.5">Avg Rating</p>
                            <p className="text-tertiary font-semibold">{'★'.repeat(Math.round(model.avg_user_rating))}{model.avg_user_rating.toFixed(1)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-outline uppercase tracking-wider mb-0.5">Feedback</p>
                          <p className="text-on-surface font-semibold">{model.total_feedback_count}</p>
                        </div>
                        <div>
                          <p className="text-outline uppercase tracking-wider mb-0.5">Updated</p>
                          <p className="text-on-surface font-semibold">{new Date(model.last_updated).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column — 4 cols */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* RL Buffer */}
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/15">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-outline font-semibold mb-1">RL Feedback Buffer</p>
                  <p className="text-2xl font-black text-on-surface tracking-[-0.02em]">
                    {feedbackStats ? feedbackStats.buffer_size : '—'}
                    <span className="text-base text-outline-variant font-normal"> / {feedbackStats?.buffer_capacity ?? '—'}</span>
                  </p>
                </div>
                <span className="material-symbols-outlined text-secondary-container text-2xl">psychology</span>
              </div>
              {feedbackStats && (
                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary-container to-primary rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((feedbackStats.buffer_size / feedbackStats.buffer_capacity) * 100, 100)}%` }}
                  ></div>
                </div>
              )}
              <p className="text-[11px] text-on-surface-variant mt-2">
                {feedbackStats?.buffer_size >= feedbackStats?.buffer_capacity
                  ? '🔄 Retraining triggered'
                  : `${feedbackStats ? feedbackStats.buffer_capacity - feedbackStats.buffer_size : '—'} more needed to retrain`}
              </p>
            </div>

            {/* Feedback metrics */}
            <div className="flex-1 bg-surface-container-high rounded-xl p-5 border border-outline-variant/15">
              <h3 className="text-base font-semibold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[18px]">star</span>
                Feedback Metrics
              </h3>
              {!feedbackStats || !metrics.total_feedback ? (
                <p className="text-xs text-on-surface-variant">No feedback submitted yet. Rate predictions to improve the model.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Total Feedback', value: metrics.total_feedback, icon: 'feedback' },
                    { label: 'Avg Accuracy Rating', value: metrics.avg_accuracy_rating ? `${metrics.avg_accuracy_rating.toFixed(1)} / 5` : '—', icon: 'target' },
                    { label: 'Avg Usefulness', value: metrics.avg_usefulness_rating ? `${metrics.avg_usefulness_rating.toFixed(1)} / 5` : '—', icon: 'thumb_up' },
                    { label: 'Avg Reward', value: metrics.avg_reward != null ? metrics.avg_reward.toFixed(3) : '—', icon: 'emoji_events' },
                    { label: 'Good Predictions', value: metrics.good_predictions_count ?? '—', icon: 'check_circle' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-outline text-[14px]">{item.icon}</span>
                        <span className="text-xs text-on-surface-variant">{item.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-on-surface">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PredictiveHub;
