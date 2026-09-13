import {test,expect} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const essay='/essays/what-we-owe-to-each-other'
test('narrative, exploration, keyboard evidence, and provenance',async({page})=>{
 await page.goto(essay)
 const figure=page.locator('[data-constellation-study]:visible').first()
 await expect(figure).toHaveAttribute('data-story-state','opening')
 await expect(figure.locator('[data-world-edge][data-revealed=true]')).toHaveCount(1)
 await page.locator('[data-institutional-step="exploration"]').evaluate(el=>window.scrollTo(0,window.scrollY+el.getBoundingClientRect().top-innerHeight*.25))
 await expect(figure).toHaveAttribute('data-story-state','exploration')
 await expect(figure.locator('[data-world-edge][data-revealed=true]')).toHaveCount(31)
 const node=figure.locator('[data-institution="anthropic"]')
 await expect(node).toBeEnabled();await node.focus();await page.keyboard.press('Enter')
 await expect(page.getByRole('dialog',{name:'Anthropic evidence'})).toBeVisible()
 await page.keyboard.press('Escape');await expect(node).toBeFocused()
 await node.click();await page.getByRole('dialog',{name:'Anthropic evidence'}).getByRole('link').first().click()
 await expect(page.locator('h1')).toBeVisible()
 await expect(page.getByText('Atomic evidence',{exact:false}).first()).toBeVisible()
})
test('essay and evidence have no axe violations',async({page})=>{
 for(const url of [essay,'/institutional-links','/institutional-links/dod-anthropic-contested']){
  await page.goto(url)
  const result=await new AxeBuilder({page}).analyze()
  expect(result.violations).toEqual([])
 }
})
for(const [width,height] of [[1440,900],[1280,800],[1024,768],[1180,820],[768,1024],[820,1180],[390,844],[430,932],[320,568],[844,390]]){
 test(`responsive reading and evidence ${width}×${height}`,async({page})=>{
  await page.setViewportSize({width,height});await page.goto(essay)
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  await page.screenshot({path:`/tmp/cepheus-shots/${width}-opening.png`})
  await page.locator('#cepheus-map').evaluate(el=>window.scrollTo(0,scrollY+el.getBoundingClientRect().top-100))
  const figures=page.locator('[data-constellation-study]:visible');const f=width>=700&&height>=700?figures.first():page.locator('[data-constellation-study][data-story=false]:visible').last()
  await expect(f).toHaveAttribute('data-story-state','exploration')
  await expect(f.locator('[data-world-edge][data-revealed=true]')).toHaveCount(31)
  for(const node of await f.locator('[data-institution]').all()){
   const box=await node.boundingBox();expect(box!.width).toBeGreaterThanOrEqual(44);expect(box!.height).toBeGreaterThanOrEqual(44)
  }
  await page.screenshot({path:`/tmp/cepheus-shots/${width}-explore.png`})
  await f.locator('[data-institution="anthropic"]').click()
  await expect(page.getByRole('dialog',{name:'Anthropic evidence'}).getByRole('link').first()).toBeVisible()
  await page.screenshot({path:`/tmp/cepheus-shots/${width}-card.png`})
  const result=await new AxeBuilder({page}).include('[data-constellation-study]').analyze();expect(result.violations).toEqual([])
 })
}
test('all footnotes return focus to their exact reference',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(essay)
 await expect(page.locator('sup a')).toHaveCount(8)
 for(let n=1;n<=8;n++){
  await page.locator(`#footnote-ref-${n}`).click();await page.getByRole('dialog',{name:`Note ${n}`,exact:true}).getByRole('link',{name:'View in Notes →'}).click();await expect(page).toHaveURL(new RegExp(`#footnote-${n}$`));await expect(page.locator(`#footnote-${n}`)).toBeFocused()
  await page.locator(`#footnote-${n} a[href="#footnote-ref-${n}"]`).click();await expect(page.locator(`#footnote-ref-${n}`)).toBeFocused()
 }
})
test('reverse scrolling, deep reload, rotation and history',async({page})=>{
 await page.goto(essay+'#what-do-we-owe-to-each-other')
 const figure=page.locator('[data-story=true]');await expect(figure).toHaveAttribute('data-story-state','exploration')
 await page.reload();await expect(figure).toHaveAttribute('data-story-state','exploration')
 await page.locator('[data-institutional-step="interfaces"]').evaluate(el=>window.scrollTo(0,scrollY+el.getBoundingClientRect().top-150));await expect(figure).toHaveAttribute('data-story-state','interfaces')
 await page.setViewportSize({width:768,height:1024});await expect(figure).toBeVisible()
 await page.setViewportSize({width:1024,height:768});await expect(figure).toBeVisible()
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(essay+'#footnote-1');await expect(page.locator('#footnote-1')).toBeVisible()
 await page.goBack();await expect(page.locator('#first-collision')).toBeAttached()
})
test('evidence index is available without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('/institutional-links');await expect(page.getByText('Published analytical assessments')).toBeVisible();await context.close()
})
test('public languages share the research story and evidence',async({page})=>{
 for(const locale of ['ru','ko','fr','zh-CN']){
  await page.goto(`/${locale}${essay}`)
  await expect(page.locator('[data-institutional-step]')).toHaveCount(6)
  await expect(page.locator('.language-picker option')).toHaveCount(5)
  await expect(page.locator('[data-story=true]')).toHaveAttribute('data-story-state','opening')
  await expect(page.locator('[data-story=true] [data-world-edge][data-revealed=true]')).toHaveCount(1)
 }
})

