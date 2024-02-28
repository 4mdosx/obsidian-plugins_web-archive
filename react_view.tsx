import { useContext } from "react"
import { AppContext, StoreContext } from "main_view"
import { archiveUrl, saveArchive } from "utils/archive"

export const ReactView = () => {
  const app = useContext(AppContext)
  const store = useContext(StoreContext)

  async function archiveLink(link: string) {
    const article = await archiveUrl(link)
    if (article?.markdown && app?.vault) {
      await saveArchive(app?.vault, article)
    }
  }

  return (
    <div>
      <h1>Content Links</h1>
      <ul>
        {store.links.map((link: string, key: number) => (
          <li key={key}>
            <span>{link}</span>
            <button onClick={() => archiveLink(link)}>⏬</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
