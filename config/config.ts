type DeploymentProfile = 'local' | 'production'

const profiles: Record<DeploymentProfile, { frontendUrl: string; backendUrl: string }> = {
  local: {
    frontendUrl: 'http://localhost:3000',
    backendUrl: 'http://localhost:3000',
  },
  production: {
    frontendUrl: 'https://sst-announcement.vercel.app',
    backendUrl: 'https://sst-announcement.vercel.app',
  },
}

export interface RuntimeConfig {
  deployment: DeploymentProfile
  frontendUrl: string
  backendUrl: string
}

export function getConfig(): RuntimeConfig {
  const deployment = (process.env.NODE_ENV === 'production' ? 'production' : 'local') as DeploymentProfile
  const defaults = profiles[deployment]

  const config = {
    deployment,
    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || defaults.frontendUrl,
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || defaults.backendUrl,
  }

  return config
}
