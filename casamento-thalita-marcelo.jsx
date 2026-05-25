import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

/* ══════════════════════════════════════════════════════════════
   SUPABASE — substitua pelas suas credenciais reais
══════════════════════════════════════════════════════════════ */
const SB_URL = "https://SEU_PROJETO.supabase.co";
const SB_KEY = "SUA_CHAVE_ANON";

async function dbPost(table, body) {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    });
    return r.ok;
  } catch { return false; }
}

async function dbGet(table) {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${table}?select=*&order=created_at.desc`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    });
    if (!r.ok) return [];
    return r.json();
  } catch { return []; }
}

/* ══════════════════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════════════════ */
const NOIVOS_EMAIL = "noivos@casamento.com";
const NOIVOS_SENHA = "thalitamarcelo2026";

/* ══════════════════════════════════════════════════════════════
   MONOGRAMAS — SVG inline (idênticos às imagens enviadas)
   dark = letras brancas | light = letras pretas
══════════════════════════════════════════════════════════════ */
function Monograma({ size = 80, dark = true }) {
  const color = dark ? "#ffffff" : "#111111";
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* T */}
      <text x="10" y="148" fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="148" fontWeight="400" fill={color} letterSpacing="-8">T</text>
      {/* & */}
      <text x="82" y="148" fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="100" fontWeight="400" fill={color}>{"&"}</text>
      {/* M */}
      <text x="118" y="148" fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="120" fontWeight="400" fill={color} letterSpacing="-4">M</text>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   COUNTDOWN
══════════════════════════════════════════════════════════════ */
const WEDDING_TS = new Date("2026-12-20T13:00:00").getTime();

function useCountdown() {
  const get = () => {
    const d = WEDDING_TS - Date.now();
    if (d <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const s = Math.floor(d / 1000);
    return {
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
    };
  };
  const [t, setT] = useState(get);
  useEffect(() => { const id = setInterval(() => setT(get()), 1000); return () => clearInterval(id); }, []);
  return t;
}

/* ══════════════════════════════════════════════════════════════
   THEME TOKENS
══════════════════════════════════════════════════════════════ */
const T = {
  dark: {
    bg: "#151515", bg2: "#1a1a1a", card: "#1a1a1a",
    text: "#ffffff", text2: "rgba(255,255,255,0.55)", text3: "rgba(255,255,255,0.35)",
    border: "rgba(255,255,255,0.10)", border2: "rgba(255,255,255,0.18)",
    input: "#2a2a2a", inputBorder: "rgba(255,255,255,0.15)",
    btnBg: "#ffffff", btnText: "#151515",
    labelColor: "rgba(255,255,255,0.55)",
    divider: "rgba(255,255,255,0.18)",
    sLabel: "rgba(255,255,255,0.35)",
    toggleBg: "#2a2a2a", toggleBorder: "rgba(255,255,255,0.2)",
    sectionAlt: "#1a1a1a",
    tableTh: "rgba(255,255,255,0.35)",
    tableTd: "rgba(255,255,255,0.72)",
    tableBorder: "rgba(255,255,255,0.07)",
  },
  light: {
    bg: "#faf9f7", bg2: "#f2ede6", card: "#ffffff",
    text: "#111111", text2: "#555555", text3: "#999999",
    border: "#e5ddd3", border2: "#ccc5ba",
    input: "#f5f1ec", inputBorder: "#ccc5ba",
    btnBg: "#111111", btnText: "#ffffff",
    labelColor: "#666666",
    divider: "#d9d1c7",
    sLabel: "#aaa49c",
    toggleBg: "#f0ebe3", toggleBorder: "#d9d1c7",
    sectionAlt: "#f2ede6",
    tableTh: "#aaa49c",
    tableTd: "#333333",
    tableBorder: "#ede8e0",
  },
};

/* ══════════════════════════════════════════════════════════════
   CSS FUNCTION (theme-aware)
══════════════════════════════════════════════════════════════ */
function makeCSS(isDark) {
  const t = isDark ? T.dark : T.light;
  return `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Dancing+Script:wght@400;700&family=Lato:wght@300;400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: ${t.bg}; color: ${t.text};
  font-family: 'Lato', sans-serif; font-weight: 300;
  -webkit-font-smoothing: antialiased; min-height: 100vh;
  transition: background .3s, color .3s;
}
.eg { font-family: 'EB Garamond', serif; }
.ds { font-family: 'Dancing Script', cursive; }

input, textarea, select {
  display: block; width: 100%;
  background: ${t.input};
  border: 1px solid ${t.inputBorder};
  color: ${t.text};
  border-radius: 8px; padding: 12px 14px; font-size: 14px;
  font-family: 'Lato', sans-serif; font-weight: 300;
  outline: none; transition: border-color .2s;
  appearance: none; -webkit-appearance: none;
}
input::placeholder, textarea::placeholder { color: ${t.text3}; }
input:focus, textarea:focus { border-color: ${t.border2}; }
label { display: block; font-size: 13px; color: ${t.labelColor}; margin-bottom: 7px; font-weight: 400; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: ${t.bg}; }
::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 2px; }

