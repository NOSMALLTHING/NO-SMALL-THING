// @ts-nocheck
"use client";

export function initPeel(root: HTMLElement): () => void {
  if (typeof window === "undefined") return () => {};

  if (!(window as any).Peel) {
    globalThis.process??={},globalThis.process.env??={},(function(e){var t=[`webkit`,`moz`,``],n=`http://www.w3.org/2000/svg`,r=`peel-`,i,a,o,s,c,l=document.documentElement,u=l.style;function d(e){for(var n,r,i=0;i<t.length;i++)if(n=t[i],r=n?n+v(e):e,r in u)return r}function f(){i=d(`clipPath`),a=d(`transform`),o=d(`boxShadow`),s=d(`filter`),p(),V.supported=!!(i&&a),V.effectsSupported=c}function p(){var e=document.createElement(`div`).style;e.cssText=`background:linear-gradient(45deg,#9f9,white);`,c=(e.backgroundImage||``).indexOf(`gradient`)>-1}function m(e){return Math.round(e*100)/100}function h(e){return Math.max(0,Math.min(1,e))}function g(e,t,n){return(e-t)/(n-t)}function _(e,t){return(t||1)*2*(.5-Math.abs(e-.5))}function v(e){return e.slice(0,1).toUpperCase()+e.slice(1)}function y(e){return e.replace(/-(\w)/g,function(e,t){return t.toUpperCase()})}function b(e){return r+e}function x(e,t){e.style[i]=t}function S(e,t){e.style[a]=t}function C(e,t,n,r,i,a){e.style[o]=T(t,n,r,i,a)}function w(e,t,n,r,i){e.style[s]=`drop-shadow(`+T(t,n,r,null,i)+`)`}function T(e,t,n,r,i){return m(e)+`px `+m(t)+`px `+m(n)+`px `+(r?m(r)+`px `:``)+`rgba(0,0,0,`+m(i)+`)`}function E(e,t){e.style.opacity=t}function D(e,t,n){if(c){var r=n.length===0?`none`:`linear-gradient(`+m(t)+`deg,`+n.join(`,`)+`)`;e.style.backgroundImage=r}}function O(e,t,n){e.addEventListener(t,n)}function k(e,t,n){e.removeEventListener(t,n)}function A(e,t){var n=e.changedTouches?e.changedTouches[0]:e;return{x:n.clientX-t.offsetLeft+window.scrollX,y:n.clientY-t.offsetTop+window.scrollY}}function j(e,t){return N(0,0,0,e,t)}function M(e,t){return N(255,255,255,e,t)}function N(e,t,n,r,i){return r=m(h(r)),`rgba(`+e+`,`+t+`,`+n+`,`+r+`) `+m(i*100)+`%`}function P(e,t){return typeof e==`string`&&(e=(t||document).querySelector(e)),e}function F(e,t){var n=document.createElement(`div`);return I(n,t),e.appendChild(n),n}function I(e,t){e.classList.add(t)}function L(e){return e.style.zIndex}function R(e,t){e.style.zIndex=t}function z(e,t,r){t||=l;var i=document.createElementNS(n,e);for(var a in t.appendChild(i),r)r.hasOwnProperty(a)&&B(i,a,r[a]);return i}function B(e,t,n){e.setAttributeNS(null,t,n)}function V(e,t){this.setOptions(t),this.el=P(e,l),this.constraints=[],this.events=[],this.setupLayers(),this.setupDimensions(),this.setCorner(this.getOption(`corner`)),this.setMode(this.getOption(`mode`)),this.init()}V.Corners={TOP_LEFT:0,TOP_RIGHT:1,BOTTOM_LEFT:2,BOTTOM_RIGHT:3},V.Defaults={topShadow:!0,topShadowBlur:5,topShadowAlpha:.5,topShadowOffsetX:0,topShadowOffsetY:1,topShadowCreatesShape:!0,backReflection:!1,backReflectionSize:.02,backReflectionOffset:0,backReflectionAlpha:.15,backReflectionDistribute:!0,backShadow:!0,backShadowSize:.04,backShadowOffset:0,backShadowAlpha:.1,backShadowDistribute:!0,bottomShadow:!0,bottomShadowSize:1.5,bottomShadowOffset:0,bottomShadowDarkAlpha:.7,bottomShadowLightAlpha:.1,bottomShadowDistribute:!0,setPeelOnInit:!0,clippingBoxScale:4,flipConstraintOffset:5,dragPreventsDefault:!0},V.prototype.setCorner=function(){var e=arguments;e[0]===void 0?e=[V.Corners.BOTTOM_RIGHT]:e[0].length&&(e=e[0]),this.corner=this.getPointOrCorner(e)},V.prototype.setMode=function(e){e===`book`?(this.addPeelConstraint(V.Corners.BOTTOM_LEFT),this.addPeelConstraint(V.Corners.TOP_LEFT),this.setOption(`backReflection`,!1),this.setOption(`backShadowDistribute`,!1),this.setOption(`bottomShadowDistribute`,!1)):e===`calendar`&&(this.addPeelConstraint(V.Corners.TOP_RIGHT),this.addPeelConstraint(V.Corners.TOP_LEFT))},V.prototype.setPeelPath=function(e,t){var n=arguments,r=new q(e,t),i,a,o;n.length===4?(i=new q(n[2],n[3]),this.path=new K(r,i)):n.length===8&&(a=new q(n[2],n[3]),o=new q(n[4],n[5]),i=new q(n[6],n[7]),this.path=new G(r,a,o,i))},V.prototype.handleDrag=function(e,t){this.dragHandler=e,this.setupDragEvents(t)},V.prototype.handlePress=function(e,t){this.pressHandler=e,this.setupDragEvents(t)},V.prototype.setupDragEvents=function(e){var t=this,n,r,i;if(this.dragEventsSetup)return;e||=this.el;function a(e,a){t.getOption(`dragPreventsDefault`)&&a.preventDefault(),r=e?`touchmove`:`mousemove`,i=e?`touchend`:`mouseup`,O(l,r,o),O(l,i,s),n=!1}function o(e){t.dragHandler&&c(t.dragHandler,e),n=!0}function s(e){!n&&t.pressHandler&&c(t.pressHandler,e),k(l,r,o),k(l,i,s)}function c(e,n){var r=A(n,t.el);e.call(t,n,r.x,r.y)}this.addEvent(e,`mousedown`,a.bind(this,!1)),this.addEvent(e,`touchstart`,a.bind(this,!0)),this.dragEventsSetup=!0},V.prototype.removeEvents=function(){this.events.forEach(function(e,t){k(e.el,e.type,e.handler)}),this.events=[]},V.prototype.setTimeAlongPath=function(e){e=h(e);var t=this.path.getPointForTime(e);this.timeAlongPath=e,this.setPeelPosition(t.x,t.y)},V.prototype.setFadeThreshold=function(e){this.fadeThreshold=e},V.prototype.setPeelPosition=function(){var e=this.getPointOrCorner(arguments);e=this.getConstrainedPeelPosition(e),e&&(this.peelLineSegment=this.getPeelLineSegment(e),this.peelLineRotation=this.peelLineSegment.getAngle(),this.setClipping(),this.setBackTransform(e),this.setEffects())},V.prototype.addPeelConstraint=function(){var e=this.getPointOrCorner(arguments),t=this.corner.subtract(e).getLength();this.constraints.push(new U(e,t)),this.calculateFlipConstraint()},V.prototype.setOption=function(e,t){this.options[e]=t},V.prototype.getOption=function(e){return this.options[y(e)]},V.prototype.getAmountClipped=function(){return g(this.getTopClipArea(),this.width*this.height,0)},V.prototype.addEvent=function(e,t,n){return O(e,t,n),this.events.push({el:e,type:t,handler:n}),n},V.prototype.getTopClipArea=function(){var e=new W;return this.elementBox.forEach(function(t){this.distributeLineByPeelLine(t,e)},this),W.getArea(e.getPoints())},V.prototype.calculateFlipConstraint=function(){var e=this.corner,t=this.constraints.concat();this.flipConstraint=t.sort(function(t,n){return e.y-t.center.y,e.y-n.center.y,t-n})[0]},V.prototype.dragStart=function(e,t,n){},V.prototype.fireHandler=function(e,t){var n=A(e,this.el);t.call(this,e,n.x,n.y)},V.prototype.setClipping=function(){var e=new W,t=new W;this.clippingBox.forEach(function(n){this.distributeLineByPeelLine(n,e,t)},this),this.topClip.setPoints(e.getPoints()),this.backClip.setPoints(t.getPoints())},V.prototype.distributeLineByPeelLine=function(e,t,n){var r=this.peelLineSegment.getIntersectPoint(e);this.distributePointByPeelLine(e.p1,t,n),this.distributePointByPeelLine(r,t,n)},V.prototype.distributePointByPeelLine=function(e,t,n){if(e){var r=this.peelLineSegment.getPointDeterminant(e);r<=0&&t.addPoint(e),r>=0&&n&&n.addPoint(this.flipPointHorizontally(e))}},V.prototype.setOptions=function(e){var t=e||{},n=V.Defaults;for(var r in n)!n.hasOwnProperty(r)||r in t||(t[r]=n[r]);this.options=t},V.prototype.findOrCreateLayer=function(e,t,n){var r=e+`-element`,i=b(e),a=P(this.getOption(r)||`.`+i,t);return a||=F(t,i),I(a,b(`layer`)),R(a,n),a},V.prototype.getPointOrCorner=function(e){return e.length===2?new q(e[0],e[1]):typeof e[0]==`number`?this.getCornerPoint(e[0]):e[0]},V.prototype.getCornerPoint=function(e){return new q(+!!(e&1)*this.width,+!!(e&2)*this.height)},V.prototype.getOptionalShape=function(){var e=[`rect`,`polygon`,`path`,`circle`],t;return e.some(function(e){var n=this.getOption(e),r;return n&&(r={},r.attributes=n,r.type=e,t=r),t},this),t},V.prototype.setupLayers=function(){var e=this.getOptionalShape(),t=this.topLayer=this.findOrCreateLayer(`top`,this.el,2),n=this.backLayer=this.findOrCreateLayer(`back`,this.el,3);this.bottomLayer=this.findOrCreateLayer(`bottom`,this.el,1),e?(this.topLayer=this.wrapShapeLayer(this.topLayer,`top-outer-clip`),this.backLayer=this.wrapShapeLayer(this.backLayer,`back-outer-clip`),this.topShapeClip=new H(t,e),this.backShapeClip=new H(n,e),this.bottomShapeClip=new H(this.bottomLayer,e),this.getOption(`topShadowCreatesShape`)&&(this.topShadowElement=this.setupDropShadow(e,t))):this.topShadowElement=this.findOrCreateLayer(`top-shadow`,t,1),this.topClip=new H(this.topLayer),this.backClip=new H(this.backLayer),this.backShadowElement=this.findOrCreateLayer(`back-shadow`,n,1),this.backReflectionElement=this.findOrCreateLayer(`back-reflection`,n,2),this.bottomShadowElement=this.findOrCreateLayer(`bottom-shadow`,this.bottomLayer,1),this.usesBoxShadow=!e},V.prototype.setupDropShadow=function(e,t){var n=z(`svg`,t,{class:b(`layer`)});return z(e.type,n,e.attributes),n},V.prototype.wrapShapeLayer=function(e,t){var n=L(e);I(e,b(`shape-layer`));var r=this.findOrCreateLayer(t,this.el,n);return r.appendChild(e),r},V.prototype.setupDimensions=function(){this.width=this.el.offsetWidth,this.height=this.el.offsetHeight,this.center=new q(this.width/2,this.height/2),this.elementBox=this.getScaledBox(1),this.clippingBox=this.getScaledBox(this.getOption(`clippingBoxScale`))},V.prototype.getScaledBox=function(e){var t=e,n=e-1,r=new q(-this.width*n,-this.height*n),i=new q(this.width*t,-this.height*n),a=new q(this.width*t,this.height*t),o=new q(-this.width*n,this.height*t);return[new K(r,i),new K(i,a),new K(a,o),new K(o,r)]},V.prototype.getConstrainedPeelPosition=function(e){return this.constraints.forEach(function(t){var n=this.getFlipConstraintOffset(t,e);n&&(t=new U(t.center,t.radius-n)),e=t.constrainPoint(e)},this),e},V.prototype.getFlipConstraintOffset=function(e,t){var n=this.getOption(`flipConstraintOffset`);if(e===this.flipConstraint&&n){var r=this.corner.subtract(this.center),i=this.corner.subtract(e.center),a=i.getAngle();i.rotate(-a);var o=t.subtract(e.center).rotate(-a);if(r.x*r.y<0&&(o.y*=-1),o.x>0&&o.y>0)return g(o.getAngle(),45,0)*n}},V.prototype.getPeelLineSegment=function(e){var t=this.corner.subtract(e).scale(.5),n=e.add(t);t.x===0&&t.y===0&&(t=e.subtract(this.center));var r=t.getLength(),i=Math.max(this.width,this.height)/r*10,a=t.rotate(-90).scale(i);return new K(n.add(a),n.subtract(a))},V.prototype.setBackTransform=function(e){var t=this.flipPointHorizontally(this.corner),n=(this.peelLineRotation-90)*2,r=e.subtract(t.rotate(n)),i=`translate(`+m(r.x)+`px, `+m(r.y)+`px) rotate(`+m(n)+`deg)`;S(this.backLayer,i),S(this.topShadowElement,i)},V.prototype.getPeelLineDistance=function(){var e,t,n,r;this.peelLineRotation<90?(e=V.Corners.TOP_RIGHT,t=V.Corners.BOTTOM_LEFT):this.peelLineRotation<180?(e=V.Corners.BOTTOM_RIGHT,t=V.Corners.TOP_LEFT):this.peelLineRotation<270?(e=V.Corners.BOTTOM_LEFT,t=V.Corners.TOP_RIGHT):this.peelLineRotation<360&&(e=V.Corners.TOP_LEFT,t=V.Corners.BOTTOM_RIGHT),n=this.getCornerPoint(e),r=this.getCornerPoint(t);var i=new K(n,r).scale(2),a=this.peelLineSegment.getIntersectPoint(i);return a?n.subtract(a).getLength()/n.subtract(r).getLength():2},V.prototype.setEffects=function(){var e=this.getPeelLineDistance();this.setTopShadow(e),this.setBackShadow(e),this.setBackReflection(e),this.setBottomShadow(e),this.setFade()},V.prototype.setTopShadow=function(e){if(this.getOption(`topShadow`)){var t=this.getOption(`topShadowBlur`),n=this.getOption(`topShadowOffsetX`),r=this.getOption(`topShadowOffsetY`),i=this.getOption(`topShadowAlpha`),a=this.exponential(e,5,i);this.usesBoxShadow?C(this.topShadowElement,n,r,t,0,a):w(this.topShadowElement,n,r,t,a)}},V.prototype.distributeOrLinear=function(e,t,n){return t?_(e,n):e*n},V.prototype.exponential=function(e,t,n){return n*h((1+e)**+t-1)},V.prototype.setBackReflection=function(e){var t=[];if(this.canSetLinearEffect(`backReflection`,e)){var n=this.getOption(`backReflectionDistribute`),r=this.getOption(`backReflectionSize`),i=this.getOption(`backReflectionOffset`),a=this.getOption(`backReflectionAlpha`),o=this.distributeOrLinear(e,n,r),s=e-i,c=s-o,l=c-o;t.push(M(0,0)),t.push(M(0,l)),t.push(M(a,c)),t.push(M(0,s))}D(this.backReflectionElement,180-this.peelLineRotation,t)},V.prototype.setBackShadow=function(e){var t=[];if(this.canSetLinearEffect(`backShadow`,e)){var n=this.getOption(`backShadowSize`),r=this.getOption(`backShadowOffset`),i=this.getOption(`backShadowAlpha`),a=this.getOption(`backShadowDistribute`),o=this.distributeOrLinear(e,a,n),s=e-r,c=s-o,l=c-o;t.push(j(0,0)),t.push(j(0,l)),t.push(j(i,c)),t.push(j(i,s))}D(this.backShadowElement,180-this.peelLineRotation,t)},V.prototype.setBottomShadow=function(e){var t=[];if(this.canSetLinearEffect(`bottomShadow`,e)){var n=this.getOption(`bottomShadowSize`),r=this.getOption(`bottomShadowOffset`),i=this.getOption(`bottomShadowDarkAlpha`),a=this.getOption(`bottomShadowLightAlpha`),o=this.getOption(`bottomShadowDistribute`),s=e-(.025-r),c=s-this.distributeOrLinear(e,o,.03)*n-r,l=c-(.02*n-r);t=[j(0,0),j(0,l),j(a,c),j(a,s),j(i,e)]}D(this.bottomShadowElement,this.peelLineRotation+180,t)},V.prototype.canSetLinearEffect=function(e,t){return this.getOption(e)&&t>0},V.prototype.setFade=function(){var e=this.fadeThreshold,t=1,n;e&&(n=this.timeAlongPath===void 0?this.getAmountClipped():this.timeAlongPath,n>e&&(t=(1-n)/(1-e)),E(this.topLayer,t),E(this.backLayer,t),E(this.bottomShadowElement,t))},V.prototype.flipPointHorizontally=function(e){return new q(e.x-(e.x-this.center.x)*2,e.y)},V.prototype.init=function(){this.getOption(`setPeelOnInit`)&&this.setPeelPosition(this.corner),I(this.el,b(`ready`))};function H(e,t){this.el=e,this.shape=H.createClipPath(e,t||{type:`polygon`}),S(this.el,`translate(0px,0px)`)}H.getDefs=function(){return this.defs||=(this.svg=z(`svg`,null,{class:b(`svg-clip-element`)}),z(`defs`,this.svg)),this.defs},H.createClipPath=function(e,t){var n=H.getId(),r=z(`clipPath`,this.getDefs()),i=z(t.type,r,t.attributes);return B(r,`id`,n),x(e,`url(#`+n+`)`),i},H.getId=function(){return H.id||=1,`svg-clip-`+H.id++},H.prototype.setPoints=function(e){var t=e.map(function(e){return m(e.x)+`,`+m(e.y)}).join(` `);B(this.shape,`points`,t)};function U(e,t){this.center=e,this.radius=t}U.prototype.containsPoint=function(e){if(this.boundingRectContainsPoint(e)){var t=this.center.x-e.x,n=this.center.y-e.y;return t*=t,n*=n,t+n<=this.radius*this.radius}return!1},U.prototype.boundingRectContainsPoint=function(e){return e.x>=this.center.x-this.radius&&e.x<=this.center.x+this.radius&&e.y>=this.center.y-this.radius&&e.y<=this.center.y+this.radius},U.prototype.constrainPoint=function(e){if(!this.containsPoint(e)){var t=e.subtract(this.center).getAngle();e=this.center.add(new q(this.radius,0).rotate(t))}return e};function W(){this.points=[]}W.getArea=function(e){var t=0,n=0;return e.forEach(function(e,r,i){var a=i[(r+1)%i.length];t+=e.x*a.y,n+=e.y*a.x}),(t-n)/2},W.prototype.addPoint=function(e){this.points.push(e)},W.prototype.getPoints=function(){return this.points};function G(e,t,n,r){this.p1=e,this.c1=t,this.p2=r,this.c2=n}G.prototype.getPointForTime=function(e){var t=(1-e)**3,n=3*e*(1-e)**2,r=3*e**2*(1-e),i=e**3;return new q(t*this.p1.x+n*this.c1.x+r*this.c2.x+i*this.p2.x,t*this.p1.y+n*this.c1.y+r*this.c2.y+i*this.p2.y)};function K(e,t){this.p1=e,this.p2=t}K.EPSILON=1e-6,K.prototype.getPointForTime=function(e){return this.p1.add(this.getVector().scale(e))},K.prototype.scale=function(e){return 1+e/2,new K(this.p1.add(this.p2.subtract(this.p1).scale(e)),this.p2.add(this.p1.subtract(this.p2).scale(e)))},K.prototype.getPointDeterminant=function(e){var t=(e.x-this.p1.x)*(this.p2.y-this.p1.y)-(e.y-this.p1.y)*(this.p2.x-this.p1.x);return t>-K.EPSILON&&t<K.EPSILON&&(t=0),t},K.prototype.getIntersectPoint=function(e){var t=this;function n(e,t){return e.x*t.y-e.y*t.x}var r=t.p2.subtract(t.p1),i=e.p2.subtract(e.p1),a=n(e.p1.subtract(t.p1),r),o=n(r,i);if(o==0)return null;var s=a/o,c=n(e.p1.subtract(t.p1),i)/o;return c>=0&&c<=1&&s>=0&&s<=1?t.p1.add(r.scale(c)):null},K.prototype.getAngle=function(){return this.getVector().getAngle()},K.prototype.getVector=function(){return this.vector||=this.p2.subtract(this.p1),this.vector};function q(e,t){this.x=e,this.y=t}q.DEGREES_IN_RADIANS=180/Math.PI,q.degToRad=function(e){return e/q.DEGREES_IN_RADIANS},q.radToDeg=function(e){for(var t=e*q.DEGREES_IN_RADIANS;t<0;)t+=360;return t},q.vector=function(e,t){var n=q.degToRad(e);return new q(Math.cos(n)*t,Math.sin(n)*t)},q.prototype.add=function(e){return new q(this.x+e.x,this.y+e.y)},q.prototype.subtract=function(e){return new q(this.x-e.x,this.y-e.y)},q.prototype.scale=function(e){return new q(this.x*e,this.y*e)},q.prototype.getLength=function(){return Math.sqrt(this.x**2+this.y**2)},q.prototype.getAngle=function(){return q.radToDeg(Math.atan2(this.y,this.x))},q.prototype.setAngle=function(e){return q.vector(e,this.getLength())},q.prototype.rotate=function(e){return this.setAngle(this.getAngle()+e)},f(),e.Peel=V})(window);
  }

  const Peel = (window as any).Peel;
  if (!Peel || !Peel.supported) return () => {};

  const cleanups: (() => void)[] = [];
  const t = (e: number) => 1 - (1 - e) ** 3;

  const stickers = root.querySelectorAll<HTMLElement>("[data-sticker]");
  stickers.forEach((n) => {
    let r = n.querySelector<HTMLElement>("[data-peel]"),
      i = r ? r.querySelector<HTMLElement>("[data-art]") : null;
    if (!r || !i) return;

    let a: any = null,
      o = 0,
      s = 0;
    const c = () => {
      o = i.offsetWidth;
      s = i.offsetHeight;
      if (!o || !s) return false;
      r.style.width = o + "px";
      r.style.height = s + "px";
      let tDiv = document.createElement("div");
      tDiv.className = "peel-back";
      let clone = i.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[data-holo]").forEach((e) => e.removeAttribute("data-holo"));
      clone.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id"));
      tDiv.appendChild(clone);
      let bDiv = document.createElement("div");
      bDiv.className = "peel-bottom";
      r.append(tDiv, bDiv);
      a = new Peel(r, {
        topShadow: false,
        backShadow: false,
        backReflection: false,
        bottomShadow: false,
      });
      return true;
    };

    let l = "";
    const u = (flag: boolean) => {
      if (!a) return;
      let topL = a.topLayer,
        backL = a.backLayer;
      if (flag) {
        l = l || topL.style.clipPath;
        topL.style.clipPath = "none";
        backL.style.visibility = "hidden";
      } else {
        if (l) topL.style.clipPath = l;
        backL.style.visibility = "";
      }
    };

    const d = (eX: number, eY: number) => {
      let rect = r.getBoundingClientRect(),
        aX = rect.left + rect.width / 2,
        cY = rect.top + rect.height / 2,
        rotDeg = (parseFloat(getComputedStyle(n).getPropertyValue("--rot")) || 0) * (Math.PI / 180),
        sc = parseFloat(getComputedStyle(n).scale) || 1,
        dX = (eX - aX) / sc,
        dY = (eY - cY) / sc;
      return {
        x: dX * Math.cos(-rotDeg) - dY * Math.sin(-rotDeg) + o / 2,
        y: dX * Math.sin(-rotDeg) + dY * Math.cos(-rotDeg) + s / 2,
      };
    };

    const f = (pt: { x: number; y: number }) => {
      let tX = pt.x - o / 2,
        tY = pt.y - s / 2;
      if (Math.abs(tX) < 1 && Math.abs(tY) < 1) {
        tX = 1;
        tY = 1;
      }
      let rRatio = Math.min(Math.abs(o / 2 / (tX || 1e-6)), Math.abs(s / 2 / (tY || 1e-6)));
      return { x: o / 2 + tX * rRatio, y: s / 2 + tY * rRatio };
    };

    let p = "idle",
      m = { x: 0, y: 0 },
      h = { x: 0, y: 0 },
      g = { x: 0, y: 0 },
      _ = { x: 0, y: 0, t: 0 },
      v = { x: 0, y: 0 };

    const y = (ePt: { x: number; y: number }) => {
      let startT = performance.now();
      const step = (now: number) => {
        let prog = Math.min(1, (now - startT) / 380),
          sc = t(prog);
        a.setPeelPosition(ePt.x + (m.x - ePt.x) * sc, ePt.y + (m.y - ePt.y) * sc);
        if (prog < 1) requestAnimationFrame(step);
        else if (p === "idle") u(true);
      };
      requestAnimationFrame(step);
    };

    const onPointerDown = (evt: PointerEvent) => {
      if (p !== "idle" || (!a && !c())) return;
      evt.preventDefault();
      p = "peeling";
      n.classList.add("peeling");
      n.setPointerCapture(evt.pointerId);
      let pt = d(evt.clientX, evt.clientY);
      m = f(pt);
      u(false);
      a.setCorner(m.x, m.y);
      a.setPeelPosition(m.x, m.y);
      h = pt;
      g = { ...m };
      _ = { x: evt.clientX, y: evt.clientY, t: performance.now() };
      v = { x: 0, y: 0 };
    };

    const b = (evt: PointerEvent) => {
      let now = performance.now(),
        dt = Math.max(1, now - _.t) / 16;
      v = {
        x: v.x * 0.5 + ((evt.clientX - _.x) / dt) * 0.5,
        y: v.y * 0.5 + ((evt.clientY - _.y) / dt) * 0.5,
      };
      _ = { x: evt.clientX, y: evt.clientY, t: now };
    };

    const onPointerMove = (evt: PointerEvent) => {
      if (p !== "peeling") return;
      b(evt);
      let pt = d(evt.clientX, evt.clientY);
      g = { x: m.x + (pt.x - h.x), y: m.y + (pt.y - h.y) };
      a.setPeelPosition(g.x, g.y);
      if (a.getAmountClipped() > 0.5) triggerCarried(evt);
    };

    let xSaved: any = null,
      sPos = { x: 0, y: 0 },
      cPos = { x: 0, y: 0 },
      wPos = { x: 0, y: 0 },
      tRot = 0,
      eRot = 0,
      dScale = 0;

    const triggerCarried = (evt: PointerEvent) => {
      p = "carried";
      n.classList.remove("peeling");
      let rCopy = { ...g };
      let startNow = performance.now();
      const returnStep = (now: number) => {
        let prog = Math.min(1, (now - startNow) / 160),
          sc = t(prog);
        a.setPeelPosition(rCopy.x + (m.x - rCopy.x) * sc, rCopy.y + (m.y - rCopy.y) * sc);
        if (prog < 1) requestAnimationFrame(returnStep);
        else u(true);
      };
      requestAnimationFrame(returnStep);

      dScale = 0;
      let bRect = n.getBoundingClientRect(),
        midX = bRect.left + bRect.width / 2,
        midY = bRect.top + bRect.height / 2;
      xSaved = {
        parent: n.parentElement,
        next: n.nextSibling,
        style: n.getAttribute("style") ?? "",
      };
      tRot = parseFloat(getComputedStyle(n).getPropertyValue("--rot")) || 0;
      let sScale = parseFloat(getComputedStyle(n).scale) || 1;

      document.body.appendChild(n);
      Object.assign(n.style, {
        position: "fixed",
        right: "auto",
        bottom: "auto",
        margin: "0",
        translate: "none",
        zIndex: "999",
        animation: "none",
        transition: "none",
        cursor: "grabbing",
      });

      let wOff = n.offsetWidth,
        hOff = n.offsetHeight;
      sPos = { x: midX - wOff / 2, y: midY - hOff / 2 };
      let rRad = (tRot * Math.PI) / 180,
        bOff = (m.x - o / 2) * sScale,
        eOff = (m.y - s / 2) * sScale;
      wPos = {
        x: wOff / 2 + bOff * Math.cos(rRad) - eOff * Math.sin(rRad),
        y: hOff / 2 + bOff * Math.sin(rRad) + eOff * Math.cos(rRad),
      };
      cPos = { x: evt.clientX - wPos.x, y: evt.clientY - wPos.y };
      applyTransform();
      requestAnimationFrame(flyStep);
    };

    const applyTransform = () => {
      n.style.left = sPos.x + "px";
      n.style.top = sPos.y + "px";
      n.style.transform = "rotate(" + (tRot + eRot) + "deg) scale(" + (1 + 0.08 * dScale) + ")";
      n.style.filter =
        "drop-shadow(0 " +
        (8 + 14 * dScale) +
        "px " +
        (14 + 12 * dScale) +
        "px rgba(0, 0, 0, " +
        (0.16 + 0.14 * dScale) +
        "))";
    };

    const flyStep = () => {
      if (p === "carried") {
        sPos.x += (cPos.x - sPos.x) * 0.22;
        sPos.y += (cPos.y - sPos.y) * 0.22;
        dScale += (1 - dScale) * 0.15;
        eRot += (Math.max(-16, Math.min(16, v.x * 1.2)) - eRot) * 0.15;
        applyTransform();
        requestAnimationFrame(flyStep);
      }
    };

    const onDocPointerMove = (evt: PointerEvent) => {
      if (p === "carried") {
        b(evt);
        cPos = { x: evt.clientX - wPos.x, y: evt.clientY - wPos.y };
      }
    };
    const onDocPointerUp = () => {
      if (p === "carried") fallStep();
    };

    const fallStep = () => {
      p = "falling";
      n.style.pointerEvents = "none";
      let posX = 0,
        posY = 0,
        curRot = tRot + eRot,
        velX = Math.max(-900, Math.min(900, v.x * 40)),
        velY = Math.max(-500, Math.min(600, v.y * 40)) - 120,
        spin = velX * 0.35 + (Math.random() - 0.5) * 120,
        baseY = sPos.y,
        lastT = performance.now();

      const fallTick = (now: number) => {
        let dt = Math.min(0.05, (now - lastT) / 1000);
        lastT = now;
        velY += 1600 * dt;
        posX += velX * dt;
        posY += velY * dt;
        velX *= 1 - 0.6 * dt;
        curRot += spin * dt;
        n.style.transform =
          "translate(" +
          posX +
          "px, " +
          posY +
          "px) rotate(" +
          curRot +
          "deg) scale(" +
          (1 + 0.08 * dScale) +
          ")";
        if (baseY + posY < window.innerHeight + 40) {
          requestAnimationFrame(fallTick);
        } else {
          resetSticker();
        }
      };
      requestAnimationFrame(fallTick);
    };

    const resetSticker = () => {
      n.style.visibility = "hidden";
      setTimeout(() => {
        if (xSaved && xSaved.parent) {
          xSaved.parent.insertBefore(n, xSaved.next);
          n.setAttribute("style", xSaved.style);
          n.style.animationDelay = "0s";
          eRot = 0;
          p = "idle";
        }
      }, 2500);
    };

    const onPointerUpOrCancel = () => {
      if (p === "peeling") {
        n.classList.remove("peeling");
        p = "idle";
        y(g);
      }
    };

    n.addEventListener("pointerdown", onPointerDown);
    n.addEventListener("pointermove", onPointerMove);
    n.addEventListener("pointerup", onPointerUpOrCancel);
    n.addEventListener("pointercancel", onPointerUpOrCancel);

    document.addEventListener("pointermove", onDocPointerMove);
    document.addEventListener("pointerup", onDocPointerUp);
    document.addEventListener("pointercancel", onDocPointerUp);

    const ro = new ResizeObserver(() => {
      if (!a) return;
      let curW = i.offsetWidth,
        curH = i.offsetHeight;
      if (curW !== o || curH !== s) {
        o = curW;
        s = curH;
        r.style.width = o + "px";
        r.style.height = s + "px";
        a.setupDimensions();
        a.setPeelPosition(m.x, m.y);
      }
    });
    ro.observe(i);

    cleanups.push(() => {
      n.removeEventListener("pointerdown", onPointerDown);
      n.removeEventListener("pointermove", onPointerMove);
      n.removeEventListener("pointerup", onPointerUpOrCancel);
      n.removeEventListener("pointercancel", onPointerUpOrCancel);
      document.removeEventListener("pointermove", onDocPointerMove);
      document.removeEventListener("pointerup", onDocPointerUp);
      document.removeEventListener("pointercancel", onDocPointerUp);
      ro.disconnect();
    });
  });

  return () => cleanups.forEach((c) => c());
}
