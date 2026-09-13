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