test('note cards preview without scrolling and support hover, touch and keyboard',async({page})=>{
 await page.goto(essay)
 const ref=page.locator('#footnote-ref-1')
 await ref.scrollIntoViewIfNeeded()
 const before=await page.evaluate(()=>scrollY)
 await ref.hover()
 const card=page.getByRole('dialog',{name:'Note 1',exact:true})
 await expect(card).toBeVisible()
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(before)
 await card.hover();await expect(card).toBeVisible()
 await page.keyboard.press('Escape');await expect(card).toBeHidden();await expect(ref).toBeFocused()
 await ref.press('Enter');await ref.press('Tab');await expect(card.getByRole('button',{name:'Close note 1'})).toBeFocused()
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([])
 await card.getByRole('link',{name:'View in Notes →'}).focus();await page.keyboard.press('Tab')
 await expect(card).toBeHidden()
 expect(await page.evaluate(()=>document.activeElement!==document.body&&!!(document.querySelector('#footnote-ref-1')!.compareDocumentPosition(document.activeElement!)&Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true)
 await page.keyboard.press('Escape')
 await page.setViewportSize({width:390,height:844})
 await ref.scrollIntoViewIfNeeded();const mobileY=await page.evaluate(()=>scrollY)
 await ref.click();await expect(card).toBeVisible();await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(mobileY)
 const box=await card.boundingBox();expect(box!.x).toBeGreaterThanOrEqual(12);expect(box!.x+box!.width).toBeLessThanOrEqual(378)
 await page.screenshot({path:'/tmp/cepheus-note-card-mobile.png'})
 await card.getByRole('button',{name:'Close note 1'}).click();await expect(card).toBeHidden();await expect(ref).toBeFocused()
})

test('touch opens a note in place and outside tap dismisses it',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'})
 const page=await context.newPage();await page.goto(essay)
 const ref=page.locator('#footnote-ref-7');await ref.scrollIntoViewIfNeeded()
 const y=await page.evaluate(()=>scrollY);await ref.tap()
 await expect(page.getByRole('dialog',{name:'Note 7',exact:true})).toBeVisible()
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(y)
 await page.touchscreen.tap(2,2)
 await expect(page.getByRole('dialog')).toBeHidden();await context.close()
})