@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
.fu { animation: fadeUp .9s ease both; }

.div-line { width: 40px; height: 1px; background: ${t.divider}; margin: 18px auto 24px; }
.s-label { font-size: 11px; letter-spacing: 3.5px; text-transform: uppercase; color: ${t.sLabel}; text-align: center; margin-bottom: 14px; }
.s-title { font-family: 'EB Garamond', serif; font-size: clamp(32px, 7vw, 48px); font-weight: 400; text-align: center; color: ${t.text}; margin-bottom: 12px; }

.card {
  background: ${t.card}; border: 1px solid ${t.border};
  border-radius: 16px; padding: 32px 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,${isDark ? "0.3" : "0.06"});
  transition: box-shadow .3s;
}
.card:hover { box-shadow: 0 8px 32px rgba(0,0,0,${isDark ? "0.5" : "0.12"}); }

.btn {
  display: flex; align-items: center; justify-content: center;
  padding: 13px 24px; border: none; border-radius: 8px;
  background: ${t.btnBg}; color: ${t.btnText};
  font-size: 14px; font-weight: 500; font-family: 'Lato', sans-serif;
  cursor: pointer; width: 100%; letter-spacing: .3px;
  transition: opacity .2s, transform .15s;
}
.btn:hover { opacity: .85; transform: translateY(-1px); }
.btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

.btn-outline {
  background: transparent !important;
  color: ${t.text2} !important;
  border: 1px solid ${t.border2} !important;
}
.btn-outline:hover { background: ${t.bg2} !important; opacity: 1 !important; }

table { width: 100%; border-collapse: collapse; font-size: 13px; }
th { text-align:left; padding: 10px 14px; border-bottom: 1px solid ${t.tableBorder}; color: ${t.tableTh}; font-weight:400; font-size:11px; letter-spacing:.8px; text-transform:uppercase; }
td { padding: 10px 14px; border-bottom: 1px solid ${t.tableBorder}; color: ${t.tableTd}; vertical-align: top; }

