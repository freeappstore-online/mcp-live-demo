import { initApp } from '@freeappstore/sdk'
import { Shell, BuildInfo } from '@freeappstore/sdk/ui'

const fas = initApp({ appId: 'mcp-live-demo' })

export default function App() {
  return (
    <Shell app={fas} appName="mcp-live-demo">
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="display-font text-3xl font-bold text-[var(--ink)]">mcp-live-demo</h1>
          <p className="mt-3 text-[var(--muted)]">Edit <code>web/src/App.tsx</code> to start building.</p>
        </div>
      </div>
      <BuildInfo />
    </Shell>
  )
}
