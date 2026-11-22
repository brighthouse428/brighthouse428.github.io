import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const url = "https://elderly-grill-b56.notion.site/Kang-Hyun-Woo-ee06eac458df4dd6885fc52edc08d4ec";
const names=["profile","exhibition","music","video-art","design","education","painting"];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
try {
 await page.goto(url,{waitUntil:"domcontentloaded",timeout:90000});
 await page.waitForTimeout(4000);
 const total=await page.evaluate(()=>document.body.scrollHeight);
 for(let y=0;y<total+1200;y+=650){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(160);}
 await page.waitForTimeout(2200);
 await page.evaluate(()=>window.scrollTo(0,0));
 const imgs=await page.evaluate(()=>Array.from(document.querySelectorAll("img")).map((img,i)=>({
  src:img.currentSrc||img.src, alt:img.alt,
  w:img.naturalWidth,h:img.naturalHeight, index:i,
  block:!!img.closest("[data-block-id]")
 })).filter(x=>x.src && x.src.startsWith("http") && (x.block || (x.w>=320 && x.h>=150)) && !x.src.includes("avatar") && !x.src.includes("emoji")));
 console.log("IMAGE CANDIDATES",JSON.stringify(imgs.map(i=>({w:i.w,h:i.h,src:i.src.slice(0,160)}))));
 if(imgs.length===0) throw Error("No public Notion images found");
 await mkdir("assets/notion",{recursive:true});
 let count=0;const seen=new Set();
 for (const im of imgs){
   if(count>=names.length)break;
   const key=im.src.split("?")[0];
   if(seen.has(key))continue;
   seen.add(key);
   try{
    const response=await page.request.get(im.src,{timeout:45000});
    if(!response.ok())throw Error("HTTP "+response.status());
    const bytes=await response.body();
    const info=await sharp(bytes).metadata();
    if((info.width||0)<280||(info.height||0)<150)continue;
    const out=await sharp(bytes,{animated:false}).rotate().resize({width:1500,withoutEnlargement:true}).webp({quality:82,effort:4}).toBuffer();
    await writeFile("assets/notion/"+names[count]+".webp",out);
    console.log("SAVED",names[count],info.width,info.height,out.length);
    count++;
   }catch(e){console.warn("SKIP",im.src.slice(0,110),String(e));}
 }
 if(count<2)throw Error("Too few images retrieved: "+count);
} finally {await browser.close();}
