import {test,expect,type Locator} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function expectAligned(graph:Locator) {
 const errors=await graph.evaluate(root=>{
  const failures:string[]=[]
  for(const node of Array.from(root.querySelectorAll('.react-flow__node'))){
   const port=node.querySelector('[data-circle-port]')?.getBoundingClientRect()
   const label=node.querySelector('[data-institution-label]')?.getBoundingClientRect()
   if(port&&label&&Math.abs(port.y-(label.y+label.height/2))>1)failures.push(`${node.getAttribute('data-id')}: label off circle axis`)
  }
  for(const edge of Array.from(root.querySelectorAll('[data-world-edge][data-revealed=true]'))){
   const source=root.querySelector(`[data-id="${edge.getAttribute('data-source-institution')}"] [data-circle-port]`)
   const target=root.querySelector(`[data-id="${edge.getAttribute('data-target-institution')}"] [data-circle-port]`)
   if(!source||!target){failures.push('Missing circle port');continue}
   const a=source.getBoundingClientRect(),b=target.getBoundingClientRect()
   for(const path of Array.from(edge.querySelectorAll('path'))){
    const p=path as SVGPathElement,m=p.getScreenCTM();if(!m)continue
    const start=p.getPointAtLength(0).matrixTransform(m),end=p.getPointAtLength(p.getTotalLength()).matrixTransform(m)
    const distance=(point:DOMPoint,box:DOMRect)=>Math.hypot(point.x-box.x,point.y-box.y)
    const error=Math.min(Math.max(distance(start,a),distance(end,b)),Math.max(distance(start,b),distance(end,a)))
    if(error>1)failures.push(`${edge.getAttribute('data-world-edge')}: ${error}px`)
   }
  }
  return failures
 })
 expect(errors).toEqual([])
}

