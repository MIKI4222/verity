import {createClient} from 'genlayer-js';
import {studioDevnet} from 'genlayer-js/chains';
import {TransactionHashVariant} from 'genlayer-js/types';
import {z} from 'zod';
export const CONFIG={address:'0xa44D5A557a2B146e6aC5B8c674cA31d540d98175' as const,chainId:'0xf22d',rpc:'https://studio-dev.genlayer.com/api',explorer:'https://explorer-studio-next.genlayer.com/address/0xa44D5A557a2B146e6aC5B8c674cA31d540d98175',txExplorer:'https://explorer-studio-dev.genlayer.com/tx/'};
export type Provider={request:(v:{method:string;params?:unknown[]|object})=>Promise<unknown>;on?:(event:string,fn:(v:unknown)=>void)=>void;removeListener?:(event:string,fn:(v:unknown)=>void)=>void;isMetaMask?:boolean;providers?:Provider[]};
declare global{interface Window{ethereum?:Provider}}
export const client=createClient({chain:studioDevnet});
const claimSchema=z.object({claim_id:z.number(),owner:z.string(),claim:z.string(),category:z.string(),instructions:z.string(),expected_facts:z.array(z.string()),min_sources:z.number(),max_sources:z.number(),external_ref:z.string(),expires_at:z.number(),expired:z.boolean(),source_count:z.number(),status:z.string(),assessment_count:z.number(),created_at:z.string(),updated_at:z.string()});
const sourceSchema=z.object({position:z.number(),source_url:z.string(),source_type:z.string(),description:z.string(),added_at:z.string()});
const factSchema=z.object({fact:z.string(),status:z.string(),supporting_sources:z.array(z.number()),contradicting_sources:z.array(z.number()),mentioned_by:z.array(z.number()),independent_support_groups:z.number(),independent_contradiction_groups:z.number()});
const sourceResultSchema=z.object({source_index:z.number(),url:z.string(),source_type:z.string(),access_status:z.string(),relevance:z.string(),evidence_result:z.string(),evidence_excerpt:z.string(),excerpt_verified:z.boolean(),facts:z.array(z.string()),key_findings:z.array(z.string()),limitations:z.array(z.string()),possible_dependency:z.string()});
const historySchema=z.object({assessment_number:z.number(),previous_assessment:z.number(),kind:z.string(),overall_status:z.string(),evidence_strength:z.string(),confidence:z.number(),source_count:z.number(),observed_at:z.string()});
const assessmentSchema=historySchema.extend({claim_id:z.number(),claim_summary:z.string(),evidence_set:z.array(z.string()),source_results:z.array(sourceResultSchema),fact_results:z.array(factSchema),source_relationships:z.array(z.object({a:z.number(),b:z.number(),relation:z.string()})),supporting_findings:z.array(z.string()),contradictory_findings:z.array(z.string()),unverified_aspects:z.array(z.string()),limitations:z.array(z.string()),requested_by:z.string()});
export type Claim=z.infer<typeof claimSchema>;export type Source=z.infer<typeof sourceSchema>;export type Assessment=z.infer<typeof assessmentSchema>;export type History=z.infer<typeof historySchema>;
const cache=new Map<string,{value:unknown;time:number}>();const inflight=new Map<string,Promise<unknown>>();let epoch=0;
export function clearCache(){epoch++;cache.clear();inflight.clear()}
async function read(name:string,args:number[]=[],fresh=false){const key=JSON.stringify([name,args]);if(!fresh){const c=cache.get(key);if(c&&Date.now()-c.time<30000)return c.value;const p=inflight.get(key);if(p)return p}const e=epoch;const promise=client.readContract({address:CONFIG.address,functionName:name,args,transactionHashVariant:TransactionHashVariant.LATEST_FINAL});if(!fresh)inflight.set(key,promise);try{const val=await promise;if(e===epoch)cache.set(key,{value:val,time:Date.now()});return val}finally{if(inflight.get(key)===promise)inflight.delete(key)}}
export async function count(fresh=false){return z.number().int().nonnegative().parse(await read('get_claim_count',[],fresh))}
export async function getClaim(id:number,fresh=false){return claimSchema.parse(await read('get_claim',[id],fresh))}
export async function getSources(id:number,fresh=false){return z.array(sourceSchema).parse(await read('get_evidence_sources',[id],fresh))}
export async function getHistory(id:number){return z.array(historySchema).parse(await read('get_assessment_history',[id]))}
export async function getAssessment(id:number,n?:number){return assessmentSchema.parse(await read(n?'get_assessment':'get_latest_assessment',n?[id,n]:[id]))}
export function walletClient(provider:Provider,account:`0x${string}`){return createClient({chain:studioDevnet,account,provider:provider as NonNullable<Parameters<typeof createClient>[0]>['provider']})}
export const categories=['CODE_FEATURE','CERTIFICATION','COMPATIBILITY','DELIVERABLE','COMPLIANCE','TECHNICAL_CAPABILITY','OTHER'];
export const sourceTypes=['GITHUB_REPOSITORY','TECHNICAL_DOCUMENTATION','OFFICIAL_WEBSITE','PUBLIC_REPORT','CERTIFICATION_RECORD','RESEARCH_PUBLICATION','OTHER'];
export const label=(s:string)=>s.replaceAll('_',' ').toLowerCase().replace(/^./,c=>c.toUpperCase());
export const short=(s:string)=>s.length>18?s.slice(0,8)+'…'+s.slice(-6):s;
export const date=(s:string)=>{const d=new Date(s);return isNaN(d.valueOf())?s:d.toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'})};
export const errorMessage=(e:unknown)=>e instanceof Error?e.message:typeof e==='object'&&e!==null&&'message' in e?String(e.message):String(e);
export const same=(a:string,b:string)=>!!a&&a.toLowerCase()===b.toLowerCase();
export function safeURL(url:string){try{const x=new URL(url);return ['https:','http:'].includes(x.protocol)&&!x.username&&!x.password?x.href:undefined}catch{return undefined}}
