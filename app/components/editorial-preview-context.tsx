'use client'
import { createContext } from 'react'
export const EditorialPreviewContext = createContext(false)
export function EditorialPreviewProvider({ children }: { children: React.ReactNode }) {
  return <EditorialPreviewContext.Provider value={true}>{children}</EditorialPreviewContext.Provider>
}
