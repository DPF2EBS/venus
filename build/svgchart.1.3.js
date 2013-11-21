// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2.1.0 - JavaScript Vector Library                          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2008-2012 Dmitry Baranovskiy (http://raphaeljs.com)    │ \\
// │ Copyright © 2008-2012 Sencha Labs (http://sencha.com)              │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license.│ \\
// └────────────────────────────────────────────────────────────────────┘ \\

(function(a){var b="0.3.4",c="hasOwnProperty",d=/[\.\/]/,e="*",f=function(){},g=function(a,b){return a-b},h,i,j={n:{}},k=function(a,b){var c=j,d=i,e=Array.prototype.slice.call(arguments,2),f=k.listeners(a),l=0,m=!1,n,o=[],p={},q=[],r=h,s=[];h=a,i=0;for(var t=0,u=f.length;t<u;t++)"zIndex"in f[t]&&(o.push(f[t].zIndex),f[t].zIndex<0&&(p[f[t].zIndex]=f[t]));o.sort(g);while(o[l]<0){n=p[o[l++]],q.push(n.apply(b,e));if(i){i=d;return q}}for(t=0;t<u;t++){n=f[t];if("zIndex"in n)if(n.zIndex==o[l]){q.push(n.apply(b,e));if(i)break;do{l++,n=p[o[l]],n&&q.push(n.apply(b,e));if(i)break}while(n)}else p[n.zIndex]=n;else{q.push(n.apply(b,e));if(i)break}}i=d,h=r;return q.length?q:null};k.listeners=function(a){var b=a.split(d),c=j,f,g,h,i,k,l,m,n,o=[c],p=[];for(i=0,k=b.length;i<k;i++){n=[];for(l=0,m=o.length;l<m;l++){c=o[l].n,g=[c[b[i]],c[e]],h=2;while(h--)f=g[h],f&&(n.push(f),p=p.concat(f.f||[]))}o=n}return p},k.on=function(a,b){var c=a.split(d),e=j;for(var g=0,h=c.length;g<h;g++)e=e.n,!e[c[g]]&&(e[c[g]]={n:{}}),e=e[c[g]];e.f=e.f||[];for(g=0,h=e.f.length;g<h;g++)if(e.f[g]==b)return f;e.f.push(b);return function(a){+a==+a&&(b.zIndex=+a)}},k.stop=function(){i=1},k.nt=function(a){if(a)return(new RegExp("(?:\\.|\\/|^)"+a+"(?:\\.|\\/|$)")).test(h);return h},k.off=k.unbind=function(a,b){var f=a.split(d),g,h,i,k,l,m,n,o=[j];for(k=0,l=f.length;k<l;k++)for(m=0;m<o.length;m+=i.length-2){i=[m,1],g=o[m].n;if(f[k]!=e)g[f[k]]&&i.push(g[f[k]]);else for(h in g)g[c](h)&&i.push(g[h]);o.splice.apply(o,i)}for(k=0,l=o.length;k<l;k++){g=o[k];while(g.n){if(b){if(g.f){for(m=0,n=g.f.length;m<n;m++)if(g.f[m]==b){g.f.splice(m,1);break}!g.f.length&&delete g.f}for(h in g.n)if(g.n[c](h)&&g.n[h].f){var p=g.n[h].f;for(m=0,n=p.length;m<n;m++)if(p[m]==b){p.splice(m,1);break}!p.length&&delete g.n[h].f}}else{delete g.f;for(h in g.n)g.n[c](h)&&g.n[h].f&&delete g.n[h].f}g=g.n}}},k.once=function(a,b){var c=function(){var d=b.apply(this,arguments);k.unbind(a,c);return d};return k.on(a,c)},k.version=b,k.toString=function(){return"You are running Eve "+b},a.eve=k})(this),function(){function cF(a){for(var b=0;b<cy.length;b++)cy[b].el.paper==a&&cy.splice(b--,1)}function cE(b,d,e,f,h,i){e=Q(e);var j,k,l,m=[],o,p,q,t=b.ms,u={},v={},w={};if(f)for(y=0,z=cy.length;y<z;y++){var x=cy[y];if(x.el.id==d.id&&x.anim==b){x.percent!=e?(cy.splice(y,1),l=1):k=x,d.attr(x.totalOrigin);break}}else f=+v;for(var y=0,z=b.percents.length;y<z;y++){if(b.percents[y]==e||b.percents[y]>f*b.top){e=b.percents[y],p=b.percents[y-1]||0,t=t/b.top*(e-p),o=b.percents[y+1],j=b.anim[e];break}f&&d.attr(b.anim[b.percents[y]])}if(!!j){if(!k){for(var A in j)if(j[g](A))if(U[g](A)||d.paper.customAttributes[g](A)){u[A]=d.attr(A),u[A]==null&&(u[A]=T[A]),v[A]=j[A];switch(U[A]){case C:w[A]=(v[A]-u[A])/t;break;case"colour":u[A]=a.getRGB(u[A]);var B=a.getRGB(v[A]);w[A]={r:(B.r-u[A].r)/t,g:(B.g-u[A].g)/t,b:(B.b-u[A].b)/t};break;case"path":var D=bR(u[A],v[A]),E=D[1];u[A]=D[0],w[A]=[];for(y=0,z=u[A].length;y<z;y++){w[A][y]=[0];for(var F=1,G=u[A][y].length;F<G;F++)w[A][y][F]=(E[y][F]-u[A][y][F])/t}break;case"transform":var H=d._,I=ca(H[A],v[A]);if(I){u[A]=I.from,v[A]=I.to,w[A]=[],w[A].real=!0;for(y=0,z=u[A].length;y<z;y++){w[A][y]=[u[A][y][0]];for(F=1,G=u[A][y].length;F<G;F++)w[A][y][F]=(v[A][y][F]-u[A][y][F])/t}}else{var J=d.matrix||new cb,K={_:{transform:H.transform},getBBox:function(){return d.getBBox(1)}};u[A]=[J.a,J.b,J.c,J.d,J.e,J.f],b$(K,v[A]),v[A]=K._.transform,w[A]=[(K.matrix.a-J.a)/t,(K.matrix.b-J.b)/t,(K.matrix.c-J.c)/t,(K.matrix.d-J.d)/t,(K.matrix.e-J.e)/t,(K.matrix.f-J.f)/t]}break;case"csv":var L=r(j[A])[s](c),M=r(u[A])[s](c);if(A=="clip-rect"){u[A]=M,w[A]=[],y=M.length;while(y--)w[A][y]=(L[y]-u[A][y])/t}v[A]=L;break;default:L=[][n](j[A]),M=[][n](u[A]),w[A]=[],y=d.paper.customAttributes[A].length;while(y--)w[A][y]=((L[y]||0)-(M[y]||0))/t}}var O=j.easing,P=a.easing_formulas[O];if(!P){P=r(O).match(N);if(P&&P.length==5){var R=P;P=function(a){return cC(a,+R[1],+R[2],+R[3],+R[4],t)}}else P=bf}q=j.start||b.start||+(new Date),x={anim:b,percent:e,timestamp:q,start:q+(b.del||0),status:0,initstatus:f||0,stop:!1,ms:t,easing:P,from:u,diff:w,to:v,el:d,callback:j.callback,prev:p,next:o,repeat:i||b.times,origin:d.attr(),totalOrigin:h},cy.push(x);if(f&&!k&&!l){x.stop=!0,x.start=new Date-t*f;if(cy.length==1)return cA()}l&&(x.start=new Date-x.ms*f),cy.length==1&&cz(cA)}else k.initstatus=f,k.start=new Date-k.ms*f;eve("raphael.anim.start."+d.id,d,b)}}function cD(a,b){var c=[],d={};this.ms=b,this.times=1;if(a){for(var e in a)a[g](e)&&(d[Q(e)]=a[e],c.push(Q(e)));c.sort(bd)}this.anim=d,this.top=c[c.length-1],this.percents=c}function cC(a,b,c,d,e,f){function o(a,b){var c,d,e,f,j,k;for(e=a,k=0;k<8;k++){f=m(e)-a;if(z(f)<b)return e;j=(3*i*e+2*h)*e+g;if(z(j)<1e-6)break;e=e-f/j}c=0,d=1,e=a;if(e<c)return c;if(e>d)return d;while(c<d){f=m(e);if(z(f-a)<b)return e;a>f?c=e:d=e,e=(d-c)/2+c}return e}function n(a,b){var c=o(a,b);return((l*c+k)*c+j)*c}function m(a){return((i*a+h)*a+g)*a}var g=3*b,h=3*(d-b)-g,i=1-g-h,j=3*c,k=3*(e-c)-j,l=1-j-k;return n(a,1/(200*f))}function cq(){return this.x+q+this.y+q+this.width+" × "+this.height}function cp(){return this.x+q+this.y}function cb(a,b,c,d,e,f){a!=null?(this.a=+a,this.b=+b,this.c=+c,this.d=+d,this.e=+e,this.f=+f):(this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0)}function bH(b,c,d){b=a._path2curve(b),c=a._path2curve(c);var e,f,g,h,i,j,k,l,m,n,o=d?0:[];for(var p=0,q=b.length;p<q;p++){var r=b[p];if(r[0]=="M")e=i=r[1],f=j=r[2];else{r[0]=="C"?(m=[e,f].concat(r.slice(1)),e=m[6],f=m[7]):(m=[e,f,e,f,i,j,i,j],e=i,f=j);for(var s=0,t=c.length;s<t;s++){var u=c[s];if(u[0]=="M")g=k=u[1],h=l=u[2];else{u[0]=="C"?(n=[g,h].concat(u.slice(1)),g=n[6],h=n[7]):(n=[g,h,g,h,k,l,k,l],g=k,h=l);var v=bG(m,n,d);if(d)o+=v;else{for(var w=0,x=v.length;w<x;w++)v[w].segment1=p,v[w].segment2=s,v[w].bez1=m,v[w].bez2=n;o=o.concat(v)}}}}}return o}function bG(b,c,d){var e=a.bezierBBox(b),f=a.bezierBBox(c);if(!a.isBBoxIntersect(e,f))return d?0:[];var g=bB.apply(0,b),h=bB.apply(0,c),i=~~(g/5),j=~~(h/5),k=[],l=[],m={},n=d?0:[];for(var o=0;o<i+1;o++){var p=a.findDotsAtSegment.apply(a,b.concat(o/i));k.push({x:p.x,y:p.y,t:o/i})}for(o=0;o<j+1;o++)p=a.findDotsAtSegment.apply(a,c.concat(o/j)),l.push({x:p.x,y:p.y,t:o/j});for(o=0;o<i;o++)for(var q=0;q<j;q++){var r=k[o],s=k[o+1],t=l[q],u=l[q+1],v=z(s.x-r.x)<.001?"y":"x",w=z(u.x-t.x)<.001?"y":"x",x=bD(r.x,r.y,s.x,s.y,t.x,t.y,u.x,u.y);if(x){if(m[x.x.toFixed(4)]==x.y.toFixed(4))continue;m[x.x.toFixed(4)]=x.y.toFixed(4);var y=r.t+z((x[v]-r[v])/(s[v]-r[v]))*(s.t-r.t),A=t.t+z((x[w]-t[w])/(u[w]-t[w]))*(u.t-t.t);y>=0&&y<=1&&A>=0&&A<=1&&(d?n++:n.push({x:x.x,y:x.y,t1:y,t2:A}))}}return n}function bF(a,b){return bG(a,b,1)}function bE(a,b){return bG(a,b)}function bD(a,b,c,d,e,f,g,h){if(!(x(a,c)<y(e,g)||y(a,c)>x(e,g)||x(b,d)<y(f,h)||y(b,d)>x(f,h))){var i=(a*d-b*c)*(e-g)-(a-c)*(e*h-f*g),j=(a*d-b*c)*(f-h)-(b-d)*(e*h-f*g),k=(a-c)*(f-h)-(b-d)*(e-g);if(!k)return;var l=i/k,m=j/k,n=+l.toFixed(2),o=+m.toFixed(2);if(n<+y(a,c).toFixed(2)||n>+x(a,c).toFixed(2)||n<+y(e,g).toFixed(2)||n>+x(e,g).toFixed(2)||o<+y(b,d).toFixed(2)||o>+x(b,d).toFixed(2)||o<+y(f,h).toFixed(2)||o>+x(f,h).toFixed(2))return;return{x:l,y:m}}}function bC(a,b,c,d,e,f,g,h,i){if(!(i<0||bB(a,b,c,d,e,f,g,h)<i)){var j=1,k=j/2,l=j-k,m,n=.01;m=bB(a,b,c,d,e,f,g,h,l);while(z(m-i)>n)k/=2,l+=(m<i?1:-1)*k,m=bB(a,b,c,d,e,f,g,h,l);return l}}function bB(a,b,c,d,e,f,g,h,i){i==null&&(i=1),i=i>1?1:i<0?0:i;var j=i/2,k=12,l=[-0.1252,.1252,-0.3678,.3678,-0.5873,.5873,-0.7699,.7699,-0.9041,.9041,-0.9816,.9816],m=[.2491,.2491,.2335,.2335,.2032,.2032,.1601,.1601,.1069,.1069,.0472,.0472],n=0;for(var o=0;o<k;o++){var p=j*l[o]+j,q=bA(p,a,c,e,g),r=bA(p,b,d,f,h),s=q*q+r*r;n+=m[o]*w.sqrt(s)}return j*n}function bA(a,b,c,d,e){var f=-3*b+9*c-9*d+3*e,g=a*f+6*b-12*c+6*d;return a*g-3*b+3*c}function by(a,b){var c=[];for(var d=0,e=a.length;e-2*!b>d;d+=2){var f=[{x:+a[d-2],y:+a[d-1]},{x:+a[d],y:+a[d+1]},{x:+a[d+2],y:+a[d+3]},{x:+a[d+4],y:+a[d+5]}];b?d?e-4==d?f[3]={x:+a[0],y:+a[1]}:e-2==d&&(f[2]={x:+a[0],y:+a[1]},f[3]={x:+a[2],y:+a[3]}):f[0]={x:+a[e-2],y:+a[e-1]}:e-4==d?f[3]=f[2]:d||(f[0]={x:+a[d],y:+a[d+1]}),c.push(["C",(-f[0].x+6*f[1].x+f[2].x)/6,(-f[0].y+6*f[1].y+f[2].y)/6,(f[1].x+6*f[2].x-f[3].x)/6,(f[1].y+6*f[2].y-f[3].y)/6,f[2].x,f[2].y])}return c}function bx(){return this.hex}function bv(a,b,c){function d(){var e=Array.prototype.slice.call(arguments,0),f=e.join("␀"),h=d.cache=d.cache||{},i=d.count=d.count||[];if(h[g](f)){bu(i,f);return c?c(h[f]):h[f]}i.length>=1e3&&delete h[i.shift()],i.push(f),h[f]=a[m](b,e);return c?c(h[f]):h[f]}return d}function bu(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return a.push(a.splice(c,1)[0])}function bm(a){if(Object(a)!==a)return a;var b=new a.constructor;for(var c in a)a[g](c)&&(b[c]=bm(a[c]));return b}function a(c){if(a.is(c,"function"))return b?c():eve.on("raphael.DOMload",c);if(a.is(c,E))return a._engine.create[m](a,c.splice(0,3+a.is(c[0],C))).add(c);var d=Array.prototype.slice.call(arguments,0);if(a.is(d[d.length-1],"function")){var e=d.pop();return b?e.call(a._engine.create[m](a,d)):eve.on("raphael.DOMload",function(){e.call(a._engine.create[m](a,d))})}return a._engine.create[m](a,arguments)}a.version="2.1.0",a.eve=eve;var b,c=/[, ]+/,d={circle:1,rect:1,path:1,ellipse:1,text:1,image:1},e=/\{(\d+)\}/g,f="prototype",g="hasOwnProperty",h={doc:document,win:window},i={was:Object.prototype[g].call(h.win,"Raphael"),is:h.win.Raphael},j=function(){this.ca=this.customAttributes={}},k,l="appendChild",m="apply",n="concat",o="createTouch"in h.doc,p="",q=" ",r=String,s="split",t="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[s](q),u={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},v=r.prototype.toLowerCase,w=Math,x=w.max,y=w.min,z=w.abs,A=w.pow,B=w.PI,C="number",D="string",E="array",F="toString",G="fill",H=Object.prototype.toString,I={},J="push",K=a._ISURL=/^url\(['"]?([^\)]+?)['"]?\)$/i,L=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,M={NaN:1,Infinity:1,"-Infinity":1},N=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,O=w.round,P="setAttribute",Q=parseFloat,R=parseInt,S=r.prototype.toUpperCase,T=a._availableAttrs={"arrow-end":"none","arrow-start":"none",blur:0,"clip-rect":"0 0 1e9 1e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/","letter-spacing":0,opacity:1,path:"M0,0",r:0,rx:0,ry:0,src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",transform:"",width:0,x:0,y:0},U=a._availableAnimAttrs={blur:C,"clip-rect":"csv",cx:C,cy:C,fill:"colour","fill-opacity":C,"font-size":C,height:C,opacity:C,path:"path",r:C,rx:C,ry:C,stroke:"colour","stroke-opacity":C,"stroke-width":C,transform:"transform",width:C,x:C,y:C},V=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g,W=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,X={hs:1,rg:1},Y=/,?([achlmqrstvxz]),?/gi,Z=/([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,$=/([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,_=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig,ba=a._radial_gradient=/^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,bb={},bc=function(a,b){return a.key-b.key},bd=function(a,b){return Q(a)-Q(b)},be=function(){},bf=function(a){return a},bg=a._rectPath=function(a,b,c,d,e){if(e)return[["M",a+e,b],["l",c-e*2,0],["a",e,e,0,0,1,e,e],["l",0,d-e*2],["a",e,e,0,0,1,-e,e],["l",e*2-c,0],["a",e,e,0,0,1,-e,-e],["l",0,e*2-d],["a",e,e,0,0,1,e,-e],["z"]];return[["M",a,b],["l",c,0],["l",0,d],["l",-c,0],["z"]]},bh=function(a,b,c,d){d==null&&(d=c);return[["M",a,b],["m",0,-d],["a",c,d,0,1,1,0,2*d],["a",c,d,0,1,1,0,-2*d],["z"]]},bi=a._getPath={path:function(a){return a.attr("path")},circle:function(a){var b=a.attrs;return bh(b.cx,b.cy,b.r)},ellipse:function(a){var b=a.attrs;return bh(b.cx,b.cy,b.rx,b.ry)},rect:function(a){var b=a.attrs;return bg(b.x,b.y,b.width,b.height,b.r)},image:function(a){var b=a.attrs;return bg(b.x,b.y,b.width,b.height)},text:function(a){var b=a._getBBox();return bg(b.x,b.y,b.width,b.height)}},bj=a.mapPath=function(a,b){if(!b)return a;var c,d,e,f,g,h,i;a=bR(a);for(e=0,g=a.length;e<g;e++){i=a[e];for(f=1,h=i.length;f<h;f+=2)c=b.x(i[f],i[f+1]),d=b.y(i[f],i[f+1]),i[f]=c,i[f+1]=d}return a};a._g=h,a.type=h.win.SVGAngle||h.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML";if(a.type=="VML"){var bk=h.doc.createElement("div"),bl;bk.innerHTML='<v:shape adj="1"/>',bl=bk.firstChild,bl.style.behavior="url(#default#VML)";if(!bl||typeof bl.adj!="object")return a.type=p;bk=null}a.svg=!(a.vml=a.type=="VML"),a._Paper=j,a.fn=k=j.prototype=a.prototype,a._id=0,a._oid=0,a.is=function(a,b){b=v.call(b);if(b=="finite")return!M[g](+a);if(b=="array")return a instanceof Array;return b=="null"&&a===null||b==typeof a&&a!==null||b=="object"&&a===Object(a)||b=="array"&&Array.isArray&&Array.isArray(a)||H.call(a).slice(8,-1).toLowerCase()==b},a.angle=function(b,c,d,e,f,g){if(f==null){var h=b-d,i=c-e;if(!h&&!i)return 0;return(180+w.atan2(-i,-h)*180/B+360)%360}return a.angle(b,c,f,g)-a.angle(d,e,f,g)},a.rad=function(a){return a%360*B/180},a.deg=function(a){return a*180/B%360},a.snapTo=function(b,c,d){d=a.is(d,"finite")?d:10;if(a.is(b,E)){var e=b.length;while(e--)if(z(b[e]-c)<=d)return b[e]}else{b=+b;var f=c%b;if(f<d)return c-f;if(f>b-d)return c-f+b}return c};var bn=a.createUUID=function(a,b){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(a,b).toUpperCase()}}(/[xy]/g,function(a){var b=w.random()*16|0,c=a=="x"?b:b&3|8;return c.toString(16)});a.setWindow=function(b){eve("raphael.setWindow",a,h.win,b),h.win=b,h.doc=h.win.document,a._engine.initWin&&a._engine.initWin(h.win)};var bo=function(b){if(a.vml){var c=/^\s+|\s+$/g,d;try{var e=new ActiveXObject("htmlfile");e.write("<body>"),e.close(),d=e.body}catch(f){d=createPopup().document.body}var g=d.createTextRange();bo=bv(function(a){try{d.style.color=r(a).replace(c,p);var b=g.queryCommandValue("ForeColor");b=(b&255)<<16|b&65280|(b&16711680)>>>16;return"#"+("000000"+b.toString(16)).slice(-6)}catch(e){return"none"}})}else{var i=h.doc.createElement("i");i.title="Raphaël Colour Picker",i.style.display="none",h.doc.body.appendChild(i),bo=bv(function(a){i.style.color=a;return h.doc.defaultView.getComputedStyle(i,p).getPropertyValue("color")})}return bo(b)},bp=function(){return"hsb("+[this.h,this.s,this.b]+")"},bq=function(){return"hsl("+[this.h,this.s,this.l]+")"},br=function(){return this.hex},bs=function(b,c,d){c==null&&a.is(b,"object")&&"r"in b&&"g"in b&&"b"in b&&(d=b.b,c=b.g,b=b.r);if(c==null&&a.is(b,D)){var e=a.getRGB(b);b=e.r,c=e.g,d=e.b}if(b>1||c>1||d>1)b/=255,c/=255,d/=255;return[b,c,d]},bt=function(b,c,d,e){b*=255,c*=255,d*=255;var f={r:b,g:c,b:d,hex:a.rgb(b,c,d),toString:br};a.is(e,"finite")&&(f.opacity=e);return f};a.color=function(b){var c;a.is(b,"object")&&"h"in b&&"s"in b&&"b"in b?(c=a.hsb2rgb(b),b.r=c.r,b.g=c.g,b.b=c.b,b.hex=c.hex):a.is(b,"object")&&"h"in b&&"s"in b&&"l"in b?(c=a.hsl2rgb(b),b.r=c.r,b.g=c.g,b.b=c.b,b.hex=c.hex):(a.is(b,"string")&&(b=a.getRGB(b)),a.is(b,"object")&&"r"in b&&"g"in b&&"b"in b?(c=a.rgb2hsl(b),b.h=c.h,b.s=c.s,b.l=c.l,c=a.rgb2hsb(b),b.v=c.b):(b={hex:"none"},b.r=b.g=b.b=b.h=b.s=b.v=b.l=-1)),b.toString=br;return b},a.hsb2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"b"in a&&(c=a.b,b=a.s,a=a.h,d=a.o),a*=360;var e,f,g,h,i;a=a%360/60,i=c*b,h=i*(1-z(a%2-1)),e=f=g=c-i,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a];return bt(e,f,g,d)},a.hsl2rgb=function(a,b,c,d){this.is(a,"object")&&"h"in a&&"s"in a&&"l"in a&&(c=a.l,b=a.s,a=a.h);if(a>1||b>1||c>1)a/=360,b/=100,c/=100;a*=360;var e,f,g,h,i;a=a%360/60,i=2*b*(c<.5?c:1-c),h=i*(1-z(a%2-1)),e=f=g=c-i/2,a=~~a,e+=[i,h,0,0,h,i][a],f+=[h,i,i,h,0,0][a],g+=[0,0,h,i,i,h][a];return bt(e,f,g,d)},a.rgb2hsb=function(a,b,c){c=bs(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g;f=x(a,b,c),g=f-y(a,b,c),d=g==0?null:f==a?(b-c)/g:f==b?(c-a)/g+2:(a-b)/g+4,d=(d+360)%6*60/360,e=g==0?0:g/f;return{h:d,s:e,b:f,toString:bp}},a.rgb2hsl=function(a,b,c){c=bs(a,b,c),a=c[0],b=c[1],c=c[2];var d,e,f,g,h,i;g=x(a,b,c),h=y(a,b,c),i=g-h,d=i==0?null:g==a?(b-c)/i:g==b?(c-a)/i+2:(a-b)/i+4,d=(d+360)%6*60/360,f=(g+h)/2,e=i==0?0:f<.5?i/(2*f):i/(2-2*f);return{h:d,s:e,l:f,toString:bq}},a._path2string=function(){return this.join(",").replace(Y,"$1")};var bw=a._preload=function(a,b){var c=h.doc.createElement("img");c.style.cssText="position:absolute;left:-9999em;top:-9999em",c.onload=function(){b.call(this),this.onload=null,h.doc.body.removeChild(this)},c.onerror=function(){h.doc.body.removeChild(this)},h.doc.body.appendChild(c),c.src=a};a.getRGB=bv(function(b){if(!b||!!((b=r(b)).indexOf("-")+1))return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:bx};if(b=="none")return{r:-1,g:-1,b:-1,hex:"none",toString:bx};!X[g](b.toLowerCase().substring(0,2))&&b.charAt()!="#"&&(b=bo(b));var c,d,e,f,h,i,j,k=b.match(L);if(k){k[2]&&(f=R(k[2].substring(5),16),e=R(k[2].substring(3,5),16),d=R(k[2].substring(1,3),16)),k[3]&&(f=R((i=k[3].charAt(3))+i,16),e=R((i=k[3].charAt(2))+i,16),d=R((i=k[3].charAt(1))+i,16)),k[4]&&(j=k[4][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),k[1].toLowerCase().slice(0,4)=="rgba"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100));if(k[5]){j=k[5][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),(j[0].slice(-3)=="deg"||j[0].slice(-1)=="°")&&(d/=360),k[1].toLowerCase().slice(0,4)=="hsba"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100);return a.hsb2rgb(d,e,f,h)}if(k[6]){j=k[6][s](W),d=Q(j[0]),j[0].slice(-1)=="%"&&(d*=2.55),e=Q(j[1]),j[1].slice(-1)=="%"&&(e*=2.55),f=Q(j[2]),j[2].slice(-1)=="%"&&(f*=2.55),(j[0].slice(-3)=="deg"||j[0].slice(-1)=="°")&&(d/=360),k[1].toLowerCase().slice(0,4)=="hsla"&&(h=Q(j[3])),j[3]&&j[3].slice(-1)=="%"&&(h/=100);return a.hsl2rgb(d,e,f,h)}k={r:d,g:e,b:f,toString:bx},k.hex="#"+(16777216|f|e<<8|d<<16).toString(16).slice(1),a.is(h,"finite")&&(k.opacity=h);return k}return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:bx}},a),a.hsb=bv(function(b,c,d){return a.hsb2rgb(b,c,d).hex}),a.hsl=bv(function(b,c,d){return a.hsl2rgb(b,c,d).hex}),a.rgb=bv(function(a,b,c){return"#"+(16777216|c|b<<8|a<<16).toString(16).slice(1)}),a.getColor=function(a){var b=this.getColor.start=this.getColor.start||{h:0,s:1,b:a||.75},c=this.hsb2rgb(b.h,b.s,b.b);b.h+=.075,b.h>1&&(b.h=0,b.s-=.2,b.s<=0&&(this.getColor.start={h:0,s:1,b:b.b}));return c.hex},a.getColor.reset=function(){delete this.start},a.parsePathString=function(b){if(!b)return null;var c=bz(b);if(c.arr)return bJ(c.arr);var d={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},e=[];a.is(b,E)&&a.is(b[0],E)&&(e=bJ(b)),e.length||r(b).replace(Z,function(a,b,c){var f=[],g=b.toLowerCase();c.replace(_,function(a,b){b&&f.push(+b)}),g=="m"&&f.length>2&&(e.push([b][n](f.splice(0,2))),g="l",b=b=="m"?"l":"L");if(g=="r")e.push([b][n](f));else while(f.length>=d[g]){e.push([b][n](f.splice(0,d[g])));if(!d[g])break}}),e.toString=a._path2string,c.arr=bJ(e);return e},a.parseTransformString=bv(function(b){if(!b)return null;var c={r:3,s:4,t:2,m:6},d=[];a.is(b,E)&&a.is(b[0],E)&&(d=bJ(b)),d.length||r(b).replace($,function(a,b,c){var e=[],f=v.call(b);c.replace(_,function(a,b){b&&e.push(+b)}),d.push([b][n](e))}),d.toString=a._path2string;return d});var bz=function(a){var b=bz.ps=bz.ps||{};b[a]?b[a].sleep=100:b[a]={sleep:100},setTimeout(function(){for(var c in b)b[g](c)&&c!=a&&(b[c].sleep--,!b[c].sleep&&delete b[c])});return b[a]};a.findDotsAtSegment=function(a,b,c,d,e,f,g,h,i){var j=1-i,k=A(j,3),l=A(j,2),m=i*i,n=m*i,o=k*a+l*3*i*c+j*3*i*i*e+n*g,p=k*b+l*3*i*d+j*3*i*i*f+n*h,q=a+2*i*(c-a)+m*(e-2*c+a),r=b+2*i*(d-b)+m*(f-2*d+b),s=c+2*i*(e-c)+m*(g-2*e+c),t=d+2*i*(f-d)+m*(h-2*f+d),u=j*a+i*c,v=j*b+i*d,x=j*e+i*g,y=j*f+i*h,z=90-w.atan2(q-s,r-t)*180/B;(q>s||r<t)&&(z+=180);return{x:o,y:p,m:{x:q,y:r},n:{x:s,y:t},start:{x:u,y:v},end:{x:x,y:y},alpha:z}},a.bezierBBox=function(b,c,d,e,f,g,h,i){a.is(b,"array")||(b=[b,c,d,e,f,g,h,i]);var j=bQ.apply(null,b);return{x:j.min.x,y:j.min.y,x2:j.max.x,y2:j.max.y,width:j.max.x-j.min.x,height:j.max.y-j.min.y}},a.isPointInsideBBox=function(a,b,c){return b>=a.x&&b<=a.x2&&c>=a.y&&c<=a.y2},a.isBBoxIntersect=function(b,c){var d=a.isPointInsideBBox;return d(c,b.x,b.y)||d(c,b.x2,b.y)||d(c,b.x,b.y2)||d(c,b.x2,b.y2)||d(b,c.x,c.y)||d(b,c.x2,c.y)||d(b,c.x,c.y2)||d(b,c.x2,c.y2)||(b.x<c.x2&&b.x>c.x||c.x<b.x2&&c.x>b.x)&&(b.y<c.y2&&b.y>c.y||c.y<b.y2&&c.y>b.y)},a.pathIntersection=function(a,b){return bH(a,b)},a.pathIntersectionNumber=function(a,b){return bH(a,b,1)},a.isPointInsidePath=function(b,c,d){var e=a.pathBBox(b);return a.isPointInsideBBox(e,c,d)&&bH(b,[["M",c,d],["H",e.x2+10]],1)%2==1},a._removedFactory=function(a){return function(){eve("raphael.log",null,"Raphaël: you are calling to method “"+a+"” of removed object",a)}};var bI=a.pathBBox=function(a){var b=bz(a);if(b.bbox)return b.bbox;if(!a)return{x:0,y:0,width:0,height:0,x2:0,y2:0};a=bR(a);var c=0,d=0,e=[],f=[],g;for(var h=0,i=a.length;h<i;h++){g=a[h];if(g[0]=="M")c=g[1],d=g[2],e.push(c),f.push(d);else{var j=bQ(c,d,g[1],g[2],g[3],g[4],g[5],g[6]);e=e[n](j.min.x,j.max.x),f=f[n](j.min.y,j.max.y),c=g[5],d=g[6]}}var k=y[m](0,e),l=y[m](0,f),o=x[m](0,e),p=x[m](0,f),q={x:k,y:l,x2:o,y2:p,width:o-k,height:p-l};b.bbox=bm(q);return q},bJ=function(b){var c=bm(b);c.toString=a._path2string;return c},bK=a._pathToRelative=function(b){var c=bz(b);if(c.rel)return bJ(c.rel);if(!a.is(b,E)||!a.is(b&&b[0],E))b=a.parsePathString(b);var d=[],e=0,f=0,g=0,h=0,i=0;b[0][0]=="M"&&(e=b[0][1],f=b[0][2],g=e,h=f,i++,d.push(["M",e,f]));for(var j=i,k=b.length;j<k;j++){var l=d[j]=[],m=b[j];if(m[0]!=v.call(m[0])){l[0]=v.call(m[0]);switch(l[0]){case"a":l[1]=m[1],l[2]=m[2],l[3]=m[3],l[4]=m[4],l[5]=m[5],l[6]=+(m[6]-e).toFixed(3),l[7]=+(m[7]-f).toFixed(3);break;case"v":l[1]=+(m[1]-f).toFixed(3);break;case"m":g=m[1],h=m[2];default:for(var n=1,o=m.length;n<o;n++)l[n]=+(m[n]-(n%2?e:f)).toFixed(3)}}else{l=d[j]=[],m[0]=="m"&&(g=m[1]+e,h=m[2]+f);for(var p=0,q=m.length;p<q;p++)d[j][p]=m[p]}var r=d[j].length;switch(d[j][0]){case"z":e=g,f=h;break;case"h":e+=+d[j][r-1];break;case"v":f+=+d[j][r-1];break;default:e+=+d[j][r-2],f+=+d[j][r-1]}}d.toString=a._path2string,c.rel=bJ(d);return d},bL=a._pathToAbsolute=function(b){var c=bz(b);if(c.abs)return bJ(c.abs);if(!a.is(b,E)||!a.is(b&&b[0],E))b=a.parsePathString(b);if(!b||!b.length)return[["M",0,0]];var d=[],e=0,f=0,g=0,h=0,i=0;b[0][0]=="M"&&(e=+b[0][1],f=+b[0][2],g=e,h=f,i++,d[0]=["M",e,f]);var j=b.length==3&&b[0][0]=="M"&&b[1][0].toUpperCase()=="R"&&b[2][0].toUpperCase()=="Z";for(var k,l,m=i,o=b.length;m<o;m++){d.push(k=[]),l=b[m];if(l[0]!=S.call(l[0])){k[0]=S.call(l[0]);switch(k[0]){case"A":k[1]=l[1],k[2]=l[2],k[3]=l[3],k[4]=l[4],k[5]=l[5],k[6]=+(l[6]+e),k[7]=+(l[7]+f);break;case"V":k[1]=+l[1]+f;break;case"H":k[1]=+l[1]+e;break;case"R":var p=[e,f][n](l.slice(1));for(var q=2,r=p.length;q<r;q++)p[q]=+p[q]+e,p[++q]=+p[q]+f;d.pop(),d=d[n](by(p,j));break;case"M":g=+l[1]+e,h=+l[2]+f;default:for(q=1,r=l.length;q<r;q++)k[q]=+l[q]+(q%2?e:f)}}else if(l[0]=="R")p=[e,f][n](l.slice(1)),d.pop(),d=d[n](by(p,j)),k=["R"][n](l.slice(-2));else for(var s=0,t=l.length;s<t;s++)k[s]=l[s];switch(k[0]){case"Z":e=g,f=h;break;case"H":e=k[1];break;case"V":f=k[1];break;case"M":g=k[k.length-2],h=k[k.length-1];default:e=k[k.length-2],f=k[k.length-1]}}d.toString=a._path2string,c.abs=bJ(d);return d},bM=function(a,b,c,d){return[a,b,c,d,c,d]},bN=function(a,b,c,d,e,f){var g=1/3,h=2/3;return[g*a+h*c,g*b+h*d,g*e+h*c,g*f+h*d,e,f]},bO=function(a,b,c,d,e,f,g,h,i,j){var k=B*120/180,l=B/180*(+e||0),m=[],o,p=bv(function(a,b,c){var d=a*w.cos(c)-b*w.sin(c),e=a*w.sin(c)+b*w.cos(c);return{x:d,y:e}});if(!j){o=p(a,b,-l),a=o.x,b=o.y,o=p(h,i,-l),h=o.x,i=o.y;var q=w.cos(B/180*e),r=w.sin(B/180*e),t=(a-h)/2,u=(b-i)/2,v=t*t/(c*c)+u*u/(d*d);v>1&&(v=w.sqrt(v),c=v*c,d=v*d);var x=c*c,y=d*d,A=(f==g?-1:1)*w.sqrt(z((x*y-x*u*u-y*t*t)/(x*u*u+y*t*t))),C=A*c*u/d+(a+h)/2,D=A*-d*t/c+(b+i)/2,E=w.asin(((b-D)/d).toFixed(9)),F=w.asin(((i-D)/d).toFixed(9));E=a<C?B-E:E,F=h<C?B-F:F,E<0&&(E=B*2+E),F<0&&(F=B*2+F),g&&E>F&&(E=E-B*2),!g&&F>E&&(F=F-B*2)}else E=j[0],F=j[1],C=j[2],D=j[3];var G=F-E;if(z(G)>k){var H=F,I=h,J=i;F=E+k*(g&&F>E?1:-1),h=C+c*w.cos(F),i=D+d*w.sin(F),m=bO(h,i,c,d,e,0,g,I,J,[F,H,C,D])}G=F-E;var K=w.cos(E),L=w.sin(E),M=w.cos(F),N=w.sin(F),O=w.tan(G/4),P=4/3*c*O,Q=4/3*d*O,R=[a,b],S=[a+P*L,b-Q*K],T=[h+P*N,i-Q*M],U=[h,i];S[0]=2*R[0]-S[0],S[1]=2*R[1]-S[1];if(j)return[S,T,U][n](m);m=[S,T,U][n](m).join()[s](",");var V=[];for(var W=0,X=m.length;W<X;W++)V[W]=W%2?p(m[W-1],m[W],l).y:p(m[W],m[W+1],l).x;return V},bP=function(a,b,c,d,e,f,g,h,i){var j=1-i;return{x:A(j,3)*a+A(j,2)*3*i*c+j*3*i*i*e+A(i,3)*g,y:A(j,3)*b+A(j,2)*3*i*d+j*3*i*i*f+A(i,3)*h}},bQ=bv(function(a,b,c,d,e,f,g,h){var i=e-2*c+a-(g-2*e+c),j=2*(c-a)-2*(e-c),k=a-c,l=(-j+w.sqrt(j*j-4*i*k))/2/i,n=(-j-w.sqrt(j*j-4*i*k))/2/i,o=[b,h],p=[a,g],q;z(l)>"1e12"&&(l=.5),z(n)>"1e12"&&(n=.5),l>0&&l<1&&(q=bP(a,b,c,d,e,f,g,h,l),p.push(q.x),o.push(q.y)),n>0&&n<1&&(q=bP(a,b,c,d,e,f,g,h,n),p.push(q.x),o.push(q.y)),i=f-2*d+b-(h-2*f+d),j=2*(d-b)-2*(f-d),k=b-d,l=(-j+w.sqrt(j*j-4*i*k))/2/i,n=(-j-w.sqrt(j*j-4*i*k))/2/i,z(l)>"1e12"&&(l=.5),z(n)>"1e12"&&(n=.5),l>0&&l<1&&(q=bP(a,b,c,d,e,f,g,h,l),p.push(q.x),o.push(q.y)),n>0&&n<1&&(q=bP(a,b,c,d,e,f,g,h,n),p.push(q.x),o.push(q.y));return{min:{x:y[m](0,p),y:y[m](0,o)},max:{x:x[m](0,p),y:x[m](0,o)}}}),bR=a._path2curve=bv(function(a,b){var c=!b&&bz(a);if(!b&&c.curve)return bJ(c.curve);var d=bL(a),e=b&&bL(b),f={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},g={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},h=function(a,b){var c,d;if(!a)return["C",b.x,b.y,b.x,b.y,b.x,b.y];!(a[0]in{T:1,Q:1})&&(b.qx=b.qy=null);switch(a[0]){case"M":b.X=a[1],b.Y=a[2];break;case"A":a=["C"][n](bO[m](0,[b.x,b.y][n](a.slice(1))));break;case"S":c=b.x+(b.x-(b.bx||b.x)),d=b.y+(b.y-(b.by||b.y)),a=["C",c,d][n](a.slice(1));break;case"T":b.qx=b.x+(b.x-(b.qx||b.x)),b.qy=b.y+(b.y-(b.qy||b.y)),a=["C"][n](bN(b.x,b.y,b.qx,b.qy,a[1],a[2]));break;case"Q":b.qx=a[1],b.qy=a[2],a=["C"][n](bN(b.x,b.y,a[1],a[2],a[3],a[4]));break;case"L":a=["C"][n](bM(b.x,b.y,a[1],a[2]));break;case"H":a=["C"][n](bM(b.x,b.y,a[1],b.y));break;case"V":a=["C"][n](bM(b.x,b.y,b.x,a[1]));break;case"Z":a=["C"][n](bM(b.x,b.y,b.X,b.Y))}return a},i=function(a,b){if(a[b].length>7){a[b].shift();var c=a[b];while(c.length)a.splice(b++,0,["C"][n](c.splice(0,6)));a.splice(b,1),l=x(d.length,e&&e.length||0)}},j=function(a,b,c,f,g){a&&b&&a[g][0]=="M"&&b[g][0]!="M"&&(b.splice(g,0,["M",f.x,f.y]),c.bx=0,c.by=0,c.x=a[g][1],c.y=a[g][2],l=x(d.length,e&&e.length||0))};for(var k=0,l=x(d.length,e&&e.length||0);k<l;k++){d[k]=h(d[k],f),i(d,k),e&&(e[k]=h(e[k],g)),e&&i(e,k),j(d,e,f,g,k),j(e,d,g,f,k);var o=d[k],p=e&&e[k],q=o.length,r=e&&p.length;f.x=o[q-2],f.y=o[q-1],f.bx=Q(o[q-4])||f.x,f.by=Q(o[q-3])||f.y,g.bx=e&&(Q(p[r-4])||g.x),g.by=e&&(Q(p[r-3])||g.y),g.x=e&&p[r-2],g.y=e&&p[r-1]}e||(c.curve=bJ(d));return e?[d,e]:d},null,bJ),bS=a._parseDots=bv(function(b){var c=[];for(var d=0,e=b.length;d<e;d++){var f={},g=b[d].match(/^([^:]*):?([\d\.]*)/);f.color=a.getRGB(g[1]);if(f.color.error)return null;f.color=f.color.hex,g[2]&&(f.offset=g[2]+"%"),c.push(f)}for(d=1,e=c.length-1;d<e;d++)if(!c[d].offset){var h=Q(c[d-1].offset||0),i=0;for(var j=d+1;j<e;j++)if(c[j].offset){i=c[j].offset;break}i||(i=100,j=e),i=Q(i);var k=(i-h)/(j-d+1);for(;d<j;d++)h+=k,c[d].offset=h+"%"}return c}),bT=a._tear=function(a,b){a==b.top&&(b.top=a.prev),a==b.bottom&&(b.bottom=a.next),a.next&&(a.next.prev=a.prev),a.prev&&(a.prev.next=a.next)},bU=a._tofront=function(a,b){b.top!==a&&(bT(a,b),a.next=null,a.prev=b.top,b.top.next=a,b.top=a)},bV=a._toback=function(a,b){b.bottom!==a&&(bT(a,b),a.next=b.bottom,a.prev=null,b.bottom.prev=a,b.bottom=a)},bW=a._insertafter=function(a,b,c){bT(a,c),b==c.top&&(c.top=a),b.next&&(b.next.prev=a),a.next=b.next,a.prev=b,b.next=a},bX=a._insertbefore=function(a,b,c){bT(a,c),b==c.bottom&&(c.bottom=a),b.prev&&(b.prev.next=a),a.prev=b.prev,b.prev=a,a.next=b},bY=a.toMatrix=function(a,b){var c=bI(a),d={_:{transform:p},getBBox:function(){return c}};b$(d,b);return d.matrix},bZ=a.transformPath=function(a,b){return bj(a,bY(a,b))},b$=a._extractTransform=function(b,c){if(c==null)return b._.transform;c=r(c).replace(/\.{3}|\u2026/g,b._.transform||p);var d=a.parseTransformString(c),e=0,f=0,g=0,h=1,i=1,j=b._,k=new cb;j.transform=d||[];if(d)for(var l=0,m=d.length;l<m;l++){var n=d[l],o=n.length,q=r(n[0]).toLowerCase(),s=n[0]!=q,t=s?k.invert():0,u,v,w,x,y;q=="t"&&o==3?s?(u=t.x(0,0),v=t.y(0,0),w=t.x(n[1],n[2]),x=t.y(n[1],n[2]),k.translate(w-u,x-v)):k.translate(n[1],n[2]):q=="r"?o==2?(y=y||b.getBBox(1),k.rotate(n[1],y.x+y.width/2,y.y+y.height/2),e+=n[1]):o==4&&(s?(w=t.x(n[2],n[3]),x=t.y(n[2],n[3]),k.rotate(n[1],w,x)):k.rotate(n[1],n[2],n[3]),e+=n[1]):q=="s"?o==2||o==3?(y=y||b.getBBox(1),k.scale(n[1],n[o-1],y.x+y.width/2,y.y+y.height/2),h*=n[1],i*=n[o-1]):o==5&&(s?(w=t.x(n[3],n[4]),x=t.y(n[3],n[4]),k.scale(n[1],n[2],w,x)):k.scale(n[1],n[2],n[3],n[4]),h*=n[1],i*=n[2]):q=="m"&&o==7&&k.add(n[1],n[2],n[3],n[4],n[5],n[6]),j.dirtyT=1,b.matrix=k}b.matrix=k,j.sx=h,j.sy=i,j.deg=e,j.dx=f=k.e,j.dy=g=k.f,h==1&&i==1&&!e&&j.bbox?(j.bbox.x+=+f,j.bbox.y+=+g):j.dirtyT=1},b_=function(a){var b=a[0];switch(b.toLowerCase()){case"t":return[b,0,0];case"m":return[b,1,0,0,1,0,0];case"r":return a.length==4?[b,0,a[2],a[3]]:[b,0];case"s":return a.length==5?[b,1,1,a[3],a[4]]:a.length==3?[b,1,1]:[b,1]}},ca=a._equaliseTransform=function(b,c){c=r(c).replace(/\.{3}|\u2026/g,b),b=a.parseTransformString(b)||[],c=a.parseTransformString(c)||[];var d=x(b.length,c.length),e=[],f=[],g=0,h,i,j,k;for(;g<d;g++){j=b[g]||b_(c[g]),k=c[g]||b_(j);if(j[0]!=k[0]||j[0].toLowerCase()=="r"&&(j[2]!=k[2]||j[3]!=k[3])||j[0].toLowerCase()=="s"&&(j[3]!=k[3]||j[4]!=k[4]))return;e[g]=[],f[g]=[];for(h=0,i=x(j.length,k.length);h<i;h++)h in j&&(e[g][h]=j[h]),h in k&&(f[g][h]=k[h])}return{from:e,to:f}};a._getContainer=function(b,c,d,e){var f;f=e==null&&!a.is(b,"object")?h.doc.getElementById(b):b;if(f!=null){if(f.tagName)return c==null?{container:f,width:f.style.pixelWidth||f.offsetWidth,height:f.style.pixelHeight||f.offsetHeight}:{container:f,width:c,height:d};return{container:1,x:b,y:c,width:d,height:e}}},a.pathToRelative=bK,a._engine={},a.path2curve=bR,a.matrix=function(a,b,c,d,e,f){return new cb(a,b,c,d,e,f)},function(b){function d(a){var b=w.sqrt(c(a));a[0]&&(a[0]/=b),a[1]&&(a[1]/=b)}function c(a){return a[0]*a[0]+a[1]*a[1]}b.add=function(a,b,c,d,e,f){var g=[[],[],[]],h=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],i=[[a,c,e],[b,d,f],[0,0,1]],j,k,l,m;a&&a instanceof cb&&(i=[[a.a,a.c,a.e],[a.b,a.d,a.f],[0,0,1]]);for(j=0;j<3;j++)for(k=0;k<3;k++){m=0;for(l=0;l<3;l++)m+=h[j][l]*i[l][k];g[j][k]=m}this.a=g[0][0],this.b=g[1][0],this.c=g[0][1],this.d=g[1][1],this.e=g[0][2],this.f=g[1][2]},b.invert=function(){var a=this,b=a.a*a.d-a.b*a.c;return new cb(a.d/b,-a.b/b,-a.c/b,a.a/b,(a.c*a.f-a.d*a.e)/b,(a.b*a.e-a.a*a.f)/b)},b.clone=function(){return new cb(this.a,this.b,this.c,this.d,this.e,this.f)},b.translate=function(a,b){this.add(1,0,0,1,a,b)},b.scale=function(a,b,c,d){b==null&&(b=a),(c||d)&&this.add(1,0,0,1,c,d),this.add(a,0,0,b,0,0),(c||d)&&this.add(1,0,0,1,-c,-d)},b.rotate=function(b,c,d){b=a.rad(b),c=c||0,d=d||0;var e=+w.cos(b).toFixed(9),f=+w.sin(b).toFixed(9);this.add(e,f,-f,e,c,d),this.add(1,0,0,1,-c,-d)},b.x=function(a,b){return a*this.a+b*this.c+this.e},b.y=function(a,b){return a*this.b+b*this.d+this.f},b.get=function(a){return+this[r.fromCharCode(97+a)].toFixed(4)},b.toString=function(){return a.svg?"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join()},b.toFilter=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')"},b.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)]},b.split=function(){var b={};b.dx=this.e,b.dy=this.f;var e=[[this.a,this.c],[this.b,this.d]];b.scalex=w.sqrt(c(e[0])),d(e[0]),b.shear=e[0][0]*e[1][0]+e[0][1]*e[1][1],e[1]=[e[1][0]-e[0][0]*b.shear,e[1][1]-e[0][1]*b.shear],b.scaley=w.sqrt(c(e[1])),d(e[1]),b.shear/=b.scaley;var f=-e[0][1],g=e[1][1];g<0?(b.rotate=a.deg(w.acos(g)),f<0&&(b.rotate=360-b.rotate)):b.rotate=a.deg(w.asin(f)),b.isSimple=!+b.shear.toFixed(9)&&(b.scalex.toFixed(9)==b.scaley.toFixed(9)||!b.rotate),b.isSuperSimple=!+b.shear.toFixed(9)&&b.scalex.toFixed(9)==b.scaley.toFixed(9)&&!b.rotate,b.noRotation=!+b.shear.toFixed(9)&&!b.rotate;return b},b.toTransformString=function(a){var b=a||this[s]();if(b.isSimple){b.scalex=+b.scalex.toFixed(4),b.scaley=+b.scaley.toFixed(4),b.rotate=+b.rotate.toFixed(4);return(b.dx||b.dy?"t"+[b.dx,b.dy]:p)+(b.scalex!=1||b.scaley!=1?"s"+[b.scalex,b.scaley,0,0]:p)+(b.rotate?"r"+[b.rotate,0,0]:p)}return"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]}}(cb.prototype);var cc=navigator.userAgent.match(/Version\/(.*?)\s/)||navigator.userAgent.match(/Chrome\/(\d+)/);navigator.vendor=="Apple Computer, Inc."&&(cc&&cc[1]<4||navigator.platform.slice(0,2)=="iP")||navigator.vendor=="Google Inc."&&cc&&cc[1]<8?k.safari=function(){var a=this.rect(-99,-99,this.width+99,this.height+99).attr({stroke:"none"});setTimeout(function(){a.remove()})}:k.safari=be;var cd=function(){this.returnValue=!1},ce=function(){return this.originalEvent.preventDefault()},cf=function(){this.cancelBubble=!0},cg=function(){return this.originalEvent.stopPropagation()},ch=function(){if(h.doc.addEventListener)return function(a,b,c,d){var e=o&&u[b]?u[b]:b,f=function(e){var f=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,i=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,j=e.clientX+i,k=e.clientY+f;if(o&&u[g](b))for(var l=0,m=e.targetTouches&&e.targetTouches.length;l<m;l++)if(e.targetTouches[l].target==a){var n=e;e=e.targetTouches[l],e.originalEvent=n,e.preventDefault=ce,e.stopPropagation=cg;break}return c.call(d,e,j,k)};a.addEventListener(e,f,!1);return function(){a.removeEventListener(e,f,!1);return!0}};if(h.doc.attachEvent)return function(a,b,c,d){var e=function(a){a=a||h.win.event;var b=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,e=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,f=a.clientX+e,g=a.clientY+b;a.preventDefault=a.preventDefault||cd,a.stopPropagation=a.stopPropagation||cf;return c.call(d,a,f,g)};a.attachEvent("on"+b,e);var f=function(){a.detachEvent("on"+b,e);return!0};return f}}(),ci=[],cj=function(a){var b=a.clientX,c=a.clientY,d=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,e=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft,f,g=ci.length;while(g--){f=ci[g];if(o){var i=a.touches.length,j;while(i--){j=a.touches[i];if(j.identifier==f.el._drag.id){b=j.clientX,c=j.clientY,(a.originalEvent?a.originalEvent:a).preventDefault();break}}}else a.preventDefault();var k=f.el.node,l,m=k.nextSibling,n=k.parentNode,p=k.style.display;h.win.opera&&n.removeChild(k),k.style.display="none",l=f.el.paper.getElementByPoint(b,c),k.style.display=p,h.win.opera&&(m?n.insertBefore(k,m):n.appendChild(k)),l&&eve("raphael.drag.over."+f.el.id,f.el,l),b+=e,c+=d,eve("raphael.drag.move."+f.el.id,f.move_scope||f.el,b-f.el._drag.x,c-f.el._drag.y,b,c,a)}},ck=function(b){a.unmousemove(cj).unmouseup(ck);var c=ci.length,d;while(c--)d=ci[c],d.el._drag={},eve("raphael.drag.end."+d.el.id,d.end_scope||d.start_scope||d.move_scope||d.el,b);ci=[]},cl=a.el={};for(var cm=t.length;cm--;)(function(b){a[b]=cl[b]=function(c,d){a.is(c,"function")&&(this.events=this.events||[],this.events.push({name:b,f:c,unbind:ch(this.shape||this.node||h.doc,b,c,d||this)}));return this},a["un"+b]=cl["un"+b]=function(a){var c=this.events||[],d=c.length;while(d--)if(c[d].name==b&&c[d].f==a){c[d].unbind(),c.splice(d,1),!c.length&&delete this.events;return this}return this}})(t[cm]);cl.data=function(b,c){var d=bb[this.id]=bb[this.id]||{};if(arguments.length==1){if(a.is(b,"object")){for(var e in b)b[g](e)&&this.data(e,b[e]);return this}eve("raphael.data.get."+this.id,this,d[b],b);return d[b]}d[b]=c,eve("raphael.data.set."+this.id,this,c,b);return this},cl.removeData=function(a){a==null?bb[this.id]={}:bb[this.id]&&delete bb[this.id][a];return this},cl.hover=function(a,b,c,d){return this.mouseover(a,c).mouseout(b,d||c)},cl.unhover=function(a,b){return this.unmouseover(a).unmouseout(b)};var cn=[];cl.drag=function(b,c,d,e,f,g){function i(i){(i.originalEvent||i).preventDefault();var j=h.doc.documentElement.scrollTop||h.doc.body.scrollTop,k=h.doc.documentElement.scrollLeft||h.doc.body.scrollLeft;this._drag.x=i.clientX+k,this._drag.y=i.clientY+j,this._drag.id=i.identifier,!ci.length&&a.mousemove(cj).mouseup(ck),ci.push({el:this,move_scope:e,start_scope:f,end_scope:g}),c&&eve.on("raphael.drag.start."+this.id,c),b&&eve.on("raphael.drag.move."+this.id,b),d&&eve.on("raphael.drag.end."+this.id,d),eve("raphael.drag.start."+this.id,f||e||this,i.clientX+k,i.clientY+j,i)}this._drag={},cn.push({el:this,start:i}),this.mousedown(i);return this},cl.onDragOver=function(a){a?eve.on("raphael.drag.over."+this.id,a):eve.unbind("raphael.drag.over."+this.id)},cl.undrag=function(){var b=cn.length;while(b--)cn[b].el==this&&(this.unmousedown(cn[b].start),cn.splice(b,1),eve.unbind("raphael.drag.*."+this.id));!cn.length&&a.unmousemove(cj).unmouseup(ck)},k.circle=function(b,c,d){var e=a._engine.circle(this,b||0,c||0,d||0);this.__set__&&this.__set__.push(e);return e},k.rect=function(b,c,d,e,f){var g=a._engine.rect(this,b||0,c||0,d||0,e||0,f||0);this.__set__&&this.__set__.push(g);return g},k.ellipse=function(b,c,d,e){var f=a._engine.ellipse(this,b||0,c||0,d||0,e||0);this.__set__&&this.__set__.push(f);return f},k.path=function(b){b&&!a.is(b,D)&&!a.is(b[0],E)&&(b+=p);var c=a._engine.path(a.format[m](a,arguments),this);this.__set__&&this.__set__.push(c);return c},k.image=function(b,c,d,e,f){var g=a._engine.image(this,b||"about:blank",c||0,d||0,e||0,f||0);this.__set__&&this.__set__.push(g);return g},k.text=function(b,c,d){var e=a._engine.text(this,b||0,c||0,r(d));this.__set__&&this.__set__.push(e);return e},k.set=function(b){!a.is(b,"array")&&(b=Array.prototype.splice.call(arguments,0,arguments.length));var c=new cG(b);this.__set__&&this.__set__.push(c);return c},k.setStart=function(a){this.__set__=a||this.set()},k.setFinish=function(a){var b=this.__set__;delete this.__set__;return b},k.setSize=function(b,c){return a._engine.setSize.call(this,b,c)},k.setViewBox=function(b,c,d,e,f){return a._engine.setViewBox.call(this,b,c,d,e,f)},k.top=k.bottom=null,k.raphael=a;var co=function(a){var b=a.getBoundingClientRect(),c=a.ownerDocument,d=c.body,e=c.documentElement,f=e.clientTop||d.clientTop||0,g=e.clientLeft||d.clientLeft||0,i=b.top+(h.win.pageYOffset||e.scrollTop||d.scrollTop)-f,j=b.left+(h.win.pageXOffset||e.scrollLeft||d.scrollLeft)-g;return{y:i,x:j}};k.getElementByPoint=function(a,b){var c=this,d=c.canvas,e=h.doc.elementFromPoint(a,b);if(h.win.opera&&e.tagName=="svg"){var f=co(d),g=d.createSVGRect();g.x=a-f.x,g.y=b-f.y,g.width=g.height=1;var i=d.getIntersectionList(g,null);i.length&&(e=i[i.length-1])}if(!e)return null;while(e.parentNode&&e!=d.parentNode&&!e.raphael)e=e.parentNode;e==c.canvas.parentNode&&(e=d),e=e&&e.raphael?c.getById(e.raphaelid):null;return e},k.getById=function(a){var b=this.bottom;while(b){if(b.id==a)return b;b=b.next}return null},k.forEach=function(a,b){var c=this.bottom;while(c){if(a.call(b,c)===!1)return this;c=c.next}return this},k.getElementsByPoint=function(a,b){var c=this.set();this.forEach(function(d){d.isPointInside(a,b)&&c.push(d)});return c},cl.isPointInside=function(b,c){var d=this.realPath=this.realPath||bi[this.type](this);return a.isPointInsidePath(d,b,c)},cl.getBBox=function(a){if(this.removed)return{};var b=this._;if(a){if(b.dirty||!b.bboxwt)this.realPath=bi[this.type](this),b.bboxwt=bI(this.realPath),b.bboxwt.toString=cq,b.dirty=0;return b.bboxwt}if(b.dirty||b.dirtyT||!b.bbox){if(b.dirty||!this.realPath)b.bboxwt=0,this.realPath=bi[this.type](this);b.bbox=bI(bj(this.realPath,this.matrix)),b.bbox.toString=cq,b.dirty=b.dirtyT=0}return b.bbox},cl.clone=function(){if(this.removed)return null;var a=this.paper[this.type]().attr(this.attr());this.__set__&&this.__set__.push(a);return a},cl.glow=function(a){if(this.type=="text")return null;a=a||{};var b={width:(a.width||10)+(+this.attr("stroke-width")||1),fill:a.fill||!1,opacity:a.opacity||.5,offsetx:a.offsetx||0,offsety:a.offsety||0,color:a.color||"#000"},c=b.width/2,d=this.paper,e=d.set(),f=this.realPath||bi[this.type](this);f=this.matrix?bj(f,this.matrix):f;for(var g=1;g<c+1;g++)e.push(d.path(f).attr({stroke:b.color,fill:b.fill?b.color:"none","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":+(b.width/c*g).toFixed(3),opacity:+(b.opacity/c).toFixed(3)}));return e.insertBefore(this).translate(b.offsetx,b.offsety)};var cr={},cs=function(b,c,d,e,f,g,h,i,j){return j==null?bB(b,c,d,e,f,g,h,i):a.findDotsAtSegment(b,c,d,e,f,g,h,i,bC(b,c,d,e,f,g,h,i,j))},ct=function(b,c){return function(d,e,f){d=bR(d);var g,h,i,j,k="",l={},m,n=0;for(var o=0,p=d.length;o<p;o++){i=d[o];if(i[0]=="M")g=+i[1],h=+i[2];else{j=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6]);if(n+j>e){if(c&&!l.start){m=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n),k+=["C"+m.start.x,m.start.y,m.m.x,m.m.y,m.x,m.y];if(f)return k;l.start=k,k=["M"+m.x,m.y+"C"+m.n.x,m.n.y,m.end.x,m.end.y,i[5],i[6]].join(),n+=j,g=+i[5],h=+i[6];continue}if(!b&&!c){m=cs(g,h,i[1],i[2],i[3],i[4],i[5],i[6],e-n);return{x:m.x,y:m.y,alpha:m.alpha}}}n+=j,g=+i[5],h=+i[6]}k+=i.shift()+i}l.end=k,m=b?n:c?l:a.findDotsAtSegment(g,h,i[0],i[1],i[2],i[3],i[4],i[5],1),m.alpha&&(m={x:m.x,y:m.y,alpha:m.alpha});return m}},cu=ct(1),cv=ct(),cw=ct(0,1);a.getTotalLength=cu,a.getPointAtLength=cv,a.getSubpath=function(a,b,c){if(this.getTotalLength(a)-c<1e-6)return cw(a,b).end;var d=cw(a,c,1);return b?cw(d,b).end:d},cl.getTotalLength=function(){if(this.type=="path"){if(this.node.getTotalLength)return this.node.getTotalLength();return cu(this.attrs.path)}},cl.getPointAtLength=function(a){if(this.type=="path")return cv(this.attrs.path,a)},cl.getSubpath=function(b,c){if(this.type=="path")return a.getSubpath(this.attrs.path,b,c)};var cx=a.easing_formulas={linear:function(a){return a},"<":function(a){return A(a,1.7)},">":function(a){return A(a,.48)},"<>":function(a){var b=.48-a/1.04,c=w.sqrt(.1734+b*b),d=c-b,e=A(z(d),1/3)*(d<0?-1:1),f=-c-b,g=A(z(f),1/3)*(f<0?-1:1),h=e+g+.5;return(1-h)*3*h*h+h*h*h},backIn:function(a){var b=1.70158;return a*a*((b+1)*a-b)},backOut:function(a){a=a-1;var b=1.70158;return a*a*((b+1)*a+b)+1},elastic:function(a){if(a==!!a)return a;return A(2,-10*a)*w.sin((a-.075)*2*B/.3)+1},bounce:function(a){var b=7.5625,c=2.75,d;a<1/c?d=b*a*a:a<2/c?(a-=1.5/c,d=b*a*a+.75):a<2.5/c?(a-=2.25/c,d=b*a*a+.9375):(a-=2.625/c,d=b*a*a+.984375);return d}};cx.easeIn=cx["ease-in"]=cx["<"],cx.easeOut=cx["ease-out"]=cx[">"],cx.easeInOut=cx["ease-in-out"]=cx["<>"],cx["back-in"]=cx.backIn,cx["back-out"]=cx.backOut;var cy=[],cz=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){setTimeout(a,16)},cA=function(){var b=+(new Date),c=0;for(;c<cy.length;c++){var d=cy[c];if(d.el.removed||d.paused)continue;var e=b-d.start,f=d.ms,h=d.easing,i=d.from,j=d.diff,k=d.to,l=d.t,m=d.el,o={},p,r={},s;d.initstatus?(e=(d.initstatus*d.anim.top-d.prev)/(d.percent-d.prev)*f,d.status=d.initstatus,delete d.initstatus,d.stop&&cy.splice(c--,1)):d.status=(d.prev+(d.percent-d.prev)*(e/f))/d.anim.top;if(e<0)continue;if(e<f){var t=h(e/f);for(var u in i)if(i[g](u)){switch(U[u]){case C:p=+i[u]+t*f*j[u];break;case"colour":p="rgb("+[cB(O(i[u].r+t*f*j[u].r)),cB(O(i[u].g+t*f*j[u].g)),cB(O(i[u].b+t*f*j[u].b))].join(",")+")";break;case"path":p=[];for(var v=0,w=i[u].length;v<w;v++){p[v]=[i[u][v][0]];for(var x=1,y=i[u][v].length;x<y;x++)p[v][x]=+i[u][v][x]+t*f*j[u][v][x];p[v]=p[v].join(q)}p=p.join(q);break;case"transform":if(j[u].real){p=[];for(v=0,w=i[u].length;v<w;v++){p[v]=[i[u][v][0]];for(x=1,y=i[u][v].length;x<y;x++)p[v][x]=i[u][v][x]+t*f*j[u][v][x]}}else{var z=function(a){return+i[u][a]+t*f*j[u][a]};p=[["m",z(0),z(1),z(2),z(3),z(4),z(5)]]}break;case"csv":if(u=="clip-rect"){p=[],v=4;while(v--)p[v]=+i[u][v]+t*f*j[u][v]}break;default:var A=[][n](i[u]);p=[],v=m.paper.customAttributes[u].length;while(v--)p[v]=+A[v]+t*f*j[u][v]}o[u]=p}m.attr(o),function(a,b,c){setTimeout(function(){eve("raphael.anim.frame."+a,b,c)})}(m.id,m,d.anim)}else{(function(b,c,d){setTimeout(function(){eve("raphael.anim.frame."+c.id,c,d),eve("raphael.anim.finish."+c.id,c,d),a.is(b,"function")&&b.call(c)})})(d.callback,m,d.anim),m.attr(k),cy.splice(c--,1);if(d.repeat>1&&!d.next){for(s in k)k[g](s)&&(r[s]=d.totalOrigin[s]);d.el.attr(r),cE(d.anim,d.el,d.anim.percents[0],null,d.totalOrigin,d.repeat-1)}d.next&&!d.stop&&cE(d.anim,d.el,d.next,null,d.totalOrigin,d.repeat)}}a.svg&&m&&m.paper&&m.paper.safari(),cy.length&&cz(cA)},cB=function(a){return a>255?255:a<0?0:a};cl.animateWith=function(b,c,d,e,f,g){var h=this;if(h.removed){g&&g.call(h);return h}var i=d instanceof cD?d:a.animation(d,e,f,g),j,k;cE(i,h,i.percents[0],null,h.attr());for(var l=0,m=cy.length;l<m;l++)if(cy[l].anim==c&&cy[l].el==b){cy[m-1].start=cy[l].start;break}return h},cl.onAnimation=function(a){a?eve.on("raphael.anim.frame."+this.id,a):eve.unbind("raphael.anim.frame."+this.id);return this},cD.prototype.delay=function(a){var b=new cD(this.anim,this.ms);b.times=this.times,b.del=+a||0;return b},cD.prototype.repeat=function(a){var b=new cD(this.anim,this.ms);b.del=this.del,b.times=w.floor(x(a,0))||1;return b},a.animation=function(b,c,d,e){if(b instanceof cD)return b;if(a.is(d,"function")||!d)e=e||d||null,d=null;b=Object(b),c=+c||0;var f={},h,i;for(i in b)b[g](i)&&Q(i)!=i&&Q(i)+"%"!=i&&(h=!0,f[i]=b[i]);if(!h)return new cD(b,c);d&&(f.easing=d),e&&(f.callback=e);return new cD({100:f},c)},cl.animate=function(b,c,d,e){var f=this;if(f.removed){e&&e.call(f);return f}var g=b instanceof cD?b:a.animation(b,c,d,e);cE(g,f,g.percents[0],null,f.attr());return f},cl.setTime=function(a,b){a&&b!=null&&this.status(a,y(b,a.ms)/a.ms);return this},cl.status=function(a,b){var c=[],d=0,e,f;if(b!=null){cE(a,this,-1,y(b,1));return this}e=cy.length;for(;d<e;d++){f=cy[d];if(f.el.id==this.id&&(!a||f.anim==a)){if(a)return f.status;c.push({anim:f.anim,status:f.status})}}if(a)return 0;return c},cl.pause=function(a){for(var b=0;b<cy.length;b++)cy[b].el.id==this.id&&(!a||cy[b].anim==a)&&eve("raphael.anim.pause."+this.id,this,cy[b].anim)!==!1&&(cy[b].paused=!0);return this},cl.resume=function(a){for(var b=0;b<cy.length;b++)if(cy[b].el.id==this.id&&(!a||cy[b].anim==a)){var c=cy[b];eve("raphael.anim.resume."+this.id,this,c.anim)!==!1&&(delete c.paused,this.status(c.anim,c.status))}return this},cl.stop=function(a){for(var b=0;b<cy.length;b++)cy[b].el.id==this.id&&(!a||cy[b].anim==a)&&eve("raphael.anim.stop."+this.id,this,cy[b].anim)!==!1&&cy.splice(b--,1);return this},eve.on("raphael.remove",cF),eve.on("raphael.clear",cF),cl.toString=function(){return"Raphaël’s object"};var cG=function(a){this.items=[],this.length=0,this.type="set";if(a)for(var b=0,c=a.length;b<c;b++)a[b]&&(a[b].constructor==cl.constructor||a[b].constructor==cG)&&(this[this.items.length]=this.items[this.items.length]=a[b],this.length++)},cH=cG.prototype;cH.push=function(){var a,b;for(var c=0,d=arguments.length;c<d;c++)a=arguments[c],a&&(a.constructor==cl.constructor||a.constructor==cG)&&(b=this.items.length,this[b]=this.items[b]=a,this.length++);return this},cH.pop=function(){this.length&&delete this[this.length--];return this.items.pop()},cH.forEach=function(a,b){for(var c=0,d=this.items.length;c<d;c++)if(a.call(b,this.items[c],c)===!1)return this;return this};for(var cI in cl)cl[g](cI)&&(cH[cI]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a][m](c,b)})}}(cI));cH.attr=function(b,c){if(b&&a.is(b,E)&&a.is(b[0],"object"))for(var d=0,e=b.length;d<e;d++)this.items[d].attr(b[d]);else for(var f=0,g=this.items.length;f<g;f++)this.items[f].attr(b,c);return this},cH.clear=function(){while(this.length)this.pop()},cH.splice=function(a,b,c){a=a<0?x(this.length+a,0):a,b=x(0,y(this.length-a,b));var d=[],e=[],f=[],g;for(g=2;g<arguments.length;g++)f.push(arguments[g]);for(g=0;g<b;g++)e.push(this[a+g]);for(;g<this.length-a;g++)d.push(this[a+g]);var h=f.length;for(g=0;g<h+d.length;g++)this.items[a+g]=this[a+g]=g<h?f[g]:d[g-h];g=this.items.length=this.length-=b-h;while(this[g])delete this[g++];return new cG(e)},cH.exclude=function(a){for(var b=0,c=this.length;b<c;b++)if(this[b]==a){this.splice(b,1);return!0}},cH.animate=function(b,c,d,e){(a.is(d,"function")||!d)&&(e=d||null);var f=this.items.length,g=f,h,i=this,j;if(!f)return this;e&&(j=function(){!--f&&e.call(i)}),d=a.is(d,D)?d:j;var k=a.animation(b,c,d,j);h=this.items[--g].animate(k);while(g--)this.items[g]&&!this.items[g].removed&&this.items[g].animateWith(h,k,k);return this},cH.insertAfter=function(a){var b=this.items.length;while(b--)this.items[b].insertAfter(a);return this},cH.getBBox=function(){var a=[],b=[],c=[],d=[];for(var e=this.items.length;e--;)if(!this.items[e].removed){var f=this.items[e].getBBox();a.push(f.x),b.push(f.y),c.push(f.x+f.width),d.push(f.y+f.height)}a=y[m](0,a),b=y[m](0,b),c=x[m](0,c),d=x[m](0,d);return{x:a,y:b,x2:c,y2:d,width:c-a,height:d-b}},cH.clone=function(a){a=new cG;for(var b=0,c=this.items.length;b<c;b++)a.push(this.items[b].clone());return a},cH.toString=function(){return"Raphaël‘s set"},a.registerFont=function(a){if(!a.face)return a;this.fonts=this.fonts||{};var b={w:a.w,face:{},glyphs:{}},c=a.face["font-family"];for(var d in a.face)a.face[g](d)&&(b.face[d]=a.face[d]);this.fonts[c]?this.fonts[c].push(b):this.fonts[c]=[b];if(!a.svg){b.face["units-per-em"]=R(a.face["units-per-em"],10);for(var e in a.glyphs)if(a.glyphs[g](e)){var f=a.glyphs[e];b.glyphs[e]={w:f.w,k:{},d:f.d&&"M"+f.d.replace(/[mlcxtrv]/g,function(a){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[a]||"M"})+"z"};if(f.k)for(var h in f.k)f[g](h)&&(b.glyphs[e].k[h]=f.k[h])}}return a},k.getFont=function(b,c,d,e){e=e||"normal",d=d||"normal",c=+c||{normal:400,bold:700,lighter:300,bolder:800}[c]||400;if(!!a.fonts){var f=a.fonts[b];if(!f){var h=new RegExp("(^|\\s)"+b.replace(/[^\w\d\s+!~.:_-]/g,p)+"(\\s|$)","i");for(var i in a.fonts)if(a.fonts[g](i)&&h.test(i)){f=a.fonts[i];break}}var j;if(f)for(var k=0,l=f.length;k<l;k++){j=f[k];if(j.face["font-weight"]==c&&(j.face["font-style"]==d||!j.face["font-style"])&&j.face["font-stretch"]==e)break}return j}},k.print=function(b,d,e,f,g,h,i){h=h||"middle",i=x(y(i||0,1),-1);var j=r(e)[s](p),k=0,l=0,m=p,n;a.is(f,e)&&(f=this.getFont(f));if(f){n=(g||16)/f.face["units-per-em"];var o=f.face.bbox[s](c),q=+o[0],t=o[3]-o[1],u=0,v=+o[1]+(h=="baseline"?t+ +f.face.descent:t/2);for(var w=0,z=j.length;w<z;w++){if(j[w]=="\n")k=0,B=0,l=0,u+=t;else{var A=l&&f.glyphs[j[w-1]]||{},B=f.glyphs[j[w]];k+=l?(A.w||f.w)+(A.k&&A.k[j[w]]||0)+f.w*i:0,l=1}B&&B.d&&(m+=a.transformPath(B.d,["t",k*n,u*n,"s",n,n,q,v,"t",(b-q)/n,(d-v)/n]))}}return this.path(m).attr({fill:"#000",stroke:"none"})},k.add=function(b){if(a.is(b,"array")){var c=this.set(),e=0,f=b.length,h;for(;e<f;e++)h=b[e]||{},d[g](h.type)&&c.push(this[h.type]().attr(h))}return c},a.format=function(b,c){var d=a.is(c,E)?[0][n](c):arguments;b&&a.is(b,D)&&d.length-1&&(b=b.replace(e,function(a,b){return d[++b]==null?p:d[b]}));return b||p},a.fullfill=function(){var a=/\{([^\}]+)\}/g,b=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,c=function(a,c,d){var e=d;c.replace(b,function(a,b,c,d,f){b=b||d,e&&(b in e&&(e=e[b]),typeof e=="function"&&f&&(e=e()))}),e=(e==null||e==d?a:e)+"";return e};return function(b,d){return String(b).replace(a,function(a,b){return c(a,b,d)})}}(),a.ninja=function(){i.was?h.win.Raphael=i.is:delete Raphael;return a},a.st=cH,function(b,c,d){function e(){/in/.test(b.readyState)?setTimeout(e,9):a.eve("raphael.DOMload")}b.readyState==null&&b.addEventListener&&(b.addEventListener(c,d=function(){b.removeEventListener(c,d,!1),b.readyState="complete"},!1),b.readyState="loading"),e()}(document,"DOMContentLoaded"),i.was?h.win.Raphael=a:Raphael=a,eve.on("raphael.DOMload",function(){b=!0})}(),window.Raphael.svg&&function(a){var b="hasOwnProperty",c=String,d=parseFloat,e=parseInt,f=Math,g=f.max,h=f.abs,i=f.pow,j=/[, ]+/,k=a.eve,l="",m=" ",n="http://www.w3.org/1999/xlink",o={block:"M5,0 0,2.5 5,5z",classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",open:"M6,1 1,3.5 6,6",oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"},p={};a.toString=function(){return"Your browser supports SVG.\nYou are running Raphaël "+this.version};var q=function(d,e){if(e){typeof d=="string"&&(d=q(d));for(var f in e)e[b](f)&&(f.substring(0,6)=="xlink:"?d.setAttributeNS(n,f.substring(6),c(e[f])):d.setAttribute(f,c(e[f])))}else d=a._g.doc.createElementNS("http://www.w3.org/2000/svg",d),d.style&&(d.style.webkitTapHighlightColor="rgba(0,0,0,0)");return d},r=function(b,e){var j="linear",k=b.id+e,m=.5,n=.5,o=b.node,p=b.paper,r=o.style,s=a._g.doc.getElementById(k);if(!s){e=c(e).replace(a._radial_gradient,function(a,b,c){j="radial";if(b&&c){m=d(b),n=d(c);var e=(n>.5)*2-1;i(m-.5,2)+i(n-.5,2)>.25&&(n=f.sqrt(.25-i(m-.5,2))*e+.5)&&n!=.5&&(n=n.toFixed(5)-1e-5*e)}return l}),e=e.split(/\s*\-\s*/);if(j=="linear"){var t=e.shift();t=-d(t);if(isNaN(t))return null;var u=[0,0,f.cos(a.rad(t)),f.sin(a.rad(t))],v=1/(g(h(u[2]),h(u[3]))||1);u[2]*=v,u[3]*=v,u[2]<0&&(u[0]=-u[2],u[2]=0),u[3]<0&&(u[1]=-u[3],u[3]=0)}var w=a._parseDots(e);if(!w)return null;k=k.replace(/[\(\)\s,\xb0#]/g,"_"),b.gradient&&k!=b.gradient.id&&(p.defs.removeChild(b.gradient),delete b.gradient);if(!b.gradient){s=q(j+"Gradient",{id:k}),b.gradient=s,q(s,j=="radial"?{fx:m,fy:n}:{x1:u[0],y1:u[1],x2:u[2],y2:u[3],gradientTransform:b.matrix.invert()}),p.defs.appendChild(s);for(var x=0,y=w.length;x<y;x++)s.appendChild(q("stop",{offset:w[x].offset?w[x].offset:x?"100%":"0%","stop-color":w[x].color||"#fff"}))}}q(o,{fill:"url(#"+k+")",opacity:1,"fill-opacity":1}),r.fill=l,r.opacity=1,r.fillOpacity=1;return 1},s=function(a){var b=a.getBBox(1);q(a.pattern,{patternTransform:a.matrix.invert()+" translate("+b.x+","+b.y+")"})},t=function(d,e,f){if(d.type=="path"){var g=c(e).toLowerCase().split("-"),h=d.paper,i=f?"end":"start",j=d.node,k=d.attrs,m=k["stroke-width"],n=g.length,r="classic",s,t,u,v,w,x=3,y=3,z=5;while(n--)switch(g[n]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":r=g[n];break;case"wide":y=5;break;case"narrow":y=2;break;case"long":x=5;break;case"short":x=2}r=="open"?(x+=2,y+=2,z+=2,u=1,v=f?4:1,w={fill:"none",stroke:k.stroke}):(v=u=x/2,w={fill:k.stroke,stroke:"none"}),d._.arrows?f?(d._.arrows.endPath&&p[d._.arrows.endPath]--,d._.arrows.endMarker&&p[d._.arrows.endMarker]--):(d._.arrows.startPath&&p[d._.arrows.startPath]--,d._.arrows.startMarker&&p[d._.arrows.startMarker]--):d._.arrows={};if(r!="none"){var A="raphael-marker-"+r,B="raphael-marker-"+i+r+x+y;a._g.doc.getElementById(A)?p[A]++:(h.defs.appendChild(q(q("path"),{"stroke-linecap":"round",d:o[r],id:A})),p[A]=1);var C=a._g.doc.getElementById(B),D;C?(p[B]++,D=C.getElementsByTagName("use")[0]):(C=q(q("marker"),{id:B,markerHeight:y,markerWidth:x,orient:"auto",refX:v,refY:y/2}),D=q(q("use"),{"xlink:href":"#"+A,transform:(f?"rotate(180 "+x/2+" "+y/2+") ":l)+"scale("+x/z+","+y/z+")","stroke-width":(1/((x/z+y/z)/2)).toFixed(4)}),C.appendChild(D),h.defs.appendChild(C),p[B]=1),q(D,w);var F=u*(r!="diamond"&&r!="oval");f?(s=d._.arrows.startdx*m||0,t=a.getTotalLength(k.path)-F*m):(s=F*m,t=a.getTotalLength(k.path)-(d._.arrows.enddx*m||0)),w={},w["marker-"+i]="url(#"+B+")";if(t||s)w.d=Raphael.getSubpath(k.path,s,t);q(j,w),d._.arrows[i+"Path"]=A,d._.arrows[i+"Marker"]=B,d._.arrows[i+"dx"]=F,d._.arrows[i+"Type"]=r,d._.arrows[i+"String"]=e}else f?(s=d._.arrows.startdx*m||0,t=a.getTotalLength(k.path)-s):(s=0,t=a.getTotalLength(k.path)-(d._.arrows.enddx*m||0)),d._.arrows[i+"Path"]&&q(j,{d:Raphael.getSubpath(k.path,s,t)}),delete d._.arrows[i+"Path"],delete d._.arrows[i+"Marker"],delete d._.arrows[i+"dx"],delete d._.arrows[i+"Type"],delete d._.arrows[i+"String"];for(w in p)if(p[b](w)&&!p[w]){var G=a._g.doc.getElementById(w);G&&G.parentNode.removeChild(G)}}},u={"":[0],none:[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},v=function(a,b,d){b=u[c(b).toLowerCase()];if(b){var e=a.attrs["stroke-width"]||"1",f={round:e,square:e,butt:0}[a.attrs["stroke-linecap"]||d["stroke-linecap"]]||0,g=[],h=b.length;while(h--)g[h]=b[h]*e+(h%2?1:-1)*f;q(a.node,{"stroke-dasharray":g.join(",")})}},w=function(d,f){var i=d.node,k=d.attrs,m=i.style.visibility;i.style.visibility="hidden";for(var o in f)if(f[b](o)){if(!a._availableAttrs[b](o))continue;var p=f[o];k[o]=p;switch(o){case"blur":d.blur(p);break;case"href":case"title":case"target":var u=i.parentNode;if(u.tagName.toLowerCase()!="a"){var w=q("a");u.insertBefore(w,i),w.appendChild(i),u=w}o=="target"?u.setAttributeNS(n,"show",p=="blank"?"new":p):u.setAttributeNS(n,o,p);break;case"cursor":i.style.cursor=p;break;case"transform":d.transform(p);break;case"arrow-start":t(d,p);break;case"arrow-end":t(d,p,1);break;case"clip-rect":var x=c(p).split(j);if(x.length==4){d.clip&&d.clip.parentNode.parentNode.removeChild(d.clip.parentNode);var z=q("clipPath"),A=q("rect");z.id=a.createUUID(),q(A,{x:x[0],y:x[1],width:x[2],height:x[3]}),z.appendChild(A),d.paper.defs.appendChild(z),q(i,{"clip-path":"url(#"+z.id+")"}),d.clip=A}if(!p){var B=i.getAttribute("clip-path");if(B){var C=a._g.doc.getElementById(B.replace(/(^url\(#|\)$)/g,l));C&&C.parentNode.removeChild(C),q(i,{"clip-path":l}),delete d.clip}}break;case"path":d.type=="path"&&(q(i,{d:p?k.path=a._pathToAbsolute(p):"M0,0"}),d._.dirty=1,d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1)));break;case"width":i.setAttribute(o,p),d._.dirty=1;if(k.fx)o="x",p=k.x;else break;case"x":k.fx&&(p=-k.x-(k.width||0));case"rx":if(o=="rx"&&d.type=="rect")break;case"cx":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"height":i.setAttribute(o,p),d._.dirty=1;if(k.fy)o="y",p=k.y;else break;case"y":k.fy&&(p=-k.y-(k.height||0));case"ry":if(o=="ry"&&d.type=="rect")break;case"cy":i.setAttribute(o,p),d.pattern&&s(d),d._.dirty=1;break;case"r":d.type=="rect"?q(i,{rx:p,ry:p}):i.setAttribute(o,p),d._.dirty=1;break;case"src":d.type=="image"&&i.setAttributeNS(n,"href",p);break;case"stroke-width":if(d._.sx!=1||d._.sy!=1)p/=g(h(d._.sx),h(d._.sy))||1;d.paper._vbSize&&(p*=d.paper._vbSize),i.setAttribute(o,p),k["stroke-dasharray"]&&v(d,k["stroke-dasharray"],f),d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"stroke-dasharray":v(d,p,f);break;case"fill":var D=c(p).match(a._ISURL);if(D){z=q("pattern");var F=q("image");z.id=a.createUUID(),q(z,{x:0,y:0,patternUnits:"userSpaceOnUse",height:1,width:1}),q(F,{x:0,y:0,"xlink:href":D[1]}),z.appendChild(F),function(b){a._preload(D[1],function(){var a=this.offsetWidth,c=this.offsetHeight;q(b,{width:a,height:c}),q(F,{width:a,height:c}),d.paper.safari()})}(z),d.paper.defs.appendChild(z),q(i,{fill:"url(#"+z.id+")"}),d.pattern=z,d.pattern&&s(d);break}var G=a.getRGB(p);if(!G.error)delete f.gradient,delete k.gradient,!a.is(k.opacity,"undefined")&&a.is(f.opacity,"undefined")&&q(i,{opacity:k.opacity}),!a.is(k["fill-opacity"],"undefined")&&a.is(f["fill-opacity"],"undefined")&&q(i,{"fill-opacity":k["fill-opacity"]});else if((d.type=="circle"||d.type=="ellipse"||c(p).charAt()!="r")&&r(d,p)){if("opacity"in k||"fill-opacity"in k){var H=a._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l));if(H){var I=H.getElementsByTagName("stop");q(I[I.length-1],{"stop-opacity":("opacity"in k?k.opacity:1)*("fill-opacity"in k?k["fill-opacity"]:1)})}}k.gradient=p,k.fill="none";break}G[b]("opacity")&&q(i,{"fill-opacity":G.opacity>1?G.opacity/100:G.opacity});case"stroke":G=a.getRGB(p),i.setAttribute(o,G.hex),o=="stroke"&&G[b]("opacity")&&q(i,{"stroke-opacity":G.opacity>1?G.opacity/100:G.opacity}),o=="stroke"&&d._.arrows&&("startString"in d._.arrows&&t(d,d._.arrows.startString),"endString"in d._.arrows&&t(d,d._.arrows.endString,1));break;case"gradient":(d.type=="circle"||d.type=="ellipse"||c(p).charAt()!="r")&&r(d,p);break;case"opacity":k.gradient&&!k[b]("stroke-opacity")&&q(i,{"stroke-opacity":p>1?p/100:p});case"fill-opacity":if(k.gradient){H=a._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g,l)),H&&(I=H.getElementsByTagName("stop"),q(I[I.length-1],{"stop-opacity":p}));break};default:o=="font-size"&&(p=e(p,10)+"px");var J=o.replace(/(\-.)/g,function(a){return a.substring(1).toUpperCase()});i.style[J]=p,d._.dirty=1,i.setAttribute(o,p)}}y(d,f),i.style.visibility=m},x=1.2,y=function(d,f){if(d.type=="text"&&!!(f[b]("text")||f[b]("font")||f[b]("font-size")||f[b]("x")||f[b]("y"))){var g=d.attrs,h=d.node,i=h.firstChild?e(a._g.doc.defaultView.getComputedStyle(h.firstChild,l).getPropertyValue("font-size"),10):10;if(f[b]("text")){g.text=f.text;while(h.firstChild)h.removeChild(h.firstChild);var j=c(f.text).split("\n"),k=[],m;for(var n=0,o=j.length;n<o;n++)m=q("tspan"),n&&q(m,{dy:i*x,x:g.x}),m.appendChild(a._g.doc.createTextNode(j[n])),h.appendChild(m),k[n]=m}else{k=h.getElementsByTagName("tspan");for(n=0,o=k.length;n<o;n++)n?q(k[n],{dy:i*x,x:g.x}):q(k[0],{dy:0})}q(h,{x:g.x,y:g.y}),d._.dirty=1;var p=d._getBBox(),r=g.y-(p.y+p.height/2);r&&a.is(r,"finite")&&q(k[0],{dy:r})}},z=function(b,c){var d=0,e=0;this[0]=this.node=b,b.raphael=!0,this.id=a._oid++,b.raphaelid=this.id,this.matrix=a.matrix(),this.realPath=null,this.paper=c,this.attrs=this.attrs||{},this._={transform:[],sx:1,sy:1,deg:0,dx:0,dy:0,dirty:1},!c.bottom&&(c.bottom=this),this.prev=c.top,c.top&&(c.top.next=this),c.top=this,this.next=null},A=a.el;z.prototype=A,A.constructor=z,a._engine.path=function(a,b){var c=q("path");b.canvas&&b.canvas.appendChild(c);var d=new z(c,b);d.type="path",w(d,{fill:"none",stroke:"#000",path:a});return d},A.rotate=function(a,b,e){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1]),e=d(a[2])),a=d(a[0]),e==null&&(b=e);if(b==null||e==null){var f=this.getBBox(1);b=f.x+f.width/2,e=f.y+f.height/2}this.transform(this._.transform.concat([["r",a,b,e]]));return this},A.scale=function(a,b,e,f){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1]),e=d(a[2]),f=d(a[3])),a=d(a[0]),b==null&&(b=a),f==null&&(e=f);if(e==null||f==null)var g=this.getBBox(1);e=e==null?g.x+g.width/2:e,f=f==null?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,b,e,f]]));return this},A.translate=function(a,b){if(this.removed)return this;a=c(a).split(j),a.length-1&&(b=d(a[1])),a=d(a[0])||0,b=+b||0,this.transform(this._.transform.concat([["t",a,b]]));return this},A.transform=function(c){var d=this._;if(c==null)return d.transform;a._extractTransform(this,c),this.clip&&q(this.clip,{transform:this.matrix.invert()}),this.pattern&&s(this),this.node&&q(this.node,{transform:this.matrix});if(d.sx!=1||d.sy!=1){var e=this.attrs[b]("stroke-width")?this.attrs["stroke-width"]:1;this.attr({"stroke-width":e})}return this},A.hide=function(){!this.removed&&this.paper.safari(this.node.style.display="none");return this},A.show=function(){!this.removed&&this.paper.safari(this.node.style.display="");return this},A.remove=function(){if(!this.removed&&!!this.node.parentNode){var b=this.paper;b.__set__&&b.__set__.exclude(this),k.unbind("raphael.*.*."+this.id),this.gradient&&b.defs.removeChild(this.gradient),a._tear(this,b),this.node.parentNode.tagName.toLowerCase()=="a"?this.node.parentNode.parentNode.removeChild(this.node.parentNode):this.node.parentNode.removeChild(this.node);for(var c in this)this[c]=typeof this[c]=="function"?a._removedFactory(c):null;this.removed=!0}},A._getBBox=function(){if(this.node.style.display=="none"){this.show();var a=!0}var b={};try{b=this.node.getBBox()}catch(c){}finally{b=b||{}}a&&this.hide();return b},A.attr=function(c,d){if(this.removed)return this;if(c==null){var e={};for(var f in this.attrs)this.attrs[b](f)&&(e[f]=this.attrs[f]);e.gradient&&e.fill=="none"&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform;return e}if(d==null&&a.is(c,"string")){if(c=="fill"&&this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;if(c=="transform")return this._.transform;var g=c.split(j),h={};for(var i=0,l=g.length;i<l;i++)c=g[i],c in this.attrs?h[c]=this.attrs[c]:a.is(this.paper.customAttributes[c],"function")?h[c]=this.paper.customAttributes[c].def:h[c]=a._availableAttrs[c];return l-1?h:h[g[0]]}if(d==null&&a.is(c,"array")){h={};for(i=0,l=c.length;i<l;i++)h[c[i]]=this.attr(c[i]);return h}if(d!=null){var m={};m[c]=d}else c!=null&&a.is(c,"object")&&(m=c);for(var n in m)k("raphael.attr."+n+"."+this.id,this,m[n]);for(n in this.paper.customAttributes)if(this.paper.customAttributes[b](n)&&m[b](n)&&a.is(this.paper.customAttributes[n],"function")){var o=this.paper.customAttributes[n].apply(this,[].concat(m[n]));this.attrs[n]=m[n];for(var p in o)o[b](p)&&(m[p]=o[p])}w(this,m);return this},A.toFront=function(){if(this.removed)return this;this.node.parentNode.tagName.toLowerCase()=="a"?this.node.parentNode.parentNode.appendChild(this.node.parentNode):this.node.parentNode.appendChild(this.node);var b=this.paper;b.top!=this&&a._tofront(this,b);return this},A.toBack=function(){if(this.removed)return this;var b=this.node.parentNode;b.tagName.toLowerCase()=="a"?b.parentNode.insertBefore(this.node.parentNode,this.node.parentNode.parentNode.firstChild):b.firstChild!=this.node&&b.insertBefore(this.node,this.node.parentNode.firstChild),a._toback(this,this.paper);var c=this.paper;return this},A.insertAfter=function(b){if(this.removed)return this;var c=b.node||b[b.length-1].node;c.nextSibling?c.parentNode.insertBefore(this.node,c.nextSibling):c.parentNode.appendChild(this.node),a._insertafter(this,b,this.paper);return this},A.insertBefore=function(b){if(this.removed)return this;var c=b.node||b[0].node;c.parentNode.insertBefore(this.node,c),a._insertbefore(this,b,this.paper);return this},A.blur=function(b){var c=this;if(+b!==0){var d=q("filter"),e=q("feGaussianBlur");c.attrs.blur=b,d.id=a.createUUID(),q(e,{stdDeviation:+b||1.5}),d.appendChild(e),c.paper.defs.appendChild(d),c._blur=d,q(c.node,{filter:"url(#"+d.id+")"})}else c._blur&&(c._blur.parentNode.removeChild(c._blur),delete c._blur,delete c.attrs.blur),c.node.removeAttribute("filter")},a._engine.circle=function(a,b,c,d){var e=q("circle");a.canvas&&a.canvas.appendChild(e);var f=new z(e,a);f.attrs={cx:b,cy:c,r:d,fill:"none",stroke:"#000"},f.type="circle",q(e,f.attrs);return f},a._engine.rect=function(a,b,c,d,e,f){var g=q("rect");a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);h.attrs={x:b,y:c,width:d,height:e,r:f||0,rx:f||0,ry:f||0,fill:"none",stroke:"#000"},h.type="rect",q(g,h.attrs);return h},a._engine.ellipse=function(a,b,c,d,e){var f=q("ellipse");a.canvas&&a.canvas.appendChild(f);var g=new z(f,a);g.attrs={cx:b,cy:c,rx:d,ry:e,fill:"none",stroke:"#000"},g.type="ellipse",q(f,g.attrs);return g},a._engine.image=function(a,b,c,d,e,f){var g=q("image");q(g,{x:c,y:d,width:e,height:f,preserveAspectRatio:"none"}),g.setAttributeNS(n,"href",b),a.canvas&&a.canvas.appendChild(g);var h=new z(g,a);h.attrs={x:c,y:d,width:e,height:f,src:b},h.type="image";return h},a._engine.text=function(b,c,d,e){var f=q("text");b.canvas&&b.canvas.appendChild(f);var g=new z(f,b);g.attrs={x:c,y:d,"text-anchor":"middle",text:e,font:a._availableAttrs.font,stroke:"none",fill:"#000"},g.type="text",w(g,g.attrs);return g},a._engine.setSize=function(a,b){this.width=a||this.width,this.height=b||this.height,this.canvas.setAttribute("width",this.width),this.canvas.setAttribute("height",this.height),this._viewBox&&this.setViewBox.apply(this,this._viewBox);return this},a._engine.create=function(){var b=a._getContainer.apply(0,arguments),c=b&&b.container,d=b.x,e=b.y,f=b.width,g=b.height;if(!c)throw new Error("SVG container not found.");var h=q("svg"),i="overflow:hidden;",j;d=d||0,e=e||0,f=f||512,g=g||342,q(h,{height:g,version:1.1,width:f,xmlns:"http://www.w3.org/2000/svg"}),c==1?(h.style.cssText=i+"position:absolute;left:"+d+"px;top:"+e+"px",a._g.doc.body.appendChild(h),j=1):(h.style.cssText=i+"position:relative",c.firstChild?c.insertBefore(h,c.firstChild):c.appendChild(h)),c=new a._Paper,c.width=f,c.height=g,c.canvas=h,c.clear(),c._left=c._top=0,j&&(c.renderfix=function(){}),c.renderfix();return c},a._engine.setViewBox=function(a,b,c,d,e){k("raphael.setViewBox",this,this._viewBox,[a,b,c,d,e]);var f=g(c/this.width,d/this.height),h=this.top,i=e?"meet":"xMinYMin",j,l;a==null?(this._vbSize&&(f=1),delete this._vbSize,j="0 0 "+this.width+m+this.height):(this._vbSize=f,j=a+m+b+m+c+m+d),q(this.canvas,{viewBox:j,preserveAspectRatio:i});while(f&&h)l="stroke-width"in h.attrs?h.attrs["stroke-width"]:1,h.attr({"stroke-width":l}),h._.dirty=1,h._.dirtyT=1,h=h.prev;this._viewBox=[a,b,c,d,!!e];return this},a.prototype.renderfix=function(){var a=this.canvas,b=a.style,c;try{c=a.getScreenCTM()||a.createSVGMatrix()}catch(d){c=a.createSVGMatrix()}var e=-c.e%1,f=-c.f%1;if(e||f)e&&(this._left=(this._left+e)%1,b.left=this._left+"px"),f&&(this._top=(this._top+f)%1,b.top=this._top+"px")},a.prototype.clear=function(){a.eve("raphael.clear",this);var b=this.canvas;while(b.firstChild)b.removeChild(b.firstChild);this.bottom=this.top=null,(this.desc=q("desc")).appendChild(a._g.doc.createTextNode("Created with Raphaël "+a.version)),b.appendChild(this.desc),b.appendChild(this.defs=q("defs"))},a.prototype.remove=function(){k("raphael.remove",this),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null};var B=a.st;for(var C in A)A[b](C)&&!B[b](C)&&(B[C]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(C))}(window.Raphael),window.Raphael.vml&&function(a){var b="hasOwnProperty",c=String,d=parseFloat,e=Math,f=e.round,g=e.max,h=e.min,i=e.abs,j="fill",k=/[, ]+/,l=a.eve,m=" progid:DXImageTransform.Microsoft",n=" ",o="",p={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},q=/([clmz]),?([^clmz]*)/gi,r=/ progid:\S+Blur\([^\)]+\)/g,s=/-?[^,\s-]+/g,t="position:absolute;left:0;top:0;width:1px;height:1px",u=21600,v={path:1,rect:1,image:1},w={circle:1,ellipse:1},x=function(b){var d=/[ahqstv]/ig,e=a._pathToAbsolute;c(b).match(d)&&(e=a._path2curve),d=/[clmz]/g;if(e==a._pathToAbsolute&&!c(b).match(d)){var g=c(b).replace(q,function(a,b,c){var d=[],e=b.toLowerCase()=="m",g=p[b];c.replace(s,function(a){e&&d.length==2&&(g+=d+p[b=="m"?"l":"L"],d=[]),d.push(f(a*u))});return g+d});return g}var h=e(b),i,j;g=[];for(var k=0,l=h.length;k<l;k++){i=h[k],j=h[k][0].toLowerCase(),j=="z"&&(j="x");for(var m=1,r=i.length;m<r;m++)j+=f(i[m]*u)+(m!=r-1?",":o);g.push(j)}return g.join(n)},y=function(b,c,d){var e=a.matrix();e.rotate(-b,.5,.5);return{dx:e.x(c,d),dy:e.y(c,d)}},z=function(a,b,c,d,e,f){var g=a._,h=a.matrix,k=g.fillpos,l=a.node,m=l.style,o=1,p="",q,r=u/b,s=u/c;m.visibility="hidden";if(!!b&&!!c){l.coordsize=i(r)+n+i(s),m.rotation=f*(b*c<0?-1:1);if(f){var t=y(f,d,e);d=t.dx,e=t.dy}b<0&&(p+="x"),c<0&&(p+=" y")&&(o=-1),m.flip=p,l.coordorigin=d*-r+n+e*-s;if(k||g.fillsize){var v=l.getElementsByTagName(j);v=v&&v[0],l.removeChild(v),k&&(t=y(f,h.x(k[0],k[1]),h.y(k[0],k[1])),v.position=t.dx*o+n+t.dy*o),g.fillsize&&(v.size=g.fillsize[0]*i(b)+n+g.fillsize[1]*i(c)),l.appendChild(v)}m.visibility="visible"}};a.toString=function(){return"Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël "+this.version};var A=function(a,b,d){var e=c(b).toLowerCase().split("-"),f=d?"end":"start",g=e.length,h="classic",i="medium",j="medium";while(g--)switch(e[g]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":h=e[g];break;case"wide":case"narrow":j=e[g];break;case"long":case"short":i=e[g]}var k=a.node.getElementsByTagName("stroke")[0];k[f+"arrow"]=h,k[f+"arrowlength"]=i,k[f+"arrowwidth"]=j},B=function(e,i){e.attrs=e.attrs||{};var l=e.node,m=e.attrs,p=l.style,q,r=v[e.type]&&(i.x!=m.x||i.y!=m.y||i.width!=m.width||i.height!=m.height||i.cx!=m.cx||i.cy!=m.cy||i.rx!=m.rx||i.ry!=m.ry||i.r!=m.r),s=w[e.type]&&(m.cx!=i.cx||m.cy!=i.cy||m.r!=i.r||m.rx!=i.rx||m.ry!=i.ry),t=e;for(var y in i)i[b](y)&&(m[y]=i[y]);r&&(m.path=a._getPath[e.type](e),e._.dirty=1),i.href&&(l.href=i.href),i.title&&(l.title=i.title),i.target&&(l.target=i.target),i.cursor&&(p.cursor=i.cursor),"blur"in i&&e.blur(i.blur);if(i.path&&e.type=="path"||r)l.path=x(~c(m.path).toLowerCase().indexOf("r")?a._pathToAbsolute(m.path):m.path),e.type=="image"&&(e._.fillpos=[m.x,m.y],e._.fillsize=[m.width,m.height],z(e,1,1,0,0,0));"transform"in i&&e.transform(i.transform);if(s){var B=+m.cx,D=+m.cy,E=+m.rx||+m.r||0,G=+m.ry||+m.r||0;l.path=a.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",f((B-E)*u),f((D-G)*u),f((B+E)*u),f((D+G)*u),f(B*u))}if("clip-rect"in i){var H=c(i["clip-rect"]).split(k);if(H.length==4){H[2]=+H[2]+ +H[0],H[3]=+H[3]+ +H[1];var I=l.clipRect||a._g.doc.createElement("div"),J=I.style;J.clip=a.format("rect({1}px {2}px {3}px {0}px)",H),l.clipRect||(J.position="absolute",J.top=0,J.left=0,J.width=e.paper.width+"px",J.height=e.paper.height+"px",l.parentNode.insertBefore(I,l),I.appendChild(l),l.clipRect=I)}i["clip-rect"]||l.clipRect&&(l.clipRect.style.clip="auto")}if(e.textpath){var K=e.textpath.style;i.font&&(K.font=i.font),i["font-family"]&&(K.fontFamily='"'+i["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,o)+'"'),i["font-size"]&&(K.fontSize=i["font-size"]),i["font-weight"]&&(K.fontWeight=i["font-weight"]),i["font-style"]&&(K.fontStyle=i["font-style"])}"arrow-start"in i&&A(t,i["arrow-start"]),"arrow-end"in i&&A(t,i["arrow-end"],1);if(i.opacity!=null||i["stroke-width"]!=null||i.fill!=null||i.src!=null||i.stroke!=null||i["stroke-width"]!=null||i["stroke-opacity"]!=null||i["fill-opacity"]!=null||i["stroke-dasharray"]!=null||i["stroke-miterlimit"]!=null||i["stroke-linejoin"]!=null||i["stroke-linecap"]!=null){var L=l.getElementsByTagName(j),M=!1;L=L&&L[0],!L&&(M=L=F(j)),e.type=="image"&&i.src&&(L.src=i.src),i.fill&&(L.on=!0);if(L.on==null||i.fill=="none"||i.fill===null)L.on=!1;if(L.on&&i.fill){var N=c(i.fill).match(a._ISURL);if(N){L.parentNode==l&&l.removeChild(L),L.rotate=!0,L.src=N[1],L.type="tile";var O=e.getBBox(1);L.position=O.x+n+O.y,e._.fillpos=[O.x,O.y],a._preload(N[1],function(){e._.fillsize=[this.offsetWidth,this.offsetHeight]})}else L.color=a.getRGB(i.fill).hex,L.src=o,L.type="solid",a.getRGB(i.fill).error&&(t.type in{circle:1,ellipse:1}||c(i.fill).charAt()!="r")&&C(t,i.fill,L)&&(m.fill="none",m.gradient=i.fill,L.rotate=!1)}if("fill-opacity"in i||"opacity"in i){var P=((+m["fill-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+a.getRGB(i.fill).o+1||2)-1);P=h(g(P,0),1),L.opacity=P,L.src&&(L.color="none")}l.appendChild(L);var Q=l.getElementsByTagName("stroke")&&l.getElementsByTagName("stroke")[0],T=!1;!Q&&(T=Q=F("stroke"));if(i.stroke&&i.stroke!="none"||i["stroke-width"]||i["stroke-opacity"]!=null||i["stroke-dasharray"]||i["stroke-miterlimit"]||i["stroke-linejoin"]||i["stroke-linecap"])Q.on=!0;(i.stroke=="none"||i.stroke===null||Q.on==null||i.stroke==0||i["stroke-width"]==0)&&(Q.on=!1);var U=a.getRGB(i.stroke);Q.on&&i.stroke&&(Q.color=U.hex),P=((+m["stroke-opacity"]+1||2)-1)*((+m.opacity+1||2)-1)*((+U.o+1||2)-1);var V=(d(i["stroke-width"])||1)*.75;P=h(g(P,0),1),i["stroke-width"]==null&&(V=m["stroke-width"]),i["stroke-width"]&&(Q.weight=V),V&&V<1&&(P*=V)&&(Q.weight=1),Q.opacity=P,i["stroke-linejoin"]&&(Q.joinstyle=i["stroke-linejoin"]||"miter"),Q.miterlimit=i["stroke-miterlimit"]||8,i["stroke-linecap"]&&(Q.endcap=i["stroke-linecap"]=="butt"?"flat":i["stroke-linecap"]=="square"?"square":"round");if(i["stroke-dasharray"]){var W={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};Q.dashstyle=W[b](i["stroke-dasharray"])?W[i["stroke-dasharray"]]:o}T&&l.appendChild(Q)}if(t.type=="text"){t.paper.canvas.style.display=o;var X=t.paper.span,Y=100,Z=m.font&&m.font.match(/\d+(?:\.\d*)?(?=px)/);p=X.style,m.font&&(p.font=m.font),m["font-family"]&&(p.fontFamily=m["font-family"]),m["font-weight"]&&(p.fontWeight=m["font-weight"]),m["font-style"]&&(p.fontStyle=m["font-style"]),Z=d(m["font-size"]||Z&&Z[0])||10,p.fontSize=Z*Y+"px",t.textpath.string&&(X.innerHTML=c(t.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));var $=X.getBoundingClientRect();t.W=m.w=($.right-$.left)/Y,t.H=m.h=($.bottom-$.top)/Y,t.X=m.x,t.Y=m.y+t.H/2,("x"in i||"y"in i)&&(t.path.v=a.format("m{0},{1}l{2},{1}",f(m.x*u),f(m.y*u),f(m.x*u)+1));var _=["x","y","text","font","font-family","font-weight","font-style","font-size"];for(var ba=0,bb=_.length;ba<bb;ba++)if(_[ba]in i){t._.dirty=1;break}switch(m["text-anchor"]){case"start":t.textpath.style["v-text-align"]="left",t.bbx=t.W/2;break;case"end":t.textpath.style["v-text-align"]="right",t.bbx=-t.W/2;break;default:t.textpath.style["v-text-align"]="center",t.bbx=0}t.textpath.style["v-text-kern"]=!0}},C=function(b,f,g){b.attrs=b.attrs||{};var h=b.attrs,i=Math.pow,j,k,l="linear",m=".5 .5";b.attrs.gradient=f,f=c(f).replace(a._radial_gradient,function(a,b,c){l="radial",b&&c&&(b=d(b),c=d(c),i(b-.5,2)+i(c-.5,2)>.25&&(c=e.sqrt(.25-i(b-.5,2))*((c>.5)*2-1)+.5),m=b+n+c);return o}),f=f.split(/\s*\-\s*/);if(l=="linear"){var p=f.shift();p=-d(p);if(isNaN(p))return null}var q=a._parseDots(f);if(!q)return null;b=b.shape||b.node;if(q.length){b.removeChild(g),g.on=!0,g.method="none",g.color=q[0].color,g.color2=q[q.length-1].color;var r=[];for(var s=0,t=q.length;s<t;s++)q[s].offset&&r.push(q[s].offset+n+q[s].color);g.colors=r.length?r.join():"0% "+g.color,l=="radial"?(g.type="gradientTitle",g.focus="100%",g.focussize="0 0",g.focusposition=m,g.angle=0):(g.type="gradient",g.angle=(270-p)%360),b.appendChild(g)}return 1},D=function(b,c){this[0]=this.node=b,b.raphael=!0,this.id=a._oid++,b.raphaelid=this.id,this.X=0,this.Y=0,this.attrs={},this.paper=c,this.matrix=a.matrix(),this._={transform:[],sx:1,sy:1,dx:0,dy:0,deg:0,dirty:1,dirtyT:1},!c.bottom&&(c.bottom=this),this.prev=c.top,c.top&&(c.top.next=this),c.top=this,this.next=null},E=a.el;D.prototype=E,E.constructor=D,E.transform=function(b){if(b==null)return this._.transform;var d=this.paper._viewBoxShift,e=d?"s"+[d.scale,d.scale]+"-1-1t"+[d.dx,d.dy]:o,f;d&&(f=b=c(b).replace(/\.{3}|\u2026/g,this._.transform||o)),a._extractTransform(this,e+b);var g=this.matrix.clone(),h=this.skew,i=this.node,j,k=~c(this.attrs.fill).indexOf("-"),l=!c(this.attrs.fill).indexOf("url(");g.translate(-0.5,-0.5);if(l||k||this.type=="image"){h.matrix="1 0 0 1",h.offset="0 0",j=g.split();if(k&&j.noRotation||!j.isSimple){i.style.filter=g.toFilter();var m=this.getBBox(),p=this.getBBox(1),q=m.x-p.x,r=m.y-p.y;i.coordorigin=q*-u+n+r*-u,z(this,1,1,q,r,0)}else i.style.filter=o,z(this,j.scalex,j.scaley,j.dx,j.dy,j.rotate)}else i.style.filter=o,h.matrix=c(g),h.offset=g.offset();f&&(this._.transform=f);return this},E.rotate=function(a,b,e){if(this.removed)return this;if(a!=null){a=c(a).split(k),a.length-1&&(b=d(a[1]),e=d(a[2])),a=d(a[0]),e==null&&(b=e);if(b==null||e==null){var f=this.getBBox(1);b=f.x+f.width/2,e=f.y+f.height/2}this._.dirtyT=1,this.transform(this._.transform.concat([["r",a,b,e]]));return this}},E.translate=function(a,b){if(this.removed)return this;a=c(a).split(k),a.length-1&&(b=d(a[1])),a=d(a[0])||0,b=+b||0,this._.bbox&&(this._.bbox.x+=a,this._.bbox.y+=b),this.transform(this._.transform.concat([["t",a,b]]));return this},E.scale=function(a,b,e,f){if(this.removed)return this;a=c(a).split(k),a.length-1&&(b=d(a[1]),e=d(a[2]),f=d(a[3]),isNaN(e)&&(e=null),isNaN(f)&&(f=null)),a=d(a[0]),b==null&&(b=a),f==null&&(e=f);if(e==null||f==null)var g=this.getBBox(1);e=e==null?g.x+g.width/2:e,f=f==null?g.y+g.height/2:f,this.transform(this._.transform.concat([["s",a,b,e,f]])),this._.dirtyT=1;return this},E.hide=function(){!this.removed&&(this.node.style.display="none");return this},E.show=function(){!this.removed&&(this.node.style.display=o);return this},E._getBBox=function(){if(this.removed)return{};return{x:this.X+(this.bbx||0)-this.W/2,y:this.Y-this.H,width:this.W,height:this.H}},E.remove=function(){if(!this.removed&&!!this.node.parentNode){this.paper.__set__&&this.paper.__set__.exclude(this),a.eve.unbind("raphael.*.*."+this.id),a._tear(this,this.paper),this.node.parentNode.removeChild(this.node),this.shape&&this.shape.parentNode.removeChild(this.shape);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null;this.removed=!0}},E.attr=function(c,d){if(this.removed)return this;if(c==null){var e={};for(var f in this.attrs)this.attrs[b](f)&&(e[f]=this.attrs[f]);e.gradient&&e.fill=="none"&&(e.fill=e.gradient)&&delete e.gradient,e.transform=this._.transform;return e}if(d==null&&a.is(c,"string")){if(c==j&&this.attrs.fill=="none"&&this.attrs.gradient)return this.attrs.gradient;var g=c.split(k),h={};for(var i=0,m=g.length;i<m;i++)c=g[i],c in this.attrs?h[c]=this.attrs[c]:a.is(this.paper.customAttributes[c],"function")?h[c]=this.paper.customAttributes[c].def:h[c]=a._availableAttrs[c];return m-1?h:h[g[0]]}if(this.attrs&&d==null&&a.is(c,"array")){h={};for(i=0,m=c.length;i<m;i++)h[c[i]]=this.attr(c[i]);return h}var n;d!=null&&(n={},n[c]=d),d==null&&a.is(c,"object")&&(n=c);for(var o in n)l("raphael.attr."+o+"."+this.id,this,n[o]);if(n){for(o in this.paper.customAttributes)if(this.paper.customAttributes[b](o)&&n[b](o)&&a.is(this.paper.customAttributes[o],"function")){var p=this.paper.customAttributes[o].apply(this,[].concat(n[o]));this.attrs[o]=n[o];for(var q in p)p[b](q)&&(n[q]=p[q])}n.text&&this.type=="text"&&(this.textpath.string=n.text),B(this,n)}return this},E.toFront=function(){!this.removed&&this.node.parentNode.appendChild(this.node),this.paper&&this.paper.top!=this&&a._tofront(this,this.paper);return this},E.toBack=function(){if(this.removed)return this;this.node.parentNode.firstChild!=this.node&&(this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild),a._toback(this,this.paper));return this},E.insertAfter=function(b){if(this.removed)return this;b.constructor==a.st.constructor&&(b=b[b.length-1]),b.node.nextSibling?b.node.parentNode.insertBefore(this.node,b.node.nextSibling):b.node.parentNode.appendChild(this.node),a._insertafter(this,b,this.paper);return this},E.insertBefore=function(b){if(this.removed)return this;b.constructor==a.st.constructor&&(b=b[0]),b.node.parentNode.insertBefore(this.node,b.node),a._insertbefore(this,b,this.paper);return this},E.blur=function(b){var c=this.node.runtimeStyle,d=c.filter;d=d.replace(r,o),+b!==0?(this.attrs.blur=b,c.filter=d+n+m+".Blur(pixelradius="+(+b||1.5)+")",c.margin=a.format("-{0}px 0 0 -{0}px",f(+b||1.5))):(c.filter=d,c.margin=0,delete this.attrs.blur)},a._engine.path=function(a,b){var c=F("shape");c.style.cssText=t,c.coordsize=u+n+u,c.coordorigin=b.coordorigin;var d=new D(c,b),e={fill:"none",stroke:"#000"};a&&(e.path=a),d.type="path",d.path=[],d.Path=o,B(d,e),b.canvas.appendChild(c);var f=F("skew");f.on=!0,c.appendChild(f),d.skew=f,d.transform(o);return d},a._engine.rect=function(b,c,d,e,f,g){var h=a._rectPath(c,d,e,f,g),i=b.path(h),j=i.attrs;i.X=j.x=c,i.Y=j.y=d,i.W=j.width=e,i.H=j.height=f,j.r=g,j.path=h,i.type="rect";return i},a._engine.ellipse=function(a,b,c,d,e){var f=a.path(),g=f.attrs;f.X=b-d,f.Y=c-e,f.W=d*2,f.H=e*2,f.type="ellipse",B(f,{cx:b,cy:c,rx:d,ry:e});return f},a._engine.circle=function(a,b,c,d){var e=a.path(),f=e.attrs;e.X=b-d,e.Y=c-d,e.W=e.H=d*2,e.type="circle",B(e,{cx:b,cy:c,r:d});return e},a._engine.image=function(b,c,d,e,f,g){var h=a._rectPath(d,e,f,g),i=b.path(h).attr({stroke:"none"}),k=i.attrs,l=i.node,m=l.getElementsByTagName(j)[0];k.src=c,i.X=k.x=d,i.Y=k.y=e,i.W=k.width=f,i.H=k.height=g,k.path=h,i.type="image",m.parentNode==l&&l.removeChild(m),m.rotate=!0,m.src=c,m.type="tile",i._.fillpos=[d,e],i._.fillsize=[f,g],l.appendChild(m),z(i,1,1,0,0,0);return i},a._engine.text=function(b,d,e,g){var h=F("shape"),i=F("path"),j=F("textpath");d=d||0,e=e||0,g=g||"",i.v=a.format("m{0},{1}l{2},{1}",f(d*u),f(e*u),f(d*u)+1),i.textpathok=!0,j.string=c(g),j.on=!0,h.style.cssText=t,h.coordsize=u+n+u,h.coordorigin="0 0";var k=new D(h,b),l={fill:"#000",stroke:"none",font:a._availableAttrs.font,text:g};k.shape=h,k.path=i,k.textpath=j,k.type="text",k.attrs.text=c(g),k.attrs.x=d,k.attrs.y=e,k.attrs.w=1,k.attrs.h=1,B(k,l),h.appendChild(j),h.appendChild(i),b.canvas.appendChild(h);var m=F("skew");m.on=!0,h.appendChild(m),k.skew=m,k.transform(o);return k},a._engine.setSize=function(b,c){var d=this.canvas.style;this.width=b,this.height=c,b==+b&&(b+="px"),c==+c&&(c+="px"),d.width=b,d.height=c,d.clip="rect(0 "+b+" "+c+" 0)",this._viewBox&&a._engine.setViewBox.apply(this,this._viewBox);return this},a._engine.setViewBox=function(b,c,d,e,f){a.eve("raphael.setViewBox",this,this._viewBox,[b,c,d,e,f]);var h=this.width,i=this.height,j=1/g(d/h,e/i),k,l;f&&(k=i/e,l=h/d,d*k<h&&(b-=(h-d*k)/2/k),e*l<i&&(c-=(i-e*l)/2/l)),this._viewBox=[b,c,d,e,!!f],this._viewBoxShift={dx:-b,dy:-c,scale:j},this.forEach(function(a){a.transform("...")});return this};var F;a._engine.initWin=function(a){var b=a.document;b.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!b.namespaces.rvml&&b.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),F=function(a){return b.createElement("<rvml:"+a+' class="rvml">')}}catch(c){F=function(a){return b.createElement("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}},a._engine.initWin(a._g.win),a._engine.create=function(){var b=a._getContainer.apply(0,arguments),c=b.container,d=b.height,e,f=b.width,g=b.x,h=b.y;if(!c)throw new Error("VML container not found.");var i=new a._Paper,j=i.canvas=a._g.doc.createElement("div"),k=j.style;g=g||0,h=h||0,f=f||512,d=d||342,i.width=f,i.height=d,f==+f&&(f+="px"),d==+d&&(d+="px"),i.coordsize=u*1e3+n+u*1e3,i.coordorigin="0 0",i.span=a._g.doc.createElement("span"),i.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;",j.appendChild(i.span),k.cssText=a.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",f,d),c==1?(a._g.doc.body.appendChild(j),k.left=g+"px",k.top=h+"px",k.position="absolute"):c.firstChild?c.insertBefore(j,c.firstChild):c.appendChild(j),i.renderfix=function(){};return i},a.prototype.clear=function(){a.eve("raphael.clear",this),this.canvas.innerHTML=o,this.span=a._g.doc.createElement("span"),this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;",this.canvas.appendChild(this.span),this.bottom=this.top=null},a.prototype.remove=function(){a.eve("raphael.remove",this),this.canvas.parentNode.removeChild(this.canvas);for(var b in this)this[b]=typeof this[b]=="function"?a._removedFactory(b):null;return!0};var G=a.st;for(var H in E)E[b](H)&&!G[b](H)&&(G[H]=function(a){return function(){var b=arguments;return this.forEach(function(c){c[a].apply(c,b)})}}(H))}(window.Raphael)
//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if ( !Array.prototype.forEach ) {

  Array.prototype.forEach = function( callback, thisArg ) {

    var T, k;

    if ( this == null ) {
      throw new TypeError( "this is null or not defined" );
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0; // Hack to convert O.length to a UInt32

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ( {}.toString.call(callback) != "[object Function]" ) {
      throw new TypeError( callback + " is not a function" );
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if ( thisArg ) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while( k < len ) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if ( k in O ) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call( T, kValue, k, O );
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

//https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {  
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {  
        "use strict";  
        if (this == null) {  
            throw new TypeError();  
        }  
        var t = Object(this);  
        var len = t.length >>> 0;  
        if (len === 0) {  
            return -1;  
        }  
        var n = 0;  
        if (arguments.length > 0) {  
            n = Number(arguments[1]);  
            if (n != n) { // shortcut for verifying if it's NaN  
                n = 0;  
            } else if (n != 0 && n != Infinity && n != -Infinity) {  
                n = (n > 0 || -1) * Math.floor(Math.abs(n));  
            }  
        }  
        if (n >= len) {  
            return -1;  
        }  
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);  
        for (; k < len; k++) {  
            if (k in t && t[k] === searchElement) {  
                return k;  
            }  
        }  
        return -1;  
    }  
}

//Object.keys
if (!Object.keys) Object.keys = function(o) {
  if (o !== Object(o))
    throw new TypeError('Object.keys called on a non-object');
  var k=[],p;
  for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
  return k;
}  
this.Venus = {_Venus:this.Venus};
Venus.util={};
Venus.config={

    version:1.0,
    debug:false
};
;(function () {
    var util=Venus.util||{};
    var _hsv2rgb = function (h, s, v) {
        var hi, f, p, q, result = [];
        hi = Math.floor(h / 60) % 6;
        f = hi % 2 ? h / 60 - hi : 1 - (h / 60 - hi);
        p = v * (1 - s);
        q = v * (1 - f * s);

        switch (hi) {
            case 0:
                result = [v, q, p];
                break;
            case 1:
                result = [q, v, p];
                break;
            case 2:
                result = [p, v, q];
                break;
            case 3:
                result = [p, q, v];
                break;
            case 4:
                result = [q, p, v];
                break;
            case 5:
                result = [v, p, q];
                break;
        }

        for (var j = 0, L = result.length; j < L; j++) {result[j] = Math.floor(result[j] * 255);}

        return result;
    };

    /**
     * get a group of chart colors
     * @param {Integer} colorCount How many colors needed.
     * @example DPChart.getColors(6);
     * @return a group of colors in type of rgb().
     * @type {Array}
     */
    util.getColors = function (colorCount) {
        var H=[.6, .2, .05, .1333, .75, 0], S=[0.75,0.75,0.45,1,0.35], V=[0.75,0.45,0.9,0.6,0.9], colors = [], L;

		//if colorCount is not provide, set colorCount default value 20
		colorCount=parseInt(colorCount,10)||10;
		L=Math.min(colorCount,Math.max(colorCount/S.length,12));

		for(var c=0;c<colorCount;c++){
			if (c < H.length&&colorCount<=H.length) {
                colors.push('rgba(' + _hsv2rgb(H[c]*360, S[0], V[0]).join(',') + ', 1)');
            }else{
				colors.push('rgba(' + _hsv2rgb(c%L*360/L, S[Math.floor(c/L)], V[Math.floor(c/L)]).join(',') + ', 1)');
			}
		}

        return colors;
    };


    /*
     * mix
     * */
    util.mix = function (o1, o2) {
        for (var attr in o2) {
            if (typeof  o2[attr] !== "object" || o1[attr] === undefined || typeof o1[attr] !== 'object') {
                o1[attr] = o2[attr];
            } else {
                util.mix(o1[attr], o2[attr]);
            }
        }
        return o1;
    };


    /*
    * isArray
    * */

    util.isArray = function (arr) {
        return __type(arr, "array");
    };

    /*
     * isObject
     */
    util.isObject = function(obj){
        return __type(obj, "object");
    };

    util.isNumber = function(nub){
        return __type(nub, "number");
    };

	util.isFunction=function(func){
		return __type(func,"function");
	};

    /**
    *get variable true type
    *@param {Unknown} target variable to be checked
    *@param {String} type[optional] which variable type to be check.
    *type can be any element of this array [Arguments, Array, Boolean, Date, Error, Function, JSON, Math, Number, Object, RegExp, String]
    *@return the result checked, if parameter type is provide, result will be true or false. else result is variable type.
    *@type {Boolean|String}
    */
    function __type(target, type) {
        var clas = Object.prototype.toString.call(target).slice(8, -1);
        clas = clas.toLowerCase();
        return !type?clas:target !== undefined && target !== null && clas === type;
    }


    /*
    * clone object
    *
    * returns a cloned object
    * */

   util.clone = function(obj){
       if(typeof obj=="string" || typeof obj=="boolean" || typeof obj== "number" || obj==null || util.isFunction(obj)){
           return obj;
       }
       if(util.isArray(obj)){
           return obj.slice(0);
       }
       if(util.isObject(obj)){
           var cloned = {};
           for(var o in obj){
               cloned[o] = util.clone(obj[o]);
           }
           return cloned;
       }

   };

    /*
    * add and multiple function to fix float number bug
    * */


    util.number = {
        add:function () {
            var args = Array.prototype.slice.call(arguments,0),
                mul = 1,
                sum = 0;
            args.forEach(function (number) {
                if (number.toString().indexOf('.') != -1) {
                    mul = Math.pow(10, number.toString().split('.')[1].length);
                }
            });
            args.forEach(function (num) {
                sum += num * mul;
            });
            return sum / mul;
        },
        multiple:function () {
            var args = Array.prototype.slice.call(arguments,0),
                mul = 1,
                divider = 1,
                sum = 1;
            args.forEach(function (number) {
                if (number.toString().indexOf('.') != -1) {
                    mul = Math.pow(10, number.toString().split('.')[1].length);
                    sum *= (number * mul);
                    divider *= mul;
                } else {
                    sum *= number;
                }
            });
            return sum / divider;
        }
    };

    util.date = {
        parse:function (d) {
            try{
                if(typeof d ==="string"){
                    var arr = d.split(/\s|-|\/|\:/);
                    if(arr[1]){
                        arr[1]--;
                    }
                    return eval("(new Date("+arr.join(',')+"))");
                }
                    return new Date(d);

            }catch(e){
                throw "can't convert date :" + d;
            }
//                try{
//                    if(typeof d==="string" && d.indexOf(' ')!==-1 && d.indexOf(':')==-1 && d.indexOf(' ')!== d.length-1){
//                        //yyyy-MM-dd hh, this cant't be parsed
//                        d+= ":00";
//                    }else if(util.isNumber(d)){
//                        return new Date(d)
//                    }
//                    if(typeof d==="string" && navigator.userAgent.indexOf('MSIE')!==-1){
//                        //is ie , can't use Date.parse to pase 'yyyy-MM-dd'
//                        // use new Date
//
//                        var arr = d.split(/\s|-|\/|\:/);
//                        if(arr[1]){
//                            arr[1]--;
//                        }
//                        return eval("(new Date("+arr.join(',')+"))");
//                    }
//                    var date = Date.parse(d);
//                    if (!date && date !== 0) {
//                        throw "can't convert date " + d;
//                    } else {
//                        return new Date(date);
//                    }
//                }catch(e){
//                    throw "can't convert date " + d;
//                }

        },
        format:function (date, formatString) {
            /*
            * convert Date instance to string
            * */
            date = this.parse(date);
            var formatStr = formatString || "yyyy-MM-dd hh:mm::ss",
                year = date.getFullYear().toString(),
                month = "0" + (date.getMonth() + 1),
                day = "0" + date.getDate(),
                hour = "0" + date.getHours(),
                minute = "0" + date.getMinutes(),
                second = "0" + date.getSeconds();

             var s =formatStr.replace('yyyy', year).replace('yy', year.substr(year.length - 2)).replace('MM', month.substr(month.length - 2))
                .replace('dd', day.substr(day.length - 2)).replace('hh', hour.substr(hour.length - 2)).replace('mm', minute.substr(minute.length - 2))
                .replace('ss', second.substr(second.length - 2));

            return s;

        }
    }
})();

/**
 * Created with JetBrains WebStorm.
 * User: allanma
 * Date: 12-5-18
 * Time: 下午6:38
 * customevent.js
 * Pack after common.js
 */
;(function () {
    var namespace = Venus.util||{};


    var slice = Array.prototype.slice

    var CustomEvent = function () {
        /*
         * events format like
         * {
         *   event1:{
         *      callbacks:[fn1,fn2...]
         *   },
         *   event2:{}..
         * }
         */
        this.events = {};
    };

    var createWhenNone = function (obj, eventName) {
            return (obj.events[eventName]) || (obj.events[eventName] = {callbacks:[]});
        },
        bind = function (obj, eventName, fn) {
            createWhenNone(obj, eventName).callbacks.push(fn);
        };

    CustomEvent.prototype.on = function (eventName, callback) {
        //@param eventName:String name of event
        //@param callback:Function the callback function
        //call callback when eventName fired
        if (typeof callback !== "function") {
            return;
        }
        bind(this, eventName, callback);
    };

    CustomEvent.prototype.off = function (eventName, fn) {
        if (!fn) {
            //remove all eventName callbacks
            this.events[eventName] = {callbacks:[]};
        } else {
            var cb, i = 0, cbs = createWhenNone(this, eventName).callbacks;
            while (cb = cbs[i++]) {
                if (cb === fn) {
                    cbs.splice(--i, 1);
                }
            }
        }
    };

    CustomEvent.prototype.one = function (eventName, callback) {
        //@param eventName:String name of event
        //@param callback:Function the callback function
        //当event fire之后触发callback，只触发一次，触发完之后remove
        if (typeof callback !== "function") {
            return;
        }
        var self = this;
        bind(this, eventName, function () {
            callback.apply(eventName, slice.call(arguments, 0));
            self.off(eventName, arguments.callee);
        });
    };

    CustomEvent.prototype.fire = function () {
        var event = arguments[0],
            data = slice.call(arguments, 1),
            callback,
            i = 0;
        if (this.events[event] && this.events[event].callbacks) {
            while (callback = this.events[event].callbacks[i++]) {
                callback.apply(event, data);
            }
        }
        return this;
    };

    CustomEvent.prototype.clear = function () {
        this.events = {};
    };

    namespace.CustomEvent = CustomEvent;
})();
/*
 * SVG Chart Lib of Venus
 * */

;
(function (global, undefined) {
    /*
     * cache global.Venus to Venus
     * */
    var Venus = global.Venus;

    /* make some global variables local */
    var util = Venus.util
        , mix = util.mix
        , PI = Math.PI
        , isArray = util.isArray
        , isObject = util.isObject
        , getColor = util.getColors

    // charts added  using Venus.SvgChart.addChart
        , charts = {}

        , DEFAULT_Y_AXIS = "y"
        , DEFAULT_X_AXIS = "x"
        , UNDER_TICK = 'under-tick'
        , CONTINUOUS  = "continuous"
        , DISCRETE =  'discrete'
        , DATETIME = "datetime";

    /*Chart Begin*/
    /*
     * Class Chart
     * @param container{HTMLElement} container of the svg element to draw the chart
     * @param data{Array,Object} data can be array or object
     * @param options{object}
     *
     *  will bind to Venus.SvgChart later
     */
    function Chart(container, data, options) {
        container = typeof container === "string" ? document.getElementById(container) : container;
        if (!container || !container.nodeType) {
            //not dom
            return;
        }
        this.container = container;
        this.data = data || [];
        this.events = new Venus.util.CustomEvent();

        //default options
        var defaultOptions = {
            /*
             * width and height  equals the containers width and height by default
             * but when the container is invisible ,please parse the width and height manually
             * */
            width:container.clientWidth,
            height:container.clientHeight,

            /*
             * colors will be auto generated by calling Venus.util.getColors if you don't parse an array
             * */
            colors:[],

            /*
             * axises usually are x and y .
             * actually you can create any numbers of axises
             * For detail see Class Axis
             * */
            axis:{
            },

            /*
            * config each series  which two axises are used as the x and y axis
            *  for example :
            *  axisUsage:{
            *      0:['x','y']
            *      1:['x','y1']
            *  }
            *  x and y axis are used by default
            *
            * */
            axisUsage:{},

            /*
             * grid under the chart has the follow config options:
             * enableRow
             * enableColumn
             * opacity
             *
             * no grid by default
             *
             * for detail , see Class Grid
             * */
            grid:{
                opacity:0.4
            },

            /*
            * config tooltip text
            * tooltip will call this function to get the tooltip text and will parsed in an object
            * obj contains
            * {
            *     x: x axis value
            *     y: y axis value
            *     label: name of this series
            * }
            * */
            tooltip:function (obj) {
               // return obj.label + " " + obj.x + " " + obj.y;
                return obj.y;
            },

            /*
            * config series icons
            * {
            *     0:"rect",
            *     1:"circle",
            *     2:"triangle",
            *     3:"lozenge"
            * }
            *
            * */
            icons:{
            },

            /*
            * threshold lines
            * {
            *     y:{
            *         value:10
            *     }
            * }
            * */
            threshold:{

            }
        }, self = this;

        //clone and mix options
        this.options = mix(defaultOptions,util.clone(options)|| {});

        //init raphael
        this.stage = new Raphael(container, this.options.width, this.options.height);

        //to fix FireFox bound box bug
        this.stardBox = this.stage.rect(0,0,this.options.width,this.options.height).attr('stroke-width',0)

        //new! coordinate object
        this.coordinate = this._initCoordinate();

        //new! icon factory
        this.iconFactory = this._initIconFactory();

        //init events
        this._initEvents();

        //init data
        this._initData();
        this.events.fire('onDataInit', this.series);

        this.colors = this.options.colors && this.options.colors.length ? this.options.colors : getColor(this.series.getSeries().length);

        // init axis
        this._initAxis();
        this.events.fire('onAxisInit', {});

        //init labels
        this._initLabels();

        //init legend
        this._initLegend();
        this.events.fire('onLegendInit', this.legend);

        // draw
        this._draw();

        //init grid
        this._initGrid();
        this.events.fire('onGridInit', this.grid);

        // init threshold line
        this._initThreshold();

        // render axis ui
        this._renderAxis();

        this.events.fire('onFinish');

    }
    Chart.prototype = {
        constructor:Chart,
        _initData:function () {
            this.series = new Series(this.data);
        },
        _initLabels:function(){
            var data = this.series.getSeries(),
                labels = this.series.getLabels(),
                _labels = [],
                self = this,
                coordinate = self.coordinate;

            data.forEach(function (d, j) {
                if (d.name !== undefined) {
                    //if got name , use name
                    _labels.push(d.name);
                } else if (Venus.util.isNumber(d.data)) {
                    //if data is number , use label or x ticks because labels may be empty
                    _labels.push(labels[j] || (coordinate.x && coordinate.x.options.ticks ? coordinate.x.options.ticks[j] || '' : ""));
                } else {
                    //otherwise there's no way to get the names , let it be empty
                    _labels.push('');
                }
            });
            this.labels = _labels;
        },
        _initCoordinate:function () {
            var self = this,
                options = self.options;
            return {

                /*
                 * axises are stored in this object
                 * axises:{
                 *     x:,
                 *     y:,
                 *     x1:,
                 *     y1:,...
                 * }
                 * */
                axises:{},

                /*
                 * add axis
                 * */
                push:function (name, axis) {
                    this.axises[name] = axis
                },

                /*
                 * use two axis to generate the coordinate
                 * */
                use:function (x, y) {
                    if(isObject(x)){
                        this.x = this.axises[x.x];
                        this.y = this.axises[x.y];
                        this.xName = x.x;
                        this.yName = x.y;
                        return;
                    }
                    this.x = this.axises[x];
                    this.y = this.axises[y];
                    this.xName = x;
                    this.yName = y;
                },

                /*
                 * use the coordinate generated by 'use' function
                 * returns x and y position in svg
                 * */
                get:function (key, value) {
                    var xOpt = this.x.options,
                        yOpt = this.y.options,
                        xModel = this.x.model,
                        yModel = this.y.model,
                        xObj , yObj,
                        x, y, xTick, yTick;

                    xObj = this.x.getPoint(key);
                    x = xObj.length;
                    xTick = xObj.tick;

                    yObj = this.y.getPoint(value);
                    y = yObj.length;
                    yTick = yObj.tick;

                    if(yModel.reverse){
                        y = yModel.totalWidth - y;
                    }
                    if(xModel.reverse){
                        x = xModel.totalWidth - x;
                    }
                    if (xModel.rotate == 90 && yModel.rotate == 0) {
                        //x axis is vertical and y axis is horizontal
                        return {
                            y:xModel.beginY - x,
                            x:yModel.beginX + y,
                            xTick:xTick,
                            yTick:yTick
                        }
                    } else {
                        return {
                            x:xModel.beginX + x,
                            y:yModel.beginY - y,
                            xTick:xTick,
                            yTick:yTick
                        }
                    }
                },

                /*
                * get the size of the coordinate
                * */

                size:function () {
                    var width, height;
                    if (this.x.model.rotate == 90) {
                        height = this.x.model.totalWidth;
                    } else {
                        width = this.x.model.totalWidth;
                    }
                    if (this.y.model.rotate == 90) {
                        height = this.y.model.totalWidth;
                    } else {
                        width = this.y.model.totalWidth;
                    }
                    return {
                        width:width,
                        height:height
                    }
                },

                /*
                * get the distance from an point to an axis
                * point - axis
                * it could be negative
                * */

                distance:function (axis, point) {
                    if (axis.model.rotate == 0) {
                        return point.y - axis.model.beginY;
                    } else {
                        return point.x - axis.model.beginX;
                    }
                },


                /*
                 * get which two axises to use
                 *
                 * */
                getAxisUse:function (i) {
                    if (!this.axisUsageArray) {
                        var arr = this.axisUsageArray = [];
                        self.series.getSeries().forEach(function (s, _index) {
                            if (!options.axisUsage || !options.axisUsage[_index]) {
                                arr.push({
                                    x:DEFAULT_X_AXIS,
                                    y:DEFAULT_Y_AXIS
                                });
                            }else{
                                arr.push({
                                    x: options.axisUsage[_index][0] || DEFAULT_X_AXIS,
                                    y:options.axisUsage[_index][1] || DEFAULT_Y_AXIS
                                });
                            }
                        });
                    }
                    return this.axisUsageArray[i];
                },
                /*
                * get related series array
                *
                * */
                getRelatedSeries:function(axisName){
                    var result = [],
                        axisUsage = self.options.axisUsage;
                    if (axisName == DEFAULT_X_AXIS) {
                        self.series.getSeries().forEach(function (s, i) {
                            if (!axisUsage || !axisUsage[i] || !axisUsage[i][0]) {
                                result.push(i);
                            }
                        });
                    } else if (axisName == DEFAULT_Y_AXIS) {
                        self.series.getSeries().forEach(function (s, i) {
                            if (!axisUsage || !axisUsage[i] || !axisUsage[i][1]) {
                                result.push(i);
                            }
                        });
                    }else {
                        self.series.getSeries().forEach(function (s, i) {
                            if (axisUsage && axisUsage[i] && (axisUsage[i][0] === axisName || axisUsage[i][1]===axisName)) {
                                result.push(i);
                            }
                        });
                    }
                    return result;
                },
                useDefault:function(){
                    this.use(DEFAULT_X_AXIS,DEFAULT_Y_AXIS);
                },
                type:function(axis){
                    typeof axis==="string" || (axis = axis.axisName);
                    return axis.indexOf('x') == 0 ? 'x' : 'y';
                },
                isX:function(axis){
                    return this.type(axis)=='x';
                },
                isY:function(axis){
                    return this.type(axis)=='y';
                }
            };
        },
        _initIconFactory:function () {
            var self = this,
            /*
                * build-in icons for legend , line and others
                * currently contains 'rect','circle','triangle'
                * each icon must extends interfaces below:
                * create{Function} ,receives stage, x, y , width and returns an object contains raphael element, size ,position,animate function
                *          stage is the raphael instance;
                *          x,y is the center of the element;
                *          width is the width of the element;
                * size{Function} , receives the 'width' param and set the width of the element
                * position{Function}, set or get the position of the element, that is the coordinate of the center of the element
                * animate{Function}, delegate raphael element and custom the x,y,width animation
                *
                * */
                nativeIcons = {
                    'rect':{
                        create:function (stage, x, y, width) {
                            return {
                                icon:stage.rect(x - width / 2, y - width / 2, width, width),
                                position:this.position,
                                animate:this.animate,
                                size:this.size
                            }
                        },
                        size:function (w) {
                            this.icon.attr('width', w);
                        },
                        position:function (x, y) {
                            if (arguments.length == 0) {
                                return{
                                    x:this.icon.attr('x') + this.icon.attr('width') / 2,
                                    y:this.icon.attr('y') + this.icon.attr('width') / 2
                                }
                            }
                            this.icon.attr({
                                'x':x,
                                'y':y
                            });
                        },
                        animate:function (obj, duration) {
                            if (obj.x) {
                                obj.x = obj.x - this.icon.attr('width') / 2;
                            }
                            if (obj.y) {
                                obj.y = obj.y - this.icon.attr('width') / 2;
                            }
                            if (obj.width) {
                                obj.height = obj.width;
                                if (!obj.x && !obj.y) {
                                    var icon = this.icon,
                                        delta = obj.width - icon.attr('width');
                                    obj.x = icon.attr('x') - delta / 2;
                                    obj.y = icon.attr('y') - delta / 2;
                                }
                            }
                            this.icon.animate(obj, duration);
                        }
                    },
                    'circle':{
                        create:function (stage, x, y, width) {
                            return {
                                icon:stage.circle(x, y, width / 2),
                                position:this.position,
                                animate:this.animate,
                                size:this.size
                            }
                        },
                        size:function (w) {
                            this.icon.attr('r', w / 2);
                        },
                        position:function (x, y) {
                            if (arguments.length == 0) {
                                return{
                                    x:this.icon.attr('cx'),
                                    y:this.icon.attr('cy')
                                }
                            }
                            this.icon.attr({
                                'cx':x,
                                'cy':y
                            });
                        },
                        animate:function (obj, duration) {
                            for (var o in obj) {
                                if (o == 'x') {
                                    obj.cx = obj[o];
                                } else if (o == 'y') {
                                    obj.cy = obj[o];
                                } else if (o == 'width') {
                                    obj.r = obj[o] / 2;
                                }
                            }
                            delete obj.x;
                            delete obj.y;
                            delete obj.width;
                            this.icon.animate(obj, duration);
                        }
                    },
                    'triangle':{
                        create:function (stage, x, y, width) {
                            return {
                                icon:stage.path().attr({
                                    path:['M', x - width / 2, y + width / 2 * Math.tan(PI / 6), 'l', width / 2, -width / 2 * Math.tan(PI / 3), 'l', width / 2, width / 2 * Math.tan(PI / 3)],
                                    'stroke-width':0
                                }),
                                position:this.position,
                                animate:this.animate,
                                size:this.size,
                                x:x,
                                y:y,
                                width:width
                            }
                        },
                        size:function(width){
                            var icon = this.icon,
                                x = this.x,
                                y = this.y;

                            icon.attr('path',['M', x - width / 2, y + width / 2 * Math.tan(PI / 6), 'l', width / 2, -width / 2 * Math.tan(PI / 3), 'l', width / 2, width / 2 * Math.tan(PI / 3)]);
                            this.width = width;
                        },
                        position:function(x,y){
                            var icon = this.icon,
                                width = this.width;

                            if (arguments.length == 0) {
                                return{
                                    x:this.x,
                                    y:this.y
                                }
                            }
                            icon.attr('path',['M', x - width / 2, y + width / 2 * Math.tan(PI / 6), 'l', width / 2, -width / 2 * Math.tan(PI / 3), 'l', width / 2, width / 2 * Math.tan(PI / 3)]);
                        },
                        animate:function(obj, duration){
                            var icon = this.icon,
                                width = this.width,
                                x = this.x,
                                y = this.y

                            if ('x' in obj || 'y' in obj || 'width' in obj) {
                                width = (obj.width || width);
                                var path = ['M',(obj.x || x) - width / 2, (obj.y || y) + width / 2 * Math.tan(PI / 6), 'l', width / 2, -width / 2 * Math.tan(PI / 3), 'l', width / 2, width / 2 * Math.tan(PI / 3)]
                                this.x = (obj.x || x);
                                this.y = (obj.y || y);
                                this.width = width;
                                obj.path = path;
                            }

                            delete obj.x;
                            delete obj.y;
                            delete obj.width;
                            icon.animate(obj, duration);
                        }
                    },
                    'lozenge':{
                        create:function (stage, x, y, width) {
                            return {
                                icon:stage.path().attr({
                                    path:['M', x - width / 2, y , 'l', width / 2, -width / 2 , 'l', width / 2, width / 2 ,'l',-width/2,width/2,'l',-width/2,-width/2],
                                    'stroke-width':0
                                }),
                                position:this.position,
                                animate:this.animate,
                                size:this.size,
                                x:x,
                                y:y,
                                width:width
                            }
                        },
                        size:function(width){
                            var icon = this.icon,
                                x = this.x,
                                y = this.y;

                            icon.attr('path',['M', x - width / 2, y , 'l', width / 2, -width / 2 , 'l', width / 2, width / 2 ,'l',-width/2,width/2,'l',-width/2,-width/2]);
                            this.width = width;
                        },
                        position:function(x,y){
                            var icon = this.icon,
                                width = this.width;

                            if (arguments.length == 0) {
                                return{
                                    x:this.x,
                                    y:this.y
                                }
                            }
                            icon.attr('path',['M', x - width / 2, y , 'l', width / 2, -width / 2 , 'l', width / 2, width / 2 ,'l',-width/2,width/2,'l',-width/2,-width/2]);
                        },
                        animate:function(obj, duration){
                            var icon = this.icon,
                                width = this.width,
                                x = this.x,
                                y = this.y

                            if ('x' in obj || 'y' in obj || 'width' in obj) {
                                width = (obj.width || width);
                                var path = ['M', (obj.x||x) - width / 2, (obj.y || y) , 'l', width / 2, -width / 2 , 'l', width / 2, width / 2 ,'l',-width/2,width/2,'l',-width/2,-width/2]
                                this.x = (obj.x || x);
                                this.y = (obj.y || y);
                                this.width = width;
                                obj.path = path;
                            }

                            delete obj.x;
                            delete obj.y;
                            delete obj.width;
                            icon.animate(obj, duration);
                        }
                    }
                },

                /*
                * default icon is rect
                * */
                defaultIcon = 'rect';
            return {
                defaultIcon:defaultIcon,
                icons:self.options.icons,
                create:function (i, x, y, width) {
                    /*
                    * factory function to create an icon element
                    * i{Number}:index
                    * x,y {Number}:position of the center of the element
                    * width{Number}:width of the element
                     * this function will call the build-in icon create function or function parsed in the icons options
                    *
                    * */
                    var iconType = this.icons[i] || defaultIcon;
                    if (typeof iconType === "string") {
                        //if string , call the build-in icons
                        return nativeIcons[iconType].create(self.stage, x, y, width);
                    } else if (util.isObject(iconType)) {
                        //call the icons parsed in the icons options
                        //it must implement the icon interface as build-in icons
                        return  iconType.create(self.stage, x, y, width);
                    }
                },
                nativeIcons:nativeIcons
            }

        },
        _initAxis:function () {
            var opt = this.options,
                axisOption = opt.axis,
                axis,
                thisAxisOption,
                range,
                beginX,
                beginY,
                seriesArray = [],
                thisAxis,
                coordinate = this.coordinate;

            for (axis in axisOption) {
                if (!axisOption.hasOwnProperty(axis)) {
                    continue;
                }
                //init each axis in options.axis
                if ((thisAxisOption = axisOption[axis])) {
                    //set rotate 90 for y axis by default
                    (coordinate.isY(axis) && !('rotate' in thisAxisOption)) && (thisAxisOption.rotate = 90);

                    if (coordinate.isY(axis) && !axisOption.ticks) {
                        //if y axis has no ticks , then auto generate ticks use series.getRange()
                        seriesArray = coordinate.getRelatedSeries(axis);
                        //get range
                        range = this.series.getRange(seriesArray);

                        //set max and min
                        thisAxisOption.max === undefined && (thisAxisOption.max = range.max);
                        thisAxisOption.min === undefined && (thisAxisOption.min = range.min);
                    }
                    if (coordinate.isX(axis)) {
                        //set pop=1 for x Axis by default
                     //   (thisAxisOption.pop === undefined) && (thisAxisOption.pop = 1);

                        (thisAxisOption.percent === undefined) && (thisAxisOption.percent =.9);

                        //if x axis has no ticks , then auto generate ticks use series.getLabels()
                        //but getLabels() sometimes returns array of empty string depends on the data
                        if (!thisAxisOption.ticks) {
                            thisAxisOption.ticks = this.series.getLabels();
                        }
                        if (thisAxisOption.type == DATETIME && this.series.getLength()>1) {
                            //datetime axis , get min and max
                            var ticks = [];
                            thisAxisOption.ticks.forEach(function (t) {
                                ticks.push(util.date.parse(t, thisAxisOption.fromFormat));
                            });
                            ticks.sort(function (a, b) {
                                return +a - +b;
                            });
                            thisAxisOption.min = ticks[0];
                            thisAxisOption.max = ticks[ticks.length - 1];
                        } else {
                            thisAxisOption.type = DISCRETE;
                        }
                    }

                    if (coordinate.isY(axis) && axis !== DEFAULT_Y_AXIS) {
                        thisAxisOption.opposite = true;
                    }

                    thisAxisOption._svgWidth = this.options.width;
                    thisAxisOption._svgHeight = this.options.height;
                    thisAxisOption._name = axis;

                    thisAxis = new Axis(thisAxisOption, this.series, this.stage);
                    coordinate.push(axis, thisAxis);

                    if (thisAxis.model.rotate == 0) {
                        beginX = Math.min(beginX || opt.width, (opt.width - thisAxis.model.totalWidth) / 2);
                    } else if (thisAxis.model.rotate == 90) {
                        beginY = Math.min(beginY || opt.width, (opt.height - thisAxis.model.totalWidth) / 2);
                    }
                }
            }

            this.coordinate.use(DEFAULT_X_AXIS, DEFAULT_Y_AXIS);


            for (axis in coordinate.axises) {
                if (!coordinate.axises.hasOwnProperty(axis)) {
                    continue;
                }
                //thisAxis is the Axis instance
                thisAxis = coordinate.axises[axis];

                if (thisAxis.options.opposite) {
                    //if it is opposite, reset it's beginX ,beginY
                    if (thisAxis.model.rotate == 90) {
                        thisAxis.model.beginX = beginX + coordinate.size().width;
                        thisAxis.model.beginY = opt.height - beginY;
                    } else {
                        thisAxis.model.beginX = beginX;
                        thisAxis.model.beginY = opt.height - beginY - coordinate.size().height;
                    }
                    if (coordinate.isX(axis)) {
                        //if x axis is opposite , reverse all the y axises
                        for (var o in coordinate.axises) {
                            if (coordinate.isY(o)) {
                                coordinate.axises[o].model.reverse = true;
                            }
                        }
                    }
                } else {
                    thisAxis.model.beginX = beginX;
                    thisAxis.model.beginY = opt.height - beginY;
                }
            }


            //set this property false
            //and before it is true , set model will not immediately rerender the ui
            //it will be changed to true in _renderAxis method
            this.axisRendered = false;
        },
        _renderAxis:function () {
            var o , axises = this.coordinate.axises;
            for (o in axises) {
                if (axises.hasOwnProperty(o)) {
                    axises[o].axisRendered = true;
                    axises[o].autoModel();
                    axises[o].render();
                }
            }
            this.axisRendered = true;
        },
        _initLegend:function () {
            /*
             * init legend
             * */

            var opt = this.options,
                legendOption = opt.legend,
                coordinate = this.coordinate,
                series = this.series,
                legend,
                axisName,
                axis,
                relatedSeries,
                activeRelatedSeries,
                range;

            if (legendOption && this.series.getSeries().length) {
                //set options for legend
                legendOption._svgWidth = opt.width;
                legendOption._svgHeight = opt.height;
                legendOption.colors = this.colors;
                legendOption.names = this.labels;

                //if there are ticks of x axis , parse to legend for some use
               // this.coordinate.axises.x && this.coordinate.axises.x.options.ticks && ( legendOption._ticks = this.coordinate.axises.x.options.ticks);

                legend = this.legend = new Legend(this, legendOption, this.stage);
                legend.onActiveChange(function (active,activeArray) {
                    for (axisName in coordinate.axises) {
                        axis = coordinate.axises[axisName];
                        relatedSeries = coordinate.getRelatedSeries(axisName);
                        activeRelatedSeries = [];
                        relatedSeries.forEach(function (i) {
                            if (active[i]) {
                                activeRelatedSeries.push(i);
                            }
                        });
                        if ((!axis.options.ticks || !axis.options.ticks.length ) && activeRelatedSeries.length) {
                            range = series.getRange(activeRelatedSeries);
                            axis.set({
                                min:range.min,
                                max:range.max
                            });
                        }
                    }
                });

            }
        },
        _initGrid:function () {
            var gridOption = this.options.grid,
                coordinate = this.coordinate,
                rows = [],columns = [];
            //generate positions of  rows and columns
            function generatePositions() {
                rows = [];
                columns = [];
                if (gridOption.enableRow) {
                    //use coordinate.y to generate rows
                    if (coordinate.y && coordinate.y.model.rotate == 90) {
                        coordinate.y.forEach(function(i,length){
                            rows.push(coordinate.y.model.beginY-length)
                        });
                        gridOption._x = coordinate.x.model.beginX;
                    } else if (coordinate.x && coordinate.x.model.rotate == 90) {
                        coordinate.x.forEach(function (i, length) {
                            rows.push(coordinate.x.model.beginY - length)
                        });

                        gridOption._x = coordinate.y.model.beginX;
                    }
                    gridOption.width = coordinate.size().width || 0;
                    gridOption.rows = rows;
                }
                if (gridOption.enableColumn) {
                    if (coordinate.y && coordinate.y.model.rotate == 0) {
                        coordinate.y.forEach(function(i,length){
                            columns.push(coordinate.y.model.beginX+length)
                        });
                        gridOption._y = coordinate.x.model.beginY;
                    } else if (coordinate.x && coordinate.x.model.rotate == 0) {
                        coordinate.x.forEach(function (i, length) {
                            columns.push(coordinate.x.model.beginX + length)
                        });
                        gridOption._y = coordinate.y.model.beginY;
                    }
                    gridOption.height = coordinate.size().height || 0;
                    gridOption.columns = columns;
                }

            }
            generatePositions();

            var grid = this.grid = new Grid(gridOption, this.stage);
            coordinate.y && coordinate.y.on(function () {
                generatePositions();
                util.mix(grid.options, gridOption);
                grid.options.rows = gridOption.rows;
                grid.options.columns = gridOption.columns;
                grid.render();
            });

        },
        _initThreshold:function(){
            var options = this.options,
                coordinate = this.coordinate,
                threshold = options.threshold,
                axisName,
                axis,value;

            if (threshold && util.isObject(threshold)) {
                for (var axisName in threshold) {
                    if ((axis = coordinate.axises[axisName]) && util.isObject(threshold[axisName]) && (value = threshold[axisName].value)){
                        new Threshold(axisName,value,coordinate,this.stage);
                    }
                }
            }
        },
        _initEvents:function () {
            var opt = this.options,self = this;
            if(opt.events){
                for(var event in opt.events){
                    this.events.on(event, function(){
                        opt.events[event].apply(self,arguments)
                    });
                }
            }
        },
        _draw:function () {
            var chart ,chartOption;
            for (chart in charts) {
                if (chartOption =  this.options[chart]) {
                    //draw each chart in options , so you can put several type of charts in one svg
                    charts[chart].draw && charts[chart].draw.call(this, chartOption);
                }
            }
        },
        destroy:function(){
            this.stage && this.stage.clear();
            this.stage = null;
            this.container.innerHTML = "";
        }
    };


    /*
    * add line,bar,dot and any other custom charts using this function
    * in methods object , you must provide the draw function
    *
    * bind Method addChart to Class Chart as a static function
    * */
    Chart.addChart = function (name, methods) {
        /*
        * @param name{String} chart name , identity
        * @param methods{Object} chart methods and at least contains draw function
        *
        * the charts config options will be parsed in the Chart options using key name that matches the param name
        * for example :
        *   the line chart is added using Chart.addChart("line",{})
        *   and the line config options is in the Chart options {line:{..}}
        *
        * */

         //cache the methods in the local charts object and will be called when drawing charts
         charts[name] = methods;
    };
    Chart.charts = charts;

    /*Chart End*/

    /*Class Series Begin*/

    var Series = function (data) {
        /*
         * init the series object which deal with the data
         * data can be Array or Object and format like :
         * [number,number,....] or [{},...] or [[number,..],..]
         * or {name:data,name:data,.....}
         *
         * all the above will be convert to
         * [{data:(number or array or object),name:(if has)},....]
         * and save as series property
         *
         * 2013-04-01 add 'type' property
         * if has type , use this type ,otherwise use global type
         *
         * */
        var series = []
        if (isArray(data)) {
            data.forEach(function (d, i) {
                if (isArray(d)) {
                    series.push({data:d});
                }
                else if (isObject(d)) {
                    //item is {}
                    if (d.data !== undefined) {
                        // item in format {data:something,otherThings...}
                        series.push(d);
                    } else {
                        //item is data
                        series.push({data:d});
                    }
                } else {
                    series.push({data:d});
                }
            })
        } else if (isObject(data)) {
            for (var o in data) {
                series.push({
                    name:o,
                    data:data[o]
                });
            }
        } else {
            series.push({data:data});
        }
        this.series = series;

        //whether accumulate when range calculation
        this.accumulation = false;

    };
    Series.prototype = {
        constructor:Series,
        getRange:function (arr) {
            /*
             * get the max and min value of data
             * return Object
             * {
             *     max:
             *     min:
             * }
             * */
            var series = this.series,
                accumulation = this.accumulation,
                max , min;

             if(!arr){
                //it means all data
                arr = [];
                this.series.forEach(function(s,i){
                    arr.push(i);
                });
            }
            arr.forEach(function (index) {
                //get the max and min value depends on the data format
                var d = series[index].data
                if (isArray(d)) {
                    if(isObject(d[0]) && d[0].data){
                        var filterData = d.map(function(_d){
                            return _d.data;
                        });
                        var iMax = Math.max.apply(Math,filterData);
                        var iMin = Math.min.apply(Math,filterData);

                    }else {
                        var iMax = Math.max.apply(Math, d),
                            iMin = Math.min.apply(Math, d);
                    }
                    (max === undefined || iMax > max) && (max = iMax);
                    (min === undefined || iMin < min) && (min = iMin);
                } else if (isObject(d)) {
                    for (var o in d) {
                        (max === undefined || d[o] > max) && (max = d[o]);
                        (min === undefined || d[o] < min) && (min = d[o]);
                    }
                } else {
                    (max === undefined || d > max) && (max = d);
                    (min === undefined || d < min) && (min = d);
                }
            });
            if (accumulation) {
                //accumulate max
                var ac
                arr.forEach(function (index, j) {
                    var d = series[index].data;
                    if (isArray(d)) {
                        ac = ac || [];
                        d.forEach(function (value, i) {
                            ac[i] === undefined ? ac[i] = value : ac[i] += value;
                        });
                    } else if (isObject(d)) {
                        ac = ac || {};
                        for (var o in d) {
                            ac[o] === undefined ? ac[o] = d[o] : ac[o] += d[o];
                        }
                    } else {
                        ac = ac || [];
                        ac[j] = d;
                    }
                });
                if (isArray(ac)) {
                    max = Math.max.apply(Math, ac);
                } else if (isObject(ac)) {
                    max = undefined;
                    for (var o in ac) {
                        (max === undefined || ac[o] > max) && (max = ac[o]);
                    }
                }
            }

            return {
                max:max,
                min:min
            }
        },
        getSeries:function () {
            return this.series;
        },
        getLabels:function () {
            /*
             * return labels for auto generated x Axis
             * labels depends on the data
             * so sometimes labels will be array of empty string
             * */

            var labels = [],
                _labels = {},
                isObj = false,
                isArr = false,
                len = 0
            this.series.forEach(function (item) {
                if (item.name && Venus.util.isNumber(item.data)) {
                    //if there is 'name',then use the name
                    labels.push(item.name)
                }
                else {
                    var data = item.data;
                    if (isArray(data)) {
                        if(isObject(data[0]) && data[0].name){
                            isObj = true;
                            data.forEach(function(d){
                                _labels[d.name] = true;

                            });
                        }else {
                            //got no labels
                            isArr = true;
                            len = Math.max(data.length, len)
                        }
                    }else if (isObject(data)) {
                        for (var o in data) {
                            //cache the labels in the object _labels first , this will avoid duplicated labels
                            //and later will convert it to array
                            isObj = true;
                            _labels[o] = true;
                        }
                    } else {
                        labels.push('');
                    }
                }
            });
            if (isObj) {
                //convert _labels to array
                labels = [];
                for (var o in _labels) {
                    labels.push(o);
                }
            }
            if (isArr) {
                // data is Array ,create an array of empty string,length = len
                labels = new Array(len);
                // DON'T USE forEach , it won't work here
                for (var i = 0; i < len; i++) {
                    labels[i] = ''
                }
            }
            return labels;
        },
        getLength:function(){
            /*
            * get data length
            * */
debugger;
             var length = 0,
                series = this.series;
            if (series.length) {
                if (util.isNumber(series[0].data)) {
                    length = series.length;
                } else if (util.isArray(series[0].data)) {
                    var l = [];
                    series.forEach(function (i) {
                        l.push(i.data.length);
                    });
                    length = Math.max.apply(Math, l);
                } else if (util.isObject(series[0].data)) {
                    var l = [], o;
                    series.forEach(function (s, i) {
                        l[i] = 0;
                        for (o in s.data) {
                            l[i]++;
                        }
                    });
                    length = Math.max.apply(Math, l);
                }
            }
            return length;
         }
    }

    /*Class Series End */


    /*Class Axis Begin*/

    var Axis = function (options, series, paper) {
        var defaultOptions = {
            title:"",               //title
            percent:0.8,            //length of the axis , percent of svg
            total:0,                //how many ticks to be shown
            max:0,
            min:0,
            tickSize:0,             //tick size in value , optional
            tickWidth:0,            //tick size in pixel , optional
            ticks:[],               //ticks
            rotate:0,               //rotate 0-360 in counter-clockwise
            pop:0,                  // empty ticks before
            opposite:false,
            _svgWidth:0,
            _svgHeight:0,
            _name:'',
            type:CONTINUOUS,      //default type is continuous (discrete,datetime)
            toFormat:"",
            fromFormat:"",
            labelRotate:0,          //rotate 0-360 of the labels in clockwise
            labelPosition:UNDER_TICK, //label is under the tick , otherwise in the center of two ticks
            enable:true,            //visible or not
            fontSize:12             //label font size
        };

        this.options = mix(defaultOptions, options || {});

        this.implement(this.options.type);

        this.name = this.options._name;

        this.stage = paper;

        this.events = new Venus.util.CustomEvent();

        this.model = {};
        this.view = {};
        this.events = new util.CustomEvent();

        this.autoModel();

    }

    Axis.prototype = {
        constructor:Axis,
        autoModel:function () {
            /*
             * auto compute visible ticks ,according to width ,origin ticks , data and so on
             * model got key attribute below
             * {
             *     max,
             *     min,
             *     total,
             *     ticks,
             *     tickSize,
             *     tickWidth,
             *     totalWidth,
             *     pop,
             *     rotate,
             * }
             * */

            // override by each type axis
         },
        set:function(key,value){
            /*
            * set model options
            * */
            var change = false;
            if (isObject(key)) {
                for (var o in key) {
                    if(!key.hasOwnProperty(o)){
                        continue;
                    }
                    if (this.options[o] != key[o]) {
                        this.options[o] = key[o];
                        change = true;
                    }
                }
            } else {
                if (this.options[key] !== value) {
                    this.options[key] = value;
                    change = true;
                }
            }

            if(change){
                this.autoModel();
            }

            if (change && this.axisRendered) {
                this.render();
                this.events.fire('model_change',this.model);
            }

         },
        autoRange:function (min, max, totalTick) {
            /*
             * generate axis ticks according to min and max
             *
             * */
            (min === undefined || min===null || isNaN(min)) && (min = 0);
            (max === undefined || max===null || isNaN(max)) && (max = 10);
            var iDelta = max - min,
                iExp,
                iMultiplier,
                dSolution ,
                dMultiCal,
                dInterval,
                start, end;

            totalTick = totalTick || 5;

//            if (iDelta < 1) { //Modify this by your requirement.
//                max += ( 1 - iDelta) / 2;
//                min -= ( 1 - iDelta) / 2;
//            }
//            iDelta = max - min;
            if(iDelta==0){
                if(min==0 && max==0){
                    return {
                        min:0,
                        max:10,
                        total:2,
                        step:10
                    }
                }
                return {
                    max:max,
                    min:max - Math.abs(max),
                    total:2,
                    step: Math.abs(max)
                }
            }

            iExp = parseInt(Math.log(iDelta) / Math.log(10)) - 2;
            iMultiplier = Math.pow(10, iExp);
            dSolution = [1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000,5000];
            for (var i = 0, l = dSolution.length; i < l; i++) {
                dMultiCal = iMultiplier * dSolution[i];
                if ((parseInt(iDelta / dMultiCal) + 1) <= totalTick) {
                    break;
                }
            }
            dInterval = iMultiplier * dSolution[i];

           // start = (Math.ceil(min / dInterval) - 1) * dInterval;
            start = Math.abs(min) == dInterval ? ( min - dInterval) : util.number.multiple(Math.floor(min / dInterval) ,dInterval);
            for (i = 0; 1; i++) {
                if (start + dInterval * i > max)
                    break;
                end = util.number.add(start, dInterval * (i + 1));
            }


            return {
                max:end,
                min:start,
                step:dInterval,
                total:Math.round((end - start) /dInterval ) + 1
            }
        },
        render:function(){
            var view  = this.view,
                model = this.model,
                stage = this.stage,
                opt = this.options,
                pathAttr = {
                    'opacity':.8,
                    'stroke-width':1
                },
                pathString = [],
                beginX = model.beginX,
                beginY = model.beginY,
                tickHeight = 2,
                labelMarginTop = 5,
                label,
                bbox,
                skip,//if label text is too wide , skip some
                noOppositeLabel = (( model.rotate == 0  ) !== opt.opposite),
                reverse = !!model.reverse,
                hasTitle = !!opt.title;
                transformString = "";

            if (!view.axisElement) {
                view.axisElement = stage.path();
            }
            if (view.tickElements) {
                view.tickElements.forEach(function (t) {
                    t.remove();
                });
                view.tickElements.clear();
            } else {
                view.tickElements = stage.set();
            }
            if (view.labelElements) {
                view.labelElements.forEach(function (label) {
                    label.remove();
                });
                view.labelElements.clear();
            } else {
                view.labelElements = stage.set();
            }
            if(hasTitle && !view.titleElement){
                view.titleElement = stage.text(beginX+model.totalWidth/2,beginY,opt.title);
            }

            pathString.push('M', beginX, beginY, 'h', model.totalWidth);

            this.forEach(function (i, length, text) {
                if (i !== 0) {
                    view.tickElements.push(stage.path().attr({
                        path:['M', beginX + length, beginY, 'v', tickHeight]
                    }).attr(pathAttr));
                }
                if (text!==undefined && (!skip || skip <= 1 || (i - model.pop) % skip == 0 )) {
                    var distance = (opt.labelPosition == UNDER_TICK ? 0 : model.tickWidth / 2);
                    label = stage.text(reverse ? (beginX + model.totalWidth - length + distance) : (beginX + length - distance), beginY, text).attr({
                        'font-size':this.options.fontSize
                    });
                    view.labelElements.push(label);
                    bbox = label.getBBox();
                    var line = Math.sqrt(Math.pow(bbox.width, 2) + Math.pow(bbox.height, 2)),
                        totalRotate = ((opt.labelRotate || 0) + (model.rotate || 0)) * PI / 180,
                        t = Math.max(bbox.height, line * Math.cos(totalRotate));
                    skip = Math.ceil((t + 20) / model.tickWidth);
                }

            });

            view.axisElement.attr({
                path:pathString
            }).attr(pathAttr);

            if (model.rotate) {
                //rotate the axis
                transformString += ('R' + (- model.rotate) + ',' + beginX + ',' + beginY);
            }

            if (transformString) {
                //do the transform
                view.axisElement.transform(transformString);
                view.tickElements.transform(transformString);
            }
            var maxT = 0;
            view.labelElements.forEach(function (l) {
                var str = "",
                    bBox = l.getBBox(),
                    line = Math.sqrt(Math.pow(bBox.width, 2) + Math.pow(bBox.height, 2)),
                    totalRotate = ((opt.labelRotate || 0) + (model.rotate || 0))*PI/180,
                    t = (Math.max(bBox.height, line * Math.sin(totalRotate)) / 2 + labelMarginTop) * (noOppositeLabel ? 1 : -1);

                maxT = Math[noOppositeLabel?'max':'min'](maxT,t);

                if (model.rotate) {
                    str += ("R90");
                }
                if (opt.labelRotate) {
                    str += ( "...R" + opt.labelRotate );
                }
                str += ('T0,'+t);

                if (model.rotate) {
                    str += ("...R-90," + beginX + "," + beginY);
                }

                if (str) {
                    l.transform(str);
                }
            });

            if(hasTitle){
                var offset =  noOppositeLabel?maxT+20:maxT-20;
                //view.titleElement.attr("y",beginY +offset);
                if(model.rotate){
                    view.titleElement.transform("T0,"+offset+"...R-90,"+beginX+","+beginY);
                }else{
                    view.titleElement.transform("T0,"+offset);

                }
            }

            if (!this.options.enable) {
                //if invisible ,hide the elements
                //but the coordinate is actually exist
                view.axisElement.hide();
                view.labelElements.hide();
                view.tickElements.hide();
                view.titleElement.hide();
            }
        },
        on:function(fn){
            this.events.on('model_change',fn);
        },
        implement:function(type){
            if (Axis.types[type]) {
                for (var m in Axis.types[type]) {
                    this[m] = Axis.types[type][m];
                }
            }
        }
    };
    Axis.types = {
        'continuous':{
            autoModel:function(){
                var opt = this.options,
                    model = this.model,
                    alpha = Math.atan(opt._svgHeight / opt._svgWidth),
                    beta = (opt.rotate || 0) * PI / 180,
                    percent = opt.percent,
                    maxWidth = beta <= alpha ? opt._svgWidth / Math.cos(beta) : opt._svgHeight / Math.sin(beta);

                model.pop = opt.pop || 0;
                model.rotate = opt.rotate;

                //got min and max
                var range = this.autoRange(opt.min, opt.max, opt.total);
                model.max = range.max;
                model.min = range.min;
                model.tickSize = range.step;
                model.desc = range.desc;

                model.total = range.total;

                model.tickWidth = opt.tickWidth || maxWidth * percent / (model.total + model.pop - 1);
                model.totalWidth = model.tickWidth * (model.total + model.pop - 1);
            },
            getPoint:function (value) {
                var model = this.model,
                    length;
                length = value === undefined ? 0 : (value - model.min) * model.tickWidth / model.tickSize + model.pop * model.tickWidth;
                return {
                    length:length,
                    tick:value
                }
            },
            forEach:function(fn){
                var model = this.model,
                    distance,
                    i , l,
                    count = 0;

                for (i = 0, l = model.pop; i < l; i++) {
                    fn.call(this, i, (i + 1) * model.tickWidth)
                }
                for (i = model.min, l = model.max; i <= l;) {
                    distance = (count + model.pop) * model.tickWidth;
                    fn.call(this, model.pop + count, distance,l>=1000&& i / 100 === parseInt(i / 100) && i !== 0 ? i / 1000 + 'k' : i);
                    i = util.number.add(i, model.tickSize);
                    count++;
                }
            }
        },
        'discrete': {
            autoModel:function () {
                var opt = this.options,
                    model = this.model,
                    alpha = Math.atan(opt._svgHeight / opt._svgWidth),
                    beta = (opt.rotate || 0) * PI / 180,
                    percent = opt.percent,
                    maxWidth = beta <= alpha ? opt._svgWidth / Math.cos(beta) : opt._svgHeight / Math.sin(beta),
                    total, i, l;

                model.pop = opt.pop || 0;
                model.rotate = opt.rotate;

                //got ticks and generate the visible ticks
                if (opt.tickSize) {
                    model.tickSize = opt.tickSize;
                } else {
                    //compute the tickSize
                    if (opt.total) {
                        total = Math.min(opt.total, opt.ticks.length);
                    } else {
                        total = opt.ticks.length;
                        while (total) {
                            if (opt.fontSize * (total + model.pop) > maxWidth * percent) {
                                total = Math.floor(total / 2);
                            } else {
                                break;
                            }
                        }
                    }
                    if (total == 1) {
                        total = 2;
                        model.pop = 1;
                    }
                    model.tickSize = Math.ceil((opt.ticks.length - 1) / (total - 1)) || 1;
                }
                total = Math.ceil((opt.ticks.length - 1) / model.tickSize) + 1;
                model.tickWidth = parseInt(opt.tickWidth || maxWidth * percent / (total + model.pop - 1));
                model.totalWidth = model.tickWidth * (total + model.pop - 1);
                model.total = total;
            },
            getPoint:function (key) {
                var tick, length,
                    model = this.model,
                    options = this.options

                if (key === undefined) {
                    length = 0;
                } else {
                    if (typeof key == "string") {
                        tick = key;
                        options.ticks.forEach(function (tick, i) {
                            if (tick == key) {
                                key = i;
                            }
                        });
                    } else {
                        tick = options.ticks[key];
                    }
                    length = key * model.tickWidth / model.tickSize + model.pop * model.tickWidth;
                }

                return {
                    length:length,
                    tick:tick
                }
            },
            forEach:function(fn){
                var model = this.model,
                    opt = this.options,
                    distance,
                    i , l,
                    count = 0;

                for (i = 0, l = model.pop; i < l; i++) {
                    fn.call(this, i, (i + 1) * model.tickWidth)
                }
                for (i = 0, l = opt.ticks.length - 1; i <= l;) {
                    distance = (count + model.pop) * model.tickWidth
                    fn.call(this, model.pop + count, distance, opt.ticks[i]);
                    i = util.number.add(i, model.tickSize);
                    count++;
                }
            }
        },
        'datetime':{
            autoModel:function(){
                Axis.types.continuous.autoModel.call(this);

            },
            autoRange:function (a, b) {
                var min = a ? (+a) : ( +new Date()) ,
                    max = b ? (+b) : ( +new Date()) ,
                    iDelta = max - min,
                    step,
                    total,
                    desc,
                    aSecond = 1000,
                    aMinute = 60 * aSecond,
                    aHour = 60 * aMinute,
                    aDay = 24 * aHour,
                    minTime = new Date(min),
                    maxTime = new Date(max);


                if (iDelta == 0) {
                    return {
                        max:max,
                        min:0,
                        step:max,
                        total:2
                    }
                } else if (iDelta < aSecond * 2) {
                    //within 2 seconds
                } else if (iDelta < aMinute * 2) {
                    //within 2 minutes
                    min = minTime.setMilliseconds(0);
                    max = maxTime.getMilliseconds() === 0 ? max : maxTime.setSeconds(maxTime.getSeconds() + 1);
                    step = aSecond;
                    desc = "second";
                    total = (max - min) / step + 1;
                } else if (iDelta < aHour * 2) {
                    //within 2 hours
                    min = minTime.setSeconds(0, 0);
                    max = +(new Date(max).setSeconds(0, 0)) < max ? maxTime.setMinutes(maxTime.getMinutes() + 1,0,0) : max;
                    step = aMinute;
                    desc = "minute";
                    total = (max - min) / step + 1;
                } else if (iDelta < aDay * 2) {
                    //within 2 days
                    min = minTime.setMinutes(0, 0, 0);
                    max = +(new Date(max).setMinutes(0, 0, 0)) < max ? maxTime.setHours(maxTime.getHours() + 1,0,0,0) : max;
                    step = aHour;
                    desc = "hour";
                    total = (max - min) / step + 1;
                } else if (new Date(min).setMonth(minTime.getMonth()+2) > max) {
                    //within 2 month
                    min = minTime.setHours(0, 0, 0, 0);
                    max = +(new Date(max).setHours(0, 0, 0, 0)) < max ? +new Date(maxTime.getFullYear(), maxTime.getMonth(), maxTime.getDate() + 1) : max;
                    step = aDay;
                    desc = "day";
                    total = (max - min) / step + 1;
                } else if (new Date(min).setFullYear(minTime.getFullYear()+2)> max) {
                    //within 2 years
                    min = +new Date(minTime.getFullYear(), minTime.getMonth(), 1);
                    max = +new Date(maxTime.getFullYear(), maxTime.getMonth()) < maxTime ? +new Date(maxTime.getFullYear(), maxTime.getMonth() + 1) : maxTime;
                    minTime = new Date(min);
                    maxTime = new Date(max);
                    desc = "month";
                    //no step because each month has different days
                    total = (maxTime.getFullYear() - minTime.getFullYear()) * 12 + maxTime.getMonth() - minTime.getMonth() + 1;
                } else {
                    // more than two years
                    min = +new Date(minTime.getFullYear());
                    max = +new Date(maxTime.getFullYear(), 0) < maxTime ? +new Date(maxTime.getFullYear() + 1) : maxTime;
                    minTime = new Date(min);
                    maxTime = new Date(max);
                    desc = "year";
                    total = maxTime.getFullYear() - minTime.getFullYear() + 1;
                }
                return {
                    max:max,
                    min:min,
                    step:step,
                    total:total,
                    desc:desc
                }

            },
            getPoint:function (date) {
                var value = +util.date.parse(date),
                    model = this.model,
                    length;
                length = value === undefined ? 0 : (value - model.min) * (model.totalWidth - model.pop * model.tickWidth) / (model.max - model.min) + model.pop * model.tickWidth;
                return {
                    length:length,
                    tick: util.date.format(new Date(value),this.options.toFormat)
                }
            },
            forEach:function(fn){
                var model = this.model,
                    distance,
                    format,
                    i , l,
                    count = 0,
                    date,
                    monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                for (i = 0, l = model.pop; i < l; i++) {
                    fn.call(this, i, (i + 1) * model.tickWidth)
                }
                if (model.tickSize) {
                    switch(model.desc){
                        case "second":
                            format = "ss";
                            break;
                        case "minute":
                            format = "mm:ss";
                            break;
                        case "hour":
                            format = "hh:mm";
                            break;
                        case "day":
                            format = "MM-dd";
                            break;
                    }
                    //got tickSize , means tickSize< month
                    for (i = model.min, l = model.max; i <= l;) {
                        distance = (count + model.pop) * model.tickWidth;
                        fn.call(this, model.pop + count, distance, util.date.format(i, format));
                        i = util.number.add(i, model.tickSize);
                        count++;
                    }
                } else {
                    //month or year
                    date = new Date(model.min);
                    if (model.desc == "month") {
                        while (+date <= model.max) {
                            distance = this.getPoint(date).length;
                            fn.call(this, model.pop + count, distance, monthMap[date.getMonth()]);
                            date = new Date(date.setMonth(date.getMonth() + 1));
                            count++;
                        }
//                        for (i = model.min, l = model.max; i <= l;) {
//                            distance = this.getPoint(date);
//                            fn.call(this, model.pop + count, distance, monthMap[date.getMonth()]);
//                            i = util.number.add(i, model.tickSize);
//                            count++;
//                        }
                    } else if (model.desc == "year") {
                        while (+date <= model.max) {
                            distance = (count + model.pop) * model.tickWidth;
                            fn.call(this, model.pop + count, distance, date.getFullYear());
                            date = new Date(date.setFullYear(date.getFullYear() + 1));
                            count++;
                        }
                    }
                }

            }
        }
    };

    Axis.extendType = function(type,methods){
        Axis.types = methods;
    };


    /*Class Axis End*/


    /*Class Legend Begin*/

    var Legend = function (chart, options, paper) {
        /*
         * Class Legend
         * @param series{Series} instance of Series
         * @param options{Object}
         * @param paper{Raphael} instance of Raphael
         *
         * */
         var defaultOption = {
                position:['right', 'top'],  //position of the legend contains two elements (horizontal and vertical) each could be string and number
                format:'{name}',            //format of the texts
                fontSize:12,                //text font size
                colors:[],                  //colors ,parsed as the dpchart.colors
                borderWidth:.8,
                borderColor:'gray',
                direction:'vertical'       //how to layout the items
            }, i, l
            , series = chart.series
            , data = series.getSeries()
            , width = 15                        //item width
            , lineHeight = 20                   // item line height
            , span = 10                         //distance between item and text
            , border                            // rect element of border
            , startX = 0
            , startY = 0
            , item
            , icon
            , text
            , textWidth
            , totalWidth
            , totalHeight
            , itemSet                           // set of items
            , textSet                           // set of texts
            , margin = 10                       // margin to svg boundary
            , padding = 10
            , names
            , colors
            , isVertical, _x,_y ,
            left , top,
            active, activeEvent, activeArray,
            self = this,
            opt = this.options = mix(defaultOption, options);

        //Raphael Set to contain the elements
        itemSet = paper.set();
        textSet = paper.set();

        colors = opt.colors;

        names = options.names;

        //vertical or horizontal
        isVertical = (opt.direction == 'vertical');

        //used to compute the total width
        isVertical ? totalWidth = [] : totalWidth = 0;

        startX = padding;
        startY = padding;

        for (i = 0, l = data.length; i < l; i++) {
            //create the raphael elements
            _x = startX;
            _y = startY;
            icon = chart.iconFactory.create(i, _x+width/2, _y+lineHeight/2, width);
            item = icon.icon;
            item._iconObj = icon;

            text = paper.text(_x + width + span, _y + lineHeight/ 2, names[i]).attr({
                'font-size':opt.fontSize
            });

            textWidth = text.getBBox().width;
            text.translate(textWidth / 2, 0);

            isVertical ? startY += lineHeight : startX += (width + span * 2 + textWidth);

            item.attr({
                'fill':colors[i],
                'stroke-width':0,
                'cursor':'pointer'
            });
            itemSet.push(item);
            textSet.push(text);
            isVertical ? totalWidth.push(textWidth) : totalWidth += textWidth;
        }
        totalWidth = isVertical ? Math.max.apply(Math, totalWidth) + width + span + padding * 2 : width * l + (2 * l - 1) * span + padding * 2 + totalWidth;
        totalHeight = isVertical ? lineHeight * l + padding * 2 : padding * 2 + lineHeight;

        //border
        var _lastX,_lastY;
        border = paper.rect(0, 0, totalWidth, totalHeight, 5).attr({
            'stroke-width':opt.borderWidth,
            'stroke':opt.borderColor,
            'fill':"#FFF",
            'cursor':'move'
        }).drag(function(dx,dy){
                var shiftX = dx - _lastX,
                    shiftY = dy - _lastY;
                self.setPosition(shiftX,shiftY);
                _lastX = dx;
                _lastY = dy;
            },function(){
                _lastX = 0;
                _lastY = 0;
                self.toFront();
            });


        this.border = border;
        this.itemSet = itemSet;
        this.textSet = textSet;

        this.toFront();

        //convert position string to value
        if (typeof (left = this.options.position[0]) == "string") {
            if (left == "right") {
                left = this.options._svgWidth - totalWidth - margin;
            } else if (left == "center") {
                left = this.options._svgWidth / 2 - totalWidth / 2
            } else {
                left = margin
            }
        }

        if (typeof (top = this.options.position[1]) == "string") {
            if (top == "bottom") {
                top = this.options._svgHeight - totalHeight - margin
            } else if (top == 'center') {
                top = this.options._svgHeight / 2 - totalHeight / 2
            } else {
                top = margin
            }
        }

        this.setPosition(left, top);

        //init active , all is active
        active =  this.active = [];
        itemSet.forEach(function(){
            active.push(true);
        });
        activeArray = this.activeArray = active.slice(0);
        activeEvent =  this.activeEvent = new util.CustomEvent();


        //bind default click event
        this.on('click', function (e, i) {
            active[i] ? active[i] = false : active[i] = true;
            active[i] ? this.attr('fill', colors[i]) : this.attr('fill', 'gray');
            activeArray = self.activeArray = [];
            active.forEach(function(truth,index){
                truth && activeArray.push(index);
            });
            activeEvent.fire('change', active,activeArray);
        });
    };
    Legend.prototype = {
        constructor:Legend,
        setPosition:function (left, top) {
            //set the position of the legend
            //relative ,not absolute
            this.itemSet.translate(left, top);
            this.textSet.translate(left, top);
            this.border.translate(left, top);
        },
        on:function (name, fn) {
            //bind DOM Events on legend item
            var event;
            if ((event = this.itemSet[name] ) && util.isFunction(event)) {
                //has function such as click, mouseover
                this.itemSet.forEach(function (item, i) {
                    item[name](function (e) {
                        fn.call(item, e, i);
                    });
                })
            }
            return this;
        },
        onActiveChange:function (fn) {
            this.activeEvent.on('change', fn);
        },
        toFront:function(){
            this.border.toFront();
            this.itemSet.toFront();
            this.textSet.toFront();
        }
    }

    /*Class Legend End*/


    /*Class Grid Begin*/

    var Grid = function (options, paper) {
        var defaultOption = {
                'color':'#ccc', //color of the grid
                'rows':[], //coordinate
                'columns':[],
                'width':0, //length of the row
                'height':0, //length of the column
                'stroke-width':1,
                'opacity':0.2,
                _x:0, //x coordinate of y axis
                _y:0                    //y coordinate of x axis ,these are used as the start position
            };
        this.options = mix(defaultOption, options);
        this.paper = paper;
        this.rows = paper.set();
        this.columns = paper.set();
        this.render();
    }
    Grid.prototype = {
        constructor:Grid,
        render:function(){
            this.rows.forEach(function(r){
                r.remove();
            }).clear();
            this.columns.forEach(function(c){
                c.remove();
            }).clear();

            var options = this.options,
                paper = this.paper,
                lineAttr = {
                stroke:options.color,
                "stroke-width":options['stroke-width'],
                'opacity':options.opacity
                },self = this;

            if (options.rows && options.rows.length) {
                //draw rows
                options.rows.forEach(function (value) {
                    self.rows.push(paper.path('M' + options._x + "," + value + "h" + options.width).attr(lineAttr));
                });
                self.rows.toBack();
            }
            if (options.columns &&options.columns.length) {
                //draw columns
                options.columns.forEach(function (value) {
                    self.columns.push(paper.path('M' + value + "," + options._y + "v" + -options.height).attr(lineAttr));
                });
                self.columns.toBack();
            }
        }
    }

    /*Class Grid End*/

    var Threshold = function(axisName,value,coordinate,stage){
        this.axisName = axisName;
        this.stage = stage;
        this.axis = coordinate.axises[axisName];
        this.type = coordinate.type(axisName);
        this.value = value;
        this.coordinate = coordinate;
        this.render();
    }
    Threshold.prototype = {
        constructor:Threshold,
        render:function(){
            var width,
                coordinate = this.coordinate,
                triangleWidth = 10,
                pos = this.getPosition(this.value);

            width = this.type=='x'? coordinate.y.model.totalWidth: coordinate.x.model.totalWidth;
            this.line = this.stage.path().attr({
                path:['M', pos.x, pos.y, 'v', -triangleWidth / 2, 'l', triangleWidth, triangleWidth / 2, 'h', width - triangleWidth, 'm', triangleWidth - width, 0, 'l', -triangleWidth, triangleWidth / 2, 'v', -triangleWidth / 2],
                'fill':'red',
                'stroke':'red'
            });

        },
        moveTo:function(value){

        },
        getPosition:function(value){
            var coordinate = this.coordinate,
                x = coordinate.xName,
                y = coordinate.yName,
                xy;

            if(this.type==="x"){
                coordinate.use(this.axisName,y);
                xy = coordinate.get(value);
                coordinate.use(x,y);
                return {
                    x:xy.x,
                    y:xy.y
                }

            }else{
                coordinate.use(x,this.axisName);
                xy = coordinate.get(undefined,value);
                coordinate.use(x,y);
                return {
                    x:xy.x,
                    y:xy.y
                }
            }
        }
    }




    /*
        extends Raphael Element , toolTip function
    */
    var toolTip = function (paper, x, y, texts, side) {
            //extend the Raphael Element and provide the toolTip Function
            //@param x , y position of the tip
            //@texts{Array or String} each line of text
            //@side{String} 'left','top','right' or 'bottom'
            var tip, labels,
                side = side || 'top',
                path = function (width, height, padding,side) {
                    var p = [],
                        arrowWidth = 5,
                        left, top;

                    height += (2 * padding || 0);
                    width += (2 * padding || 0);
                    switch (side) {
                        case 'right':
                            //arrow at the left side and content at right
                            height = Math.max(arrowWidth * 2, height);
                            p.push('M', x + 10, y);
                            p.push('l', arrowWidth, -arrowWidth);
                            p.push('v', -(height / 2 - arrowWidth));
                            p.push('h', width);
                            p.push('v', height, 'h', -width);
                            p.push('v', -(height / 2 - arrowWidth));
                            p.push('l', -arrowWidth, -arrowWidth);
                            left = x + 10 + arrowWidth;
                            top = y - height / 2;
                            break;
                        case 'top':
                            width = Math.max(arrowWidth * 2, width);
                            p.push('M', x, y - 10);
                            p.push('l', -arrowWidth, -arrowWidth);
                            p.push('h', -(width / 2 - arrowWidth));
                            p.push('v', -height, 'h', width, 'v', height);
                            p.push('h', -(width / 2 - arrowWidth));
                            p.push('l', -arrowWidth, arrowWidth);
                            left = x - width / 2;
                            top = y-10 - arrowWidth - height;
                            break;
                        case 'left':
                            height = Math.max(arrowWidth * 2, height);
                            p.push('M', x - 10, y);
                            p.push('l', -arrowWidth, arrowWidth);
                            p.push('v', height / 2 - arrowWidth);
                            p.push('h', -width, 'v', -height, 'h', width);
                            p.push('v', height / 2 - arrowWidth);
                            p.push('l', arrowWidth, arrowWidth);
                            left = x-10 - arrowWidth - width;
                            top = y - height / 2;
                            break;
                        case 'bottom':
                            width = Math.max(arrowWidth * 2, width);
                            p.push('M', x, y + 10);
                            p.push('l', arrowWidth, arrowWidth);
                            p.push('h', width / 2 - arrowWidth);
                            p.push('v', height, 'h', -width, 'v', -height);
                            p.push('h', width / 2 - arrowWidth);
                            p.push('l', arrowWidth, -arrowWidth);
                            left = x - width / 2;
                            top = y+10 + arrowWidth;
                            break;

                    }
                    p.push('z');
                    return {
                        path:p,
                        box:{
                            left:left,
                            top:top,
                            width:width,
                            height:height
                        }
                    };
                }

            !isArray(texts) && (texts = [texts]);
            labels = paper.set();
            var width = [], height = 0,
                bBox,
                text,
                paddingToBorder = 8,
                p,
                totalWidth,totalHeight;


            texts.forEach(function (t, i) {
                text = paper.text(x, -100, t);
                labels.push(text);
                bBox =util.clone(text.getBBox());
                //seems Raphael's bug , when contains（ ）
                bBox.width += (t.toString().split(' ').length * 10)

                text.attr({
                    'opacity':0,
                    'font-size':12
                });
                width.push(bBox.width);
            });
            if (this._venus_tooltip_show)
                return;

            totalWidth = Math.max.apply(Math, width);
            totalHeight = texts.length * bBox.height;

            p = path(totalWidth, totalHeight, paddingToBorder,side);
            //if the tip is out of bound
            if (p.box.left + p.box.width > paper.canvas.clientWidth) {
                p = path(totalWidth, totalHeight, paddingToBorder, 'left');
            } else if (p.box.left < 0) {
                p = path(totalWidth, totalHeight, paddingToBorder, 'right');
            } else if (p.box.top < 0) {
                p = path(totalWidth, totalHeight, paddingToBorder, 'bottom');
            } else if (p.box.top + p.box.height > paper.canvas.clientHeight) {
                p = path(totalWidth, totalHeight, paddingToBorder, 'top');
            }
            tip = paper.path();
            labels.toFront();
            tip.attr({
                path:p.path,
                fill:"#FFF",
                "stroke-width":2,
                "fill-opacity":.1,
                'stroke-linejoin':'round',
                'stroke':'#4572A7',
                'opacity':'0'
            });
            tip.animate({'opacity':1, 'fill-opacity':.85}, 100);
            labels.animate({'opacity':1}, 100);
            labels.forEach(function (la, i) {
                la.attr({
                    'y':p.box.top + (i + .5) * bBox.height + paddingToBorder,
                    'x':p.box.left + p.box.width / 2
                })
            });
            this._venus_tooltip_labels = labels;
            this._venus_tooltip = tip;
            this._venus_tooltip_show = true;
            return toolTip;
        },
        toolTipHide = function () {
            var self = this,
                cb = function () {
                    this.remove();
                    self._venus_tooltip_show = false;
                }, animate = Raphael.animation({'opacity':0}, 100, 'linear', cb);
            this._venus_tooltip && (this._venus_tooltip.animate(animate) ) && (this._venus_tooltip_labels.animate(animate) );
        };
    Raphael.el.toolTip = toolTip;
    Raphael.el.toolTipHide = toolTipHide;


    //for unit test , temporary bind Classes on Chart
    Chart.Series = Series;
    Chart.Axis = Axis;
    Chart.Legend = Legend;
    Chart.Grid = Grid;

    Venus.SvgChart = Chart;

})(this);


/*
* @change log :
*
*   2012-09-25: version 1.1
*   1. options change:
*       1.1 add 'tooltip' function to config the tooltip
*           {x:String,y:String,label:String} will be parsed to this function
*       1.2 add 'axisUsage' to config which two axises to use
*       1.3 add 'icons' to config which icon to used for each series
*           call this.iconFactory.create to create icons
*       1.4 axis config optimized :
*           tickWidth,tickSize,max,min
*           are now optional
*       1.5 options object now cloned and mix to default options , outer options object stays no change
*
*   2. Class Axis rebuild:
*       2.1 Axis now is separated as model and view
*           model can be changed out of the Axis instance
*           view binds to the model and will auto render when model changes
*           charts now rely on the model , bind to model and auto change when model changes
*           model got some key attributes , see Axis.model
*      2.2 range and ticks are auto computed and also can config in options
*      2.3 remove prototype function getX,getY,getOrigin,setPosition,getAngel,getTicksPos
*      2.4 coordinate service now is provided by Chart.coordinate
*
*   3. Class Series change:
*       3.1 Series.getRange() can receive an array which is indexes of series to get the appointed range of data
*
*   4. Class Legend change:
*       4.1 legend now use iconFactory to create icons
*       4.2 legend now is draggable
*
*   4. Class Grid change:
*       4.1 Grid now are bind to the axis model and re-render when model changes
*
*   5. Chart.coordinate added:
*       4.1 coordinate object manages the axises and provide some services to help draw charts
*       4.2 use coordinate.get(x,y) to replace axis.getX, axis.getY
*
*   6. add _initLabels() in the main drawing flow to provide the labels use by legend , tooltip , axis
*
*   7. add _initIconFactory() in the main drawing flow to init the iconFactory object
*
*   8. charts are bind to the axis model and do some changes when the model change
*
*   9. Line Chart
*      9.1 Line Dot now stays the same as legend both calls iconFactory to create icons
*      9.2 Tip will show when close to dot and add 'hoverRadius' to config the response radius,default to 50
*      9.3 set 'columnHover' default to false since the 'hoverRadius' is on
*      9.4 use mouse event clientX,and clientY to implement columnHover instead of invisible column bars
*
*   10.Bar Chart
*      10.1 bind to axis model
*      10.2 set x axis label and bars between ticks
*
*   11.tooltip
*      11.1 tooltip ui rebuild and fix some bugs
*
* */

;
(function () {
    var util = Venus.util;
    Venus.SvgChart.addChart('bar', {
        draw:function () {
            var series = this.series.getSeries(),
                colors = this.colors,
                coordinate = this.coordinate,
                paper = this.stage,
                sideBySide = "sidebyside",
                nestification = "nestification",
                sumY = [],

                /*
                 * default of the bar config options
                 * which could be parsed from the SvgChart.options.bar
                 * */
                barOptions = util.mix({
                    radius:0,               //radius of bars
                    beginAnimate:true,      //enable begin animate or not
                    opacity:1,              //opacity of the bars
                    multiple:sideBySide   //how to layout bars when there are multiple bars in one tick, sidebyside or nestification
                }, this.options.bar),

                elements = [],
                self = this,
                duration = 500;

                coordinate.x.set('pop',1);


            /*
             * Main Function of draw bar
             * @param x{Number} x svg coordinate of left top point of the bar
             * @param y{Number}
             * @param width{Number} width of the bar
             * @param height{Number} height of the bar
             * @param color{String} color of the bar
             * @param value{String} Text of the toolTip
             *
             * */
            function drawBar(x, y, width, height, color, tipObj) {
                var bar,
                    distance = coordinate.distance(coordinate.x,{x:x,y:y});
                if (barOptions.beginAnimate) {
                    if(isHorizontal()){
                        if (distance >= 0) {
                            bar = paper.rect(x, y, 0, height, barOptions.radius).animate({width:width}, 500);
                        } else {
                            bar = paper.rect(coordinate.x.model.beginX, y, 0, height, barOptions.radius).animate({
                                width:width,
                                x:x
                            }, 500);
                        }

                    }else{
                        bar = paper.rect(x, coordinate.x.model.beginY, width, 0, barOptions.radius).animate({height:height, y:y}, 500);
                    }
                } else {
                    bar = paper.rect(x, y, width, height, barOptions.radius);
                }

                bar.attr({
                    'fill':color,
                    'stroke-width':0,
                    'opacity':barOptions.opacity || 1
                }).hover(function (e) {
                        if(isHorizontal()){
                            if(distance>=0){
                                this.toolTip(paper, this.attr('x') + this.attr('width'), this.attr('y') + this.attr('height') / 2, self.options.tooltip.call(self, tipObj), 'right');
                            }else{
                                this.toolTip(paper, this.attr('x'), this.attr('y') + this.attr('height') / 2, self.options.tooltip.call(self, tipObj), 'left');
                            }
                        }else{
                            if(distance>=0){
                                this.toolTip(paper, this.attr('x') + this.attr('width') / 2, this.attr('y')+this.attr('height'), self.options.tooltip.call(self,tipObj),"bottom");
                            }else{
                                this.toolTip(paper, this.attr('x') + this.attr('width') / 2, this.attr('y'), self.options.tooltip.call(self,tipObj),"top");
                            }
                        }
                    }, function () {
                        this.toolTipHide();
                    });
                return bar;
            }


            function isBarType(index) {
                return series[index].type === undefined || series[index].type === "bar";
            }

            function bindLegendEvents() {
                /*
                 * bind legend active change event
                 * related bar toggles hide
                 * */
                self.legend && self.legend.onActiveChange(function (active,activeArray) {
                    active.forEach(function (truth, i) {
                        if(elements[i]){
                            truth ? elements[i].show() : elements[i].hide();
                        }
                    });
                    render(activeArray);
                });
            }

            function getPositions(x, y, i,count, sumY) {
                /*
                 * when there are several bars on one tick
                 * this function returns each position of the bar
                 *
                 * @param x{Number} x tick
                 * @param y{Number} y value
                 * @param i{Number} index of series
                 * @param count{Number} numbers of bars
                 * @param sumY{Number} current height of the bar
                 *
                 * return {
                 *  x:Number,
                 *  y:Number,
                 *  width:Number,
                 *  height:Number
                 * }
                 * */

                var xy = coordinate.get(x, y),
                    oX = xy.x,
                    oY = xy.y,
                    xModel = coordinate.x.model,
                    xTickWidth = xModel.tickWidth,
                   // xTickSize = coordinate.x.model.tickSize,
                    totalWidth = xModel.totalWidth,
                    beginY = xModel.beginY,
                    beginX = xModel.beginX,
                    times = 5, // width/space=times
                    distance ;

                distance = coordinate.distance(coordinate.x, xy);
                if (barOptions.multiple == sideBySide) {
                    var total = ((totalWidth - xModel.pop * xModel.tickWidth)||totalWidth) / self.series.getLength() * .8,
                        space = total / ((times + 1) * count + 1),
                        bWidth = times * space;

                    if (isHorizontal()) {
                        distance < 0 ? (x = oX) : (x = beginX);
                        return {
                            x:x,
                            y:oY - total / 2 + i * bWidth + (i + 1) * space + xTickWidth / 2,
                            width:Math.abs(distance),
                            height:bWidth,
                            xTick:xy.xTick,
                            yTick:xy.yTick
                        }
                    } else {
                        distance < 0 ? (y = oY) : (y = beginY);
                        x = oX - total / 2 + i * bWidth + (i + 1) * space;
                        return {
                            x:x - xTickWidth / 2,
                            y:y,
                            width:bWidth,
                            height:Math.abs(distance),
                            xTick:xy.xTick,
                            yTick:xy.yTick
                        }
                    }
                } else {
                    if (isHorizontal()) {
                        distance < 0 ? (x = oX - sumY) : (x = beginX + sumY);
                        return {
                            x:x,
                            y:oY + xTickWidth / 4,
                            width:Math.abs(distance),
                            height:xTickWidth / 2,
                            xTick:xy.xTick,
                            yTick:xy.yTick
                        }
                    } else {
                        distance < 0 ? (y = oY-sumY) : (y = beginY+sumY);
                        return {
                            x:oX - xTickWidth / 4 - xTickWidth / 2,
                            y:y,
                            width:xTickWidth / 2,
                            height:Math.abs(distance),
                            xTick:xy.xTick,
                            yTick:xy.yTick
                        }
                    }
                }
            }


            function isHorizontal(){
                return coordinate.x.model.rotate == 90 && coordinate.y.model.rotate == 0;
            }

            if (barOptions.multiple == nestification) {
                this.series.accumulation = true;
                var range = this.series.getRange();
                coordinate.y.set({
                    min:range.min,
                    max:range.max
                })
            }


            function render(seriesArray) {
                if (!seriesArray) {
                    seriesArray = [];
                    series.forEach(function (d, i) {
                        if(isBarType(i)){
                            seriesArray.push(i);
                        }
                    });
                }else{
                   seriesArray =  seriesArray.filter(function(d,i){
                       return isBarType(d);
                    });
                }
                sumY = [];
                if (util.isNumber(series[0].data)) {
                    /*
                     * if data is Number ,that means series  format as
                     * [{data:Number},{data:Number},...]
                     * draw each data a bar
                     * */

                    coordinate.use(coordinate.getAxisUse(0));
                    series.forEach(function (d, i) {
                        var p = getPositions(i, d.data, 0, 1);
                        if (elements[i]) {
                            //change , animate
                            elements[i].animate({
                                x:p.x,
                                y:p.y,
                                width:p.width,
                                height:p.height
                            }, duration);
                        } else {
                            //init and draw
                            elements[i] = drawBar(p.x, p.y, p.width, p.height, colors[i], {
                                x:p.xTick,
                                y:p.yTick,
                                label:self.labels[i]
                            });
                        }
                    });
                } else if (util.isArray(series[0].data)) {
                    /*
                     * if data is array,that means series format as
                     * [{data:[Number,..]},...]
                     * draw each data data.length bar
                     *
                     * */

                    series.forEach(function (d, i) {
                        coordinate.use(coordinate.getAxisUse(i));
                        var indexOfI = seriesArray.indexOf(i),
                            xTickWidth = coordinate.x.model.tickWidth;

                        if( indexOfI== -1){
                            return;
                        }
                        elements[i] = elements[i] || paper.set();
                        d.data.forEach(function (value, j) {
                            sumY[j] = sumY[j] || 0;
                            var p = getPositions(j, value, indexOfI,seriesArray.length, sumY[j]);
                            sumY[j] += (isHorizontal()? p.width: p.height);
                            if(elements[i][j]){
                                elements[i][j].animate({
                                    x:p.x,
                                    y:p.y,
                                    width:p.width,
                                    height:p.height
                                },duration);
                            }else{
                                elements[i].push(drawBar(p.x, p.y, p.width, p.height, colors[i], {
                                    x:p.xTick,
                                    y:p.yTick,
                                    label:self.labels[i]
                                }));
                            }
                        });
                    });
                } else if (util.isObject(series[0].data)) {
                    /*
                     * data is object ,that means series format as
                     * [{data:{key:value,...}},...]
                     * draw each data keys.length bar
                     * */

                    series.forEach(function (d, i) {
                        coordinate.use(coordinate.getAxisUse(i));
                        var indexOfI = seriesArray.indexOf(i)
                        if( indexOfI== -1){
                            return;
                        }
                        var j = 0, o;
                        elements[i] = elements[i]|| paper.set();
                        for (o in d.data) {
                            sumY[j] = sumY[j] || 0;
                            var p = getPositions(o, d.data[o], indexOfI,seriesArray.length, sumY[j]);
                            sumY[j] += (isHorizontal()? p.width: p.height);

                            if(elements[i][j]){
                                elements[i][j].animate({
                                    x:p.x ,
                                    y:p.y,
                                    width:p.width,
                                    height:p.height
                                },duration);
                            }else{
                                elements[i].push(drawBar(p.x, p.y, p.width, p.height, colors[i], {
                                    x:p.xTick,
                                    y:p.yTick,
                                    label:self.labels[i]
                                }));
                            }
                            j++;
                        }
                    });
                }
            }

            if (series.length) {
                render();
                bindLegendEvents();
                coordinate.x.options.labelPosition = "between_ticks";
                coordinate.y.on(function () {
                    render(self.legend.activeArray);
                });
            }


        }
    });
})();

(function () {
    var util = Venus.util;
	function DotChart(paper, x, y, r, color, d) {
		var dot;

		x=Math.random()*(x+y)/2+x/2;
		
		dot=paper.circle(x, y, r);
		
		color&&dot.attr({
			'stroke' : '#fff',
			'fill' : color
		});
		
		// (d||d===0)&&paper.text(x, y - 10, d);
		
		return dot;
	}
	
	Venus.SvgChart.addChart('dot', {
		draw : function () {
            var series = this.series.getSeries(),
                colors = this.colors,
                coordinate = this.coordinate,
                xAxis = coordinate.x,
                yAxis = coordinate.y,
                axisLength = Math.min(xAxis.model.totalWidth, yAxis.model.totalWidth),
                data,
                xy,
                posX,
                posY,
                radius,
                total = 0,
                elements = [],
                paper = this.stage;
			
			/**calculate summation of all data*/
			for (var i = 0, L = series.length; i < L; i++) {
				if(util.isArray(series[i].data)){
					series[i].data.forEach(function(item){
						total+=item;
					});
				}else if(util.isObject(series[i].data)){
					for(var key in series[i].data){
						total+=series[i].data[key];
					}
				}else if(util.isNumber(series[i].data)){
					total+=series[i].data;
				}
			}
			total*=2;
			
			for (var i = 0, L = series.length; i < L; i++) {
				elements.push([]);
				if(util.isArray(series[i].data)){
					series[i].data.forEach(function(item,j){
						data = item;
                        xy = coordinate.get(j,item)
                        posX = xy.x;
                        posY = xy.y;
						radius=data/total*axisLength;

						elements[i].push(DotChart(paper, posX, posY, radius, colors[i], data));
					});
				}else if(util.isObject(series[i].data)){
					var j=0;
					for(var key in series[i].data){
						data =series[i].data[key];
                        xy = coordinate.get(key,data);
                        posX = xy.x;
                        posY = xy.y;
						radius=data/total*axisLength;

						elements[i].push(DotChart(paper, posX, posY, radius, colors[i], data));
						j++;
					}
				}else if(util.isNumber(series[i].data)){
					data=series[i].data;
                    xy = coordinate.get(i,data);
                    posX = xy.x;
                    posY = xy.y;
					radius=data/total*axisLength;

					elements[i].push(DotChart(paper, posX, posY, radius, colors[i], data));
				}				
			}
			
			/**Legend events*/
            if (this.legend) {
                /* Array.prototype.forEach.call(this.legend.itemSet,function(item,i){
                 var el=elements[i];
                 item.hover(
                 function(){
                 this.rotate(45);

                 el.stop();
                 el.transform('t'+(el.mx-el.cx)/5+','+(el.my-el.cy)/5);;
                 },
                 function(){
                 this.rotate(-45);

                 el.animate({
                 transform : 's1,1,'+el.cx+','+el.cy
                 }, 500, "bounce");
                 }
                 );
                 }); */

                this.legend.on('click', (function () {
                    var arr = new Array(series.length);
                    return function (e, i) {
                        if (arr[i] == true || arr[i] == undefined) {
                            arr[i] = false;
                            elements[i].forEach(function (item) {
                                item.attr('opacity', 0);
                            });
                        } else {
                            arr[i] = true;
                            elements[i].forEach(function (item) {
                                item.attr('opacity', 1);
                            });
                        }
                    }
                })());
            }
		}
	});
})();
;(function (Chart, undefined) {
    /*
     * line chart
     *
     * */


    /*
     * function helps calculate the Bezier
     * */
    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2,
        l2 = (p3x - p2x) / 2,
        a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
        b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));

        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;

        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
        dx1 = l1 * Math.sin(alpha + a),
        dy1 = l1 * Math.cos(alpha + a),
        dx2 = l2 * Math.sin(alpha + b),
        dy2 = l2 * Math.cos(alpha + b);

        return {
            x1:p2x - dx1,
            y1:p2y + dy1,
            x2:p2x + dx2,
            y2:p2y + dy2
        };
    }

    Chart.addChart('line', {
        draw:function () {
            var util = Venus.util,
            opt = this.options,
            /*
             * default options of DPChart.options.line
             * */
            lineOpt = util.mix({
                'line-width':2,         //width of the line
                smooth:false,           //straight line or curved line
                dots:true,              //draw dot for each value or not
                lines:true,
                dotRadius:1,            //dot radius if dots enabled
                hoverRadius:50,          //dot hover radius
                area:false,             //draw area under the line or not
                areaOpacity:0.1,        //area opacity if area enabled
                beginAnimate:false,     //enable begin animate or not
                dotSelect:true,         //enable dots select or not
                enableToolTip:true,
                columnHover:false        //enable column hover or not
            }, opt.line),
            dotRadius = lineOpt.dotRadius,
            series = this.series,
            data = series.getSeries(),
            self = this,
            raphael = this.stage,
            colors = this.colors,       //this.colors,
            elements = [],              //save the element by series
            coordinate = self.coordinate;

            function isLineType(index){
                return data[index].type === undefined || data[index].type === "line";
            }


            function pointBindModel(x, y) {
                function set() {
                    var xy = coordinate.get(x, y);
                    if(coordinate.x.options.labelPosition==="between_ticks"){
                        point.x = xy.x-coordinate.x.model.tickWidth/2;
                    }else{
                        point.x = xy.x;
                    }
                    point.y = xy.y;
                    point.xTick = xy.xTick;
                    point.yTick = xy.yTick;
                }
                var point = {};
                coordinate.y.on(set);
                set();
                return point;
            }

            function activeDot(dot,event) {
                var icon = dot._iconObj,
                point = dot.data('point');
                if (dot._selected_ || dot.node.style.display==="none" || dot._active_) {
                    return;
                }
                dot._active_ = true;
                icon.animate({
                    width: lineOpt.dotRadius * 4
                }, 100);
                var info = {
                    x:point.xTick,
                    y:point.yTick,
                    label:point.label
                };
                lineOpt.enableToolTip && dot.toolTip(raphael, icon.position().x, icon.position().y, self.options.tooltip.call(self,info));
                self.events.fire('dotActive',event,dot, info);
            }
            function inActiveDot(dot){
                var icon = dot._iconObj,
                point = dot.data('point');
                if (dot._selected_ || !dot._active_) {
                    return;
                }
                dot._active_ = false;
                icon.animate({
                    width: dotRadius *2
                }, 100);
                dot.toolTipHide();
                self.events.fire('dotInactive',dot);
            }

            /*
             * Main Function of draw a line
             * @param arr{Array or Object} array or object of the data of each point
             * @param indexOfSeries{Number} index of the Series
             * @color{Color}
             * @dotColor{Color}
             *
             * */
            function drawLine(arr, indexOfSeries, color, dotColor,label) {
                coordinate.use(coordinate.getAxisUse(indexOfSeries));
                var points = [],
                isH = coordinate.x.model.rotate == 90 && coordinate.y.model.rotate == 0;

                //put all points in the point array, ignore some missing points
                if (util.isArray(arr)) {
                    arr.forEach(function (d, i) {
                        var key, value, point,icon,color;
                        if (util.isObject(d)) {
                            value = d.data;
                            label = label || self.labels[i];
                            key = d.name;
                            icon = d.icon;
                            color = d.color;
                        } else {
                            value = d;
                            key = i;
                        }
                        if(value===undefined || value===null || isNaN(value)){
                            return;
                        }
                        point = pointBindModel(key, value);
                        point.label = label;
                        point.icon = icon;
                        point.color = color;
                        points.push(point);
                    });
                } else {
                    //arr is object
                    for (var o in arr) {
                        var value = arr[o];
                        if (value === undefined || value === null || isNaN(value)) {
                            continue;
                        }
                        var point = pointBindModel(o, value)
                        point.label = label;
                        points.push(point);
                    }
                }

                if (!points.length) {
                    //no point ,return
                    elements.push({});
                    return;
                }

                //sort by xAxis to avoid wrong order
                points.sort(function (a, b) {
                    if(isH){
                        return b.y - a.y;
                    }
                    return a.x - b.x;
                });
                var pathString,             //path string of the line
                areaPathString,         //path string of the area
                pathAnimateString,      //path string of the line animation
                areaPathAnimateString;  //path string of the area animation

                //if points.length <=2 , draw straight line
                points.length <= 2 && (lineOpt.smooth = false);

                function path() {
                    coordinate.use(coordinate.getAxisUse(indexOfSeries));
                    if (lineOpt.smooth) {
                        //draw smooth line
                        var x, y,
                        i, l,
                        x0, y0, x1, y1,
                        p;

                        //start point
                        pathString = [ 'M' , points[0].x , points[0].y, 'C', points[0].x, points[0].y];
                        areaPathString = ['M', points[0].x, coordinate.y.model.beginY, 'V', points[0].y, 'C', points[0].x, points[0].y];
                        lineOpt.beginAnimate && (pathAnimateString = ['M', points[0].x, coordinate.y.model.beginY]);
                        lineOpt.beginAnimate && (areaPathAnimateString = ['M', points[0].x, coordinate.y.model.beginY]);

                        for (i = 1, l = points.length - 1; i < l; i++) {
                            //calculate the path string use the current point , previous point and the next point
                            x0 = points[i - 1].x;
                            y0 = points[i - 1].y;
                            x = points[i].x;
                            y = points[i].y;
                            x1 = points[i + 1].x;
                            y1 = points[i + 1].y;


                            p = getAnchors(x0, y0, x, y, x1, y1);
                            pathString.push(p.x1, p.y1, x, y, p.x2, p.y2);
                            areaPathString.push(p.x1, p.y1, x, y, p.x2, p.y2);
                            lineOpt.beginAnimate && pathAnimateString.push('H', x) && areaPathAnimateString.push('H', x);
                        }
                        //push the last point
                        pathString.push(x1, y1, x1, y1);
                        areaPathString.push(x1, y1, x1, y1, 'V', coordinate.y.model.beginY, 'H', points[0].x, 'Z');
                        lineOpt.beginAnimate && pathAnimateString.push('H', x1);

                    } else {
                        //straight line and is simpler than the smooth line

                        //start point
                        pathString = ['M', points[0].x, points[0].y];
                        areaPathString = ['M', points[0].x, coordinate.y.beginY, 'V', points[0].y]
                        lineOpt.beginAnimate && (pathAnimateString = ['M', points[0].x, coordinate.y.model.beginY]);
                        lineOpt.beginAnimate && (areaPathAnimateString = ['M', points[0].x, coordinate.y.model.beginY]);

                        points.forEach(function (d) {
                            //push each point to the path string
                            pathString.push('L', d.x, d.y);
                            areaPathString.push('L', d.x, d.y);
                            lineOpt.beginAnimate && pathAnimateString.push('H', d.x);
                            lineOpt.beginAnimate && areaPathAnimateString.push('H', d.x);
                        });

                        //close the path of the area
                        areaPathString.push('V', coordinate.y.model.beginY, 'H', points[0].x, 'Z');
                    }
                }

                path();
                var line ,
                    dots = raphael.set(),
                    area;

                if(lineOpt.lines){
                    line = raphael.path().attr({
                        'stroke-width':lineOpt['line-width'],
                        'stroke':color,
                        'path':pathAnimateString || pathString
                    });
                    if (lineOpt.beginAnimate) {
                        //begin animate
                        line.animate({'path':pathString}, 1000);
                    }
                }

                if (lineOpt.area) {
                    //draw area path
                    area = raphael.path().attr({
                        'stroke-width':0,
                        'path':areaPathAnimateString || areaPathString,
                        'fill':color,
                        'opacity':lineOpt.areaOpacity
                    });
                    if (lineOpt.beginAnimate) {
                        area.animate({'path':areaPathString}, 1000);
                    }
                }

                if (lineOpt.dots) {
                    //draw dots

                    //dot is too large
                    // if(coordinate.x.model.tickWidth/coordinate.x.model.tickSize<4*dotRadius){
                    //     dotRadius = coordinate.x.model.tickWidth/coordinate.x.model.tickSize/4;
                    // }

                    points.forEach(function (d, i) {
                        var icon =(d.icon && self.iconFactory.nativeIcons[d.icon])?self.iconFactory.nativeIcons[d.icon].create(raphael,d.x,d.y,dotRadius *2): self.iconFactory.create(indexOfSeries, d.x, d.y,dotRadius*2),
                        dot = icon.icon.attr({
                            'fill':d.color ||dotColor || colors[i],
                            'stroke':'none'
                        }).hover(
                        //hover event which shows the toolTip and make the dot bigger
                        function (e) {
                            activeDot(this,e);
                        },
                        function (e) {
                            inActiveDot(this,e);
                        }).data('point', d);

                        dot._iconObj = icon;



                        if (lineOpt.beginAnimate) {
                            icon.position(icon.position().x, coordinate.y.model.beginY);
                            icon.animate({'y':d.y}, 1000);
                        }

                        if (lineOpt.dotSelect) {
                            //bind click event which shows the toolTip and make the dot bigger and cancel the effect when click again
                            dot.click(function () {
                                if (!this._selected_) {
                                    this.toolTip(raphael, icon.position().x, icon.position().y, self.options.tooltip.call(self,{
                                        x:d.xTick,
                                        y:d.yTick,
                                        label:d.label
                                    }));
                                    this._selected_ = true;
                                } else {
                                    this._selected_ = false;
                                    this.toolTipHide();
                                }
                            })
                        }

                        //save the dots
                        dots.push(dot);
                    });


                }

                //save the elements
                elements.push({line:line, dots:dots, area:area});

                //bind model
                coordinate.y && coordinate.y.on(function () {
                    var duration = 500;
                    path();
                    line && line.animate({ path:pathString }, duration);
                    dots.forEach(function (dot, i) {
                        dot._iconObj.animate({
                            x:points[i].x,
                            y:points[i].y
                        }, duration);
                    });
                    area && area.animate({ path:areaPathString }, duration);
                });


            }

            function bindLegendEvents() {
                //bind legend click event which toggles the line hide
                self.legend && self.legend.onActiveChange(function(active,activeArray){
                    active.forEach(function (truth, i) {
                        if (truth) {
                            try {
                                elements[i].line && elements[i].line.show();
                                elements[i].dots.show();
                                elements[i].area && elements[i].area.show();
                            } catch (e) {
                            }
                        } else {
                            try {
                                elements[i].line && elements[i].line.hide();
                                elements[i].dots.hide();
                                elements[i].area && elements[i].area.hide();
                            } catch (e) {
                            }
                        }
                    });

                });
            }

            if (data[0]) {
                if (util.isNumber(data[0].data)) {
                    /*
                     * data is Number
                     * and draw totally one line
                     * */

                    drawLine(data, 0, this.colors[0], undefined);
                } else if (util.isArray(data[0].data)) {
                    /*
                     * data is array and series format as :
                     * [{data:[number,...]},...]
                     * draw a line for each item of the series
                     *
                     * */
                    data.forEach(function (item, i) {
                        //item is content of the data,draw a line
                        if(isLineType(i)){
                            drawLine(item.data, i, colors[i], colors[i],self.labels[i]);
                        }else{
                            elements.push({}); //push an empty obj，to prevent index error
                        }
                    });
                    bindLegendEvents();

                } else if(util.isObject(data[0].data)) {
                    /*
                     * data is object and series format as :
                     * [{data:{key:value},...},...]
                     * draw a line for each item of the series
                     * */
                    data.forEach(function (item, i) {
                        // item is content of the data,draw a line
                        if(isLineType(i)){
                            drawLine(item.data, i, colors[i], colors[i],self.labels[i]);
                        }else{
                            elements.push({});
                        }
                    });
                    bindLegendEvents();
                }
                coordinate.useDefault();

                if (lineOpt.area) {
                    //put all the dots to front to avoid covered by area
                    elements.forEach(function (el) {
                        el.dots && el.dots.forEach(function (dot) {
                            dot.toFront();
                        });
                    })
                }
                if (lineOpt.dots && ((lineOpt.hoverRadius && lineOpt.hoverRadius > dotRadius) || lineOpt.columnHover)) {
                    var handler = function(e){
                        var offsetX,offsetY,
                        boundBox,
                        minDot, min ;

                        boundBox = self.stardBox.node.getBoundingClientRect();
                        offsetX = e.clientX - boundBox.left;
                        offsetY = e.clientY - boundBox.top;
                        if (!lineOpt.columnHover) {
                            // active the latest dot
                            elements.forEach(function (element) {
                                element.dots && element.dots.forEach(function (dot) {
                                    var point = dot.data('point'),
                                    distance = Math.sqrt(Math.pow((point.x - offsetX), 2) + Math.pow((point.y - offsetY), 2));
                                    if (dot.node.style.display!=="none" && distance <= lineOpt.hoverRadius && (distance <= min || min === undefined)) {
                                        minDot = dot;
                                        min = distance;
                                    }
                                });
                            });
                            elements.forEach(function (element) {
                                element.dots && element.dots.forEach(function (dot) {
                                    dot !== minDot && inActiveDot(dot);
                                });
                            });
                            minDot && activeDot(minDot,e);
                        }else{
                            //active the latest column dots
                            minDot = [];
                            elements.forEach(function (element) {
                                element.dots && element.dots.forEach(function (dot) {
                                    var point = dot.data('point'),
                                    distance = Math.abs(point.x - offsetX);
                                    if (distance <= coordinate.x.model.tickWidth && (distance < min || min === undefined)) {
                                        minDot = [dot];
                                        min = distance;
                                    } else if (distance == min) {
                                        minDot.push(dot);
                                    }
                                });
                            });
                            elements.forEach(function (element) {
                                element.dots && element.dots.forEach(function (dot) {
                                    minDot.indexOf(dot)==-1 && inActiveDot(dot);
                                });
                            });
                            minDot.forEach(function(dot){
                                activeDot(dot,e);
                            });
                        }
                    }
                    if(document.addEventListener){
                        raphael.canvas.addEventListener('mousemove',handler,false);
                    }else {
                        raphael.canvas.attachEvent('onmousemove',handler);
                    }
                }

            }
        }
    });

})(Venus.SvgChart);

;
(function (undefined) {
    var util = Venus.util;


    /**
     *get sector path string and position parameters
     *@param {Object} options {
        x:coordinate y of sector,
        y:coordinate x of sector,
        r:radius,
        startAngle:,
        endAngle:,
        dir:circle direction,
        rotate:sector rotation
     }
     *@return path and positions
     *@type {Object} an object contain path and positions
     */
    function getSectorPath(options) {
        var opt = options || {}, dir = opt.dir || 1;

        var rad = Math.PI / 180,
            angleOffset = opt.endAngle - opt.startAngle,
            x1, y1, xm, ym, x2, y2, path,xmr,ymr;

        x1 = opt.x + opt.r * Math.cos(dir * opt.startAngle * rad);
        y1 = opt.y + opt.r * Math.sin(dir * opt.startAngle * rad);

        xm = opt.x + opt.r / 2 * Math.cos(dir * (opt.startAngle + angleOffset / 2) * rad);
        xmr = opt.x + opt.r  * Math.cos(dir * (opt.startAngle + angleOffset / 2) * rad);
        ym = opt.y + opt.r / 2 * Math.sin(dir * (opt.startAngle + angleOffset / 2) * rad);
        ymr = opt.y + opt.r  * Math.sin(dir * (opt.startAngle + angleOffset / 2) * rad);

        x2 = opt.x + opt.r * Math.cos(dir * opt.endAngle * rad);
        y2 = opt.y + opt.r * Math.sin(dir * opt.endAngle * rad);

        if (parseInt(opt.hollow, 10) > 0) {
            var xh1, yh1, xh2, yh2;
            xh1 = opt.x + opt.hollow * Math.cos(dir * opt.startAngle * rad);
            yh1 = opt.y + opt.hollow * Math.sin(dir * opt.startAngle * rad);

            xm = opt.x + (opt.hollow + opt.r / 2 - opt.hollow / 2) * Math.cos(dir * (opt.startAngle + angleOffset / 2) * rad);
            ym = opt.y + (opt.hollow + opt.r / 2 - opt.hollow / 2) * Math.sin(dir * (opt.startAngle + angleOffset / 2) * rad);

            xh2 = opt.x + opt.hollow * Math.cos(dir * opt.endAngle * rad);
            yh2 = opt.y + opt.hollow * Math.sin(dir * opt.endAngle * rad);

            path = [
                "M", xh2, yh2,
                "A", opt.hollow, opt.hollow, 0, +(Math.abs(angleOffset) > 180), +(dir * (opt.endAngle - opt.startAngle) < 0), xh1, yh1,
                "L", x1, y1,
                "A", opt.r, opt.r, 0, +(Math.abs(angleOffset) > 180), +(dir * (opt.endAngle - opt.startAngle) > 0), x2, y2,
                "z"
            ];
        } else {
            path = [
                "M", opt.x, opt.y,
                "L", x1, y1,
                "A", opt.r, opt.r, 0, +(Math.abs(angleOffset) > 180), +(dir * (opt.endAngle - opt.startAngle) > 0), x2, y2,
                "z"
            ];
        }

        return {path:path, pos:{xstart:x1, ystart:y1, xmiddle:xm,xMiddleOnBound:xmr, ymiddle:ym,yMiddleOnBound:ymr, xend:x2, yend:y2}};
    }

    /**
     *draw sector and text
     *@param {Object} options {
        x:coordinate y of sector,
        y:coordinate x of sector,
        r:radius, startAngle:,
        endAngle:,
        color:sector fill color,
        d:data of sector,
        callback:animation callback function,
        dir:circle direction,
        rotate:sector rotation
     }
     *@return sector raphael object
     *@type {Object} an object instance of raphael
     */
    function SectorChart(options) {
        var sector,
            text,
            opt = options || {},
            angleOffset = opt.endAngle - opt.startAngle,
            sectorPath = getSectorPath(opt),
            strokeOpt = util.mix({'stroke-width':1, 'stroke':'#dedede', "stroke-linejoin":"round", 'fill':opt.color}, opt.stroke),
            pos;

        if (!opt.animation) {
            sector = Math.abs(angleOffset) === 360 ? opt.paper.circle(opt.x, opt.y, opt.r) : opt.paper.path(sectorPath.path.join(' '));
        } else {
            sector = opt.paper.path().attr({arc:[opt.x, opt.y, opt.r, opt.hollow, opt.startAngle, opt.startAngle, opt.dir]}).animate({arc:[opt.x, opt.y, opt.r, opt.hollow, opt.startAngle, opt.endAngle, opt.dir]}, opt.time || 100, opt.callback);
        }

        opt.color && sector.attr(strokeOpt);

      //  opt.d && (text = Math.abs(angleOffset) === 360 ? opt.paper.text(opt.x, opt.y, opt.d) : opt.paper.text(sectorPath.pos.xmiddle, sectorPath.pos.ymiddle, opt.d)).attr({'font-size':Math.max(Math.round(opt.r / 10), 10)});

      //  opt.animation && opt.d && text.hide();

        pos = sectorPath.pos;
        util.mix(sector, {cx:opt.x, cy:opt.y, mx:pos.xmiddle, mxr:pos.xMiddleOnBound, my:pos.ymiddle, myr:pos.yMiddleOnBound,_data:opt.d,_index:opt.index, text:text,startAngle:opt.startAngle});

        return sector;
    }

    /*
    * function to compute the positions of text
    * @param pos{Object} position of the bound of the sector
    *
    * */

    function textPosition(pos){

    }
    textPosition.rows = {
        left:{},
        right:{}
    }

    function initTexts(s,percents, opt, paper) {
        var rows = {
                0:[], // area 0
                1:[],
                2:[],
                3:[]
            },
            lineHeight = 16,
            maxRow = Math.ceil(opt.r / lineHeight) - 1,
            cx = opt.x,
            cy = opt.y,
            self = this,
            sectors = s.slice(0),
            startSwitch;

        function getArea(x, y) {
            if (x > cx && y < cy) {
                return 0;
            } else if (x > cx && y > cy) {
                return 1;
            } else if (x < cx && y > cy) {
                return 2;
            } else {
                return 3;
            }
        }

        function getPos(area, row) {
            var l = lineHeight * (row + 0.5);
            if (area == 0 || area == 3) {
                return cy - l;
            } else {
                return cy + l;
            }
        }

        sectors.forEach(function (sector,i) {
            var mxr = sector.mxr,
                myr = sector.myr,
                area = getArea(mxr, myr),
                row = Math.floor(Math.abs(myr - cy) / lineHeight);

            if (rows[area][row] !== undefined) {
                // got text on this row
                if (area == 0 || area == 2) {
                    rows[area].splice(row, 0, i);
                } else {
                    if (area == 3 && row == maxRow && mxr > cx - .1 * opt.r) {
                        if (startSwitch === undefined) {
                            //compute the start index to switch to area 0
                            if (sectors.length - i <= rows[3].length - maxRow) {
                                // all switch
                                startSwitch = i;
                            } else {
                                startSwitch = Math.ceil(sectors.length - i - (rows[3].length - maxRow)) / 2 + i;
                            }
                        }
                        if (i >= startSwitch) {
                            //area 3 and in max Row, put the text in area 0
                            rows[0][maxRow + sectors.length - i] = i;
                            return;
                        }
                    }
                    for (var index = row + 1; ; index++) {
                        if (rows[area][index] === undefined) {
                            rows[area][index] = i;
                            break;
                        }
                    }
                }
            } else {
                rows[area][row] = i;
            }
        });

        for (var area in rows) {
            rows[area].forEach(function (index,i) {
                if(index!==undefined){
                    var sector = sectors[index],
                        originIndex = sector._index,
                        label = self.labels[originIndex],
                        percent = percents[originIndex] +"%",
                        span = 30,
                        text = paper.text(sector.mxr, getPos(area, i), label).attr({
                            'font-size':13,
                            'font-weight':'bolder'
                        }),
                        percentText = paper.text(sector.mxr, getPos(area, i), " "+percent).attr({
                            'font-size':13
                        });
                    var width = text.getBBox().width,
                        percentWidth = percentText.getBBox().width+10;

                    text.attr({
                        'x':sector.mxr + (area > 1 ? -(span + percentWidth + width / 2) : +(span + width / 2))
                    });
                    percentText.attr({
                        'x':sector.mxr + (area > 1 ? -(span + percentWidth / 2) : (span + width + percentWidth / 2))
                    });
                    paper.path().attr({
                        path:['M', sector.mxr, sector.myr, 'S', sector.mxr, getPos(area, i), sector.mxr + (area > 1 ? -span : span), getPos(area, i)],
                        "stroke-width":1,
                        "stroke":"#000000"
                    });

                }
            });
        }


    }

    Venus.SvgChart.addChart('pie', {
        draw:function (opt) {
            /*
                initialize chart options
            */
            var chartWidth = this.options.width,
                chartHeight = this.options.height,
                self = this,
                options = util.mix({
                x:chartWidth/ 2,                                //position of the pie center
                y:chartHeight/ 2,
                radius:Math.min(chartWidth, chartHeight) / 2.5, //radius of the p
                duration:900,
                animation:true,
                showText:true,
                rotate:-90,
                dir:1,
                hollow:0,
                stroke:{}
            }, opt);

            if (options.hollow >= options.radius) {
                options.hollow = 0;
            }
            options.r = options.radius;
            delete options.radius;

            /**define variables needed*/
            var series = this.series.getSeries().slice(0).sort(function (a, b) {
                    return b.data - a.data
                }),
                colors = this.colors,
                paper = this.stage,
                data,
                total = 0,
                elements = [],
                percents = [],
                startAngle = options.rotate * options.dir,
                endAngle,
                opts = [], t = 0;

            /**add coustomer attribute*/
            paper.customAttributes.arc = function (x, y, r, hollow, startAngle, endAngle, dir) {
                return {
                    path:getSectorPath({x:x, y:y, r:r, hollow:hollow, startAngle:startAngle, endAngle:endAngle, dir:dir}).path
                };
            };

            /**calculate summation of all data*/
            series.forEach(function(s){
                total+= s.data;
            });


            /**draw each sector chart*/
            series.forEach(function(s,i){
                data = s.data;
                percents.push((data/total*100).toFixed(2));
                endAngle = s.data / total * 360 + startAngle;
                opts.push({
                    startAngle:startAngle,
                    endAngle:endAngle,
                    color:colors[i],
                    d:options.showText && data,
                    time:Math.round(data / total * options.duration),
                    index:i
                });
                startAngle = endAngle;
            });

            opts.forEach(function (item, i) {
                if (options.animation) {
                    switch (options.animation) {
                        case 'simultaneous':
                            t = 0;
                            item.time = Math.max(Math.round(options.duration / opts.length), 400);
                            break;
                        default:
                            i > 0 ? t += opts[i - 1].time : t = 0;
                            break;
                    }
                }

                setTimeout(function () {
                    elements.push(SectorChart(util.mix({
                        paper:paper,
                        callback:function () {
                        this.text && this.text.show();
                    }}, util.mix(options, item))));
                    if (i == opts.length - 1 && options.showText) {
                        //last sector finish
                        //draw texts
                        initTexts.call(self,elements,percents,options,paper);
                    }
                }, t);
            });

            /**
             *bind sector elements event actions
             */
            function bindElementsAction() {
                elements && elements.forEach(function (item) {
                    item.hover(function () {
                        this.stop();
                        this.transform('s1.1,1.1,' + this.cx + ',' + this.cy);

                        // this.transform('t'+(this.mx-this.cx)/5+','+(this.my-this.cy)/5);
                    }, function () {
                        this.animate({
                            transform:'s1,1,' + this.cx + ',' + this.cy
                        }, 500, "bounce");
                    });
                });
            }

            /**
             *bind legends event actions
             */
            function bindLegendsAction() {
                if (!this.legend) {
                    return false;
                }

                this.legend.itemSet.forEach(function (item, i) {
                    var el = elements[i];
                    item.hover(
                        function () {
                            this.rotate(45);

                            el.stop();
                            el.transform('t' + (el.mx - el.cx) / 5 + ',' + (el.my - el.cy) / 5);
                            if (el.text) {
                                el.text.stop();
                                el.text.transform('t' + (el.mx - el.cx) / 5 + ',' + (el.my - el.cy) / 5);
                            }
                        },
                        function () {
                            this.rotate(-45);

                            el.animate({
                                transform:'s1,1,' + el.cx + ',' + el.cy
                            }, 500, "bounce");

                            if (el.text) {
                                el.text.animate({
                                    transform:'t0,0'
                                }, 500, "bounce");
                            }
                        }
                    );
                });

                this.legend.on('click', (function () {
                    var arr = new Array(series.length);
                    return function (e, i) {
                        if (arr[i] == true || arr[i] == undefined) {
                            arr[i] = false;
                            elements[i].attr('opacity', 0).text.attr('opacity', 0);
                        } else {
                            arr[i] = true;
                            elements[i].attr('opacity', 1).text.attr('opacity', 1);
                        }
                    }
                })());
            }

            /**
             *initialize all event actions
             */
            (function (context) {
                setTimeout(function () {
                    bindElementsAction.call(context);
                    bindLegendsAction.call(context);
                }, t);
            })(this);
        }
    });
})();

if (typeof _gaq == "undefined") {
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-36468754-1']);
    _gaq.push(['_trackPageview']);
    var vga = function (key) {
        _gaq.push(['_trackPageview', key || ''])
    }, pageTracker = {_trackPageview:vga};

    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    document.getElementsByTagName('head')[0].appendChild(ga);
}
try {
    pageTracker._trackPageview('venus_svgchart');
} catch (e) {
}