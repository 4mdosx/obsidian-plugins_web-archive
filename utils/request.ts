

const electron = (globalThis as any).electron
const electronNet = electron.remote.net

const request = async (url: string) => {
  const response = await electronNet.fetch(url)
  if (response.ok) {
    const body = await response.text()
    return body
  }
}

export default request