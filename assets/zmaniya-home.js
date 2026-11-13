(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var root=document.documentElement;
var clamp=function(x,a,b){return Math.min(b,Math.max(a,x))};
var sstep=function(a,b,x){var t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var isMobile=window.matchMedia('(max-width: 800px)').matches||/Mobi|Android/i.test(navigator.userAgent);
var A=window.ZMANIYA_ASSET_ROOT || 'assets/';

/* ============ SHOP DATA ============
   Product records are supplied by the two YouCan product pickers in the homepage section settings.
   Prices, variant availability and variant IDs come from the live YouCan Liquid objects. */
var youcanData=window.ZMANIYA_YOUCAN||{};
var SHOP={
  currency:window.ZMANIYA_CURRENCY||'TND',
  name:'Born to Eat Harissa Hoodie',
  products:[
    youcanData.white ? {id:'white',name:youcanData.white.name,color:'White',swatch:'#ece8de',price:youcanData.white.price,productId:youcanData.white.id,productUrl:youcanData.white.url,productImage:youcanData.white.image||'',productImages:youcanData.white.images||[],description:youcanData.white.description||'',available:youcanData.white.available,variants:youcanData.white.variants||[],
      card:[youcanData.white.image||A+'w-front.jpg',A+'w-back.jpg'],
      turn:[A+'t-wf.jpg',A+'t-wl.jpg',A+'t-wb.jpg',A+'t-wr.jpg'],
      extra:[{src:A+'w-front.jpg',label:'Studio front'},{src:A+'w-back.jpg',label:'Studio back'},{src:A+'w-life1.jpg',label:'Worn, front'},{src:A+'w-life2.jpg',label:'Worn, back'},{src:A+'w-life3.jpg',label:'Worn, sleeve',fit:'contain'}],
      details:[{src:A+'w-d-logo.jpg',label:'Chest print'},{src:A+'w-d-seal.jpg',label:'Back seal'},{src:A+'w-d-label.jpg',label:'Label and cuff tab'},{src:A+'w-d-cord.jpg',label:'Drawcord'},{src:A+'w-d-fabric.jpg',label:'Interior'}],
      features:['Back print: BORN TO EAT HARISSA, NOT YOUR FEELINGS, WE DON’T DO MILD. WE DO LEGENDARY., with a portrait and a round seal reading TUNISIAN BY BLOOD, HARISSA BY CHOICE.','Chest print: Harissa wordmark with a chili, over TUNISIAN SOUL, PALESTINIAN HEART, GLOBAL VOICE.','Sleeve print: TUNISIAN SOUL, PALESTINIAN CAUSE.','Woven black Harissa label at the hem and a checkered woven tab at the cuff.','Hood with drawcords and metal tips, kangaroo pocket, ribbed cuffs and hem.','Soft fleece-textured interior.']
    } : null,
    youcanData.black ? {id:'black',name:youcanData.black.name,color:'Black',swatch:'#161412',price:youcanData.black.price,productId:youcanData.black.id,productUrl:youcanData.black.url,productImage:youcanData.black.image||'',productImages:youcanData.black.images||[],description:youcanData.black.description||'',available:youcanData.black.available,variants:youcanData.black.variants||[],
      card:[youcanData.black.image||A+'t-kf.jpg',A+'t-kb.jpg'],
      turn:[A+'t-kf.jpg',A+'t-kl.jpg',A+'t-kb.jpg',A+'t-kr.jpg'],
      extra:[{src:A+'k-life1.jpg',label:'Worn, back'},{src:A+'k-life2.jpg',label:'Worn, front',fit:'contain'}],
      details:[{src:A+'k-print.jpg',label:'Back print'},{src:A+'k-d-sleeve.jpg',label:'Sleeve print'},{src:A+'k-d-hood.jpg',label:'Hood tab'}],
      features:['Back print: BORN TO EAT HARISSA, NOT YOUR FEELINGS, WE DON’T DO MILD. WE DO LEGENDARY., with a portrait and a round seal reading TUNISIAN BY BLOOD, HARISSA BY CHOICE.','Chest print: Harissa wordmark with a chili.','Sleeve print: TUNISIAN SOUL, PALESTINIAN CAUSE.','Woven Harissa label at the hem, a checkered woven tab at the cuff and another on the hood.','Washed black fabric look, hood with drawcords, kangaroo pocket, ribbed cuffs and hem.']
    } : null
  ].filter(Boolean)
};
var PROD={}; SHOP.products.forEach(function(p){PROD[p.id]=p});
var TURN_LABELS=['Front','Left','Back','Right'];
function fmt(p){return p==null?null:new Intl.NumberFormat('en',{style:'currency',currency:SHOP.currency}).format(p)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* ============ clock + marquees ============ */
function tick(){
  var t='--:--:--';
  try{t=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Tunis',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date())+' UTC+1'}catch(e){}
  var a=$('#clock'),b=$('#clock2'); if(a)a.textContent=t; if(b)b.textContent=t;
}
tick(); setInterval(tick,1000);
(function(){
  var s='<span>Not a trend</span><span>An era</span><span>زمنية</span><span>Tunisian soul</span><span>Palestinian heart</span><span>Global voice</span>';
  $('#ticker1').innerHTML=s+s+s+s;
  var m='<span>Not a trend.</span><span>An era.</span><span>زمنية</span>';
  $('#marq').innerHTML=m+m+m+m;
})();

/* ============ cart ============ */
var cart=window.ZMANIYA_INITIAL_CART||{items:[],count:0,sub_total:0,cart_submit_url:'/cart'};
if(!Array.isArray(cart.items))cart.items=[];
var lenis=null, openers=[], lastFocus=null;

function lockScroll(on){ document.body.style.overflow=on?'hidden':''; syncLenis(); }
function trap(panel,e){
  if(e.key!=='Tab')return;
  var f=$$('button,a[href],input,textarea,select,summary,[tabindex]:not([tabindex="-1"])',panel).filter(function(x){return !x.disabled&&x.offsetParent!==null});
  if(!f.length)return;
  var first=f[0],last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
}
var cartEl=$('#cart'), veil=$('#veil'), pdpEl=$('#pdp');
var cartStep='cart';
function sdk(){
  if(window.youcanjs)return window.youcanjs;
  if(typeof youcanjs!=='undefined')return youcanjs;
  return null;
}
function cartItems(){return Array.isArray(cart.items)?cart.items:[]}
function lineTotal(){
  var items=cartItems();
  var n=cart.count!=null?Number(cart.count):items.reduce(function(s,i){return s+Number(i.quantity||0)},0);
  var rawTotal=cart.sub_total!=null?Number(cart.sub_total):items.reduce(function(s,i){return s+Number(i.price||0)*Number(i.quantity||0)},0);
  var tot=cart.discounted_sub_total!=null?Number(cart.discounted_sub_total):rawTotal;
  var discount=cart.discounted_price!=null?Number(cart.discounted_price):Math.max(0,rawTotal-tot);
  return {tot:tot,rawTotal:rawTotal,discount:discount,n:n};
}
function variationText(v){
  if(!v)return '';
  if(Array.isArray(v))return v.map(function(x){return typeof x==='string'?x:(x&&((x.name?x.name+': ':'')+(x.value||x.label||''))) }).filter(Boolean).join(' · ');
  if(typeof v==='object')return Object.keys(v).map(function(k){return k+': '+v[k]}).join(' · ');
  return String(v);
}
function renderCart(){
  var t=lineTotal(), c=$('#cartCount');
  if(c){c.textContent=t.n;c.classList.toggle('zero',t.n===0)}
  var body=$('#cartBody'), foot=$('#cartFoot'), title=$('#cartTitle');
  if(!body||!foot||!title)return;
  title.textContent='Cart';
  var items=cartItems();
  if(!items.length){
    body.innerHTML='<div class="empty"><p class="mono">Your cart is empty</p><a class="btn primary" href="#collection" data-go>See the collection</a></div>';
    foot.innerHTML='';return;
  }
  body.innerHTML=items.map(function(i,k){
    var variations=variationText(i.variations);
    var hasStock=i.inventory!==null&&i.inventory!==undefined&&Number.isFinite(Number(i.inventory));
    var cannotIncrease=hasStock&&Number(i.quantity||0)>=Number(i.inventory);
    return '<div class="line"><img src="'+esc(i.image||'')+'" alt="'+esc(i.name||'ZMANIYA product')+'"><div><h3>'+esc(i.name||'ZMANIYA product')+'</h3><div class="m">'+esc(variations)+' · '+fmt(Number(i.price||0))+'</div>'+ 
      '<div class="r"><div class="qty"><button type="button" data-q="-1" data-k="'+k+'" aria-label="Decrease quantity">−</button><output aria-live="polite">'+Number(i.quantity||0)+'</output><button type="button" data-q="1" data-k="'+k+'" aria-label="Increase quantity" '+(cannotIncrease?'disabled':'')+'>+</button></div><button class="rm" type="button" data-rm="'+k+'">Remove</button></div></div></div>';
  }).join('');
  foot.innerHTML=(t.discount>0?'<div class="sub"><span class="mono">Discount</span><span class="price">−'+fmt(t.discount)+'</span></div>':'')+
    '<div class="sub"><span class="mono">'+(t.discount>0?'Subtotal after discount':'Subtotal')+'</span><span class="price">'+fmt(t.tot)+'</span></div>'+ 
    '<p class="note">Delivery and payment are confirmed securely at YouCan checkout. Have a discount code? <a href="/cart">Open the full cart</a>.</p>'+ 
    '<p class="note err" id="cartError" role="status" aria-live="polite"></p>'+ 
    '<a class="btn primary block" href="'+esc(cart.cart_submit_url||'/cart')+'">Checkout</a>';
}
function setCart(next){if(next&&typeof next==='object'){cart=next;if(!Array.isArray(cart.items))cart.items=[]}renderCart()}
async function addToCart(id,size,qty,variantId){
  var p=PROD[id];
  var v=(p&&p.variants||[]).filter(function(x){return String(x.id)===String(variantId)})[0];
  if(!v)throw new Error('The selected size could not be matched to a YouCan variant. Please select the size again.');
  if(!v.available)throw new Error('This size is currently unavailable. Please choose another size.');
  qty=Number(qty);
  if(!Number.isInteger(qty)||qty<1)throw new Error('Please choose a valid quantity.');
  // Product-variant inventory is an array in YouCan's theme object.
  // Cart-item inventory is numeric; the server validates every add-to-cart request.
  var api=sdk();if(!api||!api.cart)throw new Error('The YouCan shopping service is not available. Refresh the page and try again.');
  var updated=await api.cart.addItem({productVariantId:v.id,quantity:qty});
  setCart(updated);return updated;
}
async function updateCartItem(item,quantity){
  var api=sdk();if(!api||!api.cart)throw new Error('The YouCan shopping service is not available.');
  quantity=Number(quantity);
  if(quantity>0&&item.inventory!==null&&item.inventory!==undefined&&Number.isFinite(Number(item.inventory))&&quantity>Number(item.inventory))throw new Error('The requested quantity is above the available stock.');
  var args={cartItemId:item.id,productVariantId:item.product_variant_id};
  var updated=quantity<=0?await api.cart.removeItem(args):await api.cart.updateItem({cartItemId:item.id,productVariantId:item.product_variant_id,quantity:quantity});
  if(updated&&Array.isArray(updated.items)){setCart(updated)}else{window.location.reload()}
}
function openCart(){
  renderCart();lastFocus=document.activeElement;
  cartEl.classList.add('on');veil.classList.add('on');lockScroll(true);
  setTimeout(function(){$('#cartClose').focus()},60);
}
function closeCart(){
  cartEl.classList.remove('on');
  if(!pdpEl.classList.contains('on')){veil.classList.remove('on');lockScroll(false)}
  if(lastFocus&&lastFocus.focus)lastFocus.focus();
}
cartEl.addEventListener('click',function(e){
  var t=e.target.closest('button,a');if(!t)return;
  if(t.dataset.q){
    var item=cartItems()[+t.dataset.k];if(item){var next=Number(item.quantity||0)+Number(t.dataset.q);updateCartItem(item,next).catch(function(err){var m=$('#cartError');if(m)m.textContent=err.message||'Could not update the cart.'})}
  } else if(t.dataset.rm!==undefined){
    var item=cartItems()[+t.dataset.rm];if(item)updateCartItem(item,0).catch(function(err){var m=$('#cartError');if(m)m.textContent=err.message||'Could not remove the item.'});
  } else if(t.hasAttribute('data-go')){closeCart();goTo(t.getAttribute('href'))}
});
cartEl.addEventListener('keydown',function(e){trap(cartEl,e)});
if($('#cartBtn'))$('#cartBtn').addEventListener('click',function(e){e.preventDefault();openCart()});
$('#cartClose').addEventListener('click',closeCart);
renderCart();

/* ============ product cards ============ */
function priceHTML(p){return p.price==null?'<span class="price tba">Price unavailable</span>':'<span class="price">'+fmt(p.price)+'</span>'}
function firstAvailable(p){return (p.variants||[]).filter(function(v){return v.available})[0]||null}
function renderGrid(){
  if(!SHOP.products.length){
    $('#grid').innerHTML='<p class="shopnote mono">Choose the White hoodie product and Black hoodie product in the ZMANIYA section settings inside the YouCan theme editor.</p>';
    return;
  }
  $('#grid').innerHTML=SHOP.products.map(function(p,k){
    var av=firstAvailable(p);
    return '<article class="card" data-c="'+p.id+'">'+
      '<div class="media"><button class="mbtn" type="button" data-open="'+p.id+'" aria-label="View '+esc((p.name||SHOP.name)+', '+p.color)+'">'+
        '<img class="a" src="'+esc(p.card[0])+'" alt="'+esc((p.name||SHOP.name)+', '+p.color+', front')+'" '+(k?'loading="lazy"':'')+'>'+
        '<img class="b" src="'+esc(p.card[1])+'" alt="'+esc((p.name||SHOP.name)+', '+p.color+', back print')+'" loading="lazy">'+
        '</button><span class="idx">PIECE 0'+(k+1)+'</span></div>'+
      '<div class="cinfo"><div><h3 class="cname">'+esc(p.name||SHOP.name)+'</h3><div class="cmeta mono"><span class="dot" style="background:'+p.swatch+'"></span>'+p.color+'</div></div>'+priceHTML(p)+'</div>'+
      '<div class="cact"><button class="btn" type="button" data-open="'+p.id+'">View piece</button><button class="btn primary" type="button" data-quick="'+p.id+'" '+(!av?'disabled':'')+'>'+(av?'Add to cart':'Sold out')+'</button></div></article>';
  }).join('');
  $$('.card').forEach(function(c){
    var fl=document.createElement('div');fl.className='flipper';
    fl.innerHTML='<button type="button" aria-pressed="true">Front</button><button type="button" aria-pressed="false">Back</button>';
    c.querySelector('.media').appendChild(fl);
    fl.addEventListener('click',function(e){e.stopPropagation();var b=e.target.closest('button');if(!b)return;var back=b===fl.children[1];c.classList.toggle('flip',back);fl.children[0].setAttribute('aria-pressed',!back);fl.children[1].setAttribute('aria-pressed',back)});
  });
  var note=$('#shopnote');if(note)note.hidden=SHOP.products.every(function(p){return p.price!=null&&p.variants&&p.variants.length>0});
}
renderGrid();
$('#grid').addEventListener('click',function(e){
  var q=e.target.closest('[data-quick]');
  if(q){
    var p=PROD[q.dataset.quick],av=firstAvailable(p);
    if(!av)return;
    if((p.variants||[]).filter(function(v){return v.available}).length>1){openPDP(q.dataset.quick,0,q);return}
    addToCart(q.dataset.quick,'',1,av.id).then(function(){openCart()}).catch(function(err){var note=$('#shopnote');if(note){note.hidden=false;note.textContent=err.message||'Could not add this product to the cart.'}});
    return;
  }
  var o=e.target.closest('[data-open]');if(o)openPDP(o.dataset.open,0,o);
});
$$('.chip').forEach(function(ch){ch.addEventListener('click',function(){
  $$('.chip').forEach(function(x){x.setAttribute('aria-pressed',x===ch)});
  var f=ch.dataset.f;$$('.card').forEach(function(c){c.hidden=!(f==='all'||c.dataset.c===f)});
})});

/* ============ product page ============ */
function variantPairs(v){
  var raw=v&&v.variations, out=[];
  if(Array.isArray(raw))raw.forEach(function(x){if(typeof x==='string')out.push({name:'',value:x});else if(x&&typeof x==='object')out.push({name:x.name||x.option||'',value:x.value||x.label||''})});
  else if(raw&&typeof raw==='object')Object.keys(raw).forEach(function(k){out.push({name:k,value:String(raw[k])})});
  return out.filter(function(x){return x.value!==''&&x.value!=null});
}
function variantLabel(v){
  var pairs=variantPairs(v);if(!pairs.length)return 'Default';
  if(pairs.length===1)return pairs[0].value;
  return pairs.map(function(x){return x.name?x.name+': '+x.value:x.value}).join(' · ');
}
var pdp={id:'white',media:[],i:0,size:'',qty:1,variantId:''};
function currentVariant(p){
  return (p.variants||[]).filter(function(v){return String(v.id)===String(pdp.variantId)})[0]||null;
}
function buildPDP(){
  var p=PROD[pdp.id];
  var storeImages=(p.productImages||[]).filter(function(m){return m&&m.src}).map(function(m,k){return {src:m.src,label:m.alt||('Store image '+(k+1)),alt:m.alt||((p.name||SHOP.name)+', '+p.color+', store image '+(k+1))}});
  if(!storeImages.length&&p.productImage)storeImages=[{src:p.productImage,label:'YouCan product image',alt:(p.name||SHOP.name)+', '+p.color+', store product image'}];
  var storeImageCount=storeImages.length;
  pdp.media=p.turn.map(function(s,k){return {src:s,label:TURN_LABELS[k],turn:true,alt:(p.name||SHOP.name)+', '+p.color+', '+TURN_LABELS[k].toLowerCase()+' view'}})
    .concat(storeImages)
    .concat(p.extra.map(function(m){return {src:m.src,label:m.label,fit:m.fit,alt:(p.name||SHOP.name)+', '+p.color+', '+m.label.toLowerCase()}}))
    .concat(p.details.map(function(m){return {src:m.src,label:m.label,fit:'contain',alt:p.color+' hoodie detail: '+m.label.toLowerCase()}}));
  var selected=p.variants.filter(function(v){return v.is_selected&&v.available})[0]||firstAvailable(p);
  pdp.variantId=selected?selected.id:'';pdp.size=selected?variantLabel(selected):'';pdp.i=0;pdp.qty=1;
  var sizesHTML='';
  if((p.variants||[]).length>1){
    sizesHTML='<div class="fld"><span class="mono">Size</span><div class="sizes" id="sizes" role="group" aria-label="Available variants">'+p.variants.map(function(v){return '<button class="sz" type="button" aria-pressed="'+(selected&&selected.id===v.id)+'" data-variant-id="'+esc(v.id)+'" data-s="'+esc(variantLabel(v))+'" '+(!v.available?'disabled':'')+'>'+esc(variantLabel(v))+'</button>'}).join('')+'</div><p class="note err" id="szErr" role="alert" hidden>Choose an available size to continue.</p></div>';
  }else if(selected){
    sizesHTML='<p class="note mono">'+esc(variantLabel(selected))+'</p>';
  }else{
    sizesHTML='<p class="note err">This colorway is currently unavailable.</p>';
  }
  var det=p.details.map(function(d,k){return '<button type="button" data-det="'+(p.turn.length+storeImageCount+p.extra.length+k)+'"><img src="'+d.src+'" alt=""><span>'+esc(d.label)+'</span></button>'}).join('');
  $('#pdpIn').innerHTML=
   '<div class="pdp-media">'+
     '<div class="stagebox" id="stagebox" aria-label="Product images. Drag sideways to turn the hoodie.">'+pdp.media.map(function(m,k){return '<img src="'+esc(m.src)+'" alt="'+esc(m.alt)+'" class="'+(m.fit==='contain'?'contain ':'')+(k===0?'on':'')+'" draggable="false">'}).join('')+'</div>'+
     '<div class="turnbar mono" id="turnbar"><span>Turn</span><input id="turnRange" type="range" min="0" max="3" step="1" value="0" aria-label="Turn the hoodie: front, left, back, right"><span id="viewLabel" style="min-width:60px;text-align:right">Front</span></div>'+
     '<div class="thumbs" id="thumbs">'+pdp.media.map(function(m,k){return '<button class="th'+(m.fit==='contain'?' contain':'')+'" type="button" data-i="'+k+'" aria-label="'+esc(m.label)+'" '+(k===0?'aria-current="true"':'')+'><img src="'+esc(m.src)+'" alt=""></button>'}).join('')+'</div>'+
   '</div>'+
   '<div class="pdp-info">'+
     '<div><p class="mono" style="color:var(--bone2);margin:0 0 14px">Piece 0'+(SHOP.products.indexOf(p)+1)+' · Hoodie</p><h2>'+esc(p.name||SHOP.name)+'</h2></div>'+
     '<div class="pdp-price '+(!selected?'tba':'')+'" id="pdpPrice">'+(selected?fmt(selected.price):'Sold out')+'</div>'+
     '<div class="fld"><span class="mono">Colorway: '+p.color+'</span><div class="swatches" role="group" aria-label="Colorway">'+SHOP.products.map(function(q){return '<button class="sw" type="button" data-sw="'+q.id+'" aria-pressed="'+(q.id===p.id)+'"><span class="dot" style="background:'+q.swatch+'"></span>'+q.color+'</button>'}).join('')+'</div></div>'+
     sizesHTML+
     '<div class="buyrow"><div class="qty"><button type="button" id="qm" aria-label="Decrease quantity">−</button><output id="qv" aria-live="polite">1</output><button type="button" id="qp" aria-label="Increase quantity">+</button></div><button class="btn primary" type="button" id="addBtn" '+(!selected?'disabled':'')+'>Add to cart</button></div>'+
     (p.description?'<details class="acc" open><summary>Product description</summary><p class="zm-product-description">'+esc(p.description)+'</p></details>':'')+
     '<details class="acc" '+(p.description?'':'open')+'><summary>On the piece</summary><ul>'+p.features.map(function(f){return '<li>'+esc(f)+'</li>'}).join('')+'</ul></details>'+
     '<details class="acc"><summary>Details up close</summary><div class="detgrid">'+det+'</div></details>'+
     '<details class="acc"><summary>Fabric, fit and care</summary><p>Composition, sizing and care instructions have not been supplied yet. ZMANIYA will list them here.</p></details></div>'+
   '</div>';
  bindPDP();
}
function showMedia(i){
  pdp.i=i;
  $$('#stagebox img').forEach(function(im,k){im.classList.toggle('on',k===i)});
  $$('#thumbs .th').forEach(function(t,k){if(k===i)t.setAttribute('aria-current','true');else t.removeAttribute('aria-current')});
  var m=pdp.media[i],bar=$('#turnbar');bar.style.visibility=m.turn?'visible':'hidden';
  if(m.turn){$('#turnRange').value=i;$('#viewLabel').textContent=m.label}
}
function bindPDP(){
  var box=$('#stagebox'),dragX=null,start=0;
  $('#thumbs').addEventListener('click',function(e){var b=e.target.closest('.th');if(b)showMedia(+b.dataset.i)});
  $('#turnRange').addEventListener('input',function(e){showMedia(+e.target.value)});
  $$('[data-det]').forEach(function(b){b.addEventListener('click',function(){showMedia(+b.dataset.det);box.scrollIntoView({behavior:'smooth',block:'nearest'})})});
  box.addEventListener('pointerdown',function(e){if(!pdp.media[pdp.i].turn)return;dragX=e.clientX;start=pdp.i;box.classList.add('drag');box.setPointerCapture(e.pointerId)});
  box.addEventListener('pointermove',function(e){if(dragX==null)return;var step=Math.max(60,box.clientWidth/5),d=Math.round((dragX-e.clientX)/step);var n=((start+d)%4+4)%4;if(n!==pdp.i)showMedia(n)});
  var end=function(){dragX=null;box.classList.remove('drag')};box.addEventListener('pointerup',end);box.addEventListener('pointercancel',end);
  box.addEventListener('keydown',function(e){if(e.key==='ArrowRight'&&pdp.media[pdp.i].turn)showMedia((pdp.i+1)%4);if(e.key==='ArrowLeft'&&pdp.media[pdp.i].turn)showMedia((pdp.i+3)%4)});
  $$('[data-sw]').forEach(function(b){b.addEventListener('click',function(){pdp.id=b.dataset.sw;buildPDP();var s=$('[data-sw="'+pdp.id+'"]');if(s)s.focus()})});
  var sizes=$('#sizes');
  if(sizes)sizes.addEventListener('click',function(e){var b=e.target.closest('.sz');if(!b||b.disabled)return;pdp.variantId=b.dataset.variantId;pdp.size=b.dataset.s;$$('.sz').forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('#szErr').hidden=true;var p=PROD[pdp.id],v=currentVariant(p);$('#pdpPrice').textContent=fmt(v.price);$('#addBtn').disabled=!v.available});
  $('#qm').addEventListener('click',function(){pdp.qty=Math.max(1,pdp.qty-1);$('#qv').textContent=pdp.qty});
  $('#qp').addEventListener('click',function(){pdp.qty=Math.min(9,pdp.qty+1);$('#qv').textContent=pdp.qty});
  $('#addBtn').addEventListener('click',function(){
    var p=PROD[pdp.id],v=currentVariant(p);
    if(!v||!v.available){var s=$('#sizes');if(s){s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');$('#szErr').hidden=false}return}
    var button=$('#addBtn');button.disabled=true;button.textContent='Adding…';
    addToCart(pdp.id,pdp.size,pdp.qty,v.id).then(function(){closePDP(true);openCart()}).catch(function(err){button.disabled=false;button.textContent='Add to cart';var note=$('#szErr');if(note){note.hidden=false;note.textContent=err.message||'Could not add this item. Please try again.'}});
  });
}
function openPDP(id,idx,opener){
  pdp.id=id; buildPDP(); if(idx)showMedia(idx);
  lastFocus=opener||document.activeElement;
  pdpEl.scrollTop=0; pdpEl.classList.add('on'); veil.classList.remove('on'); lockScroll(true);
  setTimeout(function(){$('#pdpClose').focus()},60);
  try{history.replaceState(null,'','#piece-'+id)}catch(e){}
}
function closePDP(keepLock){
  pdpEl.classList.remove('on');
  if(!keepLock&&!cartEl.classList.contains('on'))lockScroll(false);
  if(!keepLock&&lastFocus&&lastFocus.focus)lastFocus.focus();
  try{history.replaceState(null,'','#collection')}catch(e){}
}
$('#pdpClose').addEventListener('click',function(){closePDP()});
pdpEl.addEventListener('keydown',function(e){trap(pdpEl,e)});
veil.addEventListener('click',function(){closeCart()});
document.addEventListener('keydown',function(e){
  if(e.key!=='Escape')return;
  if(cartEl.classList.contains('on'))closeCart(); else if(pdpEl.classList.contains('on'))closePDP();
});
window.addEventListener('hashchange',function(){
  var m=/^#piece-(white|black)$/.exec(location.hash); if(m&&!pdpEl.classList.contains('on'))openPDP(m[1],0);
});
renderCart();

/* ============ scrolling + guided story ============
   The story is a stack of 6 shots (0 opening ... 5 collection). One gesture (wheel, trackpad, swipe, key) moves exactly one
   shot: the camera flies, the old chapter dissolves, the new one writes itself in and then holds until the next gesture.
   Once the last shot is passed the page scrolls on normally into the shop (smooth scrolling via Lenis). */
var story=$('#story'), stage=$('#stage');
var LAST=5;
var easeIO=function(k){return k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2};
var coarse=window.matchMedia('(pointer: coarse)').matches;
var exiting=false, lenisOff=false, cueOn=null;
var Story={on:false,sf:0,target:0,tw:null,busy:false,dwell:0,exit:0,layers:[],hero:null};
var Wh={last:0,sign:0,mag:0,armed:true}, Tc={on:false,fired:false,y:0,x:0};
var railBtns=$$('#rail button'), navEl=$('#nav'), progEl=$('#prog'), heromark=$('#heromark'), cNow=$('#cNow'), cue=$('#nextcue'), cueTxt=$('#cueTxt');
function atTop(){return window.scrollY<12}
function overlayOpen(){return cartEl.classList.contains('on')||pdpEl.classList.contains('on')}
function syncLenis(){
  var eng=Story.on&&atTop()&&!exiting&&!overlayOpen();
  stage.classList.toggle('eng',eng);
  if(!lenis)return;
  var want=overlayOpen()||eng;
  if(want===lenisOff)return;
  lenisOff=want; if(want)lenis.stop(); else lenis.start();
}
function scrollToY(y,dur,done){
  exiting=true; syncLenis();
  var fin=function(){exiting=false;syncLenis();if(done)done()};
  if(lenis){ lenis.scrollTo(y,{duration:dur,easing:easeIO,lock:true,force:true,onComplete:fin}); }
  else{
    var y0=window.scrollY,t0=performance.now();
    (function step(now){var k=clamp((now-t0)/(dur*1000),0,1);window.scrollTo(0,y0+(y-y0)*easeIO(k));if(k<1)requestAnimationFrame(step);else fin()})(t0);
  }
}
function goTo(sel){
  if(sel==='#top'||sel==='#story'){goHome();return}
  var el=sel&&sel.length>1?$(sel):null; if(!el)return;
  var y=el.getBoundingClientRect().top+window.scrollY;
  scrollToY(y,clamp(Math.abs(y-window.scrollY)/1000*1.1+.7,1.4,2.6));
}
function goHome(){
  var go=function(){if(Story.on&&Story.target!==0)goStep(0,true)};
  if(window.scrollY>12)scrollToY(0,clamp(window.scrollY/1200+.7,1.4,2.6),go); else go();
}
document.addEventListener('click',function(e){
  var a=e.target.closest('a[data-go],a[href^="#"]');
  if(!a||a.closest('#cart'))return;
  var h=a.getAttribute('href'); if(!h||h.length<2)return;
  if(h.indexOf('#piece')===0)return;
  e.preventDefault();
  if(a.hasAttribute('data-step')&&Story.on){if(atTop())goStep(+a.dataset.step);else goHome();return}
  goTo(h);
});
railBtns.forEach(function(b){b.addEventListener('click',function(){if(Story.on&&atTop())goStep(+b.dataset.s)})});

/* chapters: words rise out of masks one after another, then the rest follows */
function splitWords(h){
  var out=[];
  (function walk(node){
    Array.prototype.slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var frag=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(w){
          if(!w)return;
          if(/^\s+$/.test(w)){frag.appendChild(document.createTextNode(' '));return}
          var m=document.createElement('span');m.className='w';var i=document.createElement('span');i.textContent=w;m.appendChild(i);frag.appendChild(m);out.push(i);
        });
        n.parentNode.replaceChild(frag,n);
      }else if(n.nodeType===1&&n.tagName!=='BR')walk(n);
    });
  })(h);
  return out;
}
function kidInit(K){ if(K.t==='rise')K.el.style.transform='translate3d(0,110%,0)'; else{K.el.style.opacity='0';K.el.style.transform='translate3d(0,22px,0)'} K.k=-1; }
function compileLayer(el){
  var L={el:el,state:'hidden',age:0,out:0,done:true,kids:[]};
  var add=function(n,d,dur,t){if(n){var K={el:n,d:d,dur:dur,t:t,k:-1};L.kids.push(K);kidInit(K)}};
  add($('.eyebrow',el),0,.6,'fade');
  var h=$('.h',el), ws=h?splitWords(h):[], d=.1;
  ws.forEach(function(w,j){add(w,d+j*.05,.8,'rise')});
  var base=d+ws.length*.05+.15;
  $$('.chap p',el).forEach(function(q){add(q,base,.8,'fade')});
  $$('.specimens li',el).forEach(function(li,j){add(li,base+.2+j*.08,.7,'fade')});
  add($('.ctas',el),base+.25,.7,'fade');
  return L;
}
function hideLayer(L){
  L.state='hidden';L.el.style.opacity='0';L.el.style.transform='';L.el.style.visibility='hidden';L.el.style.pointerEvents='none';L.el.setAttribute('aria-hidden','true');
  L.kids.forEach(kidInit);
}
function enterLayer(i){
  var L=Story.layers[i]; if(!L)return;
  L.kids.forEach(kidInit);
  L.state='in';L.age=0;L.out=0;L.done=false;
  L.el.style.transform='';L.el.style.opacity='0';L.el.style.visibility='visible';L.el.style.pointerEvents='auto';L.el.setAttribute('aria-hidden','false');
}
function leaveLayer(L){ if(L.state==='in'){L.state='out';L.out=0;L.el.style.pointerEvents='none'} }
function frameLayer(L,dt){
  if(L.state==='hidden')return;
  if(L.state==='in'){
    L.age+=dt;
    if(!L.done){
      var all=true;
      for(var j=0;j<L.kids.length;j++){
        var K=L.kids[j], k=clamp((L.age-K.d)/K.dur,0,1);
        if(k<1)all=false;
        if(k!==K.k){
          K.k=k; var e=1-Math.pow(1-k,3);
          if(K.t==='rise')K.el.style.transform='translate3d(0,'+((1-e)*110).toFixed(2)+'%,0)';
          else{K.el.style.opacity=e.toFixed(3);K.el.style.transform='translate3d(0,'+((1-e)*22).toFixed(1)+'px,0)'}
        }
      }
      if(all)L.done=true;
    }
    L.el.style.opacity=clamp(L.age/.4,0,1).toFixed(3);
  }else{
    L.out+=dt/.4;
    if(L.out>=1){hideLayer(L);return}
    var o=1-easeIO(L.out);
    L.el.style.opacity=o.toFixed(3);
    L.el.style.transform='translate3d(0,'+(-(1-o)*28).toFixed(1)+'px,0)';
  }
}
function chrome(n){
  railBtns.forEach(function(b,k){b.classList.toggle('on',k===n);if(k===n)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
  cNow.textContent=('0'+(n+1)).slice(-2);
  cue.dataset.s=n;
  cueTxt.textContent=n===LAST?(coarse?'Swipe up to enter the shop':'Scroll to enter the shop'):(coarse?'Swipe up':'Scroll');
  root.dataset.step=n;
}
function goStep(n,force){
  if(!Story.on||(Story.busy&&!force))return;
  n=clamp(Math.round(n),0,LAST);
  if(n===Story.target&&!Story.tw&&Math.abs(Story.sf-n)<.001)return;
  var dist=Math.abs(n-Story.sf);
  Story.layers.forEach(function(L){if(L)leaveLayer(L)});
  Story.target=n; Story.busy=true; Story.dwell=0;
  Story.tw={t:0,d:Math.min(3.4,1.1+.5*dist),from:Story.sf,to:n,entered:false};
  chrome(n);
}
function stepBy(d){
  if(!Story.on||Story.busy||exiting)return;
  var n=Story.target+d; if(n<0)return;
  if(n>LAST){var c=$('#collection');scrollToY(c.getBoundingClientRect().top+window.scrollY,2.2);return}
  goStep(n);
}
Story.frame=function(dt){
  var tw=Story.tw;
  if(tw){
    tw.t+=dt; var k=clamp(tw.t/tw.d,0,1);
    Story.sf=tw.from+(tw.to-tw.from)*easeIO(k);
    if(!tw.entered&&k>=.5){tw.entered=true;enterLayer(tw.to)}
    if(k>=1){Story.sf=tw.to;Story.tw=null;Story.dwell=.3}
  }else if(Story.busy&&!exiting){
    Story.dwell-=dt; if(Story.dwell<=0){Story.busy=false;Wh.armed=false}
  }
  for(var i=1;i<Story.layers.length;i++)frameLayer(Story.layers[i],dt);
  var sf=Story.sf, vh=window.innerHeight, sy=window.scrollY;
  Story.exit=clamp(sy/vh,0,1);
  var ho=1-sstep(.02,.3,sf), hs=1-sstep(0,vh*.35,sy), he=Story.hero;
  he.style.opacity=ho.toFixed(3);he.style.visibility=ho>.01?'visible':'hidden';he.style.pointerEvents=ho>.5?'auto':'none';
  he.style.transform='translate3d(0,'+(-(1-ho)*34).toFixed(1)+'px,0)';
  var hm=ho*hs;
  heromark.style.opacity=hm.toFixed(3);heromark.style.visibility=hm>.01?'visible':'hidden';
  heromark.style.transform='translate3d(0,'+(-sstep(0,.3,sf)*60).toFixed(1)+'px,0)';
  progEl.style.setProperty('--p',(sf/LAST).toFixed(4));
  var sc=!Story.busy&&!exiting&&atTop(); if(sc!==cueOn){cueOn=sc;cue.classList.toggle('on',sc)}
  var bz=Story.busy?'1':'0'; if(root.dataset.busy!==bz)root.dataset.busy=bz;
};

/* input: one gesture = one step. A pause, a direction change or a clearly harder push starts a new gesture, so
   trackpad inertia and fast wheel spins never skip chapters. */
function onWheel(e){
  if(!Story.on||e.ctrlKey||overlayOpen()||!atTop())return;
  e.preventDefault();e.stopPropagation();
  var now=e.timeStamp||performance.now(), dy=e.deltaMode===1?e.deltaY*32:e.deltaMode===2?e.deltaY*window.innerHeight:e.deltaY;
  var mag=Math.abs(dy), sg=dy>0?1:dy<0?-1:0; if(!sg)return;
  var gap=now-Wh.last;
  if(gap>140||(Wh.sign&&sg!==Wh.sign&&mag>6)||(mag>Wh.mag*1.9&&mag>45))Wh.armed=true;
  Wh.last=now;Wh.sign=sg;Wh.mag=mag;
  if(Story.busy||exiting||!Wh.armed||mag<3)return;
  Wh.armed=false; stepBy(sg);
}
function onTouchStart(e){
  Tc.on=Story.on&&!overlayOpen()&&atTop()&&e.touches.length===1;
  if(!Tc.on)return; Tc.fired=false; Tc.y=e.touches[0].clientY; Tc.x=e.touches[0].clientX;
}
function onTouchMove(e){
  if(!Tc.on||e.touches.length!==1)return;
  var dy=Tc.y-e.touches[0].clientY, dx=Tc.x-e.touches[0].clientX;
  if((Math.abs(dy)>10||Math.abs(dx)>10)&&e.cancelable)e.preventDefault();
  if(Tc.fired||Story.busy||exiting)return;
  if(Math.abs(dy)>40&&Math.abs(dy)>Math.abs(dx)*1.2){Tc.fired=true;stepBy(dy>0?1:-1)}
}
function onKey(e){
  if(!Story.on||overlayOpen()||!atTop()||e.altKey||e.ctrlKey||e.metaKey)return;
  var t=e.target; if(t&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))return;
  var k=e.key, d=0;
  if(k==='ArrowDown'||k==='PageDown')d=1;
  else if(k==='ArrowUp'||k==='PageUp')d=-1;
  else if(k===' '){if(t&&(t.tagName==='BUTTON'||t.tagName==='A'))return;d=e.shiftKey?-1:1}
  else if(k==='Home'){e.preventDefault();if(!Story.busy&&!exiting)goStep(0);return}
  else if(k==='End'){e.preventDefault();if(!Story.busy&&!exiting)goStep(LAST);return}
  else return;
  e.preventDefault(); stepBy(d);
}
function initStory(){
  var els=$$('.layer');
  Story.hero=els[0];
  Story.layers=els.map(function(el,i){return i===0?null:compileLayer(el)});
  Story.on=true; chrome(0);
  window.addEventListener('wheel',onWheel,{passive:false,capture:true});
  document.addEventListener('keydown',onKey);
  document.addEventListener('touchstart',onTouchStart,{passive:true});
  document.addEventListener('touchmove',onTouchMove,{passive:false});
  syncLenis();
}
function onScrollNav(){navEl.classList.toggle('solid',window.scrollY>window.innerHeight*.6)}
window.addEventListener('scroll',function(){
  if(Story.on&&atTop()&&!exiting&&!overlayOpen()&&window.scrollY>0)window.scrollTo(0,0);
  syncLenis();onScrollNav();
},{passive:true});

/* ============ WebGL world ============ */
var glOK=false, world=null;
function initWorld(){
  if(typeof THREE==='undefined')return false;
  var canvas=$('#gl'), renderer;
  try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:!isMobile,powerPreference:'high-performance',alpha:false});}catch(e){return false}
  if(!renderer||!renderer.getContext())return false;
  var DPR=Math.min(window.devicePixelRatio||1,isMobile?1.5:2);
  renderer.setPixelRatio(DPR); renderer.setClearColor(0x0a0908,1);
  var scene=new THREE.Scene();
  var camera=new THREE.PerspectiveCamera(55,1,0.1,200);
  var shared={uTime:{value:0},uCamZ:{value:9},uVel:{value:0}};
  var loader=new THREE.TextureLoader();
  var maxAniso=renderer.capabilities.getMaxAnisotropy?renderer.capabilities.getMaxAnisotropy():1;
  function tex(url,cb,errCb){
    /* Theme assets are served from YouCan's CDN. The original local-file build
       used an 8 MB base64 texture map; the theme loads the same images directly. */
    loader.load(url,function(t){t.anisotropy=Math.min(4,maxAniso);if(cb)cb(t)},undefined,function(err){
      if(errCb)errCb(err);
      else if(window.console)console.warn('ZMANIYA: texture failed '+url,err);
    });
  }
  canvas.addEventListener('webglcontextlost',function(e){
    e.preventDefault();
    if(window.console)console.warn('ZMANIYA: WebGL context lost; falling back to static');
    stop();
    setStatic();
  },false);

  /* camera: six authored shots, one per story step; the path glides through them and rests exactly on each */
  var SHOTS=[
    {p:[0,0.1,9.6],t:[0,0.1,-6]},
    {p:[0.2,0.05,-3.2],t:[0.2,0,-11]},
    {p:[-0.5,0.2,-17.5],t:[-0.5,0.1,-25.5]},
    {p:[0.4,-0.1,-31.5],t:[0.4,0,-39.5]},
    {p:[-0.3,0.15,-45.5],t:[-0.3,0.1,-53.5]},
    {p:[0,0,-59.2],t:[0,0,-67]}
  ];
  var camCurve=new THREE.CatmullRomCurve3(SHOTS.map(function(q){return new THREE.Vector3(q.p[0],q.p[1],q.p[2])}),false,'catmullrom',0.5);
  var tgtCurve=new THREE.CatmullRomCurve3(SHOTS.map(function(q){return new THREE.Vector3(q.t[0],q.t[1],q.t[2])}),false,'catmullrom',0.5);

  /* --- the dial: bone disc with clock ticks, paper grain, a red marker and a light that follows the cursor --- */
  var hero=new THREE.Group(); scene.add(hero);
  var dialMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,
    uniforms:{uTime:{value:0},uHand:{value:0},uMouse:{value:new THREE.Vector2(0,0)},uAlpha:{value:1}},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:[
      'uniform float uTime,uHand,uAlpha;uniform vec2 uMouse;varying vec2 vUv;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}',
      'void main(){',
      ' vec2 p=vUv*2.-1.;float r=length(p);float a=atan(p.y,p.x);if(r>1.)discard;',
      ' vec3 bone=vec3(.91,.88,.82),aged=vec3(.60,.52,.40);',
      ' float paper=fbm(vUv*9.+3.)*.55+fbm(vUv*60.)*.25;',
      ' vec3 col=mix(bone,aged,smoothstep(.5,1.,r)*.75+paper*.28);',
      ' col*=.9+.14*fbm(vUv*160.+uTime*.02);',
      ' float l=smoothstep(1.5,0.,length(p-uMouse*.85));col*=.72+.4*l;',
      ' float ang=a/6.2831853+.5;',
      ' float mi=abs(fract(ang*60.+.5)-.5),ma=abs(fract(ang*12.+.5)-.5);',
      ' float rm=smoothstep(.915,.92,r)*(1.-smoothstep(.955,.96,r));',
      ' float rj=smoothstep(.88,.885,r)*(1.-smoothstep(.96,.965,r));',
      ' float tm=rm*(1.-smoothstep(.02,.035,mi)),tj=rj*(1.-smoothstep(.035,.06,ma));',
      ' vec3 ink=vec3(.06,.05,.045);col=mix(col,ink,max(tm*.72,tj));',
      ' col=mix(col,ink,(1.-smoothstep(0.,.004,abs(r-.985)))*.5);',
      ' col=mix(col,ink,(1.-smoothstep(0.,.003,abs(r-.86)))*.3);',
      ' float da=abs(mod(a-uHand+3.14159,6.28318)-3.14159);',
      ' float mk=(1.-smoothstep(0.,.035,da))*smoothstep(.86,.87,r)*(1.-smoothstep(.97,.975,r));',
      ' col=mix(col,vec3(.83,.09,.11),mk);',
      ' gl_FragColor=vec4(col,(1.-smoothstep(.992,1.,r))*uAlpha);}'
    ].join('\n')});
  var DISC=7.6, LOGO_H=5.15;
  var disc=new THREE.Mesh(new THREE.PlaneGeometry(DISC,DISC),dialMat); disc.position.z=-0.5; hero.add(disc);
  var logoMat=new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,opacity:1,color:0xffffff});
  var logo=null;
  var readyTimer=setTimeout(function(){
    if(!canvas.classList.contains('ready')){
      if(window.console)console.warn('ZMANIYA: 3D scene ready timeout; falling back to static');
      stop();
      setStatic();
    }
  },3500);
  tex(A+'logo.png',function(t){
    if(readyTimer){clearTimeout(readyTimer);readyTimer=null}
    var asp=t.image.width/t.image.height; logoMat.map=t; logoMat.needsUpdate=true;
    logo=new THREE.Mesh(new THREE.PlaneGeometry(LOGO_H*asp,LOGO_H),logoMat); logo.position.z=0.25; hero.add(logo);
    canvas.classList.add('ready');
  },function(err){
    if(readyTimer){clearTimeout(readyTimer);readyTimer=null}
    if(window.console)console.warn('ZMANIYA: Logo texture failed to load; falling back to static',err);
    stop();
    setStatic();
  });
  /* falling sand along the logo's own vertical axis, from the top star to the bottom star */
  var SN=isMobile?110:220, sandPos=new Float32Array(SN*3), sandSeed=[];
  for(var i=0;i<SN;i++){sandSeed.push(Math.random());sandPos[i*3]=(Math.random()-.5)*.05;sandPos[i*3+1]=Math.random();sandPos[i*3+2]=.6}
  var sandGeo=new THREE.BufferGeometry(); sandGeo.setAttribute('position',new THREE.BufferAttribute(sandPos,3));
  var sandMat=new THREE.PointsMaterial({size:.045,color:0xd4161c,transparent:true,opacity:.95,depthWrite:false,blending:THREE.AdditiveBlending});
  var stream=new THREE.Points(sandGeo,sandMat); hero.add(stream);

  /* --- ambient sand across the whole tunnel --- */
  var PN=isMobile?900:2400, pp=new Float32Array(PN*3), ps=new Float32Array(PN);
  for(var j=0;j<PN;j++){pp[j*3]=(Math.random()-.5)*20;pp[j*3+1]=(Math.random()-.5)*14;pp[j*3+2]=10-Math.random()*76;ps[j]=Math.random()}
  var pGeo=new THREE.BufferGeometry(); pGeo.setAttribute('position',new THREE.BufferAttribute(pp,3)); pGeo.setAttribute('aSeed',new THREE.BufferAttribute(ps,1));
  var pMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{uTime:{value:0},uPR:{value:DPR}},
    vertexShader:['attribute float aSeed;uniform float uTime,uPR;varying float vA;varying float vM;',
      'void main(){vec3 p=position;p.y=mod(p.y-uTime*(.18+aSeed*.4)+7.,14.)-7.;p.x+=sin(uTime*.25+aSeed*40.)*.3;',
      'vec4 mv=modelViewMatrix*vec4(p,1.);float d=-mv.z;vA=smoothstep(.6,2.5,d)*(1.-smoothstep(16.,34.,d));vM=step(.74,fract(aSeed*7.13));',
      'gl_PointSize=clamp((1.4+aSeed*3.2)*uPR*(14./max(d,.5)),.6,9.*uPR);gl_Position=projectionMatrix*mv;}'].join('\n'),
    fragmentShader:['varying float vA;varying float vM;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.05,d)*vA*.75;',
      'vec3 c=mix(vec3(.92,.87,.76),vec3(.9,.1,.12),vM);gl_FragColor=vec4(c,a);}'].join('\n')});
  scene.add(new THREE.Points(pGeo,pMat));

  /* --- rings the camera passes through --- */
  var rings=[];
  [[-9.5,3.2,0xd4161c,1],[-10.3,4.8,0xe8e1d2,.5],[-24.5,3.6,0xd4161c,1],[-38.5,4.0,0xe8e1d2,.6],[-52,3.1,0xd4161c,1]].forEach(function(d,k){
    var m=new THREE.Mesh(new THREE.TorusGeometry(d[1],0.014,6,200),new THREE.MeshBasicMaterial({color:d[2],transparent:true,opacity:d[3],depthWrite:false}));
    m.position.set(0,0,d[0]);m.rotation.x=.12*(k%2?1:-1);m.userData={base:d[3],z:d[0],k:k};scene.add(m);rings.push(m);
  });

  /* --- archive fragments: photographs hung in the corridor (mood only, products stay untouched in the shop) --- */
  var cardVS='uniform float uTime,uVel;varying vec2 vUv;varying float vZ;void main(){vUv=uv;vec3 p=position;'+
    'p.z+=sin(uv.y*3.1416+uTime*.6)*.05+uVel*.4*sin(uv.x*3.1416)*(uv.y-.5);vec4 w=modelMatrix*vec4(p,1.);vZ=w.z;gl_Position=projectionMatrix*viewMatrix*w;}';
  var cardFS=['uniform sampler2D uMap;uniform float uCamZ,uSeed,uHover;varying vec2 vUv;varying float vZ;',
    'void main(){vec4 c=texture2D(uMap,vUv);float d=uCamZ-vZ;',
    'float vis=(1.-smoothstep(15.,32.,d))*smoothstep(.5,3.4,d);',
    'float g=dot(c.rgb,vec3(.299,.587,.114));vec3 warm=vec3(g)*vec3(1.06,.97,.88);',
    'float col=smoothstep(20.,5.,d)*.85+uHover*.15;vec3 rgb=mix(warm*.5,c.rgb,col);',
    'vec2 e=abs(vUv-.5)*2.;rgb*=1.-smoothstep(.72,1.,max(e.x,e.y))*.4;rgb*=1.+uHover*.22;',
    'float n=fract(sin(dot(vUv*vec2(913.,517.)+uSeed,vec2(12.9898,78.233)))*43758.5453);rgb+=(n-.5)*.07;',
    'gl_FragColor=vec4(rgb,vis);}'].join('\n');
  var cards=[], texCache={};
  function getTex(n,cb){
    var c=texCache[n];
    if(c){if(c.t)cb(c.t);else c.q.push(cb);return}
    c=texCache[n]={t:null,q:[cb]};
    tex(A+n+'.jpg',function(t){c.t=t;var q=c.q;c.q=null;q.forEach(function(f){f(t)})});
  }
  /* each story step has its own cluster, hung around that step's camera position: [photo, step, right, up, depth, height, turn] */
  var CARDS=[
    ['w-life2',1,3.4,.3,8.6,3.9,-.28],['k-life1',1,-5.2,-2.6,13,3.4,.3],['w-life3',1,6.8,2.7,15,3.6,-.3],
    ['k-life1',2,2.4,.2,7.2,4.3,-.26],['w-life1',2,6.0,2.6,11,3.3,-.38],['w-life3',2,1.2,-2.9,9.5,3.0,.28],['k-life2',2,7.8,-2.3,14,4.0,-.3],['w-life2',2,-5.5,2.0,12,3.6,.35],
    ['w-d-logo',3,2.6,1.9,9.0,2.2,-.25],['w-d-seal',3,5.4,.5,10.5,2.4,-.35],['w-d-label',3,2.8,-1.5,7.8,1.5,-.2],['w-d-cord',3,5.4,-2.7,9.6,1.8,-.3],['w-d-fabric',3,.2,3.5,12,2.6,-.15],['k-d-hood',3,-4.5,-2.5,12,2.2,.3],['k-d-sleeve',3,9.4,2.8,14,2.4,-.4],
    ['w-life1',4,2.9,.1,6.6,4.7,-.22],['w-d-seal',4,6.4,2.7,10.5,2.3,-.35],['k-print',4,6.0,-2.6,9.5,3.2,-.3],['k-life2',4,-5.5,-1.5,13,4.0,.3]
  ];
  function placeCard(c){
    var u=c.userData, q=SHOTS[u.shot].p, portrait=asp<1, kx=portrait?asp*.6:(asp<1.35?.86:1), ky=portrait?.5:1;
    c.position.set(q[0]+u.dx*kx,q[1]+u.dy*ky+(portrait?2.3:0),q[2]-u.depth);
    u.baseY=c.position.y;u.bs=portrait?.62:1;
  }
  function layoutCards(){cards.forEach(placeCard)}
  CARDS.forEach(function(d,k){
    getTex(d[0],function(t){
      var ar=t.image.width/t.image.height,h=d[5];
      var mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,vertexShader:cardVS,fragmentShader:cardFS,
        uniforms:{uMap:{value:t},uSeed:{value:Math.random()*10},uHover:{value:0},uTime:shared.uTime,uCamZ:shared.uCamZ,uVel:shared.uVel}});
      var m=new THREE.Mesh(new THREE.PlaneGeometry(h*ar,h,10,10),mat);
      m.rotation.y=d[6];m.userData={hover:0,ht:0,k:k,shot:d[1],dx:d[2],dy:d[3],depth:d[4],baseY:0,bs:1};
      placeCard(m);scene.add(m);cards.push(m);
    });
  });

  /* --- the gate at the end: doors slide open on a red-white light --- */
  var gateGlow=new THREE.Mesh(new THREE.PlaneGeometry(16,16),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{uI:{value:.2},uTime:shared.uTime},
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform float uI,uTime;varying vec2 vUv;void main(){vec2 p=vUv-.5;float g=exp(-abs(p.x)*16.)*smoothstep(.5,.0,abs(p.y));float core=exp(-abs(p.x)*70.)*smoothstep(.5,.1,abs(p.y));vec3 c=vec3(.85,.08,.1)*g+vec3(.95,.9,.8)*core;float fl=.94+.06*sin(uTime*7.+p.y*9.);gl_FragColor=vec4(c*uI*fl*1.6,1.);}'}));
  gateGlow.position.z=-65; scene.add(gateGlow);
  var doorMat=new THREE.MeshBasicMaterial({color:0x0a0908});
  var doorL=new THREE.Mesh(new THREE.PlaneGeometry(8,22),doorMat), doorR=new THREE.Mesh(new THREE.PlaneGeometry(8,22),doorMat);
  doorL.position.z=doorR.position.z=-63.4; scene.add(doorL);scene.add(doorR);

  /* --- sizing --- */
  var W=1,H=1,asp=1;
  function resize(){
    W=window.innerWidth;H=window.innerHeight;asp=W/H;
    renderer.setSize(W,H,false);camera.aspect=asp;camera.updateProjectionMatrix();
    var visH=2*10.2*Math.tan(27.5*Math.PI/180),visW=visH*asp;
    var fit=Math.min(visH*.74,visW*.92),s=Math.min(1.12,fit/DISC);
    hero.scale.setScalar(s);hero.position.y=asp<1?visH*.1:visH*.085;hero.userData.s=s;
    layoutCards();
  }
  resize();
  var lastW=window.innerWidth,lastH=window.innerHeight;
  window.addEventListener('resize',function(){
    var w=window.innerWidth,h=window.innerHeight;
    if(isMobile&&w===lastW&&Math.abs(h-lastH)<140)return;
    lastW=w;lastH=h;resize();
  });

  /* --- pointer --- */
  var mouse={x:0,y:0,sx:0,sy:0,nx:-2,ny:-2};
  window.addEventListener('pointermove',function(e){mouse.x=(e.clientX/window.innerWidth-.5)*2;mouse.y=(e.clientY/window.innerHeight-.5)*2;mouse.nx=mouse.x;mouse.ny=-mouse.y;},{passive:true});
  var ray=new THREE.Raycaster(),v2=new THREE.Vector2();

  /* --- frame --- */
  var pS=0,pPrev=0,vel=0,handA=0,sandT=0,last=performance.now(),raf=0,running=false,tmp=new THREE.Vector3(),look=new THREE.Vector3(),frameN=0;
  function frame(now){
    raf=requestAnimationFrame(frame);
    var dt=Math.min(.1,(now-last)/1000);last=now;frameN++;
    Story.frame(dt);
    pS=Story.sf;
    var v=(pS-pPrev)/Math.max(dt,.001);pPrev=pS;vel+=(clamp(v*.3,-1,1)-vel)*(1-Math.exp(-dt*6));
    sandT+=dt*(1+Math.abs(vel)*10);
    shared.uTime.value=now/1000;shared.uVel.value=vel*.6;

    mouse.sx+=(mouse.x-mouse.sx)*(1-Math.exp(-dt*3));mouse.sy+=(mouse.y-mouse.sy)*(1-Math.exp(-dt*3));
    var ti=now/1000, u=clamp(pS/LAST,0,1);
    camCurve.getPoint(u,tmp);tgtCurve.getPoint(u,look);
    tmp.x+=Math.sin(ti*.23)*.14;tmp.y+=Math.cos(ti*.19)*.08;tmp.z+=Math.sin(ti*.17)*.2-Story.exit*2.6;
    look.z-=Story.exit*2.6;
    camera.position.copy(tmp);camera.lookAt(look);
    camera.rotateY(-mouse.sx*.06);camera.rotateX(-mouse.sy*.04);camera.rotateZ(vel*.025);
    shared.uCamZ.value=camera.position.z;

    /* dial + logo */
    var dz=camera.position.z-0;
    var fadeIn=1-sstep(5.5,1.4,dz);             // approach fade
    var a=clamp(fadeIn,0,1);
    dialMat.uniforms.uAlpha.value=a;logoMat.opacity=a;sandMat.opacity=.95*a;
    hero.visible=a>.003;
    handA-=dt*(.22+Math.abs(vel)*14);
    dialMat.uniforms.uHand.value=handA;dialMat.uniforms.uTime.value=now/1000;
    dialMat.uniforms.uMouse.value.set(mouse.sx*.9,-mouse.sy*.9);
    hero.rotation.y=mouse.sx*.1;hero.rotation.x=mouse.sy*.06;
    if(logo){logo.position.x=-mouse.sx*.08;logo.position.y=mouse.sy*.05}
    // sand stream
    var top=2.0,bot=-1.75,sp=sandGeo.attributes.position.array;
    for(var i=0;i<SN;i++){
      var f=(sandPos[i*3+1]+sandT*(.12+sandSeed[i]*.25))%1;
      var y=top-(f*f*.6+f*.4)*(top-bot);
      sp[i*3]=(sandSeed[i]-.5)*.05*(1+f*2.4);sp[i*3+1]=y;
    }
    sandGeo.attributes.position.needsUpdate=true;

    /* ring fades + spin */
    rings.forEach(function(r){
      var d=camera.position.z-r.userData.z;
      var o=(1-sstep(14,30,d))*sstep(-1.5,1.2,d);
      r.material.opacity=r.userData.base*o;r.visible=o>.01;
      r.rotation.z+=dt*(.1+r.userData.k*.04)*(r.userData.k%2?1:-1);
    });
    pMat.uniforms.uTime.value=sandT;

    /* card hover (desktop) */
    if(!isMobile&&frameN%2===0&&mouse.nx>-1.5){
      v2.set(mouse.nx,mouse.ny);ray.setFromCamera(v2,camera);
      var hit=ray.intersectObjects(cards,false)[0];
      cards.forEach(function(c){c.userData.ht=(hit&&hit.object===c)?1:0});
    }
    cards.forEach(function(c){
      var u=c.userData;u.hover+=(u.ht-u.hover)*(1-Math.exp(-dt*7));
      c.material.uniforms.uHover.value=u.hover;
      c.position.y=u.baseY+Math.sin(now/1000*.5+u.k*1.7)*.07;
      var s=u.bs*(1+u.hover*.04);c.scale.set(s,s,1);
    });

    /* gate */
    var open=Math.max(sstep(4.1,5,pS),Story.exit);
    doorL.position.x=-(4.02+open*5.6);doorR.position.x=4.02+open*5.6;
    gateGlow.material.uniforms.uI.value=.25+open*.9;
    try{
      renderer.render(scene,camera);
    }catch(err){
      if(window.console)console.warn('ZMANIYA: Render failed; falling back to static',err);
      stop();
      setStatic();
      return;
    }
  }
  function start(){if(running)return;running=true;last=performance.now();raf=requestAnimationFrame(frame)}
  function stop(){running=false;cancelAnimationFrame(raf)}
  return {start:start,stop:stop,resize:resize,renderer:renderer};
}

