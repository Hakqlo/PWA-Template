import {init as basicInit} from "./baseFunctions";
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import anime from 'animejs/lib/anime.es.js';
//import '../node_modules/dialog-polyfill/dist/dialog-polyfill.css';
import '../css/main.scss';
import '../css/main_in_install_page.scss';
/*
this file name is so wierd btw
lmao
I was struggling naming this file 

this script is for doing main task in install.html,

install.js is for interacting with service worker 
and which is called everytime in index.html
*/

basicInit(window);
/*background animation*/
const canvas = document.querySelector('canvas');
const fitCanvasToScreen = () =>{
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
}
fitCanvasToScreen();
window.addEventListener('resize',e=>{
  fitCanvasToScreen();
  drawMain();
})
const ctx = canvas.getContext('2d');
let backGradVectorYPos = {
  vStart: 0,
  vEnd: canvas.height*3,
};
let animateStarted = false;
const drawMain = () =>{
  ctx.beginPath();
  const backgroundGradient = ctx.createLinearGradient(0,backGradVectorYPos.vStart, canvas.width,backGradVectorYPos.vEnd);
  backgroundGradient.addColorStop(0, 'black');
  backgroundGradient.addColorStop(1/3, 'rgb(10, 15, 85)');
  backgroundGradient.addColorStop(2/3, 'rgb(18, 104, 218)');
  backgroundGradient.addColorStop(1, 'rgb(248, 102, 253)');
  ctx.fillStyle = backgroundGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.closePath();
}
const maxParticleRad = Math.min(canvas.width,canvas.height)*0.08;
class BackAnimatingParticle{
  constructor(){
    this.x = Math.random()*canvas.width;
    this.y = canvas.height + Math.random()*canvas.height;
    this.radius = Math.random()*maxParticleRad+1;
    this.color = `rgba(255, 255, 255, ${(1-this.radius/maxParticleRad)**2})`;
    const v = this.radius*0.3;
    this.xVel = v*Math.random()*0.5;
    this.yVel = v*Math.random()*0.5+0.5;
  }
  
  draw(){
    //const v = this.radius*0.5;
    this.x -= this.xVel;
    this.y -= this.yVel;
    if(this.x<=-this.radius)this.x=canvas.width+this.radius;
    if(this.y<=-this.radius)this.y=canvas.height+this.radius;
    //ctx.filter = `blur(${this.radius*0.3}px)`
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    ctx.fill();
    ctx.filter = 'none';
    ctx.closePath();
    
  }
}
drawMain();
let particleList = [];
const animateAllParticles = ()=>{
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawMain();
  particleList.forEach(v=>v.draw());
  
  requestAnimationFrame(animateAllParticles);
}

for(let i=0;i<30;i++){
  particleList.push(new BackAnimatingParticle());
}
window.onappinstalled=()=>location.href="./index.html";
//console.log(require('../icon/ios-safari-share-icon.svg'));
//console.log('test');
let installApp = () =>{
  if ('serviceWorker' in navigator) {
    //navigator.serviceWorker.register('./sw.js')
    runtime.register().then(function() {
      console.log('sucsessed');
      
      //location.href+="/pwa.html";
    }).catch(function(err) {
      console.log('error:', err);
    });
    //make an install button (or installPWA function for terminal maybe?)
    const installButton = document.querySelector("#install_button");
    //installButton.innerText = "install";
    //document.body.appendChild(installButton);
    //showInstallPrompt is a function 
    installButton.addEventListener('click', () => {
      document.body.classList.add('install_pressed');
      if(!animateStarted){
        animateStarted=true;
        requestAnimationFrame(animateAllParticles);
        anime({
          targets: backGradVectorYPos,
          duration: 1500,
          //round: 1,
          vStart: [0,-canvas.height*2],
          vEnd: [canvas.height*3,canvas.height],
          easing: 'easeInOutSine',
        })
      }
      
    });
    if ("onbeforeinstallprompt" in window) {
      window.addEventListener("beforeinstallprompt", e => {
        e.preventDefault();
        installButton.addEventListener('click', () => {
          if (!e.prompt) {
            popup("didn't you already install the App?", []);
          }
          e.prompt().then(r=>console.log(r));
        })
      })
    } else if (true) {
      //show a prompt exaplaining how to install(in IOS safari)
      installButton.addEventListener('click', () => {
        popup("Install", [
          "You can install Hakqlo App by adding this website to your home screen.",
          createElementFromHTML(`
              <ol>
              <li><div style='background-color: rgba(60, 138, 255, 0.911);
              -webkit-mask: url(${require('../icon/ios-safari-share-icon.svg').default}) no-repeat center;
              mask: url(${require('../icon/ios-safari-share-icon.svg').default}) no-repeat center;width: 28px;
              height: 28px;'></div> press share button</li><li><div style='background-color: white;
            -webkit-mask: url(${require('../icon/ios-safari-add-to-home-icon.svg').default}) no-repeat center;
            mask: url(${require('../icon/ios-safari-add-to-home-icon.svg').default}) no-repeat center;width: 28px;
            height: 28px;'></div> then press 'add to home' button</li></ol>
        `)]).catch(e => console.warn(e))
      })
      /*

      popup("インストール",[
          "ホーム画面に追加することでインストールが出来ます。",
          createElementFromHTML(`
            <ol>
            <li><div style='background-color: rgba(60, 138, 255, 0.911);
            -webkit-mask: url(./icon/ios-safari-share-icon.svg) no-repeat center;
            mask: url(./icon/ios-safari-share-icon.svg) no-repeat center;width: 28px;
            height: 28px;'></div> 共有ボタンを押して、</li><li><div style='background-color: white;
          -webkit-mask: url(./icon/ios-safari-add-to-home-icon.svg) no-repeat center;
          mask: url(./icon/ios-safari-add-to-home-icon.svg) no-repeat center;width: 28px;
          height: 28px;'></div> ホームに追加ボタンを押す。</li></ol>
      `)]).then(res=>console.log(res)).catch(e=>console.warn(e))
      */

    }
  }else console.log('service worker not supported on your browser')
}
installApp();