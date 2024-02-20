(()=>{"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(t)}function i(t){var i=function(t,i){if("object"!=e(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,"string");if("object"!=e(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==e(i)?i:String(i)}function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,i(r.key),r)}}function r(t,e,i){return e&&n(t.prototype,e),i&&n(t,i),Object.defineProperty(t,"prototype",{writable:!1}),t}var s,o;!function(t){t.INITIALIZED="INITIALIZED",t.ADDED="ADDED",t.PENDING="PENDING",t.READY="READY",t.REMOVED="REMOVED"}(s||(s={})),function(t){t.NONE="NONE",t.RIGHT="RIGHT",t.LEFT="LEFT"}(o||(o={}));class a{constructor(t){this.value=t,this.listeners=[]}subscribe(t){return this.listeners.push(t),{unsubscribe:()=>{this.listeners=this.listeners.filter((e=>e!==t))}}}next(t){this.value=t,this.listeners.forEach((e=>{e(t)}))}getValue(){return this.value}setValue(t){this.value=t}unsubscribeAll(){this.listeners=[]}}function u(t,e){return Math.floor(Math.random()*(e-t+1))+t}var c=function(){function e(i,n,r){t(this,e),this.x=i,this.y=n,this.size=r,this.element$=new a,this.img=new Image,this.img.src="./assets/images/klipartz.png",this.draw()}return r(e,[{key:"draw",value:function(){this.element$.next({type:"image",image:this.img,x:this.x-this.size/2,y:this.y-this.size/2,width:this.size,height:this.size})}},{key:"addSize",value:function(t){this.size+=t,this.draw()}},{key:"setSize",value:function(t){this.size=t,this.draw()}},{key:"getSize",value:function(){return this.size}},{key:"getX",value:function(){return this.x}},{key:"getY",value:function(){return this.y}}]),e}(),l=function(){function e(){t(this,e),this.state$=new a(s.INITIALIZED),this.name="meteorites",this.hit=new a,this.animate$=new a,this.meteorites=[]}return r(e,[{key:"register",value:function(t){this.state$.next(s.ADDED),this.state$.next(s.PENDING),this.controller=t,this.init(),this.animate(),this.state$.next(s.READY)}},{key:"init",value:function(){var t=this;setInterval((function(){t.generateMeteorites()}),1e4),this.knockingMeteorites()}},{key:"animate",value:function(){var t=this;this.subscribeOnFrame=this.controller.frame$.subscribe((function(){t.meteorites.forEach((function(e){if(e.addSize(165/t.controller.targetFps*.2),e.getSize()>150){var i=t.meteorites.findIndex((function(t){return t.getX()===e.getX()&&t.getY()===e.getY()}));t.meteorites.splice(i,1),t.hit.next()}})),t.animate$.next(t.meteorites.map((function(t){return t.element$.getValue()})))}))}},{key:"unRegister",value:function(){this.subscribeOnFrame.unsubscribe(),this.state$.next(s.REMOVED)}},{key:"generateMeteorites",value:function(){for(var t=this,e=u(1,5),i=0;i<e;i++)setTimeout((function(){var e=new c(u(30,t.controller.canvas.width-30),u(30,t.controller.canvas.height-30),30);t.meteorites.push(e)}),u(0,3e3))}},{key:"knockingMeteorites",value:function(){var t=this,e=function(){t.controller.getPlugin("aim").plugin.strike$.subscribe((function(e){var i=e.x,n=e.y,r=e.size/3,s=t.meteorites.find((function(t){var e=t.getX(),s=t.getY(),o=t.getSize(),a=Math.max(e-o/2,Math.min(i,e+o/2)),u=Math.max(s-o/2,Math.min(n,s+o/2));return Math.sqrt(Math.pow(i-a,2)+Math.pow(n-u,2))<=r}));s&&t.meteorites.splice(t.meteorites.indexOf(s),1)}))};if(this.controller.pluginsState$.getValue().aim===s.READY)e();else var i=this.controller.pluginsState$.subscribe((function(t){t.aim===s.READY&&(e(),i.unsubscribe())}))}}]),e}();window.MeteoriteLayer=l})();