.radio-btn {
  flex: 1; padding: 11px 8px; border-radius: 8px; cursor: pointer; text-align: center;
  border: 1.5px solid ${t.border2};
  background: transparent; color: ${t.text2};
  font-family: 'Lato', sans-serif; font-size: 13px; font-weight: 400;
  transition: all .2s;
}
.radio-btn.active {
  background: ${t.btnBg}; color: ${t.btnText};
  border-color: ${t.btnBg};
}
`;
}

/* ══════════════════════════════════════════════════════════════
   STORES
══════════════════════════════════════════════════════════════ */
const STORES = [
  {
    id: "casasbahia", name: "Casas Bahia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Casas_Bahia_icon.svg/960px-Casas_Bahia_icon.svg.png",
    logoH: 50, invert: true,
    url: "https://www.casasbahia.com.br/",
  },
  {
    id: "havan", name: "Havan",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Havan_logo.svg",
    logoH: 36, invert: true,
    url: "https://www.havan.com.br/",
  },
  {
    id: "magalu", name: "Magazine Luiza",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Magalu_logo_2023.svg/1200px-Magalu_logo_2023.svg.png",
    logoH: 36, invert: false,
    url: "https://www.magazineluiza.com.br/",
  },
];

const MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4371.274631682339!2d-46.358016923879546!3d-23.71045376708803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce72af0357ccbb%3A0x5a733c17312d73bb!2sEspa%C3%A7o%20de%20Eventos%20Ch%C3%A1cara%20Recanto%20Vale%20das%20%C3%81guas!5e1!3m2!1spt-BR!2sbr!4v1779725365039!5m2!1spt-BR!2sbr";
const MAPS_LINK = "https://maps.app.goo.gl/5o7MUjcDxQ6336mh8";
const GCAL_URL  = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Casamento%20Thalita%20%26%20Marcelo&dates=20261220T130000/20261220T230000&location=Estrada%20do%20Soma%2C%20243%2C%20Ouro%20Fino%20Paulista%2C%20Ribeir%C3%A3o%20Pires%20-%20SP&details=Cerim%C3%B4nia%20e%20Recep%C3%A7%C3%A3o%20do%20casamento%20de%20Thalita%20e%20Marcelo";
const ICS = encodeURIComponent("BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Casamento Thalita & Marcelo\nDTSTART:20261220T130000\nDTEND:20261220T230000\nLOCATION:Estrada do Soma, 243, Ouro Fino Paulista, Ribeirão Pires - SP\nEND:VEVENT\nEND:VCALENDAR");

/* ══════════════════════════════════════════════════════════════
   HELPER — THANK YOU MODAL
══════════════════════════════════════════════════════════════ */
function ThanksModal({ emoji, title, msg, onClose, isDark }) {
  const t = isDark ? T.dark : T.light;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 300, padding: 22,
    }} onClick={onClose}>
      <div style={{
        background: t.card, border: `1px solid ${t.border}`,
        borderRadius: 16, padding: "48px 36px", maxWidth: 380, width: "100%",
        textAlign: "center", boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
      }} onClick={e => e.stopPropagation()}>
        <p style={{ fontSize: 40, marginBottom: 18 }}>{emoji}</p>
        <h3 className="eg" style={{ fontSize: 28, color: t.text, marginBottom: 12 }}>{title}</h3>
        <p style={{ fontSize: 14, color: t.text2, lineHeight: 1.7, marginBottom: 28 }}>{msg}</p>
        <p className="eg" style={{ fontSize: 18, fontStyle: "italic", color: t.text3, marginBottom: 28 }}>Deus abençoe!</p>
        <button className="btn" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════════ */
function Hero({ isDark }) {
  const t = isDark ? T.dark : T.light;
  const { days, hours, minutes, seconds } = useCountdown();
  const pad = n => String(n).padStart(2, "0");

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "90px 22px 64px",
      background: t.bg,
    }}>
      {/* Monograma real SVG */}
      <div className="fu" style={{ marginBottom: 32, animationDelay: ".05s" }}>
        <Monograma size={110} dark={isDark} />
      </div>

      {/* Nomes */}
      <h1 className="ds fu" style={{
        fontSize: "clamp(44px, 11vw, 80px)",
        fontWeight: 400, color: t.text,
        lineHeight: 1.1, marginBottom: 20,
        animationDelay: ".15s",
      }}>
        Thalita e Marcelo
      </h1>

      {/* Data */}
      <p className="eg fu" style={{
        fontSize: "clamp(14px,3vw,18px)", letterSpacing: "3px",
        color: t.text2, marginBottom: 52,
        textTransform: "uppercase", animationDelay: ".25s",
      }}>
        20 de dezembro de 2026
      </p>

      {/* Countdown */}
      <div className="fu" style={{ display: "flex", alignItems: "flex-start", gap: 4, animationDelay: ".38s" }}>
        {[[days, "Dias"], [hours, "Horas"], [minutes, "Min"], [seconds, "Seg"]].map(([v, l], i) => (
          <div key={l} style={{ display: "flex", alignItems: "flex-start" }}>
            {i > 0 && (
              <span style={{
                fontFamily: "EB Garamond, serif",
                fontSize: "clamp(20px,4vw,32px)",
                color: t.text3, margin: "0 6px", lineHeight: 1, paddingTop: 4,
              }}>·</span>
            )}
            <div style={{ textAlign: "center", minWidth: 42 }}>
              <div style={{
                fontFamily: "EB Garamond, serif",
                fontSize: "clamp(28px,6vw,52px)",
                fontWeight: 400, color: t.text, lineHeight: 1,
              }}>{pad(v)}</div>
              <div style={{
                fontSize: 10, letterSpacing: "2.5px",
                color: t.text3, textTransform: "uppercase", marginTop: 6,
              }}>{l}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   WELCOME
══════════════════════════════════════════════════════════════ */
function Welcome({ isDark }) {
  const t = isDark ? T.dark : T.light;
  return (
    <section style={{
      borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`,
      padding: "64px 22px", background: t.sectionAlt,
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <p className="eg" style={{ fontSize: 20, color: t.text, marginBottom: 24, fontStyle: "italic" }}>À paz de Deus!</p>
        <p className="eg" style={{ fontSize: 17, color: t.text2, lineHeight: 1.85, marginBottom: 18 }}>
          Segundo a vontade de Deus, criamos esse site para compartilhar com vocês os detalhes da organização do nosso casamento. Estamos muito felizes e contamos com a presença de todos no nosso grande dia!
        </p>
        <p className="eg" style={{ fontSize: 17, color: t.text2, lineHeight: 1.85, marginBottom: 24 }}>
          Aqui compartilhamos as informações essenciais para o nosso dia, como sugestões de presentes e confirmação de presença.
        </p>
        <p className="eg" style={{ fontSize: 20, color: t.text, fontStyle: "italic" }}>Deus abençoe!</p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   LOCALIZAÇÃO
