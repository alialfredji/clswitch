interface ModelItem {
  id?: string
}

interface ModelsResponse {
  data?: ModelItem[]
}

export async function checkProxyHealth(port: number): Promise<boolean> {
  const url = `http://localhost:${port}/v1/models`
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(2000)
    })
    return response.ok
  } catch {
    return false
  }
}

export async function fetchModels(port: number): Promise<string[]> {
  const url = `http://localhost:${port}/v1/models`
  const response = await fetch(url, {
    signal: AbortSignal.timeout(2000)
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch models: HTTP ${response.status}`)
  }

  const body = (await response.json()) as ModelsResponse
  const models = body.data ?? []
  return models.map((m) => m.id).filter((id): id is string => typeof id === 'string' && id.length > 0)
}
