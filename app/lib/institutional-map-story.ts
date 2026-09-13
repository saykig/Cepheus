export const storyStates = [
  {id:'opening',title:'A contested interface',institutions:['dod','anthropic'],relationshipId:'dod-anthropic-contested'},
  {id:'public-decisions',title:'Who can decide?',institutions:null,relationshipId:null},
  {id:'interfaces',title:'Where institutions meet',institutions:['dsit','openai'],relationshipId:'uk-openai-cooperation'},
  {id:'technical-knowledge',title:'Knowledge requires access',institutions:['uk-aisi','anthropic','us-aisi','openai','caisi','llnl'],relationshipId:'uk-anthropic-evaluation'},
  {id:'provenance',title:'An inspectable claim',institutions:['uk-aisi','anthropic'],relationshipId:'uk-anthropic-evaluation'},
  {id:'exploration',title:'An institutional system',institutions:null,relationshipId:null},
] as const
export function resolveStoryStep(positions: number[], threshold: number) {
  let step=0; positions.forEach((top,index)=>{if(top<=threshold)step=index}); return step
}
export function storyRelationship(step:number,publishedIds:Set<string>) {
  const id=storyStates[step]?.relationshipId
  return id&&publishedIds.has(id)?id:null
}
