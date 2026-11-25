<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--mq-ink:#111827;--mq-blue:#2563EB;--mq-navy:#1E3A8A;--mq-slate:#64748B;--mq-bg:#F8FAFC;--mq-yellow:#F5C542;--mq-line:#E5EAF3}
body.fi-body,.fi-body{background:var(--mq-bg)}
.fi-header-heading,.fi-section-header-heading,.fi-simple-header-heading,.fi-wi-stats-overview-stat-value{font-family:'Sora',sans-serif;letter-spacing:-.01em;color:var(--mq-ink)}
/* surfaces */
.fi-sidebar,.fi-topbar>nav,.fi-topbar{background:#fff}
.fi-section,.fi-ta-ctn,.fi-wi-stats-overview-stat{border-radius:1.25rem;box-shadow:0 10px 30px -18px rgba(30,58,138,.25);border:1px solid var(--mq-line);background:#fff}
.fi-sidebar-item-active>.fi-sidebar-item-btn{background:#EEF3FF}
.fi-sidebar-item-active .fi-sidebar-item-label,.fi-sidebar-item-active .fi-icon{color:var(--mq-blue)}
/* pill buttons like the landing page */
.fi-btn.fi-color-primary:not(.fi-outlined){background:linear-gradient(180deg,#3B82F6,#2563EB);border-radius:999px;box-shadow:0 8px 18px -8px rgba(37,99,235,.7);color:#fff}
.fi-btn{border-radius:999px}
.fi-input-wrp{border-radius:.9rem}
/* login */
.fi-simple-layout{background:radial-gradient(60rem 30rem at 15% -10%,#E8EFFF 0,transparent 60%),radial-gradient(40rem 26rem at 100% 100%,#EEF2FF 0,transparent 60%),#fff;position:relative;overflow:hidden}
.fi-simple-layout::before{content:"";position:absolute;width:26rem;height:26rem;border-radius:50%;background:#EAF0FF;right:-9rem;top:-7rem;opacity:.9}
.fi-simple-layout::after{content:"";position:absolute;width:.9rem;height:.9rem;border-radius:50%;background:var(--mq-yellow);left:12%;bottom:18%;box-shadow:3rem -2rem 0 -.25rem #C7D2F5}
.fi-simple-main{position:relative;z-index:1;border-radius:1.75rem;border:1px solid var(--mq-line);box-shadow:0 30px 60px -30px rgba(30,58,138,.35)}
/* brand */
.mq-logo{display:inline-flex;align-items:center;gap:.05rem;font-family:'Sora',sans-serif;font-weight:800;font-size:1.25rem;color:var(--mq-ink);letter-spacing:.02em}
.mq-logo b{color:var(--mq-blue)}
.mq-logo i{width:.4rem;height:.4rem;border-radius:50%;display:inline-block}
.mq-logo .mq-y{background:var(--mq-yellow);margin-right:.5rem}.mq-logo .mq-b{background:var(--mq-blue);margin-left:.15rem;margin-top:.55rem}
.mq-logo em{font-style:normal;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:.7rem;color:var(--mq-slate);background:#EEF3FF;border-radius:999px;padding:.15rem .6rem;margin-left:.65rem;letter-spacing:0}
/* portal widgets */
.mq-cards{display:grid;gap:1rem}
.mq-card{display:block;background:#fff;border:1px solid var(--mq-line);border-radius:1.25rem;padding:1.25rem 1.4rem;box-shadow:0 10px 30px -18px rgba(30,58,138,.25);transition:transform .2s,box-shadow .2s;text-decoration:none}
.mq-card:hover{transform:translateY(-2px);box-shadow:0 18px 36px -18px rgba(37,99,235,.4)}
.mq-card-top{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:.9rem}
.mq-card-title{font-family:'Sora',sans-serif;font-weight:700;font-size:1.05rem;color:var(--mq-ink)}
.mq-card-sub{font-size:.82rem;color:var(--mq-slate);margin-top:.15rem}
.mq-pct{font-family:'Sora',sans-serif;font-weight:800;font-size:1.4rem;color:var(--mq-blue)}
.mq-bar{height:.5rem;background:#E8EEFB;border-radius:999px;overflow:hidden;margin-bottom:1rem}
.mq-bar i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#3B82F6,#2563EB);transition:width .8s}
.mq-steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,1fr);gap:.25rem}
.mq-steps li{display:flex;flex-direction:column;align-items:center;gap:.35rem;font-size:.72rem;color:var(--mq-slate);text-align:center;position:relative}
.mq-steps li:not(:last-child)::after{content:"";position:absolute;top:.85rem;left:calc(50% + 1rem);right:calc(-50% + 1rem);height:2px;background:#DCE4F5}
.mq-steps li.is-done:not(:last-child)::after{background:var(--mq-blue)}
.mq-dot{width:1.7rem;height:1.7rem;border-radius:50%;display:grid;place-items:center;background:#EEF3FF;color:var(--mq-slate);font-weight:700;font-size:.75rem}
.is-done .mq-dot{background:var(--mq-blue);color:#fff}
.is-now .mq-dot{background:var(--mq-yellow);color:var(--mq-ink);box-shadow:0 0 0 .3rem rgba(245,197,66,.25)}
.is-now .mq-lbl{color:var(--mq-ink);font-weight:700}
.mq-badge-off,.mq-empty{color:var(--mq-slate);font-size:.9rem}
.mq-empty{background:#fff;border:1px dashed #CBD5E1;border-radius:1.25rem;padding:2rem;text-align:center}
@media(max-width:520px){.mq-steps{font-size:.65rem}.mq-lbl{font-size:.62rem}}

/* ---- polish ---- */
.fi-topbar{box-shadow:0 1px 0 var(--mq-line)}
.fi-topbar>nav{box-shadow:none;--tw-ring-shadow:0 0 #0000;border-bottom:1px solid var(--mq-line)}
.fi-sidebar{border-right:1px solid var(--mq-line);box-shadow:none;--tw-ring-shadow:0 0 #0000}
.fi-sidebar-nav{padding-top:1rem}
.fi-sidebar-group-label{font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--mq-slate)}
.fi-sidebar-item-btn{border-radius:.8rem;padding:.55rem .7rem;transition:background .15s}
.fi-sidebar-item-btn:hover{background:#F1F5FD}
.fi-sidebar-item-active .fi-sidebar-item-label{font-weight:700}
.fi-main{max-width:78rem}
.fi-header{margin-bottom:.5rem}
.fi-header-heading{font-size:1.75rem;font-weight:800}
.fi-header-subheading{color:var(--mq-slate);margin-top:.25rem}
.fi-avatar{box-shadow:0 0 0 2px #fff,0 0 0 4px #DCE6FF;background:#E8EFFF}
/* stat cards */
.fi-wi-stats-overview-stat{padding:1.25rem 1.4rem;transition:transform .2s,box-shadow .2s}
.fi-wi-stats-overview-stat:hover{transform:translateY(-2px);box-shadow:0 18px 36px -18px rgba(37,99,235,.35)}
.fi-wi-stats-overview-stat-value{font-size:1.65rem;font-weight:800;white-space:nowrap}
.fi-wi-stats-overview-stat-label{font-weight:600;color:var(--mq-slate)}
.fi-wi-stats-overview-stat-description{font-size:.8rem}
.fi-wi-stats-overview-stat .fi-icon{color:var(--mq-blue)}
/* tables */
.fi-ta-header-cell{background:#F8FAFF;font-size:.72rem;letter-spacing:.04em;text-transform:uppercase;color:var(--mq-slate)}
.fi-ta-row:hover{background:#FAFCFF}
.fi-badge{border-radius:999px}
.fi-section-header{padding-bottom:.25rem}
/* google login */
.mq-or{display:flex;align-items:center;gap:.75rem;margin:1.25rem 0 1rem;color:var(--mq-slate);font-size:.8rem}
.mq-or::before,.mq-or::after{content:"";flex:1;height:1px;background:var(--mq-line)}
.mq-google{display:flex;align-items:center;justify-content:center;gap:.6rem;width:100%;padding:.65rem 1rem;border:1px solid #D5DCEB;border-radius:999px;background:#fff;color:var(--mq-ink);font-weight:600;font-size:.9rem;transition:box-shadow .2s,border-color .2s}
.mq-google:hover{border-color:var(--mq-blue);box-shadow:0 8px 18px -10px rgba(37,99,235,.5)}
.mq-google-err{margin-top:1rem;padding:.6rem .9rem;border-radius:.8rem;background:#FEECEC;color:#B91C1C;font-size:.85rem}
/* forgot-password link */
.mq-forgot{color:var(--mq-blue);font-size:.875rem;font-weight:500;white-space:nowrap}.mq-forgot:hover{text-decoration:underline}
@media(max-width:640px){.fi-header-heading{font-size:1.4rem}.fi-wi-stats-overview-stat-value{font-size:1.4rem}}
</style>
