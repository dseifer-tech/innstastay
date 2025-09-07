'use client'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-2xl font-semibold mt-8 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-2">{children}</h3>,
    normal: ({ children }) => <p className="leading-7 text-gray-700">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ml-6 space-y-1">{children}</ul>,
  },
  marks: {
    link: ({ children, value }: any) => {
      const href = value?.href || '#'
      const external = /^https?:\/\//.test(href)
      return external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline">{children}</a>
      ) : (
        <Link href={href} className="underline">{children}</Link>
      )
    }
  }
}

export default function Portable({ value }: { value: any }) {
  if (!value) return null
  return <PortableText value={value} components={components} />
}


