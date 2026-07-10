"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  ArrowDownUp,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Check,
  ChevronDown,
  CircleCheck,
  Copy,
  Globe2,
  Info,
  Landmark,
  Menu,
  Moon,
  QrCode,
  ShieldCheck,
  Sun,
  Wallet,
  X,
  Zap,
} from "lucide-react";

type Theme = "light" | "cobalt";
type TradeMode = "buy" | "sell";
type AssetCode = "BTC" | "ETH" | "SOL" | "USDT_ERC" | "USDT_TRC" | "USDT_BEP" | "USDC_ERC" | "USDC_SOL" | "BNB" | "TRX" | "XRP" | "LTC" | "DOGE" | "ADA" | "POL" | "AVAX" | "BCH";
type FiatCode = "NGN" | "USD" | "GBP" | "EUR";

const WALLETS = {
  SOL: "8JQu9JCZr273JXxrBsV24NgfT6HDL8AJdMwkVPFfjkS3",
  ETH: "0x18b8e4f3ff38ba3fb4a279c365fa7a6379a6493c",
  BTC: "bc1pqlssf3ved0x785n8ljnuvc45ju3heall0tgk788mttlztq4cd9tq0jtgay",
  EVM: "0xe452e2656131cbc732e01aba9ef15a14db942df8",
  TRON: "TEY71Qje3nbpFDbiiCixTyFoieHKdc2HpK",
  USDC_SOL: "CHnSTG1cvPu6zPBUT7RgXaRoAoxMbzihjQiYT3CAheJ3",
  XRP: "rJn2zAPdFA193sixJwuFixRkYDUtx3apQh",
  LTC: "LMwwgvxUzJEMjUbgDX9RcvwYkMTUi9eDzK",
  DOGE: "DTVAs7SuwnMiGsJBPFwNoDKGb7cAaVWCkX",
  ADA: "addr1v9y2mzuayvtsnmlpz7ek4qlx9533uctenz93fl0gqp9n2jcvxyx8s",
  BCH: "1KqCH64Q6VSbJycqsgrD7hEtyemWSmdgD3",
} as const;

const assets = {
  BTC: {
    name: "Bitcoin",
    symbol: "₿",
    network: "Bitcoin",
    priceNgn: 103_400_000,
    wallet: WALLETS.BTC,
    color: "#f7931a",
  },
  ETH: {
    name: "Ethereum",
    symbol: "Ξ",
    network: "Ethereum (ERC-20)",
    priceNgn: 5_620_000,
    wallet: WALLETS.ETH,
    color: "#627eea",
  },
  SOL: {
    name: "Solana",
    symbol: "S",
    network: "Solana",
    priceNgn: 246_800,
    wallet: WALLETS.SOL,
    color: "#7b61ff",
  },
  USDT_ERC: {
    name: "USDT",
    symbol: "₮",
    network: "Ethereum (ERC-20)",
    priceNgn: 1_612,
    wallet: WALLETS.EVM,
    color: "#26a17b",
  },
  USDT_TRC: { name: "USDT", symbol: "₮", network: "TRON (TRC-20)", priceNgn: 1_612, wallet: WALLETS.TRON, color: "#ef0027" },
  USDT_BEP: { name: "USDT", symbol: "₮", network: "BNB Smart Chain (BEP-20)", priceNgn: 1_612, wallet: WALLETS.EVM, color: "#26a17b" },
  USDC_ERC: { name: "USDC", symbol: "$", network: "Ethereum (ERC-20)", priceNgn: 1_612, wallet: WALLETS.EVM, color: "#2775ca" },
  USDC_SOL: { name: "USDC", symbol: "$", network: "Solana", priceNgn: 1_612, wallet: WALLETS.USDC_SOL, color: "#2775ca" },
  BNB: { name: "BNB", symbol: "B", network: "BNB Smart Chain (BEP-20)", priceNgn: 1_090_000, wallet: WALLETS.EVM, color: "#f3ba2f" },
  TRX: { name: "TRON", symbol: "T", network: "TRON (TRC-20)", priceNgn: 510, wallet: WALLETS.TRON, color: "#ef0027" },
  XRP: { name: "XRP", symbol: "X", network: "XRP Ledger · Tag 501565036", priceNgn: 3_750, wallet: WALLETS.XRP, color: "#23292f" },
  LTC: { name: "Litecoin", symbol: "Ł", network: "Litecoin", priceNgn: 165_000, wallet: WALLETS.LTC, color: "#345d9d" },
  DOGE: { name: "Dogecoin", symbol: "Ð", network: "Dogecoin", priceNgn: 310, wallet: WALLETS.DOGE, color: "#c2a633" },
  ADA: { name: "Cardano", symbol: "A", network: "Cardano", priceNgn: 980, wallet: WALLETS.ADA, color: "#3468d4" },
  POL: { name: "Polygon", symbol: "P", network: "Polygon", priceNgn: 420, wallet: WALLETS.EVM, color: "#8247e5" },
  AVAX: { name: "Avalanche", symbol: "A", network: "Avalanche C-Chain", priceNgn: 38_000, wallet: WALLETS.EVM, color: "#e84142" },
  BCH: { name: "Bitcoin Cash", symbol: "B", network: "Bitcoin Cash", priceNgn: 810_000, wallet: WALLETS.BCH, color: "#0ac18e" },
} as const;

