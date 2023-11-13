interface Navigator {
  clearAppBadge: () => Promise<void>
  setAppBadge: (contents?: number) => Promise<void>
}

interface WorkerNavigator {
  clearAppBadge: () => Promise<void>
  setAppBadge: (contents?: number) => Promise<void>
}
