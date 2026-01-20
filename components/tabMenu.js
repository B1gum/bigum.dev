"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./tabMenu.module.css"

export default function TabMenu() {
  const pathname = usePathname() || "/"
  const isNotes = pathname.startsWith("/notes")
  const isTungsten = pathname.startsWith("/tungsten")
  const isBlog = !isNotes && !isTungsten

  return (
    <nav className={styles.tabMenu}>
      <Link href="/" className={isBlog ? styles.active : ''}>
        Blog Posts
      </Link>
      <Link href="/notes" className={isNotes ? styles.active : ''}>
        Lecture Notes
      </Link>
      <Link href="/tungsten" className={isTungsten ? styles.active : ''}>
        Tungsten Docs
      </Link>
    </nav>
  )
}
