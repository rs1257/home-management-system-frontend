import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/moneyTracker')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/moneyTracker"!</div>
}
