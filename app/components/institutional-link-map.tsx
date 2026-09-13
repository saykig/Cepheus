'use client'

import { useEffect, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import type { Locale } from '../lib/i18n'
import { scrollToEssayTarget } from './essay-scroll'

const Constellation = dynamic(() => import('./editorial-map-preview').then(m => m.EditorialMapPreview))

export function ConstellationSession({children}:{children:ReactNode}){
 useEffect(()=>{
  let cancelled=false;let frame=0
  // WebKit can restore a fragment before the streamed body/fonts have settled.
  // Reconcile only a failed top-of-page restoration, never an intentional scroll.
  const reconcile=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(cancelled||scrollY>1||!location.hash)return;let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return};scrollToEssayTarget(id)})}
  void document.fonts.ready.then(()=>{if(!cancelled)reconcile()})
  window.addEventListener('pageshow',reconcile)
  return()=>{cancelled=true;cancelAnimationFrame(frame);window.removeEventListener('pageshow',reconcile)}
 },[])
 return <>{children}</>}
export function InstitutionalLinkMap(props: {locale?:Locale;story?:boolean;initialStep?:number}) {
 return <Constellation {...props} />
}
