"use client";

import { useEffect, useRef } from "react";
import { initPeel } from "@/lib/demo-footer-peel";
import {
  initHolo,
  initFitText,
  initWeightHover,
  initTime,
  initToTop,
} from "@/lib/demo-footer-effects";

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = footerRef.current;
    if (!root) return;

    const cleanupPeel = initPeel(root);
    const cleanupHolo = initHolo(root);
    const cleanupFit = initFitText(root);
    const cleanupWeight = initWeightHover(root);
    const cleanupTime = initTime(root);
    const cleanupToTop = initToTop(root);

    return () => {
      cleanupPeel?.();
      cleanupHolo?.();
      cleanupFit?.();
      cleanupWeight?.();
      cleanupTime?.();
      cleanupToTop?.();
    };
  }, []);

  return (
    <footer ref={footerRef} className="footer site-footer" id="site-footer" data-astro-cid-jo6i4kqk>
  <div className="hello-wrap" data-astro-cid-jo6i4kqk>
    <a className="hello" href="mailto:nosmallthing.limited@gmail.com" aria-label="Email nosmallthing.limited@gmail.com" data-astro-cid-jo6i4kqk>
      <span className="hello-text" data-fit-text data-weight-hover data-weight-rest="900" data-weight-near="200" data-radius="380" data-astro-cid-jo6i4kqk>SAY HELLO</span>
    </a>
    {/*  Stickers around the headline: holographic by default, flat colored on the comparison page  */}
    <div className="sticker f-reply" style={{ left: "3%", top: "14%", "--rot": "-8deg", animationDelay: "0.2s" } as React.CSSProperties} aria-hidden="true" data-sticker data-astro-cid-mqob2q4p>
      <div className="peel-box" data-peel data-astro-cid-mqob2q4p>
        <div className="peel-top" data-astro-cid-mqob2q4p>
          <div className="art" data-art data-astro-cid-mqob2q4p>
            <span className="holo dark" data-holo style={{ width: "240px", height: "52px" } as React.CSSProperties} data-astro-cid-syr6i6or>
              <svg viewBox="0 0 293.6 64" width="240" height="52" aria-hidden="true" data-astro-cid-syr6i6or>
                <defs data-astro-cid-syr6i6or>
                  <linearGradient id="holo-5t9bno5-foil" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="176.16" y2="38.4" spreadMethod="reflect" data-foil data-astro-cid-syr6i6or>
                    <stop offset="0" stopColor="#ed4a1c" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.16666666666666666" stopColor="#ff6a3d" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.3333333333333333" stopColor="#ff8f5e" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.5" stopColor="#ff4f7a" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.6666666666666666" stopColor="#ed4a1c" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.8333333333333334" stopColor="#ff7a3d" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="1" stopColor="#ed4a1c" data-astro-cid-syr6i6or>
                    </stop>
                  </linearGradient>
                  <radialGradient id="holo-5t9bno5-shine" gradientUnits="userSpaceOnUse" cx="146.8" cy="32" r="132.12" data-shine data-astro-cid-syr6i6or>
                    <stop offset="0" stopColor="#fff" stopOpacity="0.7" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="1" stopColor="#fff" stopOpacity="0" data-astro-cid-syr6i6or>
                    </stop>
                  </radialGradient>
                  <g id="holo-5t9bno5-shape" data-astro-cid-syr6i6or>
                    <rect x="6" y="6" width="281.6" height="52" rx="26"/>
                  </g>
                </defs>
                {/*  White die-cut border, foil, moving shine, then the drawing  */}
                <use href="#holo-5t9bno5-shape" className="border" data-astro-cid-syr6i6or>
                </use>
                <use href="#holo-5t9bno5-shape" style={{ fill: "url(#holo-5t9bno5-foil)" } as React.CSSProperties} data-astro-cid-syr6i6or>
                </use>
                <use href="#holo-5t9bno5-shape" className="shine" style={{ fill: "url(#holo-5t9bno5-shine)" } as React.CSSProperties} data-astro-cid-syr6i6or>
                </use>
                <g data-astro-cid-syr6i6or>
                  <text className="ink-t pill-t" x="146.8" y="40" textAnchor="middle">Replies within 24h</text>
                </g>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="sticker f-bubble" style={{ right: "4%", top: "6%", "--rot": "10deg", animationDelay: "0.35s" } as React.CSSProperties} aria-hidden="true" data-sticker data-astro-cid-mqob2q4p>
      <div className="peel-box" data-peel data-astro-cid-mqob2q4p>
        <div className="peel-top" data-astro-cid-mqob2q4p>
          <div className="art" data-art data-astro-cid-mqob2q4p>
            <span className="holo dark" data-holo style={{ width: "112px", height: "93px" } as React.CSSProperties} data-astro-cid-syr6i6or>
              <svg viewBox="0 0 120 100" width="112" height="93" aria-hidden="true" data-astro-cid-syr6i6or>
                <defs data-astro-cid-syr6i6or>
                  <linearGradient id="holo-3kjssb9-foil" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="72" y2="60" spreadMethod="reflect" data-foil data-astro-cid-syr6i6or>
                    <stop offset="0" stopColor="#2e90fa" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.16666666666666666" stopColor="#5aa8ff" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.3333333333333333" stopColor="#8f7bff" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.5" stopColor="#2e90fa" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.6666666666666666" stopColor="#4fc0ff" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.8333333333333334" stopColor="#4f7dff" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="1" stopColor="#2e90fa" data-astro-cid-syr6i6or>
                    </stop>
                  </linearGradient>
                  <radialGradient id="holo-3kjssb9-shine" gradientUnits="userSpaceOnUse" cx="60" cy="50" r="54" data-shine data-astro-cid-syr6i6or>
                    <stop offset="0" stopColor="#fff" stopOpacity="0.7" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="1" stopColor="#fff" stopOpacity="0" data-astro-cid-syr6i6or>
                    </stop>
                  </radialGradient>
                  <g id="holo-3kjssb9-shape" data-astro-cid-syr6i6or>
                    <path d="M60 6c28.799999999999997 0 52 14 52 36s-23.200000000000003 36-52 36c-6 0-12-1-17-2L21.599999999999998 96l4-20C14 70 8 58 8 42 8 20 31.200000000000003 6 60 6z"/>
                  </g>
                </defs>
                {/*  White die-cut border, foil, moving shine, then the drawing  */}
                <use href="#holo-3kjssb9-shape" className="border" data-astro-cid-syr6i6or>
                </use>
                <use href="#holo-3kjssb9-shape" style={{ fill: "url(#holo-3kjssb9-foil)" } as React.CSSProperties} data-astro-cid-syr6i6or>
                </use>
                <use href="#holo-3kjssb9-shape" className="shine" style={{ fill: "url(#holo-3kjssb9-shine)" } as React.CSSProperties} data-astro-cid-syr6i6or>
                </use>
                <g data-astro-cid-syr6i6or>
                  <text className="ink-t" x="60" y="52" textAnchor="middle">hey!</text>
                </g>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="sticker f-open" style={{ left: "40%", bottom: "2%", "--rot": "-5deg", animationDelay: "0.5s" } as React.CSSProperties} aria-hidden="true" data-sticker data-astro-cid-mqob2q4p>
      <div className="peel-box" data-peel data-astro-cid-mqob2q4p>
        <div className="peel-top" data-astro-cid-mqob2q4p>
          <div className="art" data-art data-astro-cid-mqob2q4p>
            <span className="holo" data-holo style={{ width: "272px", height: "52px" } as React.CSSProperties} data-astro-cid-syr6i6or>
              <svg viewBox="0 0 333.2 64" width="272" height="52" aria-hidden="true" data-astro-cid-syr6i6or>
                <defs data-astro-cid-syr6i6or>
                  <linearGradient id="holo-zcf1iaj-foil" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="199.92" y2="38.4" spreadMethod="reflect" data-foil data-astro-cid-syr6i6or>
                    <stop offset="0" stopColor="#c6f432" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.16666666666666666" stopColor="#e8ff8a" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.3333333333333333" stopColor="#7ff0b0" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.5" stopColor="#c6f432" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.6666666666666666" stopColor="#f5ffb8" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.8333333333333334" stopColor="#a8f05a" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="1" stopColor="#c6f432" data-astro-cid-syr6i6or>
                    </stop>
                  </linearGradient>
                  <radialGradient id="holo-zcf1iaj-shine" gradientUnits="userSpaceOnUse" cx="166.6" cy="32" r="149.94" data-shine data-astro-cid-syr6i6or>
                    <stop offset="0" stopColor="#fff" stopOpacity="0.95" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="1" stopColor="#fff" stopOpacity="0" data-astro-cid-syr6i6or>
                    </stop>
                  </radialGradient>
                  <g id="holo-zcf1iaj-shape" data-astro-cid-syr6i6or>
                    <rect x="6" y="6" width="321.2" height="52" rx="26"/>
                  </g>
                </defs>
                {/*  White die-cut border, foil, moving shine, then the drawing  */}
                <use href="#holo-zcf1iaj-shape" className="border" data-astro-cid-syr6i6or>
                </use>
                <use href="#holo-zcf1iaj-shape" style={{ fill: "url(#holo-zcf1iaj-foil)" } as React.CSSProperties} data-astro-cid-syr6i6or>
                </use>
                <use href="#holo-zcf1iaj-shape" className="shine" style={{ fill: "url(#holo-zcf1iaj-shine)" } as React.CSSProperties} data-astro-cid-syr6i6or>
                </use>
                <g data-astro-cid-syr6i6or>
                  <text className="ink-t pill-t" x="166.6" y="40" textAnchor="middle">Open for new projects</text>
                </g>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="sticker f-star" style={{ right: "18%", bottom: "8%", "--rot": "14deg", animationDelay: "0.65s" } as React.CSSProperties} aria-hidden="true" data-sticker data-astro-cid-mqob2q4p>
      <div className="peel-box" data-peel data-astro-cid-mqob2q4p>
        <div className="peel-top" data-astro-cid-mqob2q4p>
          <div className="art" data-art data-astro-cid-mqob2q4p>
            <span className="holo" data-holo style={{ width: "84px", height: "84px" } as React.CSSProperties} data-astro-cid-syr6i6or>
              <svg viewBox="0 0 120 120" width="84" height="84" aria-hidden="true" data-astro-cid-syr6i6or>
                <defs data-astro-cid-syr6i6or>
                  <linearGradient id="holo-ewar0pj-foil" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="72" y2="72" spreadMethod="reflect" data-foil data-astro-cid-syr6i6or>
                    <stop offset="0" stopColor="#ff7ac6" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.16666666666666666" stopColor="#ffb0de" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.3333333333333333" stopColor="#c9a6ff" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.5" stopColor="#ff7ac6" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.6666666666666666" stopColor="#ffd0ec" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="0.8333333333333334" stopColor="#ff8fb3" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="1" stopColor="#ff7ac6" data-astro-cid-syr6i6or>
                    </stop>
                  </linearGradient>
                  <radialGradient id="holo-ewar0pj-shine" gradientUnits="userSpaceOnUse" cx="60" cy="60" r="54" data-shine data-astro-cid-syr6i6or>
                    <stop offset="0" stopColor="#fff" stopOpacity="0.95" data-astro-cid-syr6i6or>
                    </stop>
                    <stop offset="1" stopColor="#fff" stopOpacity="0" data-astro-cid-syr6i6or>
                    </stop>
                  </radialGradient>
                  <g id="holo-ewar0pj-shape" data-astro-cid-syr6i6or>
                    <path d="M60.0 6.0 L74.1 40.6 L111.4 43.3 L82.8 67.4 L91.7 103.7 L60.0 84.0 L28.3 103.7 L37.2 67.4 L8.6 43.3 L45.9 40.6z"/>
                  </g>
                </defs>
                {/*  White die-cut border, foil, moving shine, then the drawing  */}
                <use href="#holo-ewar0pj-shape" className="border" data-astro-cid-syr6i6or>
                </use>
                <use href="#holo-ewar0pj-shape" style={{ fill: "url(#holo-ewar0pj-foil)" } as React.CSSProperties} data-astro-cid-syr6i6or>
                </use>
                <use href="#holo-ewar0pj-shape" className="shine" style={{ fill: "url(#holo-ewar0pj-shine)" } as React.CSSProperties} data-astro-cid-syr6i6or>
                </use>
                <g data-astro-cid-syr6i6or>
                </g>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="grid" data-astro-cid-jo6i4kqk>
    <div className="cell contact" data-astro-cid-jo6i4kqk>
      <p className="label" data-astro-cid-jo6i4kqk>BEGIN WITH US</p>
      <a className="big-link" href="mailto:nosmallthing.limited@gmail.com" data-astro-cid-jo6i4kqk>nosmallthing.limited@gmail.com</a>
      <a className="call" href="https://cal.com/no-small-thing-ejfl44/quick-chat" target="_blank" rel="noopener" data-astro-cid-jo6i4kqk>Book a 15 min call<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" data-astro-cid-jo6i4kqk>
      <path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-astro-cid-jo6i4kqk>
      </path>
    </svg>
  </a>
</div>
<div className="cell" data-astro-cid-jo6i4kqk>
  <p className="label" data-astro-cid-jo6i4kqk>Pages</p>
  <ul className="list" data-astro-cid-jo6i4kqk>
    <li data-astro-cid-jo6i4kqk>
      <a href="/" data-astro-cid-jo6i4kqk>Home</a>
    </li>
    <li data-astro-cid-jo6i4kqk>
      <a href="/#work" data-astro-cid-jo6i4kqk>Work</a>
    </li>
    <li data-astro-cid-jo6i4kqk>
      <a href="/studio" data-astro-cid-jo6i4kqk>About</a>
    </li>
    <li data-astro-cid-jo6i4kqk>
      <a href="/#creative" data-astro-cid-jo6i4kqk>Creative</a>
    </li>
    <li data-astro-cid-jo6i4kqk>
      <a href="/#contact" data-astro-cid-jo6i4kqk>Contact</a>
    </li>
  </ul>
</div>
<div className="cell" data-astro-cid-jo6i4kqk>
  <p className="label" data-astro-cid-jo6i4kqk>Services</p>
  <ul className="small-list" data-astro-cid-jo6i4kqk>
    <li data-astro-cid-jo6i4kqk>demo1</li>
    <li data-astro-cid-jo6i4kqk>demo2</li>
    <li data-astro-cid-jo6i4kqk>demo3</li>
    <li data-astro-cid-jo6i4kqk>demo4</li>
    <li data-astro-cid-jo6i4kqk>demo5</li>
    <li data-astro-cid-jo6i4kqk>demo6</li>
    <li data-astro-cid-jo6i4kqk>demo7</li>
  </ul>
</div>
<div className="cell" data-astro-cid-jo6i4kqk>
  <p className="label" data-astro-cid-jo6i4kqk>Social</p>
  <ul className="list" data-astro-cid-jo6i4kqk>
    <li data-astro-cid-jo6i4kqk>
      <a href="https://www.linkedin.com/in/no-small-thing-987899445/" target="_blank" rel="noopener" data-astro-cid-jo6i4kqk>LinkedIn</a>
    </li>
    <li data-astro-cid-jo6i4kqk>
      <a href="#" onClick={(e) => e.preventDefault()} data-astro-cid-jo6i4kqk>X</a>
    </li>
    <li data-astro-cid-jo6i4kqk>
      <a href="https://www.instagram.com/nosmallthing.limited/" target="_blank" rel="noopener" data-astro-cid-jo6i4kqk>Instagram</a>
    </li>
    <li data-astro-cid-jo6i4kqk>
      <a href="https://facebook.com" target="_blank" rel="noopener" data-astro-cid-jo6i4kqk>faceboook</a>
    </li>
    <li data-astro-cid-jo6i4kqk>
      <a href="https://www.xiaohongshu.com" target="_blank" rel="noopener" data-astro-cid-jo6i4kqk>小红书</a>
    </li>
  </ul>
</div>
<div className="cell" data-astro-cid-jo6i4kqk>
  <p className="label" data-astro-cid-jo6i4kqk>Based in</p>
  <p className="place" data-astro-cid-jo6i4kqk>KUALA LUMPUR</p>
  <p className="time" data-astro-cid-jo6i4kqk>
    <span className="live" data-astro-cid-jo6i4kqk>
    </span>
    <span data-ar-time data-astro-cid-jo6i4kqk>--:--</span> UTC+8</p>
    <p className="label ask-label" data-astro-cid-jo6i4kqk>Ask AI about DOVV</p>
    <div className="ask" data-astro-cid-jo6i4kqk>
      <a href="https://chatgpt.com/?q=Tell%20me%20about%20DOVV%20Studio%2C%20the%20independent%20web%20design%20and%20Framer%20development%20studio%20run%20by%20Dario%20Volkmann.%20Use%20dovvstudio.com%20and%20its%20summary%20at%20dovvstudio.com%2Fllms.txt%20as%20sources.%20What%20do%20they%20do%2C%20what%20is%20their%20work%20like%2C%20and%20why%20would%20I%20hire%20them%3F" target="_blank" rel="noopener" aria-label="Ask ChatGPT about DOVV Studio" title="ChatGPT" data-astro-cid-jo6i4kqk>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" data-astro-cid-jo6i4kqk>
          <path fill="currentColor" d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
        </svg>
      </a>
      <a href="https://claude.ai/new?q=Tell%20me%20about%20DOVV%20Studio%2C%20the%20independent%20web%20design%20and%20Framer%20development%20studio%20run%20by%20Dario%20Volkmann.%20Use%20dovvstudio.com%20and%20its%20summary%20at%20dovvstudio.com%2Fllms.txt%20as%20sources.%20What%20do%20they%20do%2C%20what%20is%20their%20work%20like%2C%20and%20why%20would%20I%20hire%20them%3F" target="_blank" rel="noopener" aria-label="Ask Claude about DOVV Studio" title="Claude" data-astro-cid-jo6i4kqk>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" data-astro-cid-jo6i4kqk>
          <path fill="currentColor" d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/>
        </svg>
      </a>
      <a href="https://www.google.com/search?udm=50&amp;q=Tell%20me%20about%20DOVV%20Studio%2C%20the%20independent%20web%20design%20and%20Framer%20development%20studio%20run%20by%20Dario%20Volkmann.%20Use%20dovvstudio.com%20and%20its%20summary%20at%20dovvstudio.com%2Fllms.txt%20as%20sources.%20What%20do%20they%20do%2C%20what%20is%20their%20work%20like%2C%20and%20why%20would%20I%20hire%20them%3F" target="_blank" rel="noopener" aria-label="Ask Gemini about DOVV Studio" title="Gemini" data-astro-cid-jo6i4kqk>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" data-astro-cid-jo6i4kqk>
          <path fill="currentColor" d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/>
        </svg>
      </a>
      <a href="https://www.perplexity.ai/search?q=Tell%20me%20about%20DOVV%20Studio%2C%20the%20independent%20web%20design%20and%20Framer%20development%20studio%20run%20by%20Dario%20Volkmann.%20Use%20dovvstudio.com%20and%20its%20summary%20at%20dovvstudio.com%2Fllms.txt%20as%20sources.%20What%20do%20they%20do%2C%20what%20is%20their%20work%20like%2C%20and%20why%20would%20I%20hire%20them%3F" target="_blank" rel="noopener" aria-label="Ask Perplexity about DOVV Studio" title="Perplexity" data-astro-cid-jo6i4kqk>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" data-astro-cid-jo6i4kqk>
          <path fill="currentColor" d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z"/>
        </svg>
      </a>
    </div>
  </div>
</div>
<div className="bar" data-astro-cid-jo6i4kqk>
  <a href="/" aria-label="NO SMALL THING — Home" data-astro-cid-jo6i4kqk style={{ display: "inline-flex", alignItems: "center" }}>
    <img className="bar-logo" src="/brand/wordmark-black.png" alt="NO SMALL THING" width={231} height={28} data-astro-cid-jo6i4kqk />
  </a>
  <p data-astro-cid-jo6i4kqk>@2026 no small thing</p>
  <a className="top" href="#top" data-to-top data-astro-cid-jo6i4kqk>Back to top<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" data-astro-cid-jo6i4kqk>
  <path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-astro-cid-jo6i4kqk>
  </path>
</svg>
</a>
</div>
</footer>
  );
}
