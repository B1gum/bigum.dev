import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

const REPO_OWNER = 'B1gum'
const REPO_NAME = 'Tungsten'
const BRANCH = 'main' // or 'master', check your repo
const BASE_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/docs`

export async function getDocPage(slug = []) {
  // 1. First attempt: Try to fetch the file directly (e.g., 'introduction.md')
  let path = slug.length === 0 ? 'index.md' : slug.join('/') + '.md'
  let url = `${BASE_URL}/${path}`

  try {
    let res = await fetch(url)
    
    // 2. Fallback: If not found, try fetching '.../index.md' (e.g., 'introduction/index.md')
    // This allows you to visit '/tungsten/introduction' and see the index content
    if (!res.ok && !path.endsWith('index.md')) {
      path = slug.join('/') + '/index.md'
      url = `${BASE_URL}/${path}`
      res = await fetch(url)
    }

    if (!res.ok) return null

    const source = await res.text()
    
    // Parse frontmatter
    const { content, data } = matter(source)

    // Fix links
    const cleanContent = content
      // Case A: Link to an index file -> Link to the parent folder (remove 'index.md')
      // e.g., [Home](introduction/index.md) -> [Home](introduction/)
      .replace(/\]\((.*?)\/index\.md\)/g, ']($1/)') 
      // Case B: Link to a standard file -> Remove extension
      // e.g., [Install](installation.md) -> [Install](installation)
      .replace(/\]\((.*?)\.md\)/g, ']($1)');

    // Serialize MDX (use cleanContent!)
    const mdxSource = await serialize(cleanContent, {
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
