!function(){"use strict";if(!window.Tiler){var a=100,b=function(a,b){var c={};for(var d in a)c[d]=a[d];if(!b)return c;for(d in b)c[d]=b[d];return c},c=function(a,b){return b?c(b,a%b):a},d=function(a,b){for(var c in b)a.style[c]=b[c]};window.Tiler=function(a,e){var f,g=this,h=0,i={},j=0,k=0,l=0,m=null,n=0,o={zoom:!1,constrain:!1,root:document.body,autoStart:!0,scale:1,interval:1e3,events:{click:function(a){},flip:function(a,b,c){}}};if(a=b(o,a),this.interval=a.interval,this.timeout=null,this.events=a.events,this.data=a.data,this.zoom=a.zoom,this.hovered=-1,this.listeners={},a.debug&&console.log(a),f=a.root?a.root instanceof HTMLElement?a.root:document.querySelector(a.root):document.body,!f)throw Error("Invalid Tiler root ["+a.root+"]");if(!this.data||0==this.data.length)throw Error("No data for Tiler ["+a.root+"]");for(this.root=f,this.root.innerHTML="",this.zoom?this.root.classList.add("rmr-zoom"):this.root.classList.remove("rmr-zoom"),this.root.classList.remove("rmr-init"),this.root.classList.contains("rmr-tiler")||this.root.classList.add("rmr-tiler"),this.listeners.mouseleave=this.root.addEventListener("mouseleave",function(a){g.hovered=-1,g.events&&g.events.hover&&g.events.hover(-1,null)}),this.root.innerHTML="",i=window.getComputedStyle(f),j=parseInt(i.width),k=parseInt(i.height),l=c(j,k)/a.scale,this.numberOfTiles=j*k/l/l,this.tilesPerRow=1,this.tilesPerColumn=1,h=0;h<this.numberOfTiles;h++)m=document.createElement("div"),m.className="rmr-container",m.setAttribute("data-tiler",h),m.addEventListener("mouseenter",function(a){g.hovered=a.target.getAttribute("data-tiler"),g.events&&g.events.hover&&g.events.hover(g.hovered,g.data[g.hovered])}),a.constrain&&this.zoom&&(0===h?m.className+=" topleft":h===this.numberOfTiles-1?m.className+=" bottomright":h===j/l-1?(m.className+=" topright",this.tilesPerRow=h+1):h%(j/l)===0&&this.numberOfTiles-h==j/l?m.className+=" bottomleft":h<j/l?m.className+=" top":h>this.numberOfTiles-1-j/l?m.className+=" bottom":h%(j/l)===0?m.className+=" left":h%(j/l)===j/l-1&&(m.className+=" right")),this.tilesPerColumn=this.numberOfTiles/this.tilesPerRow,m.innerHTML='<div class="tile"><section class="rmr-tile-front"><figure></figure></section><section class="rmr-tile-back"><figure></figure></section>',d(m,{width:l+"px",height:l+"px"}),n=Math.floor(Math.random()*this.data.length),m.querySelector(".rmr-tile-front figure").className=this.data[n],n=Math.floor(Math.random()*this.data.length),m.querySelector(".rmr-tile-back figure").className=this.data[n],this.root.appendChild(m);this.listeners.click=this.root.addEventListener("click",function(a){if(g.events&&g.events.click){for(var b=a.target;!b.classList.contains("rmr-container");)b=b.parentNode;g.events.click(parseInt(b.getAttribute("data-tiler"),10),a.target.className)}}),this.root.classList.add("rmr-init"),a.autoStart&&window.setTimeout(function(){arguments[0].toggle()},this.interval,this)},window.Tiler.prototype.positionForIndex=function(a){if(a<0||a>=this.numberOfTiles)throw new Error("invalid index! "+a);var b=parseInt(a/this.tilesPerRow,10),c=a%this.tilesPerRow;return[b,c]},window.Tiler.prototype.destroy=function(){this.root.removeEventListener("click",this.listeners.click),this.root.removeEventListener("mouseleave",this.listeners.mouseleave),this.stop(),this.numberOfTiles=this.tilesPerRow=this.tilesPerColumn=0,this.data=[],this.zoom=!1,this.hovered=-1},window.Tiler.prototype.newTileIndex=function(){var b=this,c=function(){return Math.floor(Math.random()*b.numberOfTiles)},d=c(),e=0,f=this.positionForIndex(d),g=this.hovered>=0?this.positionForIndex(this.hovered):[0,0];if(this.zoom&&this.hovered>=0)do d=c(),f=this.positionForIndex(d),g=this.positionForIndex(this.hovered),e++;while(e<a&&f[0]<=g[0]+1&&f[0]>=g[0]-1&&f[1]<=g[1]+1&&f[1]>=g[1]-1);return d},window.Tiler.prototype.flip=function(){var a=this.root.querySelectorAll(".tile"),b=this.newTileIndex(),c=Math.floor(Math.random()*this.data.length),d=a[b].classList.contains("flipped"),e=d?".rmr-tile-back figure":".rmr-tile-front figure",f=d?".rmr-tile-front figure":".rmr-tile-back figure",g=this.data[c];this.events&&this.events.flip&&this.events.flip(b,a[b].querySelector(e).className,g),a[b].querySelector(f).className=g,a[b].classList.toggle("flipped")},window.Tiler.prototype.stop=function(){this.timeout&&(window.clearTimeout(this.timeout),this.timeout=null)},window.Tiler.prototype.start=function(){this.root&&(this.timeout||(this.flip(),this.timeout=window.setInterval(function(){var a=arguments[0];a.flip()},this.interval,this)))},window.Tiler.prototype.toggle=function(){this.timeout?this.stop():this.start()},window.Tiler.prototype.destroy=function(){this.stop(),this.root.innerHTML="",this.root=null,this.listeners=null,this.events=null,this.data=null,window.clearTimeout(this.timeout),this.timeout=null},window.Tiler.prototype.toString=function(){return"Tiler "+JSON.stringify({root:""+this.root,delay:this.interval,data:this.data})}}}();