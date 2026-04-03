import { useState, useEffect, useCallback, useRef } from "react";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://cexbdlcltnwjrnothnqb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable__dDeAqz2C_ZApUKtHFLXsw__OOOaZga";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #06060F; --surface: #0C0C1A; --card: #111122; --card2: #161628;
    --gold: #E8A020; --gold2: #FFD166; --gold-glow: rgba(232,160,32,0.15);
    --teal: #3ECFCF; --purple: #8B6FD4; --text: #EAEAF5; --muted: #6666AA;
    --border: rgba(232,160,32,0.14); --border2: rgba(255,255,255,0.06);
    --success: #1FB86A; --warn: #E8A020; --danger: #E84040; --info: #4BA8FF;
    --radius: 14px; --radius-sm: 8px;
  }
  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(232,160,32,0.2); border-radius: 4px; }
  .auth-root { min-height: 100vh; display: flex; position: relative; overflow: hidden; background: var(--bg); }
  .auth-bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .auth-bg-circle { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.12; animation: floatCircle 12s ease-in-out infinite alternate; }
  .auth-bg-circle:nth-child(1) { width: 600px; height: 600px; background: var(--gold); top: -200px; right: -100px; }
  .auth-bg-circle:nth-child(2) { width: 400px; height: 400px; background: var(--teal); bottom: -100px; left: -100px; animation-delay: -4s; }
  .auth-bg-circle:nth-child(3) { width: 300px; height: 300px; background: var(--purple); top: 40%; left: 30%; animation-delay: -8s; }
  .auth-left { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 60px 80px; position: relative; z-index: 2; }
  .auth-brand { margin-bottom: 48px; }
  .auth-logo { font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 700; background: linear-gradient(135deg, var(--gold), var(--gold2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1px; }
  .auth-logo-sub { font-size: 11px; color: var(--muted); letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
  .auth-headline { font-family: 'Cormorant Garamond', serif; font-size: 52px; font-weight: 600; line-height: 1.15; margin-bottom: 20px; }
  .auth-headline em { font-style: normal; color: var(--gold); }
  .auth-desc { font-size: 15px; color: var(--muted); line-height: 1.7; max-width: 420px; margin-bottom: 48px; }
  .auth-features { display: flex; flex-direction: column; gap: 16px; }
  .auth-feature { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: var(--radius); background: rgba(255,255,255,0.03); border: 1px solid var(--border2); transition: all 0.2s; }
  .auth-feature:hover { background: var(--gold-glow); border-color: var(--border); }
  .auth-feature-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; background: rgba(232,160,32,0.1); border: 1px solid var(--border); flex-shrink: 0; }
  .auth-feature-title { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
  .auth-feature-desc { font-size: 12px; color: var(--muted); }
  .auth-right { width: 480px; min-width: 480px; display: flex; align-items: center; justify-content: center; padding: 40px; position: relative; z-index: 2; background: rgba(12,12,26,0.6); border-left: 1px solid var(--border2); backdrop-filter: blur(20px); }
  .auth-panel { width: 100%; max-width: 400px; }
  .auth-tabs { display: flex; background: var(--surface); border-radius: var(--radius); padding: 4px; margin-bottom: 32px; border: 1px solid var(--border2); }
  .auth-tab { flex: 1; padding: 10px; text-align: center; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; color: var(--muted); transition: all 0.2s; }
  .auth-tab.active { background: var(--gold-glow); color: var(--gold); border: 1px solid var(--border); }
  .auth-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; margin-bottom: 6px; }
  .auth-subtitle { font-size: 13px; color: var(--muted); margin-bottom: 28px; }
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 11.5px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 7px; }
  .form-input { width: 100%; background: var(--surface); border: 1px solid var(--border2); color: var(--text); padding: 12px 16px; border-radius: var(--radius-sm); font-family: 'Outfit'; font-size: 14px; outline: none; transition: all 0.2s; }
  .form-input:focus { border-color: rgba(232,160,32,0.4); box-shadow: 0 0 0 3px rgba(232,160,32,0.06); }
  .form-input::placeholder { color: var(--muted); }
  .form-input-icon { position: relative; }
  .form-input-icon .form-input { padding-left: 44px; }
  .form-input-icon .icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; color: var(--muted); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .btn { padding: 11px 20px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 600; cursor: pointer; border: none; font-family: 'Outfit'; display: inline-flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.18s ease; }
  .btn-full { width: 100%; }
  .btn-gold { background: linear-gradient(135deg, var(--gold), #D4920A); color: #000; }
  .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,160,32,0.3); }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border2); }
  .btn-ghost:hover { color: var(--text); border-color: var(--border); }
  .btn-surface { background: var(--surface); color: var(--text); border: 1px solid var(--border2); }
  .btn-surface:hover { border-color: var(--border); }
  .btn-danger { background: rgba(232,64,64,0.12); color: var(--danger); border: 1px solid rgba(232,64,64,0.2); }
  .btn-teal { background: rgba(62,207,207,0.1); color: var(--teal); border: 1px solid rgba(62,207,207,0.2); }
  .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 7px; }
  .btn-xs { padding: 4px 8px; font-size: 11px; border-radius: 6px; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
  .auth-footer { text-align: center; font-size: 12px; color: var(--muted); margin-top: 24px; }
  .auth-link { color: var(--gold); cursor: pointer; }
  .auth-link:hover { text-decoration: underline; }
  .input-error { border-color: rgba(232,64,64,0.5) !important; }
  .error-msg { font-size: 11.5px; color: var(--danger); margin-top: 4px; }
  .crm-root { display: flex; height: 100vh; overflow: hidden; }
  .sidebar { width: 230px; min-width: 230px; background: var(--surface); border-right: 1px solid var(--border2); display: flex; flex-direction: column; z-index: 10; }
  .sidebar-logo { padding: 22px 20px 18px; border-bottom: 1px solid var(--border2); }
  .sidebar-logo-mark { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; background: linear-gradient(135deg, var(--gold), var(--gold2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .sidebar-logo-sub { font-size: 9px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-top: 1px; }
  .sidebar-nav { flex: 1; padding: 14px 10px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
  .nav-section-label { font-size: 9.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 1.5px; padding: 12px 12px 6px; opacity: 0.6; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; cursor: pointer; font-size: 13.5px; font-weight: 500; color: var(--muted); transition: all 0.15s; border: 1px solid transparent; }
  .nav-item:hover { background: rgba(232,160,32,0.05); color: var(--text); }
  .nav-item.active { background: rgba(232,160,32,0.1); color: var(--gold); border-color: rgba(232,160,32,0.18); }
  .nav-icon { font-size: 15px; width: 22px; text-align: center; flex-shrink: 0; }
  .nav-badge { margin-left: auto; background: rgba(232,64,64,0.2); color: var(--danger); font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
  .nav-live { margin-left: auto; background: rgba(62,207,207,0.15); color: var(--teal); font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
  .sidebar-user { padding: 14px 16px; border-top: 1px solid var(--border2); display: flex; align-items: center; gap: 10px; }
  .user-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), var(--purple)); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #000; flex-shrink: 0; }
  .user-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-plan { font-size: 10px; color: var(--gold); text-transform: uppercase; letter-spacing: 1px; }
  .logout-btn { margin-left: auto; font-size: 16px; cursor: pointer; color: var(--muted); padding: 4px; opacity: 0.6; transition: opacity 0.15s; }
  .logout-btn:hover { opacity: 1; color: var(--danger); }
  .main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; min-width: 0; }
  .header { padding: 18px 28px; border-bottom: 1px solid var(--border2); display: flex; align-items: center; justify-content: space-between; background: rgba(12,12,26,0.9); position: sticky; top: 0; z-index: 5; backdrop-filter: blur(16px); }
  .header-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; }
  .header-sub { font-size: 12px; color: var(--muted); margin-top: 1px; }
  .header-actions { display: flex; align-items: center; gap: 10px; }
  .card { background: var(--card); border: 1px solid var(--border2); border-radius: var(--radius); padding: 20px; transition: border-color 0.2s; }
  .card:hover { border-color: var(--border); }
  .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .metric-label { font-size: 10.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; font-weight: 500; }
  .metric-value { font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 500; line-height: 1; }
  .metric-sub { font-size: 12px; color: var(--muted); margin-top: 6px; }
  .delta { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; padding: 2px 7px; border-radius: 20px; margin-top: 8px; font-weight: 500; }
  .delta-up { background: rgba(31,184,106,0.1); color: var(--success); }
  .delta-warn { background: rgba(232,160,32,0.1); color: var(--warn); }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 500; }
  .badge-gold { background: rgba(232,160,32,0.12); color: var(--gold); border: 1px solid rgba(232,160,32,0.2); }
  .badge-teal { background: rgba(62,207,207,0.1); color: var(--teal); }
  .badge-success { background: rgba(31,184,106,0.1); color: var(--success); }
  .badge-danger { background: rgba(232,64,64,0.1); color: var(--danger); }
  .badge-warn { background: rgba(232,160,32,0.1); color: var(--warn); }
  .badge-muted { background: rgba(255,255,255,0.04); color: var(--muted); }
  .badge-connected { background: rgba(31,184,106,0.1); color: var(--success); border: 1px solid rgba(31,184,106,0.2); }
  .integration-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
  .integration-card { background: var(--card); border: 1px solid var(--border2); border-radius: var(--radius); padding: 20px; transition: all 0.2s; position: relative; overflow: hidden; }
  .integration-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.25); }
  .integration-card.connected { border-color: rgba(31,184,106,0.2); }
  .integration-card.connected::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--success); }
  .int-logo-wrap { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 14px; }
  .int-name { font-size: 15px; font-weight: 700; margin-bottom: 3px; }
  .int-type { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .int-desc { font-size: 12.5px; color: var(--muted); line-height: 1.6; margin-bottom: 14px; }
  .int-stats { display: flex; gap: 12px; margin-bottom: 14px; }
  .int-stat-val { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 500; color: var(--gold); }
  .int-stat-label { font-size: 10px; color: var(--muted); margin-top: 2px; }
  .int-actions { display: flex; gap: 8px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 200; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(6px); animation: fadeIn 0.2s ease; }
  .modal { background: var(--card); border: 1px solid var(--border2); border-radius: 18px; padding: 30px; width: 500px; max-width: 95vw; max-height: 88vh; overflow-y: auto; animation: slideUp 0.25s ease; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; margin-bottom: 6px; }
  .modal-sub { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
  .modal-actions { display: flex; gap: 10px; margin-top: 24px; justify-content: flex-end; }
  .steps { display: flex; gap: 8px; margin-bottom: 24px; }
  .step { flex: 1; height: 3px; border-radius: 2px; background: var(--border2); transition: background 0.3s; }
  .step.active { background: var(--gold); }
  .step.done { background: var(--success); }
  .connect-program-header { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: var(--surface); border-radius: var(--radius-sm); border: 1px solid var(--border2); margin-bottom: 20px; }
  .connect-logo { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .info-box { background: rgba(75,168,255,0.05); border: 1px solid rgba(75,168,255,0.15); border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; font-size: 12.5px; color: var(--muted); line-height: 1.6; }
  .info-box strong { color: var(--info); }
  .success-box { text-align: center; padding: 30px 20px; animation: fadeUp 0.4s ease; }
  .success-icon { font-size: 48px; margin-bottom: 16px; }
  .success-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: var(--success); margin-bottom: 8px; }
  .success-desc { font-size: 13px; color: var(--muted); margin-bottom: 20px; }
  .success-miles { font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 500; color: var(--gold); }
  .program-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .program-card { background: var(--card); border: 1px solid var(--border2); border-radius: var(--radius); padding: 20px; position: relative; overflow: hidden; transition: all 0.2s; }
  .program-card:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(0,0,0,0.28); }
  .program-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .pc-latam::after { background: linear-gradient(90deg, #E31837, #FF6B6B); }
  .pc-smiles::after { background: linear-gradient(90deg, #FF6600, #FFB347); }
  .pc-livelo::after { background: linear-gradient(90deg, #7B2FBE, #B084F5); }
  .pc-tudo::after { background: linear-gradient(90deg, #1170D4, #3ECFCF); }
  .pc-miles-home::after { background: linear-gradient(90deg, #C8102E, #FF4466); }
  .pc-esfera::after { background: linear-gradient(90deg, #E31837, #E8A020); }
  .pc-default::after { background: linear-gradient(90deg, var(--gold), var(--gold2)); }
  .prog-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .prog-name { font-size: 15px; font-weight: 700; }
  .prog-account { font-size: 11px; color: var(--muted); font-family: 'JetBrains Mono', monospace; margin-top: 2px; }
  .prog-logo { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .prog-miles { font-family: 'JetBrains Mono', monospace; font-size: 30px; font-weight: 500; color: var(--gold); line-height: 1; }
  .prog-miles-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .prog-brl { font-size: 12px; color: var(--muted); margin-top: 3px; }
  .prog-expiry { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 7px; font-size: 12px; margin-top: 12px; }
  .ex-ok { background: rgba(31,184,106,0.06); color: var(--success); }
  .ex-warn { background: rgba(232,160,32,0.08); color: var(--warn); }
  .ex-danger { background: rgba(232,64,64,0.1); color: var(--danger); }
  .prog-foot { display: flex; gap: 7px; margin-top: 12px; align-items: center; }
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  thead th { text-align: left; padding: 10px 14px; font-size: 10.5px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 1.2px; border-bottom: 1px solid var(--border2); }
  tbody tr { border-bottom: 1px solid rgba(255,255,255,0.025); transition: background 0.12s; }
  tbody tr:hover { background: rgba(232,160,32,0.025); }
  tbody td { padding: 11px 14px; vertical-align: middle; }
  .tx-credit { color: var(--success); font-family: 'JetBrains Mono', monospace; }
  .tx-debit { color: var(--danger); font-family: 'JetBrains Mono', monospace; }
  .tx-transfer { color: var(--info); font-family: 'JetBrains Mono', monospace; }
  .ai-panel { display: flex; flex-direction: column; height: calc(100vh - 65px); }
  .ai-messages { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 18px; }
  .msg { display: flex; gap: 12px; animation: fadeUp 0.3s ease; }
  .msg.user { flex-direction: row-reverse; }
  .msg-avatar { width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; background: rgba(232,160,32,0.12); border: 1px solid var(--border); }
  .msg.user .msg-avatar { background: rgba(62,207,207,0.12); border-color: rgba(62,207,207,0.2); }
  .msg-bubble { max-width: 72%; padding: 13px 17px; border-radius: 13px; font-size: 13.5px; line-height: 1.65; background: var(--card2); border: 1px solid var(--border2); }
  .msg.user .msg-bubble { background: rgba(62,207,207,0.07); border-color: rgba(62,207,207,0.14); }
  .msg-bubble strong { color: var(--gold); }
  .ai-input-area { padding: 16px 20px; border-top: 1px solid var(--border2); background: var(--surface); }
  .ai-input-row { display: flex; gap: 10px; }
  .ai-input { flex: 1; background: var(--card); border: 1px solid var(--border2); color: var(--text); font-family: 'Outfit'; font-size: 14px; padding: 12px 16px; border-radius: 10px; outline: none; resize: none; transition: border-color 0.2s; }
  .ai-input:focus { border-color: var(--border); }
  .ai-input::placeholder { color: var(--muted); }
  .ai-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 12px; }
  .chip { background: rgba(232,160,32,0.06); border: 1px solid var(--border); border-radius: 20px; padding: 4px 12px; font-size: 12px; color: var(--gold); cursor: pointer; transition: all 0.15s; }
  .chip:hover { background: rgba(232,160,32,0.12); }
  .progress-bar { height: 5px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
  .alert { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; border-radius: 10px; margin-bottom: 10px; font-size: 13px; }
  .alert-danger { background: rgba(232,64,64,0.06); border: 1px solid rgba(232,64,64,0.18); }
  .alert-warn { background: rgba(232,160,32,0.06); border: 1px solid rgba(232,160,32,0.15); }
  .dots span { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--gold); margin: 0 2px; animation: bounce 1.2s infinite; }
  .dots span:nth-child(2) { animation-delay: 0.2s; }
  .dots span:nth-child(3) { animation-delay: 0.4s; }
  .spinner { width: 18px; height: 18px; border: 2px solid rgba(232,160,32,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.7s linear infinite; }
  .filter-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
  .filter-select { background: var(--card); border: 1px solid var(--border2); color: var(--text); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 13px; font-family: 'Outfit'; outline: none; cursor: pointer; }
  .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .section-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; }
  .section-title span { color: var(--gold); }
  .empty { text-align: center; padding: 56px 20px; color: var(--muted); }
  .empty-icon { font-size: 44px; margin-bottom: 14px; opacity: 0.35; }
  .empty-text { font-size: 14px; }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
  .dot-green { background: var(--success); box-shadow: 0 0 6px var(--success); }
  .sync-pulse { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--teal); }
  .pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--teal); animation: pulseDot 2s infinite; }
  .divider { height: 1px; background: linear-gradient(90deg, transparent, var(--border2), transparent); margin: 22px 0; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes floatCircle { from{transform:translateY(0) scale(1)} to{transform:translateY(-40px) scale(1.05)} }
  @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-7px)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
  .animate-fade { animation: fadeUp 0.35s ease; }
  @media (max-width: 960px) {
    .grid-4 { grid-template-columns: repeat(2,1fr); }
    .grid-2 { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .auth-right { width: 100%; min-width: unset; border-left: none; }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMS CATALOG
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAMS_CATALOG = [
  { id: "latam", name: "LATAM Pass", type: "Aéreo", logo: "✈", color: "#E31837", bg: "rgba(227,24,55,0.1)", code: "pc-latam", desc: "Programa de fidelidade da LATAM Airlines.", partners: ["Banco do Brasil", "Bradesco", "Itaú"], cpp: "R$ 0,022 - R$ 0,035", transferRate: "1:1", fields: ["login", "senha"], loginUrl: "https://www.latamairlines.com/br/pt/latam-pass" },
  { id: "smiles", name: "Smiles", type: "Aéreo", logo: "😊", color: "#FF6600", bg: "rgba(255,102,0,0.1)", code: "pc-smiles", desc: "Programa de milhagem da GOL Linhas Aéreas.", partners: ["Nubank", "Santander"], cpp: "R$ 0,018 - 0,030", transferRate: "1:1", fields: ["cpf", "senha"], loginUrl: "https://www.smiles.com.br" },
  { id: "livelo", name: "Livelo", type: "Banco", logo: "💎", color: "#7B2FBE", bg: "rgba(123,47,190,0.1)", code: "pc-livelo", desc: "Programa de pontos do Banco do Brasil e Bradesco.", partners: ["BB", "Bradesco"], cpp: "R$ 0,020 - 0,028", transferRate: "Variável", fields: ["cpf", "senha"], loginUrl: "https://www.livelo.com.br" },
  { id: "tudo", name: "TudoAzul", type: "Aéreo", logo: "💙", color: "#1170D4", bg: "rgba(17,112,212,0.1)", code: "pc-tudo", desc: "Programa de fidelidade da Azul Linhas Aéreas.", partners: ["Itaú", "Caixa"], cpp: "R$ 0,020 - 0,032", transferRate: "1:1", fields: ["email", "senha"], loginUrl: "https://www.tudoazul.com.br" },
  { id: "miles-home", name: "Miles&More", type: "Internacional", logo: "🌍", color: "#C8102E", bg: "rgba(200,16,46,0.1)", code: "pc-miles-home", desc: "Programa da Lufthansa Group para voos internacionais.", partners: ["Amex", "Diners"], cpp: "R$ 0,028 - 0,045", transferRate: "1:1", fields: ["email", "senha"], loginUrl: "https://www.miles-and-more.com" },
  { id: "esfera", name: "Esfera", type: "Banco", logo: "⚡", color: "#E31837", bg: "rgba(227,24,55,0.1)", code: "pc-esfera", desc: "Programa do Santander.", partners: ["Santander"], cpp: "R$ 0,015 - 0,025", transferRate: "2.5:1", fields: ["cpf", "senha"], loginUrl: "https://www.esfera.com.br" },
  { id: "multiplus", name: "Multiplus", type: "Varejo", logo: "🛍", color: "#E8A020", bg: "rgba(232,160,32,0.1)", code: "pc-default", desc: "Programa de fidelidade multimarcas.", partners: ["TAM", "Porto Seguro"], cpp: "R$ 0,018 - 0,028", transferRate: "Variável", fields: ["cpf", "senha"], loginUrl: "https://www.multiplus.com.br" },
  { id: "itaucard", name: "Sempre Presente", type: "Banco", logo: "🧡", color: "#F5A623", bg: "rgba(245,166,35,0.1)", code: "pc-default", desc: "Programa de pontos do Itaú Unibanco.", partners: ["Itaú", "Visa"], cpp: "R$ 0,020 - 0,030", transferRate: "1:1", fields: ["cpf", "senha"], loginUrl: "https://www.itau.com.br" },
];

const CHART_DATA = [
  { m: "Mar/24", v: 145000 }, { m: "Abr/24", v: 158000 }, { m: "Mai/24", v: 149000 },
  { m: "Jun/24", v: 173000 }, { m: "Jul/24", v: 188000 }, { m: "Ago/24", v: 202000 },
  { m: "Set/24", v: 194000 }, { m: "Out/24", v: 218000 }, { m: "Nov/24", v: 228000 },
  { m: "Dez/24", v: 210000 }, { m: "Jan/25", v: 224000 }, { m: "Fev/25", v: 214580 },
];

const AI_CHIPS = ["Milhas prestes a vencer?", "Melhor programa para Europa?", "Promoções de transferência ativas?", "Estratégia para 100k milhas?", "CPP atual do Smiles?", "Vale comprar milhas agora?"];

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────
const fmt = n => new Intl.NumberFormat("pt-BR").format(n || 0);
const fmtBRL = n => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);
const fmtDate = d => { try { return new Date(d + "T00:00:00").toLocaleDateString("pt-BR"); } catch { return d; } };
const fmtDateTime = d => { try { return new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }); } catch { return d; } };
const daysUntil = d => { try { return Math.ceil((new Date(d) - new Date()) / 86400000); } catch { return 999; } };
const expiryClass = days => days < 30 ? "ex-danger" : days < 90 ? "ex-warn" : "ex-ok";
const expiryIcon = days => days < 30 ? "🚨" : days < 90 ? "⚠️" : "✅";
const getCatalog = id => PROGRAMS_CATALOG.find(p => p.id === id) || {};
const getInitials = name => name ? name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "U";

// ─────────────────────────────────────────────────────────────────────────────
// CLAUDE API
// ─────────────────────────────────────────────────────────────────────────────
async function askClaude(messages, connected) {
  const total = connected.reduce((s, p) => s + p.miles, 0);
  const system = `Você é especialista em milhas aéreas e fidelidade no Brasil.
Carteira do usuário:
${connected.map(p => { const c = getCatalog(p.catalog_id); return `- ${c.name}: ${fmt(p.miles)} milhas | Vence: ${fmtDate(p.expiry)} (${daysUntil(p.expiry)} dias)`; }).join("\n")}
Total: ${fmt(total)} milhas ≈ ${fmtBRL(total * 0.025)}
Responda em português, seja objetivo e prático. Use **negrito** para destaques.`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1024, system, messages: messages.map(m => ({ role: m.role, content: m.content })), tools: [{ type: "web_search_20250305", name: "web_search" }] })
  });
  const data = await res.json();
  return data.content.filter(b => b.type === "text").map(b => b.text).join("\n") || "Erro ao processar. Tente novamente.";
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function Dots() { return <div className="dots"><span /><span /><span /></div>; }

function formatAI(text) {
  return text.split(/(\*\*[^*]+\*\*|\n)/).map((p, i) => {
    if (p === "\n") return <br key={i} />;
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    return p;
  });
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "", confirm: "" });
  const [err, setErr] = useState({});
  const [loading, setLoading] = useState(false);
  const [regDone, setRegDone] = useState(false);
  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErr(p => ({ ...p, [k]: "" })); };

  const handleLogin = async () => {
    const e = {};
    if (!form.email) e.email = "Informe seu e-mail";
    if (!form.password) e.password = "Informe sua senha";
    if (Object.keys(e).length) return setErr(e);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) { setErr({ password: "E-mail ou senha inválidos" }); setLoading(false); return; }
    const meta = data.user.user_metadata;
    onLogin({ id: data.user.id, email: data.user.email, name: meta?.name || data.user.email.split("@")[0], avatar: getInitials(meta?.name || data.user.email), plan: "Premium" });
    setLoading(false);
  };

  const handleRegister = async () => {
    const e = {};
    if (!form.name.trim()) e.name = "Informe seu nome";
    if (!form.email.includes("@")) e.email = "E-mail inválido";
    if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (form.password !== form.confirm) e.confirm = "Senhas não conferem";
    if (Object.keys(e).length) return setErr(e);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { name: form.name } } });
    setLoading(false);
    if (error) { setErr({ email: error.message }); return; }
    setRegDone(true);
    setTimeout(() => { setTab("login"); setRegDone(false); setForm(p => ({ ...p, password: "", confirm: "" })); }, 3000);
  };

  return (
    <div className="auth-root">
      <div className="auth-bg"><div className="auth-bg-circle" /><div className="auth-bg-circle" /><div className="auth-bg-circle" /></div>
      <div className="auth-left">
        <div className="auth-brand"><div className="auth-logo">MilesCRM</div><div className="auth-logo-sub">Gestão de Milhas & Pontos</div></div>
        <div className="auth-headline">Gerencie suas<br /><em>milhas</em> com<br />inteligência</div>
        <div className="auth-desc">Conecte todos os seus programas de fidelidade em um único painel. Nunca mais perca milhas por vencimento.</div>
        <div className="auth-features">
          {[{ icon: "🔗", title: "8 programas integrados", desc: "LATAM, Smiles, Livelo, TudoAzul e mais" }, { icon: "🤖", title: "Assistente IA com busca real", desc: "Respostas com dados em tempo real da web" }, { icon: "☁️", title: "Dados salvos na nuvem", desc: "Acesse de qualquer dispositivo, a qualquer hora" }].map((f, i) => (
            <div key={i} className="auth-feature">
              <div className="auth-feature-icon">{f.icon}</div>
              <div><div className="auth-feature-title">{f.title}</div><div className="auth-feature-desc">{f.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-panel">
          <div className="auth-tabs">
            <div className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setErr({}); }}>Entrar</div>
            <div className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setErr({}); }}>Cadastrar</div>
          </div>
          {tab === "login" ? (
            <>
              <div className="auth-title">Bem-vindo de volta</div>
              <div className="auth-subtitle">Acesse sua conta para continuar</div>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <div className="form-input-icon"><span className="icon">✉</span>
                  <input className={`form-input ${err.email ? "input-error" : ""}`} type="email" placeholder="seu@email.com" value={form.email} onChange={e => set("email", e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                </div>
                {err.email && <div className="error-msg">{err.email}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Senha</label>
                <div className="form-input-icon"><span className="icon">🔒</span>
                  <input className={`form-input ${err.password ? "input-error" : ""}`} type="password" placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                </div>
                {err.password && <div className="error-msg">{err.password}</div>}
              </div>
              <button className="btn btn-gold btn-full" onClick={handleLogin} disabled={loading} style={{ marginTop: 4 }}>
                {loading ? <><div className="spinner" style={{ borderTopColor: "#000" }} /> Entrando...</> : "Entrar →"}
              </button>
              <div className="auth-footer">Não tem conta? <span className="auth-link" onClick={() => setTab("register")}>Cadastre-se grátis</span></div>
            </>
          ) : (
            <>
              <div className="auth-title">Criar conta</div>
              <div className="auth-subtitle">Comece a gerenciar suas milhas hoje</div>
              {regDone ? (
                <div className="success-box" style={{ padding: "20px 0" }}>
                  <div className="success-icon">🎉</div>
                  <div className="success-title" style={{ fontSize: 20 }}>Conta criada!</div>
                  <div className="success-desc">Verifique seu e-mail para confirmar o cadastro e depois faça login.</div>
                </div>
              ) : (
                <>
                  <div className="form-group"><label className="form-label">Nome completo</label><input className={`form-input ${err.name ? "input-error" : ""}`} placeholder="João Silva" value={form.name} onChange={e => set("name", e.target.value)} />{err.name && <div className="error-msg">{err.name}</div>}</div>
                  <div className="form-group"><label className="form-label">E-mail</label><input className={`form-input ${err.email ? "input-error" : ""}`} type="email" placeholder="seu@email.com" value={form.email} onChange={e => set("email", e.target.value)} />{err.email && <div className="error-msg">{err.email}</div>}</div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Senha</label><input className={`form-input ${err.password ? "input-error" : ""}`} type="password" placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)} />{err.password && <div className="error-msg">{err.password}</div>}</div>
                    <div className="form-group"><label className="form-label">Confirmar</label><input className={`form-input ${err.confirm ? "input-error" : ""}`} type="password" placeholder="••••••••" value={form.confirm} onChange={e => set("confirm", e.target.value)} />{err.confirm && <div className="error-msg">{err.confirm}</div>}</div>
                  </div>
                  <button className="btn btn-gold btn-full" onClick={handleRegister} disabled={loading}>{loading ? <><div className="spinner" style={{ borderTopColor: "#000" }} /> Criando...</> : "Criar conta grátis →"}</button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CONNECT MODAL ─────────────────────────────────────────────────────────────
function ConnectModal({ program, userId, onClose, onConnect }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [miles, setMiles] = useState(0);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const fieldLabel = { login: "Login / E-mail", senha: "Senha", cpf: "CPF", email: "E-mail" };

  const handleConnect = async () => {
    setLoading(true);
    const m = Math.floor(Math.random() * 80000) + 5000;
    const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().split("T")[0];
    const { data, error } = await supabase.from("connected_programs").insert({ user_id: userId, catalog_id: program.id, account: form[program.fields[0]] || "******", miles: m, expiry: expiryDate, last_sync: new Date().toISOString(), status: "connected" }).select().single();
    setLoading(false);
    if (error) { console.error(error); return; }
    setMiles(m); setStep(3); onConnect(data);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="steps">{[1,2,3].map(s => <div key={s} className={`step ${step === s ? "active" : step > s ? "done" : ""}`} />)}</div>
        {step === 1 && (<>
          <div className="modal-title">Conectar {program.name}</div>
          <div className="modal-sub">Vincule sua conta para sincronizar saldo automaticamente</div>
          <div className="connect-program-header">
            <div className="connect-logo" style={{ background: program.bg }}><span style={{ fontSize: 24 }}>{program.logo}</span></div>
            <div><div style={{ fontWeight: 700, fontSize: 15 }}>{program.name}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>{program.type}</div></div>
            <div style={{ marginLeft: "auto" }}><span className="badge badge-muted">{program.transferRate}</span></div>
          </div>
          <div className="info-box"><strong>🔐 Segurança:</strong> Suas credenciais são criptografadas e usadas apenas para leitura do saldo.<br /><br /><strong>📊 O que será importado:</strong> Saldo atual, data de vencimento e histórico de transações.</div>
          <div className="modal-actions"><button className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-gold" onClick={() => setStep(2)}>Continuar →</button></div>
        </>)}
        {step === 2 && (<>
          <div className="modal-title">Credenciais {program.name}</div>
          <div className="modal-sub">Use os mesmos dados do site ou app do programa</div>
          <div className="connect-program-header">
            <div className="connect-logo" style={{ background: program.bg }}><span style={{ fontSize: 24 }}>{program.logo}</span></div>
            <div><div style={{ fontWeight: 700 }}>{program.name}</div><a href={program.loginUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "var(--teal)", textDecoration: "none" }}>Criar conta no site →</a></div>
          </div>
          {program.fields.map(f => (<div className="form-group" key={f}><label className="form-label">{fieldLabel[f] || f}</label><input className="form-input" type={f === "senha" ? "password" : "text"} placeholder={f === "cpf" ? "000.000.000-00" : f === "senha" ? "••••••••" : "seu@email.com"} value={form[f] || ""} onChange={e => set(f, e.target.value)} /></div>))}
          <div className="info-box" style={{ fontSize: 11.5 }}>💡 <strong>Dica:</strong> Para testes, use qualquer valor — a integração é simulada nesta demonstração.</div>
          <div className="modal-actions"><button className="btn btn-ghost" onClick={() => setStep(1)}>← Voltar</button><button className="btn btn-gold" onClick={handleConnect} disabled={loading}>{loading ? <><div className="spinner" style={{ borderTopColor: "#000", width: 14, height: 14 }} /> Conectando...</> : "🔗 Conectar"}</button></div>
        </>)}
        {step === 3 && (<div className="success-box"><div className="success-icon">✅</div><div className="success-title">{program.name} conectado!</div><div className="success-desc">Saldo salvo no banco de dados com sucesso</div><div className="success-miles">{fmt(miles)}</div><div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, marginBottom: 20 }}>milhas encontradas</div><button className="btn btn-gold" onClick={onClose}>Concluído ✓</button></div>)}
      </div>
    </div>
  );
}

// ── INTEGRATIONS ──────────────────────────────────────────────────────────────
function Integrations({ connected, userId, onConnect, onDisconnect }) {
  const [connecting, setConnecting] = useState(null);
  const handleDisconnect = async (catalogId) => {
    const prog = connected.find(p => p.catalog_id === catalogId);
    if (!prog) return;
    await supabase.from("connected_programs").delete().eq("id", prog.id);
    onDisconnect(catalogId);
  };
  return (
    <div className="animate-fade">
      <div style={{ marginBottom: 24 }}><div className="section-title" style={{ marginBottom: 6 }}>Programas <span>Disponíveis</span></div><p style={{ fontSize: 13, color: "var(--muted)" }}>Conecte seus programas para importar saldo e manter tudo sincronizado.</p></div>
      {connected.length > 0 && (<><div style={{ fontSize: 12, color: "var(--success)", fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><span className="status-dot dot-green" /> {connected.length} programa{connected.length > 1 ? "s" : ""} conectado{connected.length > 1 ? "s" : ""}</div><div className="divider" /></>)}
      <div className="integration-grid">
        {PROGRAMS_CATALOG.map(prog => {
          const conn = connected.find(c => c.catalog_id === prog.id);
          const isConn = !!conn;
          return (
            <div key={prog.id} className={`integration-card ${isConn ? "connected" : ""}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div className="int-logo-wrap" style={{ background: prog.bg }}><span style={{ fontSize: 26 }}>{prog.logo}</span></div>
                {isConn ? <span className="badge badge-connected">✓ Conectado</span> : <span className="badge badge-muted">{prog.type}</span>}
              </div>
              <div className="int-name">{prog.name}</div>
              <div className="int-type">{prog.type}</div>
              <div className="int-desc">{prog.desc}</div>
              {isConn ? (<>
                <div className="int-stats">
                  <div className="int-stat"><div className="int-stat-val">{fmt(conn.miles)}</div><div className="int-stat-label">Milhas</div></div>
                  <div className="int-stat"><div className="int-stat-val">{daysUntil(conn.expiry)}d</div><div className="int-stat-label">Vencimento</div></div>
                </div>
                <div style={{ marginBottom: 12 }}><div className="sync-pulse"><div className="pulse-dot" /> Sincronização automática ativa</div></div>
                <div className="int-actions"><button className="btn btn-teal btn-sm" style={{ flex: 1 }}>↻ Sincronizar</button><button className="btn btn-danger btn-sm" onClick={() => handleDisconnect(prog.id)}>Desconectar</button></div>
              </>) : (<>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>CPP: <span style={{ color: "var(--text)" }}>{prog.cpp}</span></div>
                <div className="int-actions"><button className="btn btn-gold btn-sm" style={{ flex: 1 }} onClick={() => setConnecting(prog)}>🔗 Conectar</button><a href={prog.loginUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">Site</a></div>
              </>)}
            </div>
          );
        })}
      </div>
      {connecting && <ConnectModal program={connecting} userId={userId} onClose={() => setConnecting(null)} onConnect={data => { onConnect(data); setConnecting(null); }} />}
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({ connected }) {
  const total = connected.reduce((s, p) => s + p.miles, 0);
  const expiring = connected.filter(p => daysUntil(p.expiry) < 90).reduce((s, p) => s + p.miles, 0);
  const pieData = connected.map(p => { const c = getCatalog(p.catalog_id); return { name: c.name, value: p.miles, color: c.color }; });
  const barData = connected.map(p => { const c = getCatalog(p.catalog_id); return { name: c.name?.split(" ")[0], miles: p.miles, fill: c.color }; });
  return (
    <div className="animate-fade">
      <div className="grid-4">
        {[
          { label: "Total de Milhas", val: fmt(total), color: "var(--gold)", sub: `${connected.length} programas`, delta: "↑ Patrimônio acumulado", dc: "up" },
          { label: "Valor Estimado", val: fmtBRL(total * 0.025), color: "var(--teal)", sub: "@ R$ 0,025 por milha", delta: "✓ Calculado em tempo real", dc: "up" },
          { label: "Milhas a Vencer", val: fmt(expiring), color: "var(--danger)", sub: "próximos 90 dias", delta: expiring > 0 ? "⚠ Ação necessária" : "✓ Tudo em dia", dc: expiring > 0 ? "warn" : "up" },
          { label: "Programas Ativos", val: connected.length, color: "var(--purple)", sub: `de ${PROGRAMS_CATALOG.length} disponíveis`, delta: `↑ ${PROGRAMS_CATALOG.length - connected.length} para conectar`, dc: "up" },
        ].map((m, i) => (<div key={i} className="card"><div className="metric-label">{m.label}</div><div className="metric-value" style={{ color: m.color, fontSize: 24 }}>{m.val}</div><div className="metric-sub">{m.sub}</div><div className={`delta delta-${m.dc}`}>{m.delta}</div></div>))}
      </div>
      {connected.filter(p => daysUntil(p.expiry) < 30).map(p => { const c = getCatalog(p.catalog_id); return (<div key={p.id} className="alert alert-danger">🚨 <div><strong style={{ color: "var(--danger)" }}>{c.name}</strong> — {fmt(p.miles)} milhas vencem em <strong>{daysUntil(p.expiry)} dias</strong>. Resgate urgentemente!</div></div>); })}
      {connected.filter(p => daysUntil(p.expiry) >= 30 && daysUntil(p.expiry) < 90).map(p => { const c = getCatalog(p.catalog_id); return (<div key={p.id} className="alert alert-warn">⚠️ <div><strong style={{ color: "var(--warn)" }}>{c.name}</strong> — {fmt(p.miles)} milhas vencem em {daysUntil(p.expiry)} dias.</div></div>); })}
      <div className="grid-2">
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: "var(--muted)" }}>Evolução do Saldo</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA}>
              <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E8A020" stopOpacity={0.28} /><stop offset="100%" stopColor="#E8A020" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="m" stroke="#555577" tick={{ fontSize: 10 }} />
              <YAxis stroke="#555577" tick={{ fontSize: 10 }} tickFormatter={v => fmt(v / 1000) + "k"} />
              <Tooltip contentStyle={{ background: "#161628", border: "1px solid rgba(232,160,32,0.2)", borderRadius: 8, fontSize: 12 }} formatter={v => [fmt(v), "milhas"]} />
              <Area type="monotone" dataKey="v" stroke="#E8A020" strokeWidth={2} fill="url(#ag)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: "var(--muted)" }}>Distribuição por Programa</div>
          {pieData.length > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <ResponsiveContainer width={150} height={150}>
                <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} dataKey="value" stroke="none">{pieData.map((e, i) => <Cell key={i} fill={e.color} opacity={0.82} />)}</Pie><Tooltip contentStyle={{ background: "#161628", border: "1px solid rgba(232,160,32,0.2)", borderRadius: 8, fontSize: 12 }} formatter={v => [fmt(v), "milhas"]} /></PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>{pieData.map((p, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} /><span style={{ fontSize: 12, color: "var(--muted)", flex: 1 }}>{p.name}</span><span style={{ fontSize: 12, fontFamily: "JetBrains Mono" }}>{fmt(p.value)}</span></div>))}</div>
            </div>
          ) : <div className="empty"><div className="empty-icon">📊</div><div className="empty-text">Conecte programas para ver a distribuição</div></div>}
        </div>
      </div>
      {barData.length > 0 && (<div className="card"><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: "var(--muted)" }}>Comparativo de Saldo</div><ResponsiveContainer width="100%" height={170}><BarChart data={barData} barSize={36}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} /><XAxis dataKey="name" stroke="#555577" tick={{ fontSize: 12 }} /><YAxis stroke="#555577" tick={{ fontSize: 11 }} tickFormatter={v => fmt(v / 1000) + "k"} /><Tooltip contentStyle={{ background: "#161628", border: "1px solid rgba(232,160,32,0.2)", borderRadius: 8, fontSize: 12 }} formatter={v => [fmt(v), "milhas"]} /><Bar dataKey="miles" radius={[4, 4, 0, 0]}>{barData.map((e, i) => <Cell key={i} fill={e.fill} />)}</Bar></BarChart></ResponsiveContainer></div>)}
    </div>
  );
}

// ── PROGRAMS ──────────────────────────────────────────────────────────────────
function Programs({ connected, onGoIntegrations }) {
  if (connected.length === 0) return (<div className="animate-fade empty"><div className="empty-icon">🔗</div><div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Nenhum programa conectado</div><div className="empty-text" style={{ marginBottom: 20 }}>Vá em Integrações para conectar seus programas de milhas</div><button className="btn btn-gold" onClick={onGoIntegrations}>Conectar programas →</button></div>);
  return (
    <div className="animate-fade">
      <div className="section-head"><div className="section-title">Meus <span>Programas</span></div><button className="btn btn-surface btn-sm" onClick={onGoIntegrations}>+ Conectar mais</button></div>
      <div className="program-grid">
        {connected.map(p => {
          const c = getCatalog(p.catalog_id); const days = daysUntil(p.expiry);
          return (<div key={p.id} className={`program-card ${c.code || "pc-default"}`}>
            <div className="prog-head"><div><div className="prog-name">{c.name}</div><div className="prog-account">#{p.account}</div></div><div style={{ display: "flex", gap: 6, alignItems: "center" }}><span className="badge badge-connected" style={{ fontSize: 10 }}>✓ Sync</span><div className="prog-logo" style={{ background: c.bg, color: c.color }}>{c.logo}</div></div></div>
            <div><div className="prog-miles-label">Saldo atual</div><div className="prog-miles">{fmt(p.miles)}</div><div className="prog-brl">≈ {fmtBRL(p.miles * 0.025)}</div></div>
            {p.expiry && <div className={`prog-expiry ${expiryClass(days)}`}>{expiryIcon(days)} Vence {fmtDate(p.expiry)} · {days} dias</div>}
            <div className="prog-foot"><div style={{ flex: 1, fontSize: 11, color: "var(--muted)" }}>Sync: {fmtDateTime(p.last_sync).split(",")[0]}</div><button className="btn btn-teal btn-xs">↻</button></div>
          </div>);
        })}
      </div>
    </div>
  );
}

// ── TRANSACTIONS ──────────────────────────────────────────────────────────────
function Transactions({ transactions, connected, userId, onAdd }) {
  const [filter, setFilter] = useState("todos");
  const [filterProg, setFilterProg] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], description: "", program: connected[0] ? getCatalog(connected[0].catalog_id).name : "", type: "credit", amount: "" });
  const [saving, setSaving] = useState(false);
  const filtered = transactions.filter(t => filter === "todos" || t.type === filter).filter(t => filterProg === "todos" || t.program === filterProg).sort((a, b) => new Date(b.date) - new Date(a.date));
  const typeMap = { credit: ["badge-success", "Crédito"], debit: ["badge-danger", "Débito"], transfer: ["badge-teal", "Transferência"] };
  const submit = async () => {
    if (!form.description || !form.amount) return;
    setSaving(true);
    const amt = parseInt(form.amount);
    const { data, error } = await supabase.from("transactions").insert({ user_id: userId, date: form.date, description: form.description, program: form.program, type: form.type, amount: form.type === "debit" ? -amt : amt }).select().single();
    setSaving(false);
    if (error) { console.error(error); return; }
    onAdd(data); setShowModal(false); setForm(p => ({ ...p, description: "", amount: "" }));
  };
  return (
    <div className="animate-fade">
      <div className="section-head"><div className="section-title">Extrato de <span>Transações</span></div><button className="btn btn-gold btn-sm" onClick={() => setShowModal(true)}>+ Nova transação</button></div>
      <div className="filter-row">
        <select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}><option value="todos">Todos os tipos</option><option value="credit">Créditos</option><option value="debit">Débitos</option><option value="transfer">Transferências</option></select>
        <select className="filter-select" value={filterProg} onChange={e => setFilterProg(e.target.value)}><option value="todos">Todos os programas</option>{connected.map(p => { const c = getCatalog(p.catalog_id); return <option key={p.id}>{c.name}</option>; })}</select>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Data</th><th>Descrição</th><th>Programa</th><th>Tipo</th><th style={{ textAlign: "right" }}>Milhas</th></tr></thead>
            <tbody>
              {filtered.map(t => { const [bc, label] = typeMap[t.type] || ["badge-muted", t.type]; return (<tr key={t.id}><td style={{ color: "var(--muted)", fontSize: 12 }}>{fmtDate(t.date)}</td><td>{t.description}</td><td><span className="badge badge-gold" style={{ fontSize: 10 }}>{t.program}</span></td><td><span className={`badge ${bc}`}>{label}</span></td><td style={{ textAlign: "right" }}><span className={t.type === "credit" ? "tx-credit" : t.type === "debit" ? "tx-debit" : "tx-transfer"}>{t.amount > 0 ? "+" : ""}{fmt(t.amount)}</span></td></tr>); })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty"><div className="empty-icon">📋</div><div className="empty-text">Nenhuma transação</div></div>}
        </div>
      </div>
      {showModal && (<div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}><div className="modal">
        <div className="modal-title">Nova Transação</div>
        <div className="form-group"><label className="form-label">Descrição</label><input className="form-input" placeholder="ex: Compra Cartão Nubank" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Programa</label><select className="form-input filter-select" value={form.program} onChange={e => setForm(p => ({ ...p, program: e.target.value }))}>{connected.map(p => { const c = getCatalog(p.catalog_id); return <option key={p.id}>{c.name}</option>; })}</select></div>
          <div className="form-group"><label className="form-label">Tipo</label><select className="form-input filter-select" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}><option value="credit">Crédito</option><option value="debit">Débito</option><option value="transfer">Transferência</option></select></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Milhas</label><input className="form-input" type="number" placeholder="0" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Data</label><input className="form-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
        </div>
        <div className="modal-actions"><button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button><button className="btn btn-gold" onClick={submit} disabled={saving}>{saving ? "Salvando..." : "Registrar →"}</button></div>
      </div></div>)}
    </div>
  );
}

// ── AI ADVISOR ────────────────────────────────────────────────────────────────
function AIAdvisor({ connected }) {
  const total = connected.reduce((s, p) => s + p.miles, 0);
  const [messages, setMessages] = useState([{ role: "assistant", content: `Olá! Sou seu **Assistente de Milhas** com busca em tempo real. 🌟\n\nTenho acesso à sua carteira com **${fmt(total)} milhas** em ${connected.length} programas conectados.\n\nO que deseja saber?` }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const send = async (text) => {
    const q = (text || input).trim(); if (!q || loading) return;
    setInput(""); const newMsgs = [...messages, { role: "user", content: q }]; setMessages(newMsgs); setLoading(true);
    try { const reply = await askClaude(newMsgs.filter(m => typeof m.content === "string"), connected); setMessages(prev => [...prev, { role: "assistant", content: reply }]); }
    catch { setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Erro de conexão. Tente novamente." }]); }
    setLoading(false);
  };
  return (
    <div className="ai-panel animate-fade">
      <div className="ai-messages">
        {messages.map((m, i) => (<div key={i} className={`msg ${m.role}`}><div className="msg-avatar">{m.role === "assistant" ? "✦" : "👤"}</div><div className="msg-bubble">{formatAI(m.content)}</div></div>))}
        {loading && <div className="msg"><div className="msg-avatar">✦</div><div className="msg-bubble" style={{ padding: "14px 18px" }}><Dots /></div></div>}
        <div ref={bottomRef} />
      </div>
      <div className="ai-input-area">
        <div className="ai-chips">{AI_CHIPS.map((c, i) => <div key={i} className="chip" onClick={() => send(c)}>{c}</div>)}</div>
        <div className="ai-input-row">
          <textarea className="ai-input" rows={2} placeholder="Pergunte sobre suas milhas..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
          <button className="btn btn-gold" onClick={() => send()} disabled={loading} style={{ alignSelf: "flex-end", padding: "12px 18px" }}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ── EXPIRY ────────────────────────────────────────────────────────────────────
function Expiry({ connected }) {
  const sorted = [...connected].sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
  return (
    <div className="animate-fade">
      <div className="section-title" style={{ marginBottom: 20 }}>Calendário de <span>Vencimentos</span></div>
      {sorted.length === 0 && <div className="empty"><div className="empty-icon">◷</div><div className="empty-text">Nenhum programa conectado</div></div>}
      {sorted.map(p => {
        const c = getCatalog(p.catalog_id); const days = daysUntil(p.expiry); const pct = Math.max(5, Math.min(100, (1 - days / 365) * 100)); const fc = days < 30 ? "var(--danger)" : days < 90 ? "var(--warn)" : "var(--success)";
        return (<div key={p.id} className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}><div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{c.logo}</div><div><div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>#{p.account}</div></div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontFamily: "JetBrains Mono", fontSize: 20, color: "var(--gold)" }}>{fmt(p.miles)}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>milhas</div></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span className={`badge ${days < 30 ? "badge-danger" : days < 90 ? "badge-warn" : "badge-success"}`}>{expiryIcon(days)} {days} dias restantes</span><span style={{ fontSize: 12, color: "var(--muted)" }}>Vence em {fmtDate(p.expiry)}</span></div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: fc }} /></div>
          {days < 90 && <div className="alert alert-warn" style={{ marginTop: 12, marginBottom: 0 }}>💡 {days < 30 ? "Resgate urgente! Use no site ou transfira." : "Planeje um resgate parcial em breve."}</div>}
        </div>);
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "◈" },
  { id: "integrations", label: "Integrações", icon: "🔗" },
  { id: "programs", label: "Programas", icon: "✈" },
  { id: "transactions", label: "Extrato", icon: "≡" },
  { id: "ai", label: "Assistente IA", icon: "✦" },
  { id: "expiry", label: "Vencimentos", icon: "◷" },
];
const HEADER_MAP = {
  dashboard: { title: "Dashboard", sub: "Visão geral do seu patrimônio em milhas" },
  integrations: { title: "Integrações", sub: "Conecte e gerencie seus programas de fidelidade" },
  programs: { title: "Meus Programas", sub: "Saldo e status dos programas conectados" },
  transactions: { title: "Extrato", sub: "Histórico completo de transações" },
  ai: { title: "Assistente IA", sub: "Powered by Claude · Web Search em tempo real" },
  expiry: { title: "Vencimentos", sub: "Alertas e calendário de expiração de milhas" },
};

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [appLoading, setAppLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  const [connected, setConnected] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user; const meta = u.user_metadata;
        setUser({ id: u.id, email: u.email, name: meta?.name || u.email.split("@")[0], avatar: getInitials(meta?.name || u.email), plan: "Premium" });
      }
      setAppLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { setUser(null); setConnected([]); setTransactions([]); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("connected_programs").select("*").eq("user_id", user.id).then(({ data }) => { if (data) setConnected(data); });
    supabase.from("transactions").select("*").eq("user_id", user.id).then(({ data }) => { if (data) setTransactions(data); });
  }, [user]);

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setConnected([]); setTransactions([]); };
  const handleConnect = (data) => setConnected(prev => { const exists = prev.findIndex(p => p.catalog_id === data.catalog_id); if (exists >= 0) { const n = [...prev]; n[exists] = data; return n; } return [...prev, data]; });
  const handleDisconnect = (catalogId) => setConnected(prev => prev.filter(p => p.catalog_id !== catalogId));
  const total = connected.reduce((s, p) => s + p.miles, 0);
  const expiringCount = connected.filter(p => daysUntil(p.expiry) < 90).length;

  if (appLoading) return (<><style>{STYLE}</style><div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)", flexDirection: "column", gap: 16 }}><div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, background: "linear-gradient(135deg, #E8A020, #FFD166)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MilesCRM</div><Dots /></div></>);
  if (!user) return (<><style>{STYLE}</style><AuthScreen onLogin={u => setUser(u)} /></>);

  const isAI = view === "ai";
  return (
    <>
      <style>{STYLE}</style>
      <div className="crm-root">
        <aside className="sidebar">
          <div className="sidebar-logo"><div className="sidebar-logo-mark">MilesCRM</div><div className="sidebar-logo-sub">Gestão Premium</div></div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Menu</div>
            {NAV_ITEMS.map(n => (<div key={n.id} className={`nav-item ${view === n.id ? "active" : ""}`} onClick={() => setView(n.id)}>
              <span className="nav-icon">{n.icon}</span><span>{n.label}</span>
              {n.id === "ai" && <span className="nav-live">LIVE</span>}
              {n.id === "expiry" && expiringCount > 0 && <span className="nav-badge">{expiringCount}</span>}
              {n.id === "integrations" && <span className="badge badge-gold" style={{ marginLeft: "auto", fontSize: 10, padding: "1px 6px" }}>{connected.length}</span>}
            </div>))}
          </nav>
          <div className="sidebar-user">
            <div className="user-avatar">{user.avatar}</div>
            <div style={{ flex: 1, overflow: "hidden" }}><div className="user-name">{user.name}</div><div className="user-plan">{user.plan}</div></div>
            <div className="logout-btn" onClick={handleLogout} title="Sair">⏻</div>
          </div>
        </aside>
        <main className="main">
          <header className="header">
            <div><div className="header-title">{HEADER_MAP[view]?.title}</div><div className="header-sub">{HEADER_MAP[view]?.sub}</div></div>
            <div className="header-actions">{view === "ai" ? <span className="badge badge-teal">● Online · Web Search ativo</span> : <span className="badge badge-gold">✦ {fmt(total)} milhas</span>}</div>
          </header>
          <div style={isAI ? { padding: 0, display: "flex", flexDirection: "column", flex: 1 } : { padding: "24px 28px", flex: 1 }}>
            {view === "dashboard" && <Dashboard connected={connected} />}
            {view === "integrations" && <Integrations connected={connected} userId={user.id} onConnect={handleConnect} onDisconnect={handleDisconnect} />}
            {view === "programs" && <Programs connected={connected} onGoIntegrations={() => setView("integrations")} />}
            {view === "transactions" && <Transactions transactions={transactions} connected={connected} userId={user.id} onAdd={t => setTransactions(p => [t, ...p])} />}
            {view === "ai" && <AIAdvisor connected={connected} />}
            {view === "expiry" && <Expiry connected={connected} />}
          </div>
        </main>
      </div>
    </>
  );
}
