import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

const REPO_OWNER = 'B1gum'
const REPO_NAME = 'Tungsten'
const BRANCH = 'main' // or 'master', check your repo
const BASE_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/docs`

export async function getDocPage(slug = []) {
  // If slug is empty (root /tungsten), fetch index.md, otherwise join slug parts
  const path = slug.length === 0 ? 'index.md' : slug.join('/') + '.md'
  const url = `${BASE_URL}/${path}`

  try {
    const res = await fetch(url)
    
    if (!res.ok) return null

    const source = await res.text()
    
    // Parse frontmatter
    const { content, data } = matter(source)

    // Fix links
    const cleanContent = content.replace(/\]\((.*?)\.md\)/g, ']($1)');

    // Serialize MDX
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
      scope: data,
    })

    return {
      mdxSource,
      frontMatter: data,
    }
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    return null
  }
}
