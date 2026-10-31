import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

for (const reducedMotion of [true, false]) test(`slider autoplays only when allowed and preserves previews (reduced motion: ${reducedMotion})`, () => {
 const dom=new JSDOM(`<section><div data-webgl-canvas data-scroll-span="-3" data-hover-dim="0.75" data-wheel="true" data-hole-x="0" data-hole-y="0" data-hole-w="1" data-hole-h="1">${Array.from({length:14},(_,i)=>`<div data-webgl-item><button aria-label="Preview ${i}"></button><div><img data-webgl-image src="/showcase/${i}.png"><button data-webgl-close aria-label="Close preview"></button></div></div>`).join('')}</div></section>`,{runScripts:'outside-only',pretendToBeVisual:true,url:'http://localhost'});
 const {window}=dom;const frames=new Map();let id=0;
 window.matchMedia=()=>({matches:reducedMotion});
 window.requestAnimationFrame=fn=>{frames.set(++id,fn);return id};
 window.cancelAnimationFrame=id=>frames.delete(id);
 Object.defineProperty(window.HTMLElement.prototype,'offsetWidth',{get(){return this.hasAttribute('data-webgl-item')?600:1440}});
 Object.defineProperty(window.HTMLElement.prototype,'offsetHeight',{get(){return this.hasAttribute('data-webgl-item')?343:800}});
 Object.defineProperty(window.HTMLElement.prototype,'clientWidth',{get(){return 1440}});
 Object.defineProperty(window.HTMLElement.prototype,'clientHeight',{get(){return 800}});
 window.HTMLElement.prototype.getBoundingClientRect=()=>({left:0,top:0,right:1440,bottom:800,width:1440,height:800});
 const root=window.document.querySelector('[data-webgl-canvas]');
 try {
  // jsdom has no GPU; exercise the same position engine with its DOM renderer.
  const bundle=readFileSync(new URL('../public/vendor/webflow-miw-slider.a0e2db7.js',import.meta.url),'utf8');
  window.eval(bundle.replace('let Ct=S?null:new nt(i,T.persp)', 'let Ct=null'));
  window.document.dispatchEvent(new window.Event("DOMContentLoaded"));
  const instance=window.MwSlider.init(root);
  assert.equal(instance.cfg.scrollSpan,-3);
  assert.equal(instance.cfg.wheel,true);
  if (reducedMotion) assert.equal(instance.cfg.lerp,1,'reduced motion bypasses interpolation');
  instance.set('autoAdvance', .22);
  const start=instance.state().target;
  for(let frame=0;frame<120;frame++) instance.debugStep(16.7);
  if(reducedMotion) assert.equal(instance.state().target,start,'reduced motion never autoplays');
  else assert.ok(instance.state().target>start+.4,'advances continuously while idle');
  if (!reducedMotion) {
   const card=root.querySelector('[data-webgl-item]');
   card.dispatchEvent(new window.Event('pointerenter'));
   const paused=instance.state().target;
   for(let frame=0;frame<60;frame++) instance.debugStep(16.7);
   assert.equal(instance.state().target,paused,'hover freezes the conveyor without snapping');
   assert.equal(instance.state().current,paused,'hovered card stays stationary');
   assert.ok(card._op>.99,'hovered card stays fully lit');
   assert.ok(root.querySelectorAll('[data-webgl-item]')[1]._op>.749 && root.querySelectorAll('[data-webgl-item]')[1]._op<.751,'other cards match live Webflow 0.75 hover opacity');
   card.dispatchEvent(new window.Event('pointerleave'));
   for(let frame=0;frame<60;frame++) instance.debugStep(16.7);
   assert.ok(instance.state().target>paused+.2,'leaving resumes automatic movement');
  }
  instance.set('autoAdvance',0);
  assert.equal(root.querySelectorAll('[data-webgl-item]').length,14);
  let pageWheels=0;
  window.addEventListener('wheel',()=>pageWheels++);
  const originalTarget=instance.state().target;
  const vertical=new window.WheelEvent('wheel',{deltaY:120,bubbles:true,cancelable:true});
  root.dispatchEvent(vertical);
  assert.equal(vertical.defaultPrevented,false,'vertical wheel remains available to page scrolling');
  assert.equal(pageWheels,1,'vertical wheel reaches the smooth-scroll listener');
  assert.equal(instance.state().target,originalTarget,'vertical wheel does not change gallery selection');
  const pinch=new window.WheelEvent('wheel',{deltaX:120,ctrlKey:true,bubbles:true,cancelable:true});
  root.dispatchEvent(pinch);
  assert.equal(pinch.defaultPrevented,false,'pinch zoom remains native');
  const horizontal=new window.WheelEvent('wheel',{deltaX:120,bubbles:true,cancelable:true});
  root.dispatchEvent(horizontal);
  assert.equal(horizontal.defaultPrevented,true,'horizontal wheel still controls the gallery');
  assert.notEqual(instance.state().target,originalTarget);
  instance.open(2);
  instance.debugStep(16.7);
  assert.equal(instance.state().isOpen,true);
  assert.equal(instance.state().activeIndex,2);
  instance.close();instance.debugStep(16.7);
  assert.equal(instance.state().isOpen,false);
  instance.destroy();
  assert.equal(root.dataset.mwInit,undefined);
  assert.equal(root.querySelector('.mw-tip-layer'),null);
  assert.equal(root.querySelectorAll('[data-webgl-close]').length,14,'close buttons return to their React-owned cards');
 } finally {dom.window.close()}
});
