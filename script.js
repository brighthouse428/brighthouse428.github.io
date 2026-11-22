(()=>{
const data=window.BH_DATA||{projects:[]};const q=s=>document.querySelector(s);let lang="ko",filter="All";
const esc=s=>String(s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const image=(src,alt,loading="lazy")=>'<img src="'+esc(src)+'" alt="'+esc(alt)+'" loading="'+loading+'" onerror="this.closest(\'.work-image\')?.classList.add(\'no-image\');this.style.visibility=\'hidden\'">';
function render(){
 const items=data.projects.filter(x=>filter==="All"||x.category===filter);
 q("#workGrid").innerHTML=items.map((p,i)=>'<button type="button" class="work-card" data-project="'+esc(p.id)+'"><div class="work-image">'+image(p.cover||"assets/notion/music.webp",p.title)+'</div><div class="work-info"><div><h3>'+esc(p.title)+'</h3><p>'+esc(p.kind)+' / '+esc(p.year)+'</p></div><span class="project-number">'+String(i+1).padStart(2,"0")+'</span></div></button>').join("");
 q("#workGrid").querySelectorAll(".work-card").forEach(b=>b.addEventListener("click",()=>openProject(b.dataset.project)));
}
function youtubeId(url){const m=String(url||"").match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);return m?.[1]||null}
function openProject(id){
 const p=data.projects.find(x=>x.id===id);if(!p)return;
 q("#dialogTitle").textContent=p.title;q("#dialogMeta").textContent=(p.category||"")+" / "+(p.year||"");
 q("#dialogSubtitle").textContent=p.subtitle||"";
 q("#dialogDescription").textContent=(lang==="ko"?p.descriptionKo:p.descriptionEn)||p.descriptionKo||"";
 q("#dialogCredits").textContent=p.credit||"";
 q("#dialogVisual").innerHTML='<img src="'+esc(p.cover||"assets/notion/music.webp")+'" alt="'+esc(p.title)+'">';
 const yt=youtubeId(p.videoUrl);let html="";
 if(yt)html+='<a class="dialog-link" href="https://www.youtube.com/watch?v='+yt+'" target="_blank" rel="noopener noreferrer">WATCH VIDEO ↗</a>';
 if(p.externalUrl)html+='<a class="dialog-link" href="'+esc(p.externalUrl)+'" target="_blank" rel="noopener noreferrer">PROJECT LINK ↗</a>';
 q("#dialogLinks").innerHTML=html;
 q("#projectDialog").showModal();document.body.classList.add("modal-open");
}
q("#dialogClose")?.addEventListener("click",()=>q("#projectDialog").close());
q("#projectDialog")?.addEventListener("close",()=>{document.body.classList.remove("modal-open");q("#dialogVisual").innerHTML=""});
q("#projectDialog")?.addEventListener("click",e=>{if(e.target===q("#projectDialog"))q("#projectDialog").close()});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-pressed",String(x===b))});render()}));
q("#langBtn")?.addEventListener("click",()=>{lang=lang==="ko"?"en":"ko";document.documentElement.lang=lang;q("#langBtn").textContent=lang==="ko"?"EN":"KR";document.querySelectorAll("[data-ko][data-en]").forEach(el=>el.textContent=el.getAttribute("data-"+lang))});
q("#menuBtn")?.addEventListener("click",()=>{let nav=q(".site-header nav");let open=nav.classList.toggle("open");q("#menuBtn").setAttribute("aria-expanded",String(open))});
document.querySelectorAll(".site-header nav a").forEach(a=>a.addEventListener("click",()=>{q(".site-header nav").classList.remove("open");q("#menuBtn").setAttribute("aria-expanded","false")}));
q("#year").textContent=new Date().getFullYear();render();
})();