const fiats = {
  NGN: { name: "Nigerian naira", symbol: "₦", ngnPerUnit: 1 },
  USD: { name: "US dollar", symbol: "$", ngnPerUnit: 1_612 },
  GBP: { name: "British pound", symbol: "£", ngnPerUnit: 2_088 },
  EUR: { name: "Euro", symbol: "€", ngnPerUnit: 1_879 },
} as const;

const marketRows = [
  { code: "BTC", pair: "BTC/NGN", value: "₦103.4M", change: "+2.8%", up: true },
  { code: "ETH", pair: "ETH/NGN", value: "₦5.62M", change: "+1.4%", up: true },
  { code: "USDT_ERC", pair: "USDT/NGN", value: "₦1,612", change: "−0.2%", up: false },
] as const;

function cleanNumber(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatFiat(value: number, currency: FiatCode) {
  const maximumFractionDigits = currency === "NGN" ? 0 : 2;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits,
  }).format(value || 0);
}

function isStablecoin(code: AssetCode) {
  return code.startsWith("USDT") || code.startsWith("USDC");
}

function assetTicker(code: AssetCode) {
  return code.split("_")[0];
}

function feeForUsd(orderUsd: number, side: TradeMode) {
  const multiplier = side === "sell" ? 2 : 1;
  if (orderUsd <= 5) {
    const value = multiplier;
    return { kind: "fixed" as const, value, label: `$${value}` };
  }
  const value = 0.15 * multiplier;
  return { kind: "rate" as const, value, label: `${value * 100}%` };
}

