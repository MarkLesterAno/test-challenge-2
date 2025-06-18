'use client'

import {
  $createLinkNode,
  createClientFeature,
  LinkNode,
  toolbarFormatGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSuperscript, faHighlighter } from '@fortawesome/free-solid-svg-icons'
import { $isMarkNode, $wrapSelectionInMarkNode, MarkNode } from '@lexical/mark'
import {
  $insertNodes,
  $createTextNode,
  $createRangeSelection,
  $getRoot,
  RangeSelection,
} from 'lexical'
import { $getSelection } from 'lexical'
import { FootnoteNode, $createFootnoteNode, $isFootnoteNode } from './custom-node'
const IconHighlight: React.FC = () => {
  return <FontAwesomeIcon icon={faHighlighter} />
}
const IconSuperscript: React.FC = () => {
  return <FontAwesomeIcon icon={faSuperscript} />
}

function checkParent(nodes: any) {
  let isParentMark: boolean = false
  let parent: any
  nodes.forEach((node: any) => {
    parent = node.getParent()
    isParentMark = $isMarkNode(parent)
  })
  return { parent, isParentMark }
}

export const CustomHightlight = createClientFeature({
  nodes: [MarkNode],
  toolbarInline: {
    groups: [
      toolbarFormatGroupWithItems([
        {
          ChildComponent: IconHighlight,
          order: 5,
          key: 'highlight',
          isActive: ({ editor }) => {
            const selection: any = $getSelection()
            const nodes = selection.getNodes()
            const { isParentMark } = checkParent(nodes)
            return isParentMark
          },
          onSelect: ({ editor }) => {
            editor.update(() => {
              const selection: any = $getSelection()
              const nodes = selection.getNodes()
              const { parent, isParentMark } = checkParent(nodes)
              if (isParentMark) {
                parent.replace(parent.getChildren()[0])
              } else {
                $wrapSelectionInMarkNode(selection, true, 'mark')
              }
            })
          },
        },
      ]),
    ],
  },
})

function countNodes(nodes: any) {
  let nodeCount = 0
  nodes.forEach((node: any) => {
    const parent = node.getParent()
    if (parent) {
      nodeCount += parent.getChildren().filter($isFootnoteNode).length
    }
  })

  return { nodeCount }
}

function toLinkNode({
  footnote,
  selection,
  nodeCount,
}: {
  footnote: FootnoteNode
  selection: string
  nodeCount: number
}) {
  const linkNode = $createLinkNode({
    id: `${nodeCount + 1}`,
    fields: {
      url: `http://example.com`,
      newTab: false,
      linkType: 'internal',
      name: 'content',
      label: selection,
    },
  })

  linkNode.append(footnote)
  return linkNode
}

export const CustomSuperscript = createClientFeature({
  nodes: [FootnoteNode, LinkNode],
  toolbarInline: {
    groups: [
      toolbarFormatGroupWithItems([
        {
          ChildComponent: IconSuperscript,
          order: 6,
          key: 'footnote',
          isActive: ({ editor }) => {
            editor.read(() => {
              const selection = $createRangeSelection()
              const nodes = selection.getNodes()
              nodes.forEach((node: any) => {
                const parent = node.getParent()
                parent.getChildren().filter((child: any) => $isFootnoteNode(child))
              })
            })
            return false
          },
          onSelect: ({ editor }) => {
            editor.update(() => {
              const selection: any = $getSelection()
              const { nodeCount } = countNodes(selection.getNodes())
              const textNode = $createTextNode(selection.getTextContent())
              const text: any = selection.getTextContent()

              const footnoteNode = $createFootnoteNode(`${nodeCount + 1}`)

              const linkNode = toLinkNode({ footnote: footnoteNode, selection: text, nodeCount })
              linkNode

              $insertNodes([textNode, linkNode])
            })
          },
        },
      ]),
    ],
  },
})
