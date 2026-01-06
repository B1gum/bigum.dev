import Head from 'next/head'
import { MDXRemote } from 'next-mdx-remote'
import MDXWrapper from '../../components/MDXWrapper'
import { getDocPage } from '../../lib/tungsten'
import utilStyles from '../../styles/utils.module.css'
import styles from '../../styles/post.module.css'

export default function TungstenDoc({ mdxSource, frontMatter }) {
  if (!mdxSource) {
    return <div className={utilStyles.container}>Page not found</div>
  }

  return (
    <>
      <Head>
        <title>{frontMatter.title || 'Tungsten Docs'} | B1gum.dev</title>
      </Head>
      
      <div className={styles.postContainer}>
        <article className={utilStyles.article}>
          {frontMatter.title && <h1 className={styles.postTitle}>{frontMatter.title}</h1>}
          
          <div className={styles.postText}>
            <MDXWrapper>
               <MDXRemote {...mdxSource} />
            </MDXWrapper>
          </div>
        </article>
      </div>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const slug = params.slug || []
  const docData = await getDocPage(slug)

  if (!docData) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      ...docData,
    },
  }
}
