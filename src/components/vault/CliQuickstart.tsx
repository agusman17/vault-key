import { Terminal, Copy } from 'lucide-react'

const CLI_COMMAND = "curl -fsSL https://vault.cipher.dev/install.sh | bash && cipher login"

export function CliQuickstart() {
  return (
    <div className="bg-surface-container rounded-xl p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md">
      <div className="flex items-center gap-space-md">
        <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
          <Terminal size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-label-lg text-label-lg font-semibold text-on-surface">
            CipherVault Developer CLI Quickstart
          </span>
          <span className="font-code-sm text-code-sm text-on-surface-variant">
            Inject secrets directly into microservices and shell environments
          </span>
        </div>
      </div>
      <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-xs rounded-lg max-w-full overflow-x-auto">
        <span className="font-code-sm text-code-sm text-primary select-none">$</span>
        <code className="font-code-sm text-code-sm text-on-surface">{CLI_COMMAND}</code>
        <button
          className="text-outline hover:text-on-surface pl-2"
          onClick={() => navigator.clipboard.writeText(CLI_COMMAND)}
          title="Copy CLI Command"
          type="button"
        >
          <Copy size={16} />
        </button>
      </div>
    </div>
  )
}
