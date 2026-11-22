import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const records=[{"name":"profile","block":"756341a2-2554-4a18-94e3-7b6d5eabeb38","file":"c8093550-1cf1-4cf4-bb80-5e851406d439","space":"f9d6a422-57b2-43b6-a444-17727cd52d53","filename":"프로필사진.jpg"},{"name":"exhibition","block":"47059adb-9507-4f8f-8fa3-bbdc4c913ca2","file":"f4235df6-7da4-4d76-b834-657168172a6d","space":"f9d6a422-57b2-43b6-a444-17727cd52d53","filename":"스크린샷_2023-01-25_오후_8.55.56_copy.jpg"},{"name":"music","block":"19aba42c-bb03-4284-9c35-69b79294ab74","file":"61904df4-a685-4fb9-8ece-9f41d6d12dff","space":"f9d6a422-57b2-43b6-a444-17727cd52d53","filename":"2.jpg"},{"name":"video-art","block":"2ae7db75-ace2-4952-bcc5-53364f1c8971","file":"8048df4e-a7c8-497c-b8d7-bfb9f280bebf","space":"f9d6a422-57b2-43b6-a444-17727cd52d53","filename":"3.jpg"},{"name":"design","block":"f052a9a4-60ed-49bf-95d8-d2d9df3f0d03","file":"7f224cb2-3b4c-41c3-8e45-69671087c3cd","space":"f9d6a422-57b2-43b6-a444-17727cd52d53","filename":"4.jpg"},{"name":"education","block":"28749a0d-2c13-478c-a0c7-fed0cd737942","file":"386275dc-dcce-4bed-8912-9a4baec26c2c","space":"f9d6a422-57b2-43b6-a444-17727cd52d53","filename":"5.jpg"},{"name":"painting","block":"3c4a7c59-0c97-4665-9162-755ae47c9446","file":"1f1a747e-d3d1-413d-83f9-17c963f5b565","space":"f9d6a422-57b2-43b6-a444-17727cd52d53","filename":"6.jpg"}];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
let failures=[];
try {
 await page.goto("https://elderly-grill-b56.notion.site/Kang-Hyun-Woo-ee06eac458df4dd6885fc52edc08d4ec",{waitUntil:"domcontentloaded",timeout:60000});
 await mkdir("assets/notion",{recursive:true});
 let count=0;
 for(const item of records){
  const origin="https://s3-us-west-2.amazonaws.com/secure.notion-static.com/"+item.file+"/"+encodeURIComponent(item.filename);
  const proxy="https://elderly-grill-b56.notion.site/image/"+encodeURIComponent(origin)+"?table=block&id="+item.block+"&spaceId="+item.space+"&width=1600&userId=&cache=v2";
  try{
   const response=await page.request.get(proxy,{timeout:40000});
   if(!response.ok())throw Error("HTTP "+response.status());
   const bytes=await response.body();
   const info=await sharp(bytes).metadata();
   const out=await sharp(bytes).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:84}).toBuffer();
   await writeFile("assets/notion/"+item.name+".webp",out);
   console.log("SAVED",item.name,info.width,info.height,out.length);
   count++;
  }catch(e){console.warn("FAILED",item.name,String(e));failures.push(item.name);}
 }
 console.log("IMPORTED",count,"of",records.length);
 if(count===0)throw Error("No original Notion images imported");
} finally {await browser.close();}
