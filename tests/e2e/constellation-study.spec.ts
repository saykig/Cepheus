import {test,expect} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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
  await page.screenshot({path:testInfo.outputPath('opening.png')})
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
  await page.screenshot({path:testInfo.outputPath('follow.png')})
  await final.getByRole('button',{name:'Zoom in',exact:true}).click();await page.waitForTimeout(250)
  const zoomed=await final.locator('.react-flow__viewport').getAttribute('style');expect(zoomed).not.toBe(camera)
  const pane=final.locator('.react-flow__pane');const bounds=await pane.boundingBox()
  await page.mouse.move(bounds!.x+30,bounds!.y+30);await page.mouse.down();await page.mouse.move(bounds!.x+65,bounds!.y+55,{steps:12});await page.mouse.up()
  const panned=await final.locator('.react-flow__viewport').getAttribute('style')
  expect(panned).not.toBe(zoomed)
  await final.getByRole('button',{name:'Return to overview'}).click()
  await expect(final.locator('.react-flow__viewport')).toHaveAttribute('style',panned!)
  await final.getByRole('button',{name:'Fit',exact:true}).click()
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