// Acceptance records are intentionally retained for human motion review before promotion.
test.use({video:'on',trace:'on',reducedMotion:'no-preference'})
const route='/map-preview'
const frames=[['desktop',1440,1000],['ipad-landscape',1180,820],['ipad-portrait',820,1180],['phone',390,844]] as const
for(const [name,width,height] of frames){
 test(`study motion acceptance ${name}`,async({page},testInfo)=>{
  test.setTimeout(90000)
  await page.setViewportSize({width,height})
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message))
  await page.goto(route)
  const desktop=width>=700
  const opening=page.locator(`[data-constellation-study][data-story=${desktop?'true':'false'}]`).first()
  if(!desktop)await opening.scrollIntoViewIfNeeded()
  await expect(opening.locator('[data-institution]:enabled')).toHaveCount(2)
  await expect(opening.locator('[data-institution="dod"]')).toBeEnabled()
  await expect(opening.locator('[data-institution="anthropic"]')).toBeEnabled()
  await page.waitForTimeout(1900) // Record initial 1.6s node → edge → caption sequence.
  await expectAligned(opening)
  const openingFrame=await opening.locator('.react-flow').boundingBox()
  for(const id of ['dod','anthropic']){
   const label=await opening.locator(`[data-id="${id}"] [data-institution-label]`).boundingBox()
   expect(label!.x).toBeGreaterThan(openingFrame!.x+20)
   expect(label!.x+label!.width).toBeLessThan(openingFrame!.x+openingFrame!.width-20)
  }
  const curveInside=await opening.locator('[data-traced-interface]').evaluate((el)=>{
   const path=el as SVGPathElement,frame=el.closest('.react-flow')!.getBoundingClientRect(),matrix=path.getScreenCTM()!
   return Array.from({length:41},(_,i)=>path.getPointAtLength(path.getTotalLength()*i/40).matrixTransform(matrix)).every(p=>p.x>frame.left+20&&p.x<frame.right-20&&p.y>frame.top+20&&p.y<frame.bottom-20)
  })
  expect(curveInside).toBe(true)
  await page.screenshot({path:testInfo.outputPath('opening.png')})
  await expect(opening.getByText('Drag to explore · Pinch to zoom',{exact:true})).toBeVisible()
  await expect(opening.getByRole('button',{name:'Zoom in',exact:true})).toHaveCount(0)
  await expect(opening.locator('details').last().locator('p')).toBeHidden()
  const initialCamera=await opening.locator('.react-flow__viewport').getAttribute('style')
  const positions=await opening.locator('.react-flow__node').evaluateAll(nodes=>nodes.map(n=>({id:n.getAttribute('data-id'),transform:(n as HTMLElement).style.transform})))
  for(const state of ['public-decisions','interfaces','technical-knowledge','provenance','exploration']){
   const marker=page.locator(`[data-institutional-step="${state}"]`)
   // Ordinary stepped wheel input records expansion; precise placement reconciles chapter boundaries.
   if(desktop){
    const delta=await marker.evaluate(el=>el.getBoundingClientRect().top-innerHeight*(innerWidth<1000?.62:.4)+8)
    for(let i=0;i<8;i++){await page.mouse.wheel(0,delta/8);await page.waitForTimeout(90)}
    await marker.evaluate(el=>window.scrollTo(0,scrollY+el.getBoundingClientRect().top-innerHeight*(innerWidth<1000?.62:.4)+8))
    await expect(opening).toHaveAttribute('data-story-state',state)
    await expect(opening.locator('.react-flow__viewport')).toHaveAttribute('style',initialCamera!)
    expect(await opening.locator('.react-flow__node').evaluateAll(nodes=>nodes.map(n=>({id:n.getAttribute('data-id'),transform:(n as HTMLElement).style.transform})))).toEqual(positions)
   }else if(state==='exploration')await page.locator('#cepheus-map').scrollIntoViewIfNeeded()
   await page.waitForTimeout(1800) // Observe completed reveal without scrubbing its frames.
   if(['interfaces','provenance','exploration'].includes(state))await page.screenshot({path:testInfo.outputPath(`${state}.png`)})
  }
  const final=desktop?opening:page.locator('[data-constellation-study][data-story=false]').last()
  await expect(final.locator('[data-institution]:enabled')).toHaveCount(15)
  await expect(final.locator('[data-world-edge][data-revealed=true]')).toHaveCount(31)
  const camera=await final.locator('.react-flow__viewport').getAttribute('style')
  await final.locator('[data-institution="anthropic"]').click()
  const card=page.getByRole('dialog',{name:'Anthropic evidence'})
  await expect(card).toBeVisible()
  await card.getByLabel('Documented connection').selectOption('uk-anthropic-evaluation')
  await card.getByRole('button',{name:'Follow connections →'}).click()
  await expect(final.locator('[data-traced-interface="uk-anthropic-evaluation"]')).toBeAttached()
  await page.waitForTimeout(1900)
  await expect(final.locator('[data-institution]:enabled')).toHaveCount(15)
  await expect(final.locator('[data-world-edge][data-revealed=true]')).toHaveCount(31)
  await expect(final.locator('.react-flow__viewport')).toHaveAttribute('style',camera!)
  await expectAligned(final)
  await page.screenshot({path:testInfo.outputPath('follow.png')})
  await final.getByRole('group').first().focus();await page.keyboard.press('+');await page.waitForTimeout(250)
  const zoomed=await final.locator('.react-flow__viewport').getAttribute('style');expect(zoomed).not.toBe(camera)
  const pane=final.locator('.react-flow__pane');const bounds=await pane.boundingBox()
  await page.mouse.move(bounds!.x+30,bounds!.y+30);await page.mouse.down();await page.mouse.move(bounds!.x+65,bounds!.y+55,{steps:12});await page.mouse.up()
  const panned=await final.locator('.react-flow__viewport').getAttribute('style')
  expect(panned).not.toBe(zoomed)
  await expectAligned(final)
  await final.getByRole('group').first().focus();await page.keyboard.press('Escape')
  await expect(final.locator('.react-flow__viewport')).toHaveAttribute('style',panned!)
  await page.keyboard.press('0')
  await page.screenshot({path:testInfo.outputPath('overview.png')})
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([])
  expect(errors).toEqual([])
 })
}
test('reduced motion and keyboard keep study evidence usable',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(route+'#cepheus-map')
 const graph=page.locator('[data-constellation-study][data-story=true]')
 await expect(graph).toHaveAttribute('data-story-state','exploration')
 const node=graph.locator('[data-institution="anthropic"]');await node.focus();await node.press('Enter')
 const card=page.getByRole('dialog',{name:'Anthropic evidence'});await expect(card).toBeVisible()
 await node.press('Tab');await expect(card.getByRole('button',{name:'Read about Anthropic'})).toBeFocused()
 await page.keyboard.press('Escape');await expect(node).toBeFocused();await expect(card).toBeHidden()
 await graph.getByRole('group').first().focus();await page.keyboard.press('+');await page.keyboard.press('0')
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([])
})
