import request from "./request"
import { ArticleData, extractFromHtml } from '@extractus/article-extractor'
import html2md from 'html-to-md'
import { Vault } from 'obsidian'
import { format } from 'date-fns'

type ArticleDataWithMarkdown = ArticleData & { markdown?: string }

export async function archiveUrl(url: string): Promise<ArticleDataWithMarkdown | null> {
  const html = await request(url)

  const article = await extractFromHtml(html, url)

  if (article && article.content) {
    const res: ArticleDataWithMarkdown  = Object.assign(article, { markdown: html2md(article.content) })
    return Promise.resolve(res)
  }

  return Promise.resolve(article)
}

export async function saveArchive (vault: Vault, article: ArticleDataWithMarkdown) {
  vault.getAbstractFileByPath('web_archive') || vault.createFolder('web_archive')

  if (article.markdown) {
    // 检测是否已经有归档
    let title = article.title || article.markdown.slice(0, 20)
    const file = vault.getAbstractFileByPath(`web_archive/${title}.md`)
    if (file) title += `-${format(new Date(), 'yyyy-MM-dd')}`
    const metadata = `---\n \narchive time: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')} url: ${article.url} \n---\n\n`

    console.log('archive', `web_archive/${title}`)
    vault.create(`web_archive/${title}.md`, metadata + article.markdown)
  }
}