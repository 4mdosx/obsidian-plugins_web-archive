import { StrictMode, createContext } from "react"
import { ItemView, WorkspaceLeaf, App } from "obsidian"
import { Root, createRoot } from "react-dom/client"
import { ReactView } from "./react_view"

export const AppContext = createContext<App | undefined>(undefined)
export const StoreContext = createContext<any>(undefined)
export const VIEW_TYPE_TEXT = "web-archive-view"

export class PluginMainView extends ItemView {
	root: Root | null = null
  store: any = { links: [] }

	constructor(leaf: WorkspaceLeaf) {
		super(leaf)
	}

	getViewType() {
		return VIEW_TYPE_TEXT
	}

	getDisplayText() {
		return "Web archive"
	}

  // 从markdown文件中提取链接
  async extractLinksFromMarkdown (content: string) {
    const links = content.match(/\[.*?\]\((.*?)\)/g)
    return links?.map((link) => link.split('](')[1].slice(0, -1)) || []
  }

  async updateView () {
    // @ts-ignore
    const view: FileView = this.app.workspace.getActiveFileView()
    if (!view) return

    if (view.getViewType() === "markdown") {
      const content = await this.app.vault.cachedRead(view.file)
      this.store.links = await this.extractLinksFromMarkdown(content)
      this.root?.render(
        <StrictMode>
          <AppContext.Provider value={this.app}>
            <StoreContext.Provider value={this.store}>
              <ReactView />
            </StoreContext.Provider>
          </AppContext.Provider>
        </StrictMode>
      )
    } else if (view.getViewType() === "kanban") {
      // TODO: get kanban links
    } else {
      // clean file links
    }
  }

  registerListener () {
    this.registerEvent(this.app.metadataCache.on('changed', () => {
      this.updateView()
		}))
    this.registerEvent(this.app.workspace.on('active-leaf-change', (leaf) => {
      this.updateView()
    }))
  }

	async onOpen() {
    this.registerListener()
		this.root = createRoot(this.containerEl.children[1])
    this.updateView()
	}

	async onClose() {
		this.root?.unmount()
	}
}