/* ============ boot ============ */
function setStatic(){
  root.classList.add('static');
  Story.on=false;
  if(world&&world.stop){try{world.stop()}catch(e){}}
  glOK=false;
  syncLenis();
  $$('.layer').forEach(function(el){el.style.visibility='visible';el.style.pointerEvents='auto';el.removeAttribute('aria-hidden')});
  var poster=$('.poster');if(poster)poster.removeAttribute('aria-hidden');
}
if(reduce){setStatic()}
else{
  try{world=initWorld()}catch(err){world=null;if(window.console)console.warn('ZMANIYA: WebGL scene unavailable',err)}
  if(!world){setStatic()}
  else{
    glOK=true;
    initStory();
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting)world.start();else world.stop()})},{rootMargin:'200px 0px 200px 0px'});
    io.observe(story);
    document.addEventListener('visibilitychange',function(){if(document.hidden)world.stop();else if(story.getBoundingClientRect().bottom>-200)world.start()});
  }
}

/* smooth scrolling + motion (optional libraries; the page works without them) */
if(!reduce&&typeof Lenis!=='undefined'){
  try{
    lenis=new Lenis({duration:1.4,smoothWheel:true,wheelMultiplier:.85,touchMultiplier:1.4});
    lenisOff=false;syncLenis();
    var raf2=function(t){lenis.raf(t);requestAnimationFrame(raf2)};requestAnimationFrame(raf2);
    if(typeof ScrollTrigger!=='undefined'&&typeof gsap!=='undefined'){gsap.registerPlugin(ScrollTrigger);lenis.on('scroll',ScrollTrigger.update)}
  }catch(e){lenis=null}
}
if(!reduce&&typeof gsap!=='undefined'){
  try{
    gsap.from('.heromark i',{yPercent:110,duration:1.25,ease:'power4.out',stagger:.07,delay:.15});
    gsap.from('.hero-ar',{xPercent:12,duration:1.4,ease:'power3.out',delay:.5});
    gsap.from('.l-hero .slogan, .l-hero .ctas',{y:24,duration:1,ease:'power3.out',stagger:.12,delay:.7});
    if(typeof ScrollTrigger!=='undefined'){
      gsap.utils.toArray('.card').forEach(function(c,k){gsap.from(c,{y:60,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 92%',once:true},delay:k*.08})});
      gsap.utils.toArray('.fig').forEach(function(f,k){gsap.from(f,{y:40+k*8,duration:1,ease:'power3.out',scrollTrigger:{trigger:f,start:'top 98%',once:true}})});
    }
  }catch(e){}
}
onScrollNav();
if(!glOK&&!root.classList.contains('static')){setStatic()}
var m0=/^#piece-(white|black)$/.exec(location.hash); if(m0)setTimeout(function(){openPDP(m0[1],0)},300);
})();