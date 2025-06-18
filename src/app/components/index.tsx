import { createServerFeature } from '@payloadcms/richtext-lexical'

export const CustomHightlight = createServerFeature({
  feature: {
    ClientFeature: '@/app/components/custom-feature#CustomHightlight',
  },
  key: 'highlight',
  dependenciesPriority: [],
})
export const CustomSuperscript = createServerFeature({
  feature: {
    ClientFeature: '@/app/components/custom-feature#CustomSuperscript',
  },
  key: 'footnote',
  dependenciesPriority: [],
})