══════════════════════════════════════════════════════════════ */
function Location({ isDark }) {
  const t = isDark ? T.dark : T.light;
  return (
    <section style={{ background: t.bg, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, padding: "72px 22px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <p className="s-label">Cerimônia & Recepção</p>
        <h2 className="s-title">Horário e Local</h2>
        <div className="div-line" />

        <div className="card" style={{ marginBottom: 20 }}>
          <h3 className="eg" style={{ fontSize: 22, color: t.text, marginBottom: 20 }}>Recanto Vale das Águas</h3>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 18, marginTop: 1 }}>📍</span>
            <p className="eg" style={{ fontSize: 15, color: t.text2, lineHeight: 1.8 }}>
              Estrada do Soma, nº 243<br />
              Ouro Fino Paulista, Ribeirão Pires — SP<br />
              CEP 09445-550
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 18, marginTop: 1 }}>🕐</span>
            <div>
              <p className="eg" style={{ fontSize: 15, color: t.text, lineHeight: 1.8 }}>
                <strong>Cerimônia e Recepção às 13h</strong><br />
                20 de dezembro de 2026
              </p>
              <p style={{ fontSize: 12, color: t.text3, marginTop: 6 }}>
                Chegue com antecedência para aproveitar melhor o dia
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 12, letterSpacing: "2px", textTransform: "uppercase",
              color: t.text, borderBottom: `1px solid ${t.border2}`,
              textDecoration: "none", paddingBottom: 2,
            }}>Abrir no Google Maps</a>
            <span style={{ color: t.text3, fontSize: 10 }}>•</span>
            <span style={{ fontSize: 11, color: t.text3, letterSpacing: "1.5px", textTransform: "uppercase" }}>Adicionar ao:</span>
            <a href={GCAL_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: t.text2, textDecoration: "none" }}>📅 Google</a>
            <a href={`data:text/calendar;charset=utf-8,${ICS}`} download="casamento.ics" style={{ fontSize: 12, color: t.text2, textDecoration: "none" }}>📅 Apple/Outlook</a>
          </div>
        </div>

        {/* MAPA — iframe com zoom completo */}
        <div style={{
          borderRadius: 12, overflow: "hidden",
          border: `1px solid ${t.border}`,
          height: 400,
          boxShadow: `0 4px 20px rgba(0,0,0,${isDark ? "0.35" : "0.1"})`,
        }}>
          <iframe
            src={MAPS_EMBED}
            width="100%" height="100%"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Local do casamento"
          />
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   LISTA DE PRESENTES
══════════════════════════════════════════════════════════════ */
function Gifts({ isDark }) {
  const t = isDark ? T.dark : T.light;
  return (
    <section style={{ background: t.sectionAlt, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, padding: "72px 22px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 className="s-title">Lista de Presentes</h2>
        <div className="div-line" />
        <p className="eg" style={{ fontSize: 16, color: t.text2, textAlign: "center", lineHeight: 1.75, marginBottom: 40 }}>
          Escolha o presente perfeito em nossas lojas parceiras
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {STORES.map(s => (
            <div key={s.id} className="card" style={{ textAlign: "center" }}>
              <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <img
                  src={s.logo} alt={s.name}
                  style={{
                    height: s.logoH, objectFit: "contain", maxWidth: "75%",
                    // Casas Bahia e Havan: inverter para ficar branco no dark, normal no light
                    // Magalu: azul sempre visível, só filtrar no dark para clarear um pouco
                    filter: isDark && s.invert
                      ? "brightness(0) invert(1)"
                      : !isDark && s.invert
                      ? "brightness(0)" // fica preto no light
                      : "none",
                  }}
                  onError={e => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <span style={{ display: "none", fontFamily: "EB Garamond, serif", fontSize: 18, color: t.text }}>{s.name}</span>
              </div>
              <h3 className="eg" style={{ fontSize: 18, color: t.text, marginBottom: 18, fontWeight: 400 }}>{s.name}</h3>
              <a
                href={s.url} target="_blank" rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ textDecoration: "none", fontSize: 13, letterSpacing: "1px" }}
              >
                Ir para a Lista Oficial
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   RSVP
══════════════════════════════════════════════════════════════ */
function RSVP({ isDark }) {
  const t = isDark ? T.dark : T.light;
  const [f, setF] = useState({
    guestName: "", whatsapp: "", willAttend: true, numGuests: 0, guestNames: [],
  });
  const [status, setStatus] = useState(null); // null | "err" | "fieldErr"
  const [loading, setLoading] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  const up = patch => setF(p => ({ ...p, ...patch }));

  const incGuests = () => {
    if (f.numGuests < 8) up({ numGuests: f.numGuests + 1, guestNames: [...f.guestNames, ""] });
  };
  const decGuests = () => {
    if (f.numGuests > 0) up({ numGuests: f.numGuests - 1, guestNames: f.guestNames.slice(0, -1) });
  };
  const setGName = (i, v) => {
    const arr = [...f.guestNames]; arr[i] = v; up({ guestNames: arr });
  };

  const submit = async () => {
    // Validação clara
    if (!f.guestName.trim()) { setStatus("fieldErr"); return; }
    if (!f.whatsapp.trim())  { setStatus("fieldErr"); return; }

    setStatus(null);
    setLoading(true);
    const ok = await dbPost("rsvp", {
      guest_name: f.guestName.trim(),
      whatsapp: f.whatsapp.trim(),
      will_attend: f.willAttend ? 1 : 0,
      num_guests: f.numGuests,
      guest_names: f.guestNames.filter(Boolean).join(", "),
    });
    setLoading(false);

    if (ok) {
      setShowThanks(true);
      setF({ guestName: "", whatsapp: "", willAttend: true, numGuests: 0, guestNames: [] });
    } else {
      setStatus("err");
    }
  };

  const circleBtn = (label, onClick, disabled) => (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        width: 44, height: 44, borderRadius: "50%",
        border: `2px solid ${t.border2}`,
        background: "transparent", color: t.text,
        fontSize: 22, cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: disabled ? 0.25 : 1, transition: "opacity .2s",
        fontFamily: "Lato, sans-serif",
      }}
    >{label}</button>
  );

  return (
    <section style={{ background: t.bg, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, padding: "72px 22px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <p className="s-label">Confirme sua Presença</p>
        <h2 className="s-title">RSVP</h2>
        <div className="div-line" />
        <p className="eg" style={{ fontSize: 16, color: t.text2, textAlign: "center", lineHeight: 1.75, marginBottom: 36 }}>
          Por favor, confirme sua presença até{" "}
          <strong style={{ color: t.text }}>15 de novembro</strong>
        </p>

        <div className="card">
          {/* Nome */}
          <div style={{ marginBottom: 18 }}>
            <label>Nome Completo *</label>
            <input
              value={f.guestName}
              onChange={e => { up({ guestName: e.target.value }); setStatus(null); }}
              placeholder="Digite seu nome completo"
              style={{ borderColor: status === "fieldErr" && !f.guestName.trim() ? "#ef4444" : undefined }}
            />
          </div>

          {/* WhatsApp */}
          <div style={{ marginBottom: 18 }}>
            <label>WhatsApp *</label>
            <input
              value={f.whatsapp}
              onChange={e => { up({ whatsapp: e.target.value }); setStatus(null); }}
              placeholder="(11) 99999-9999"
              style={{ borderColor: status === "fieldErr" && !f.whatsapp.trim() ? "#ef4444" : undefined }}
            />
          </div>

          {/* Vai comparecer — toggle visual */}
          <div style={{ marginBottom: 22 }}>
            <label>Você irá comparecer? *</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className={`radio-btn${f.willAttend ? " active" : ""}`}
                onClick={() => up({ willAttend: true })}
              >
                ✓ Sim, vou comparecer
              </button>
              <button
                className={`radio-btn${!f.willAttend ? " active" : ""}`}
                onClick={() => up({ willAttend: false, numGuests: 0, guestNames: [] })}
              >
                ✗ Não poderei ir
              </button>
            </div>
          </div>

          {/* Acompanhantes */}
          {f.willAttend && (
            <>
              <div style={{ marginBottom: 20 }}>
                <label>Quantas pessoas virão com você?</label>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 12 }}>
                  {circleBtn("−", decGuests, f.numGuests === 0)}
                  <div style={{
                    background: isDark ? "#2a2a2a" : "#f5f1ec",
                    borderRadius: 10, padding: "12px 32px", textAlign: "center",
                    border: `1px solid ${t.border}`, minWidth: 110,
                  }}>
                    <p className="eg" style={{ fontSize: 40, fontWeight: 300, color: t.text, lineHeight: 1 }}>
                      {f.numGuests}
                    </p>
                    <p style={{ fontSize: 11, color: t.text3, marginTop: 4 }}>
                      {f.numGuests === 0 ? "Apenas você" : f.numGuests === 1 ? "Pessoa" : "Pessoas"}
                    </p>
                  </div>
                  {circleBtn("+", incGuests, f.numGuests >= 8)}
                </div>
              </div>

              {f.numGuests > 0 && (
                <div style={{
                  background: isDark ? "#222" : "#f5f1ec",
                  borderRadius: 10, padding: "18px 16px", marginBottom: 20,
                  border: `1px solid ${t.border}`,
                }}>
                  <p style={{ fontSize: 13, color: t.text2, marginBottom: 14, fontWeight: 400 }}>
                    Nomes dos acompanhantes
                  </p>
                  {f.guestNames.map((n, i) => (
                    <div key={i} style={{ marginBottom: i < f.guestNames.length - 1 ? 10 : 0 }}>
                      <input
                        value={n}
                        onChange={e => setGName(i, e.target.value)}
                        placeholder={`Nome do acompanhante ${i + 1}`}
                        style={{ background: isDark ? "#2a2a2a" : "#fff" }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Erros */}
          {status === "fieldErr" && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: 8, padding: "12px 16px", marginBottom: 16,
              fontSize: 13, color: "#f87171",
            }}>
              Por favor, preencha nome completo e WhatsApp.
            </div>
          )}
          {status === "err" && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: 8, padding: "12px 16px", marginBottom: 16,
              fontSize: 13, color: "#f87171",
            }}>
              Erro ao enviar. Verifique sua conexão e tente novamente.
            </div>
          )}

          <button className="btn" onClick={submit} disabled={loading} style={{ marginTop: 4 }}>
            {loading
              ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: `2px solid ${isDark ? "#151515" : "#fff"}`, borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} />
                  Confirmando...
                </span>
              : "Confirmar Presença"}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        <p className="eg" style={{ fontSize: 18, fontStyle: "italic", color: t.text3, textAlign: "center", marginTop: 28 }}>
          Deus abençoe!
        </p>
      </div>

      {showThanks && (
        <ThanksModal
          emoji="💍" isDark={isDark}
          title="Presença Confirmada!"
          msg="Obrigado pela confirmação! Mal podemos esperar para celebrar com você."
          onClose={() => setShowThanks(false)}
        />
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   MENSAGENS
══════════════════════════════════════════════════════════════ */
function Messages({ isDark }) {
  const t = isDark ? T.dark : T.light;
  const [f, setF] = useState({ guestName: "", whatsapp: "", content: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const up = patch => setF(p => ({ ...p, ...patch }));

  const submit = async () => {
    if (!f.guestName.trim() || !f.whatsapp.trim() || !f.content.trim()) { setStatus("fieldErr"); return; }
    setStatus(null);
    setLoading(true);
    const ok = await dbPost("messages", {
      guest_name: f.guestName.trim(), whatsapp: f.whatsapp.trim(),
      content: f.content.trim(), is_public: 0,
    });
    setLoading(false);
    if (ok) { setShowThanks(true); setF({ guestName: "", whatsapp: "", content: "" }); }
    else setStatus("err");
  };

  return (
    <section style={{ background: t.sectionAlt, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, padding: "72px 22px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <p className="s-label">Deixe seus Votos</p>
        <h2 className="s-title">Recados & Mensagens</h2>
        <div className="div-line" />

        <div className="card">
          <div style={{ marginBottom: 18 }}>
            <label>Seu Nome Completo *</label>
            <input value={f.guestName} onChange={e => { up({ guestName: e.target.value }); setStatus(null); }} placeholder="Digite seu nome completo"
              style={{ borderColor: status === "fieldErr" && !f.guestName.trim() ? "#ef4444" : undefined }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Seu WhatsApp *</label>
            <input value={f.whatsapp} onChange={e => { up({ whatsapp: e.target.value }); setStatus(null); }} placeholder="(11) 99999-9999"
              style={{ borderColor: status === "fieldErr" && !f.whatsapp.trim() ? "#ef4444" : undefined }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Sua Mensagem *</label>
            <textarea rows={5} value={f.content} onChange={e => { up({ content: e.target.value }); setStatus(null); }}
              placeholder="Deixe seus votos e bênçãos para os noivos..."
              style={{ borderColor: status === "fieldErr" && !f.content.trim() ? "#ef4444" : undefined }} />
            <p style={{ fontSize: 11, color: t.text3, marginTop: 6 }}>Esta mensagem é privada e será vista apenas pelos noivos.</p>
          </div>

          {status === "fieldErr" && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>
              Preencha todos os campos obrigatórios.
            </div>
          )}
          {status === "err" && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#f87171" }}>
              Erro ao enviar. Tente novamente.
            </div>
          )}

          <button className="btn" onClick={submit} disabled={loading}>
            {loading ? "Enviando..." : "Enviar Mensagem"}
          </button>
        </div>

        <div style={{
          marginTop: 16, background: isDark ? "rgba(59,130,246,0.07)" : "rgba(59,130,246,0.05)",
          border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "18px 20px", textAlign: "center",
        }}>
          <p style={{ fontSize: 14, color: t.text2, lineHeight: 1.65 }}>
            <strong style={{ color: t.text }}>Suas mensagens são privadas!</strong><br />
            <span style={{ fontSize: 13, color: t.text3, marginTop: 4, display: "block" }}>
              Apenas Thalita e Marcelo poderão ver seus votos e mensagens.
            </span>
          </p>
        </div>
      </div>

      {showThanks && (
        <ThanksModal
          emoji="💌" isDark={isDark}
          title="Mensagem Enviada!"
          msg="Obrigado pelo carinho! Sua mensagem foi recebida com muito amor."
          onClose={() => setShowThanks(false)}
        />
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════ */
function Footer({ isDark, onOpenDash }) {
  const t = isDark ? T.dark : T.light;
  return (
    <footer style={{
      borderTop: `1px solid ${t.border}`,
      padding: "64px 22px 48px", textAlign: "center", background: t.bg,
    }}>
      {/* Monograma — botão secreto */}
      <button
        onClick={onOpenDash}
        title="Área dos Noivos"
        style={{
          background: "transparent", border: "none",
          cursor: "pointer", display: "block", margin: "0 auto 24px",
          opacity: 0.35, transition: "opacity .25s", padding: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
        onMouseLeave={e => e.currentTarget.style.opacity = "0.35"}
      >
        <Monograma size={70} dark={isDark} />
      </button>

      <h2 className="ds" style={{ fontSize: 34, fontWeight: 400, color: t.text, marginBottom: 10 }}>
        Thalita e Marcelo
      </h2>
      <p className="eg" style={{ fontSize: 15, letterSpacing: "2px", color: t.text2, marginBottom: 32, textTransform: "uppercase" }}>
        20 de dezembro de 2026
      </p>

      <div className="div-line" />

      <p className="eg" style={{ fontSize: 16, fontStyle: "italic", color: t.text2, maxWidth: 420, margin: "0 auto 8px", lineHeight: 1.8 }}>
        "Para que todos vejam, e saibam, e considerem, e juntamente entendam que a mão do Senhor fez isso, e o Santo de Israel o criou."
      </p>
      <p className="eg" style={{ fontSize: 13, color: t.text3, marginBottom: 40 }}>Isaías 41:20</p>

      <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 28 }}>
        <p style={{ fontSize: 12, color: t.text3, letterSpacing: "0.5px" }}>
          © 2026 Casamento Thalita & Marcelo. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAINEL — LOGIN
══════════════════════════════════════════════════════════════ */
function NoivosLogin({ isDark, onSuccess, onClose }) {
  const t = isDark ? T.dark : T.light;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async e => {
    e.preventDefault(); setErr(""); setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    if (email === NOIVOS_EMAIL && password === NOIVOS_SENHA) onSuccess();
    else setErr("Email ou senha incorretos");
    setLoading(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 500, padding: 22,
    }} onClick={onClose}>
      <div style={{
        background: t.card, border: `1px solid ${t.border}`,
        borderRadius: 16, padding: "40px 32px", width: "100%", maxWidth: 400,
        boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <Monograma size={64} dark={isDark} />
        </div>
        <h2 className="eg" style={{ fontSize: 26, color: t.text, textAlign: "center", marginBottom: 28 }}>
          Área dos Noivos
        </h2>
        <form onSubmit={login}>
          <div style={{ marginBottom: 14 }}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label>Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {err && <p style={{ fontSize: 13, color: "#f87171", marginBottom: 14, textAlign: "center" }}>{err}</p>}
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancelar</button>
            <button type="submit" className="btn" style={{ flex: 1 }} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAINEL — DASHBOARD
══════════════════════════════════════════════════════════════ */
function NoivosDashboard({ isDark, onLogout }) {
  const t = isDark ? T.dark : T.light;
  const [tab, setTab] = useState("confirmacoes");
  const [rsvps, setRsvps] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dbGet("rsvp"), dbGet("messages")])
      .then(([r, m]) => { setRsvps(Array.isArray(r) ? r : []); setMsgs(Array.isArray(m) ? m : []); })
      .finally(() => setLoading(false));
  }, []);

  const confirmados = rsvps.filter(r => r.will_attend == 1).length;
  const naoConf = rsvps.length - confirmados;
  const pie = [
    { name: "Confirmados", value: confirmados, fill: "#3b82f6" },
    { name: "Não Confirmados", value: naoConf, fill: "#ef4444" },
  ];

  const exportCSV = () => {
    const rows = [["Nome", "WhatsApp", "Vai Confirmar", "Nº Acompanhantes", "Nomes"]];
    rsvps.forEach(r => rows.push([r.guest_name, r.whatsapp, r.will_attend ? "Sim" : "Não", r.num_guests, r.guest_names || "—"]));
    const csv = rows.map(r => r.map(c => `"${c ?? ""}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = "confirmacoes_presenca.csv"; a.click();
  };

  const Badge = ({ ok, yes, no }) => (
    <span style={{
      padding: "3px 10px", borderRadius: 99, fontSize: 11,
      background: ok ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
      color: ok ? "#6ee7b7" : "#fca5a5",
    }}>{ok ? yes : no}</span>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 500, padding: 14, overflowY: "auto",
    }}>
      <div style={{
        background: t.card, border: `1px solid ${t.border}`,
        borderRadius: 16, width: "100%", maxWidth: 920,
        maxHeight: "92vh", overflow: "auto",
        boxShadow: "0 30px 70px rgba(0,0,0,0.5)", margin: "auto",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 24px", borderBottom: `1px solid ${t.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: t.bg2, position: "sticky", top: 0, zIndex: 2,
          borderRadius: "16px 16px 0 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Monograma size={40} dark={isDark} />
            <span className="eg" style={{ fontSize: 18, color: t.text }}>
              {tab === "confirmacoes" ? "Confirmações de Presença" : "Recados & Mensagens"}
            </span>
          </div>
          <button onClick={onLogout} className="btn btn-outline" style={{ width: "auto", padding: "7px 16px", fontSize: 12 }}>
            Sair
          </button>
        </div>

        <div style={{ padding: "22px 22px 32px" }}>
          {/* Tabs */}
          <div style={{ display: "flex", marginBottom: 24, borderBottom: `1px solid ${t.border}` }}>
            {[["confirmacoes", "Confirmações"], ["recados", "Recados"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                padding: "11px 20px", border: "none", background: "transparent",
                cursor: "pointer", fontSize: 14, fontFamily: "Lato, sans-serif",
                color: tab === k ? "#3b82f6" : t.text2,
                borderBottom: tab === k ? "2px solid #3b82f6" : "2px solid transparent",
                fontWeight: tab === k ? 500 : 300,
                marginBottom: -1, transition: "color .2s",
              }}>{l}</button>
            ))}
          </div>

          {loading && <p style={{ textAlign: "center", color: t.text3, padding: 40 }}>Carregando...</p>}

          {!loading && tab === "confirmacoes" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <p style={{ fontSize: 13, color: t.text2 }}>
                  {rsvps.length} respostas · <span style={{ color: "#6ee7b7" }}>{confirmados} confirmados</span> · <span style={{ color: "#fca5a5" }}>{naoConf} não confirmados</span>
                </p>
                <button onClick={exportCSV} className="btn" style={{ width: "auto", padding: "8px 16px", fontSize: 12 }}>
                  ↓ Exportar para Excel
                </button>
              </div>
              <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${t.border}` }}>
                <table>
                  <thead>
                    <tr><th>Nome</th><th>WhatsApp</th><th>Confirmação</th><th>Acomp.</th><th>Nomes</th></tr>
                  </thead>
                  <tbody>
                    {rsvps.length === 0 && (
                      <tr><td colSpan={5} style={{ textAlign: "center", color: t.text3, padding: 36 }}>Nenhuma confirmação ainda</td></tr>
                    )}
                    {rsvps.map((r, i) => (
                      <tr key={i}>
                        <td style={{ color: t.text, fontWeight: 400 }}>{r.guest_name}</td>
                        <td>{r.whatsapp}</td>
                        <td><Badge ok={r.will_attend == 1} yes="Sim" no="Não" /></td>
                        <td>{r.num_guests || 0}</td>
                        <td style={{ color: t.text2 }}>{r.guest_names || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rsvps.length > 0 && (
                <div style={{ marginTop: 40, textAlign: "center" }}>
                  <p className="eg" style={{ fontSize: 20, color: t.text, marginBottom: 20 }}>Resumo de Confirmações</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={pie} cx="50%" cy="50%" outerRadius={95} dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                        {pie.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}

          {!loading && tab === "recados" && (
            <>
              <p style={{ fontSize: 13, color: t.text2, marginBottom: 14 }}>{msgs.length} mensagens recebidas</p>
              <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${t.border}` }}>
                <table>
                  <thead>
                    <tr><th>Nome</th><th>WhatsApp</th><th>Mensagem</th><th>Público</th></tr>
                  </thead>
                  <tbody>
                    {msgs.length === 0 && (
                      <tr><td colSpan={4} style={{ textAlign: "center", color: t.text3, padding: 36 }}>Nenhuma mensagem ainda</td></tr>
                    )}
                    {msgs.map((m, i) => (
                      <tr key={i}>
                        <td style={{ color: t.text, fontWeight: 400, whiteSpace: "nowrap" }}>{m.guest_name}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{m.whatsapp || "—"}</td>
                        <td style={{ maxWidth: 280, whiteSpace: "pre-wrap", lineHeight: 1.55 }}>{m.content}</td>
                        <td><Badge ok={m.is_public == 1} yes="Sim" no="Não" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════════════════ */
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const t = isDark ? T.dark : T.light;

  return (
    <>
      <style>{makeCSS(isDark)}</style>

      {/* Toggle Claro/Escuro — fixo no topo direito */}
      <button
        onClick={() => setIsDark(d => !d)}
        style={{
          position: "fixed", top: 14, right: 14, zIndex: 100,
          background: t.toggleBg, border: `1px solid ${t.toggleBorder}`,
          borderRadius: 99, padding: "8px 14px",
          cursor: "pointer", fontSize: 12,
          color: t.text2, fontFamily: "Lato, sans-serif",
          display: "flex", alignItems: "center", gap: 6,
          letterSpacing: ".5px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          transition: "background .3s, color .3s",
        }}
      >
        {isDark ? "☀ Claro" : "☾ Escuro"}
      </button>

      <Hero     isDark={isDark} />
      <Welcome  isDark={isDark} />
      <Location isDark={isDark} />
      <Gifts    isDark={isDark} />
      <RSVP     isDark={isDark} />
      <Messages isDark={isDark} />
      <Footer   isDark={isDark} onOpenDash={() => setShowLogin(true)} />

      {showLogin && !loggedIn && (
        <NoivosLogin
          isDark={isDark}
          onSuccess={() => { setShowLogin(false); setLoggedIn(true); }}
          onClose={() => setShowLogin(false)}
        />
      )}
      {loggedIn && (
        <NoivosDashboard isDark={isDark} onLogout={() => setLoggedIn(false)} />
      )}
    </>
  );
}
