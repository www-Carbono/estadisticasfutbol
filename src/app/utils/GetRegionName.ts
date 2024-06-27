'use client'
export const GetRegion = (region: string) => {
  const regionNames = new Intl.DisplayNames(['es'], { type: 'region' })
  return regionNames.of(region)
}