function AssetMark({ code, size = "md" }: { code: AssetCode; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      className={`asset-mark asset-mark-${size}`}
      style={{ "--asset": assets[code].color } as React.CSSProperties}
      aria-hidden="true"
    >
      {assets[code].symbol}
    </span>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mode, setMode] = useState<TradeMode>("buy");
  const [assetCode, setAssetCode] = useState<AssetCode>("BTC");
  const [fiatCode, setFiatCode] = useState<FiatCode>("NGN");
  const [amount, setAmount] = useState("500000");
  const [assetMenu, setAssetMenu] = useState(false);
  const [fiatMenu, setFiatMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [sellWalletOpen, setSellWalletOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrData, setQrData] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const selectedAsset = assets[assetCode];
  const selectedFiat = fiats[fiatCode];

  useEffect(() => {
    const stored = window.localStorage.getItem("lrda99-theme");
    if (stored === "cobalt" || stored === "light") {
      const timer = window.setTimeout(() => setTheme(stored), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("lrda99-theme", theme);
  }, [theme]);

  useEffect(() => {
    let live = true;
    QRCode.toDataURL(selectedAsset.wallet, {
      width: 220,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#07132f", light: "#ffffff" },
    }).then((url) => live && setQrData(url));
    return () => {
      live = false;
    };
  }, [selectedAsset.wallet]);

  useEffect(() => {
    if (!reviewOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setReviewOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reviewOpen]);

  const quote = useMemo(() => {
    const numericAmount = cleanNumber(amount);
    if (mode === "buy") {
      const ngnValue = numericAmount * selectedFiat.ngnPerUnit;
      const orderUsd = ngnValue / fiats.USD.ngnPerUnit;
      const tier = feeForUsd(orderUsd, mode);
      const feeNgn = tier.kind === "fixed" ? tier.value * fiats.USD.ngnPerUnit : ngnValue * tier.value;
      return Math.max(0, ngnValue - feeNgn) / selectedAsset.priceNgn;
    }
    const ngnValue = numericAmount * selectedAsset.priceNgn;
    const orderUsd = ngnValue / fiats.USD.ngnPerUnit;
    const tier = feeForUsd(orderUsd, mode);
    const grossFiat = ngnValue / selectedFiat.ngnPerUnit;
    const fixedFee = (tier.value * fiats.USD.ngnPerUnit) / selectedFiat.ngnPerUnit;
    return Math.max(0, grossFiat - (tier.kind === "fixed" ? fixedFee : grossFiat * tier.value));
  }, [amount, mode, selectedAsset.priceNgn, selectedFiat.ngnPerUnit]);

  const feeDetails = useMemo(() => {
    const numericAmount = cleanNumber(amount);
    const orderNgn = mode === "buy" ? numericAmount * selectedFiat.ngnPerUnit : numericAmount * selectedAsset.priceNgn;
    const tier = feeForUsd(orderNgn / fiats.USD.ngnPerUnit, mode);
    const feeNgn = tier.kind === "fixed" ? tier.value * fiats.USD.ngnPerUnit : orderNgn * tier.value;
    return { amount: feeNgn / selectedFiat.ngnPerUnit, label: tier.label };
  }, [amount, mode, selectedAsset.priceNgn, selectedFiat.ngnPerUnit]);

  const whatsappUrl = useMemo(() => {
    const action = mode === "buy" ? "BUY" : "SELL";
    const pay = mode === "buy" ? `${amount} ${fiatCode}` : `${amount} ${assetTicker(assetCode)}`;
    const receive = mode === "buy" ? `${quote.toFixed(isStablecoin(assetCode) ? 2 : 6)} ${assetTicker(assetCode)}` : formatFiat(quote, fiatCode);
    const message = `Hello LRDA99 XCHANGE, I want to ${action}.\nOrder: ${pay}\nEstimated receive: ${receive}\nNetwork: ${selectedAsset.network}\nFee tier: ${feeDetails.label}\nPlease confirm the current rate, minimum deposit and my order reference.`;
    return `https://wa.me/2348079222519?text=${encodeURIComponent(message)}`;
  }, [mode, amount, fiatCode, assetCode, quote, selectedAsset.network, feeDetails.label]);

  const setTradeMode = (next: TradeMode) => {
    setMode(next);
    setAmount(next === "buy" ? "500000" : "0.05");
    setSellWalletOpen(false);
  };

  const chooseAsset = (code: AssetCode) => {
    setAssetCode(code);
    setAssetMenu(false);
    setSellWalletOpen(false);
  };

  const copyWallet = async () => {
    try {
      await navigator.clipboard.writeText(selectedAsset.wallet);
    } catch {
      const input = document.createElement("textarea");
      input.value = selectedAsset.wallet;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const handlePrimary = () => {
    if (!cleanNumber(amount)) return;
    if (mode === "sell") setSellWalletOpen(true);
    else setReviewOpen(true);
  };

  const submitOrder = async () => {
    setFormError("");
    if (customerName.trim().length < 2 || !/^\+?[0-9]{10,15}$/.test(customerPhone.trim()) || !termsAccepted) {
      setFormError("Enter your name and phone number, then accept the terms.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          side: mode.toUpperCase(), asset: assetTicker(assetCode), network: selectedAsset.network, fiat: fiatCode,
          inputAmount: cleanNumber(amount), estimatedOutput: quote, estimatedFee: feeDetails.amount,
          feeLabel: feeDetails.label, walletAddress, customerName, customerPhone, customerEmail,
          termsAccepted, website: ""
        })
      });
      const result = await response.json() as { order?: { reference?: string }; error?: string };
      if (!response.ok || !result.order?.reference) throw new Error(result.error || "Order could not be created");
      const separator = whatsappUrl.includes("?") ? "%0A" : "?text=";
      window.open(`${whatsappUrl}${separator}${encodeURIComponent(`Order reference: ${result.order.reference}`)}`, "_blank", "noopener,noreferrer");
      setReviewOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to create the order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="site-shell">
      <div className="topbar">
        <span><BadgeCheck size={15} /> Fast NGN settlements</span>
        <span>Rates are indicative and confirmed before transfer</span>
      </div>

      <header className="header container">
        <a className="brand" href="#top" aria-label="LRDA99 XCHANGE home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><b>99</b></span>
          <span className="brand-text">LRDA<span>99</span> <em>XCHANGE</em></span>
        </a>

        <nav className={mobileMenu ? "nav nav-open" : "nav"} aria-label="Primary navigation">
          <a href="#markets" onClick={() => setMobileMenu(false)}>Markets</a>
          <a href="#trade" onClick={() => setMobileMenu(false)}>Buy / Sell</a>
          <a href="#how-it-works" onClick={() => setMobileMenu(false)}>How it works</a>
          <a href="#support" onClick={() => setMobileMenu(false)}>Support</a>
        </nav>

        <div className="header-actions">
          <div className="theme-switch" aria-label="Choose appearance">
            <button
              className={theme === "light" ? "active" : ""}
              onClick={() => setTheme("light")}
              aria-pressed={theme === "light"}
              title="Light mode"
            ><Sun size={16} /><span>Light</span></button>
            <button
              className={theme === "cobalt" ? "active" : ""}
              onClick={() => setTheme("cobalt")}
              aria-pressed={theme === "cobalt"}
              title="Cobalt mode"
            ><Moon size={16} /><span>Cobalt</span></button>
          </div>
          <a className="header-cta" href="#trade">Start trading <ArrowRight size={17} /></a>
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation">
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="hero container" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><Zap size={15} /> Buy and sell across currencies</div>
          <h1>Move between <span>crypto</span> and cash, confidently.</h1>
          <p>Buy and sell supported crypto with NGN, USD, GBP or EUR. Manual confirmation, transparent tiered fees, and direct human support.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#trade">Buy crypto <ArrowRight size={18} /></a>
            <a className="button button-secondary" href="#markets">View live-style rates</a>
          </div>
          <div className="trust-row" aria-label="Trading benefits">
            <span><ShieldCheck size={18} /> Network-checked wallets</span>
            <span><Globe2 size={18} /> 4 fiat currencies</span>
            <span><Banknote size={18} /> Bank settlement</span>
          </div>
        </div>

        <div className="hero-visual" id="trade">
          <div className="orb orb-one" aria-hidden="true" />
          <div className="orb orb-two" aria-hidden="true" />
          <section className="trade-card" aria-label="Crypto quote calculator">
            <div className="trade-card-head">
              <div>
                <span className="card-kicker">Instant quote</span>
                <h2>{mode === "buy" ? "Buy crypto" : "Sell crypto"}</h2>
              </div>
              <span className="secure-chip"><ShieldCheck size={15} /> Secure</span>
            </div>

            <div className="trade-tabs" role="tablist" aria-label="Trade direction">
              <button role="tab" aria-selected={mode === "buy"} className={mode === "buy" ? "active" : ""} onClick={() => setTradeMode("buy")}>Buy</button>
              <button role="tab" aria-selected={mode === "sell"} className={mode === "sell" ? "active" : ""} onClick={() => setTradeMode("sell")}>Sell</button>
            </div>

            <div className="quote-field">
              <label>{mode === "buy" ? "You pay" : "You send"}</label>
              <div className="amount-row">
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ""))}
                  inputMode="decimal"
                  aria-label={mode === "buy" ? "Amount to pay" : "Crypto amount to sell"}
                />
                {mode === "buy" ? (
                  <div className="select-wrap">
                    <button className="currency-button" onClick={() => setFiatMenu(!fiatMenu)} aria-expanded={fiatMenu}>
                      <span className="fiat-mark">{selectedFiat.symbol}</span>{fiatCode}<ChevronDown size={16} />
                    </button>
                    {fiatMenu && (
                      <div className="select-menu select-menu-right">
                        {(Object.keys(fiats) as FiatCode[]).map((code) => (
                          <button key={code} onClick={() => { setFiatCode(code); setFiatMenu(false); }}>
                            <span className="fiat-mark">{fiats[code].symbol}</span><span><strong>{code}</strong><small>{fiats[code].name}</small></span>{code === fiatCode && <Check size={16} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="select-wrap">
                    <button className="currency-button" onClick={() => setAssetMenu(!assetMenu)} aria-expanded={assetMenu}>
                      <AssetMark code={assetCode} size="sm" />{assetTicker(assetCode)}<ChevronDown size={16} />
                    </button>
                    {assetMenu && (
                      <div className="select-menu select-menu-right">
                        {(Object.keys(assets) as AssetCode[]).map((code) => (
                          <button key={code} onClick={() => chooseAsset(code)}>
                            <AssetMark code={code} size="sm" /><span><strong>{assetTicker(code)}</strong><small>{assets[code].network}</small></span>{code === assetCode && <Check size={16} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="swap-line"><span /><button aria-label="Switch trade direction" onClick={() => setTradeMode(mode === "buy" ? "sell" : "buy")}><ArrowDownUp size={17} /></button><span /></div>

            <div className="quote-field">
              <label>{mode === "buy" ? "You receive" : "You receive"}</label>
              <div className="amount-row amount-output">
                <output>{mode === "buy" ? quote.toFixed(isStablecoin(assetCode) ? 2 : 6) : formatFiat(quote, fiatCode)}</output>
                {mode === "buy" ? (
                  <div className="select-wrap">
                    <button className="currency-button" onClick={() => setAssetMenu(!assetMenu)} aria-expanded={assetMenu}>
                      <AssetMark code={assetCode} size="sm" />{assetTicker(assetCode)}<ChevronDown size={16} />
                    </button>
                    {assetMenu && (
                      <div className="select-menu select-menu-right">
                        {(Object.keys(assets) as AssetCode[]).map((code) => (
                          <button key={code} onClick={() => chooseAsset(code)}>
                            <AssetMark code={code} size="sm" /><span><strong>{assetTicker(code)}</strong><small>{assets[code].network}</small></span>{code === assetCode && <Check size={16} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="select-wrap">
                    <button className="currency-button" onClick={() => setFiatMenu(!fiatMenu)} aria-expanded={fiatMenu}>
                      <span className="fiat-mark">{selectedFiat.symbol}</span>{fiatCode}<ChevronDown size={16} />
                    </button>
                    {fiatMenu && (
                      <div className="select-menu select-menu-right">
                        {(Object.keys(fiats) as FiatCode[]).map((code) => (
                          <button key={code} onClick={() => { setFiatCode(code); setFiatMenu(false); }}>
                            <span className="fiat-mark">{fiats[code].symbol}</span><span><strong>{code}</strong><small>{fiats[code].name}</small></span>{code === fiatCode && <Check size={16} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="quote-meta">
              <span>1 {assetTicker(assetCode)} ≈ {formatFiat(selectedAsset.priceNgn / selectedFiat.ngnPerUnit, fiatCode)}</span>
              <span>Fee {feeDetails.label} · {formatFiat(feeDetails.amount, fiatCode)}</span>
            </div>

            <div className="payment-line">
              <span><Landmark size={17} /> {mode === "buy" ? "Pay by bank transfer" : `Receive ${fiatCode} by bank`}</span>
              <span className="available"><i /> Available</span>
            </div>

            <button className="review-button" onClick={handlePrimary} disabled={!cleanNumber(amount)}>
              {mode === "buy" ? "Review buy order" : "Get receiving wallet"}<ArrowRight size={18} />
            </button>
            <p className="microcopy"><ShieldCheck size={14} /> Your quote is confirmed before any payment or transfer.</p>

            {sellWalletOpen && mode === "sell" && (
              <div className="wallet-panel" aria-live="polite">
                <div className="wallet-panel-head">
                  <div><span className="card-kicker">Send {assetTicker(assetCode)} via</span><strong>{selectedAsset.network}</strong></div>
                  <button onClick={() => setSellWalletOpen(false)} aria-label="Close receiving wallet"><X size={18} /></button>
                </div>
                <div className="wallet-panel-grid">
                  <div className="qr-box">{qrData ? (
                    // QR codes are generated locally as data URLs; image optimization is not applicable.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrData} alt={`${assetTicker(assetCode)} receiving wallet QR code`} />
                  ) : <QrCode size={76} />}</div>
                  <div className="wallet-address-wrap">
                    <small>LRDA99 receiving wallet</small>
                    <code>{selectedAsset.wallet}</code>
                    <button onClick={copyWallet}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied" : "Copy address"}</button>
                  </div>
                </div>
                <div className="network-warning"><Info size={17} /><span>Send only <strong>{assetTicker(assetCode)}</strong> on the <strong>{selectedAsset.network}</strong> network. Sending on another network may permanently lose your funds.</span></div>
                {assetCode === "XRP" && <div className="network-warning"><Info size={17} /><span>XRP destination tag is required: <strong>501565036</strong>.</span></div>}
                <p className="microcopy">Do not transfer until support confirms the current minimum deposit and your order reference.</p>
                <a className="review-button" href={whatsappUrl} target="_blank" rel="noreferrer">Confirm order on WhatsApp <ArrowRight size={18} /></a>
              </div>
            )}
          </section>
        </div>
      </section>

      <section className="manual-info container" id="how-it-works">
        <article><span>01</span><h3>Request a quote</h3><p>Select the asset, network and amount. Rates remain indicative until manually confirmed.</p></article>
        <article><span>02</span><h3>Confirm on WhatsApp</h3><p>We confirm the rate, fee, current minimum deposit and the correct transfer details.</p></article>
        <article><span>03</span><h3>Settle securely</h3><p>Complete the approved transfer and send proof with your unique order reference.</p></article>
      </section>

      <section className="support-card container" id="support">
        <div><span className="card-kicker">Manual OTC support</span><h2>Need another token or network?</h2><p>Message LRDA99 XCHANGE before transferring. Never send funds to an address that has not been confirmed for your exact network.</p></div>
        <a className="button button-primary" href="https://wa.me/2348079222519" target="_blank" rel="noreferrer">WhatsApp 08079222519 <ArrowRight size={18} /></a>
        <a href="mailto:LRDA991119@gmail.com">LRDA991119@gmail.com</a>
      </section>

      <section className="market-strip" id="markets" aria-label="Market rates">
        <div className="container market-strip-inner">
          {marketRows.map((market) => (
            <article className="market-cell" key={market.code}>
              <AssetMark code={market.code} />
              <div><span>{market.pair}</span><strong>{market.value}</strong></div>
              <div className="sparkline" aria-hidden="true"><i /><i /><i /><i /><i /></div>
              <span className={market.up ? "change up" : "change down"}>{market.change}</span>
            </article>
          ))}
        </div>
      </section>

      {reviewOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setReviewOpen(false)}>
          <section className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setReviewOpen(false)} aria-label="Close order review"><X size={20} /></button>
            <span className="modal-icon"><Wallet size={24} /></span>
            <span className="card-kicker">Review your quote</span>
            <h2 id="order-title">Buy {assetTicker(assetCode)}</h2>
            <div className="order-summary">
              <div><span>You pay</span><strong>{formatFiat(cleanNumber(amount), fiatCode)}</strong></div>
              <div><span>You receive</span><strong>{quote.toFixed(isStablecoin(assetCode) ? 2 : 6)} {assetTicker(assetCode)}</strong></div>
              <div><span>Network</span><strong>{selectedAsset.network}</strong></div>
              <div><span>Estimated fee</span><strong>{feeDetails.label} · {formatFiat(feeDetails.amount, fiatCode)}</strong></div>
            </div>
            <div className="bank-options">
              <strong>Approved NGN payment accounts</strong>
              <span>OPay · 8079222519</span>
              <span>Kuda · 2010698158</span>
              <small>Account name must display LAWAL ROSHEED OLATUNJI. Do not pay until your order is confirmed.</small>
            </div>
            <div className="customer-fields">
              <label>Full name<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} autoComplete="name" maxLength={100} /></label>
              <label>Phone number<input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value.replace(/[^+0-9]/g, ""))} autoComplete="tel" inputMode="tel" placeholder="08012345678" maxLength={16} /></label>
              <label>Email (optional)<input value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} autoComplete="email" type="email" maxLength={254} /></label>
              {mode === "buy" && <label>Receiving wallet address<input value={walletAddress} onChange={(event) => setWalletAddress(event.target.value)} autoComplete="off" maxLength={160} /></label>}
              <label className="terms-check"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} /> I understand the quote and minimum deposit must be confirmed before I transfer.</label>
            </div>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <div className="modal-note"><CircleCheck size={18} /><span>Your final rate, current minimum and payment reference will be confirmed before transfer.</span></div>
            <button className="review-button" onClick={submitOrder} disabled={submitting}>{submitting ? "Creating order…" : "Create order and continue to WhatsApp"} <ArrowRight size={18} /></button>
            <p className="microcopy">No payment is taken on this screen.</p>
          </section>
        </div>
      )}

      {copied && <div className="toast"><Check size={16} /> Wallet address copied</div>}
    </main>
  );
}
