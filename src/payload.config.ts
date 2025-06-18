// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import {
  InlineToolbarFeature,
  HeadingFeature,
  AlignFeature,
  IndentFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  InlineCodeFeature,
  LinkFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { FieldsDrawer } from '@payloadcms/richtext-lexical/client'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { CustomHightlight, CustomSuperscript } from './app/components'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    {
      slug: 'posts',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures, rootFeatures }) => [
      InlineToolbarFeature(),
      HeadingFeature(),
      AlignFeature(),
      IndentFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      StrikethroughFeature(),
      CustomHightlight(),
      CustomSuperscript(),
      InlineCodeFeature(),
      LinkFeature({
        disableAutoLinks: true,
        fields: [
          {
            label: 'Content',
            name: 'content',
            type: 'text',
          },
        ],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
