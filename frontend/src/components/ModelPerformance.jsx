import React from 'react';

const MODEL_META = {
  tabnet_cause:    { label: 'Cause Classifier', icon: 'target',         color: 'text-primary' },
  tabnet_delay:    { label: 'Delay Regressor',  icon: 'timer',          color: 'text-secondary-fixed-dim' },
  tabnet_combined: { label: 'Combined Model',   icon: 'psychology',     color: 'text-tertiary' },
  gnn:             { label: 'GNN Spatial',      icon: 'hub',            color: 'text-primary' },
};

const ModelPerformance = ({ data }) => (
  <div className="bg-surface-container-high rounded-xl border border-outline-variant/10 overflow-hidden">
    <div className="bg-surface-container-highest/40 backdrop-blur-[12px] px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[18px]">model_training</span>
        <h3 className="text-[0.75rem] uppercase tracking-[0.1em] font-semibold text-primary">Model Performance</h3>
      </div>
      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold border border-primary/20">
        {data.length} model{data.length > 1 ? 's' : ''}
      </span>
    </div>

    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((model, i) => {
        const meta = MODEL_META[model.model_type] || { label: model.model_type, icon: 'analytics', color: 'text-primary' };
        return (
          <div key={i} className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-outline-variant/25 transition-colors flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-surface-container rounded-lg">
                <span className={`material-symbols-outlined text-[18px] ${meta.color}`}>{meta.icon}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface">{meta.label}</p>
                <p className="text-[9px] uppercase tracking-wider text-outline">{model.model_type}</p>
              </div>
            </div>

            {model.accuracy != null && (
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-outline uppercase tracking-wider">Accuracy</span>
                  <span className={`font-semibold ${meta.color}`}>{(model.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary-fixed-dim rounded-full" style={{ width: `${model.accuracy * 100}%` }}></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {model.mae != null && (
                <div>
                  <p className="text-outline uppercase tracking-wider">MAE</p>
                  <p className="font-semibold text-on-surface">{model.mae.toFixed(1)} min</p>
                </div>
              )}
              {model.avg_user_rating != null && (
                <div>
                  <p className="text-outline uppercase tracking-wider">Rating</p>
                  <p className="font-semibold text-tertiary">{model.avg_user_rating.toFixed(1)} ★</p>
                </div>
              )}
              <div>
                <p className="text-outline uppercase tracking-wider">Feedback</p>
                <p className="font-semibold text-on-surface">{model.total_feedback_count}</p>
              </div>
              <div>
                <p className="text-outline uppercase tracking-wider">Updated</p>
                <p className="font-semibold text-on-surface">{new Date(model.last_updated).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default ModelPerformance;
