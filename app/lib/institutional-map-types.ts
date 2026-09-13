export type PublicationStatus = 'candidate' | 'provisional' | 'reviewed' | 'published' | 'rejected' | 'withdrawn'
export type ResearchRecord = { id: string; publicationStatus?: PublicationStatus; [key: string]: any }
export type Institution = ResearchRecord & { label: string; name: string; kind: string; group: string; note: string }
export type Relationship = ResearchRecord & { source: string; target: string; type: string; evidenceIds: string[]; instrumentId: string; currentStatus: string }
export type Bundle = {
  sources: ResearchRecord[]; evidence: ResearchRecord[]; institutions: Institution[]; instruments: ResearchRecord[];
  relationships: Relationship[]; 'relation-types': ResearchRecord[]; taxonomy: any;
  'status-checks': ResearchRecord[]; succession: ResearchRecord[]; coverage: any; reviews: ResearchRecord[];
  release: any; 'institution-attributes': ResearchRecord[]; 'attribute-rubrics': ResearchRecord[];
  'analytical-relations': ResearchRecord[]; 'analytical-rubrics': ResearchRecord[];
  'source-versions': ResearchRecord[]; 'search-log': ResearchRecord[]; 'status-search-log': ResearchRecord[];
  layout?: { nodes: Record<string, {x: number; y: number}>; width: number; height: number; radius: number; basis: string }
}
