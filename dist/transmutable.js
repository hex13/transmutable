!function(t,n){for(var e in n)t[e]=n[e]}(exports,function(t){function n(o){if(e[o])return e[o].exports;var s=e[o]={i:o,l:!1,exports:{}};return t[o].call(s.exports,s,s.exports,n),s.l=!0,s.exports}var e={};return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:o})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=5)}([function(t,n,e){"use strict";const{createMutation:o}=e(1);t.exports=function(t,n){const e=(t,s=[])=>{const i=()=>"function"==typeof t?t():t;return new Proxy(i(),{get:(t,r)=>{const u=i()[r];return u&&"object"==typeof u?e(u,s.concat(r)):"function"==typeof u?function(...t){n.set(o(s,void 0,r,t))}:u},set:(t,e,i)=>{const r=[];for(let t=0;t<s.length+1;t++)r.push(s[t]||e);return n.set(o(r,i)),!0}})};return e(t)}},function(t,n,e){"use strict";t.exports={getMutationPath:function(t){return t.path},getMutationValue:function(t){return t.value},createMutation:function(t,n,e,o){return e?{type:e,path:t,value:n,args:o}:{type:"set",path:t,value:n}},getMutationType:function(t){return t.type},getMutationArgs:function(t){return t.args}}},function(t,n,e){"use strict";const o=e(0);t.exports=((t,n)=>{const e=[];return n(o(()=>t,{set:t=>{e.push(t)}})),e})},function(t,n,e){"use strict";function o(t,n){for(let e=0;e<n.length;e++){const o=n[e];if(!o)break;const s=f(o);switch(s){case"set":r(t,c(o),a(o));break;default:i(t,c(o))[s](...h(o))}}}function s(t,n){const e=(t,o=[])=>{if(!function(t,n,e){for(let e=0;e<t.length;e++){const o=c(t[e]),s=Math.min(o.length,n.length);let i=!0;for(let t=0;t<s;t++)if(o[t]!==n[t]){i=!1;break}if(i)return!0}return!1}(n,o))return t;let s;s=Array.isArray(t)?t.slice():{};for(let n in t)if(t[n]&&"object"==typeof t[n]){const i=new Array(o.length+1);for(let t=0;t<o.length;t++)i[t]=o[t];i[o.length]=n,s[n]=e(t[n],i)}else s[n]=t[n];return s};return e(t)}const{get:i,set:r}=e(4),u=Symbol(),{getMutationPath:c,getMutationValue:a,getMutationType:f,getMutationArgs:h}=e(1);n.cloneAndApplyMutations=function(t,n,e={}){const h=function(t,n){const e=[],o={};for(let s=n.length-1;s>=0;s--){const h=c(n[s]),m=a(n[s]),l=h.concat(u);("set"!=f(n[s])||i(t,h)!==m&&!0!==i(o,l))&&(e.unshift(n[s]),r(o,l,!0))}return e}(t,n);e.onComputeChanges&&e.onComputeChanges(h);const m=s(t,h);return o(m,h),m},n.applyChanges=o},function(t,n,e){"use strict";n.get=function(t,n){if(!n||!n.length)return t;let e,o=t;for(e=0;o&&e<n.length-1;o=o[n[e++]]);return o?o[n[e]]:void 0},n.set=function(t,n,e){let o,s=t;for(o=0;o<n.length-1;o++)s=s[n[o]]||(s[n[o]]={});s[n[o]]=e}},function(t,n,e){"use strict";function o(t,n={}){this.state$=c(),this.target=t,this.commits=[],this.hooks=n,this.lastCommit=new u,this.nextCommit=new u,this.stage=s(()=>this.target,{set:t=>{this.nextCommit.mutations.push(t)}})}const s=e(0),i=e(2),{cloneAndApplyMutations:r}=e(3),u=e(6),{Stream:c}=e(7),a={Transmutable:{commit(t){if(!(t instanceof u))throw new Error("Wrong argument passed to method Transmutable::commit()")}}};o.prototype.run=function(t){return this.commit(new u(i(this.target,t)))},o.prototype.commit=function(t=this.nextCommit){a.Transmutable.commit(t);const n=this.target;return this.target=r(this.target,t.mutations),this.state$.publish(this.target,n),this.commits.push(t),this.lastCommit=t,this.nextCommit=new u,this.hooks.onCommit&&this.hooks.onCommit(this,t),this.target},o.prototype.reify=function(t){return r(this.target,this.nextCommit.mutations)},o.prototype.observe=function(...t){const n="function"==typeof t[0]?t[0]:t[1],e="function"==typeof t[0]?null:t[0];return this.state$.subscribe(n,e)},o.prototype.fork=function(){const t=new o(this.target);return t.commits=this.commits.slice(),t},o.prototype.merge=function(t){for(let n=0;n<t.commits.length;n++)this.nextCommit.mutations=t.commits[n].mutations,this.commits.includes(t.commits[n])||this.commit()},n.Transmutable=o,n.transform=e(8)},function(t,n,e){"use strict";t.exports=function(t=[],n=[]){this.mutations=t,this.events=n,this.put=(t=>{this.events.push(t)})}},function(t,n,e){"use strict";const{get:o}=e(4);n.Stream=function(){const t=[];return{publish(...n){t.forEach(t=>t(...n))},subscribe(n,e){t.push((t,s)=>{o(s,e)!==o(t,e)&&n(o(t,e))})}}}},function(t,n,e){"use strict";const{cloneAndApplyMutations:o}=e(3),s=e(2);t.exports=((t,n)=>o(t,s(t,n)))}]));