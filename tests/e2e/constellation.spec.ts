import {test,expect} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const essay='/essays/what-we-owe-to-each-other'
test('narrative, exploration, keyboard evidence, and provenance',async({page})=>{
 await page.goto(essay)
 const figure=page.locator('[data-constellation]:visible').first()
 await expect(figure).toHaveAttribute('data-story-state','opening')
 await expect(figure.locator('[data-relationship-path]')).toHaveCount(1)
 await page.locator('[data-institutional-step="exploration"]').evaluate(el=>window.scrollTo(0,window.scrollY+el.getBoundingClientRect().top-innerHeight*.25))
 await expect(figure).toHaveAttribute('data-story-state','exploration')
 await expect(figure.locator('[data-relationship-path]')).toHaveCount(0)
 const node=figure.locator('[data-institution="anthropic"]')
 await node.focus();await page.keyboard.press('Enter')
 await expect(figure.getByRole('region',{name:'Anthropic evidence'})).toBeVisible()
 await page.keyboard.press('Escape');await expect(node).toBeFocused()
 await node.click();await figure.getByRole('link',{name:'View evidence →'}).click()
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
  const figures=page.locator('[data-constellation]:visible');const f=width>=1000&&height>=700?figures.first():page.locator('[data-constellation][data-story=false]:visible').last()
  await expect(f).toHaveAttribute('data-story-state','exploration')
  await expect(f.locator('[data-relationship-path]')).toHaveCount(0)
  for(const node of await f.locator('[data-institution]').all()){
   const box=await node.boundingBox();expect(box!.width).toBeGreaterThanOrEqual(44);expect(box!.height).toBeGreaterThanOrEqual(44)
  }
  await page.screenshot({path:`/tmp/cepheus-shots/${width}-explore.png`})
  await f.locator('[data-institution="anthropic"]').click()
  await expect(f.getByRole('link',{name:'View evidence →'})).toBeVisible()
  await page.screenshot({path:`/tmp/cepheus-shots/${width}-card.png`})
  const result=await new AxeBuilder({page}).include('[data-constellation]').analyze();expect(result.violations).toEqual([])
 })
}
test('all footnotes return focus to their exact reference',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(essay)
 await expect(page.locator('sup a')).toHaveCount(8)
 for(let n=1;n<=8;n++){
  await page.locator(`#footnote-ref-${n}`).click();await expect(page).toHaveURL(new RegExp(`#footnote-${n}$`));await expect(page.locator(`#footnote-${n}`)).toBeFocused()
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
