import { useState } from 'react'
import { Button, Input, Tabs } from '@/components/ui'
import { cn } from '@/lib/cn'
import { LIVE_UNTIL_OPTIONS, expiryDateFor, type LiveUntil } from './publishOptions'

export interface PublishSettings {
  status: 'live' | 'scheduled'
  scheduledDate?: string
  expiryDate?: string
}

interface PublishPanelProps {
  /** True when the test already stores an expiry the API will not let us clear. */
  hasExistingExpiry?: boolean
  isPublishing?: boolean
  onCancel: () => void
  onConfirm: (settings: PublishSettings) => void
}

const PUBLISH_TABS = [
  { value: 'now', label: 'Publish Now' },
  { value: 'schedule', label: 'Schedule Publish' },
] as const

export function PublishPanel({
  hasExistingExpiry = false,
  isPublishing = false,
  onCancel,
  onConfirm,
}: PublishPanelProps) {
  const [mode, setMode] = useState<'now' | 'schedule'>('now')
  const [liveUntil, setLiveUntil] = useState<LiveUntil>('always')
  const [customEndsAt, setCustomEndsAt] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')

  const needsSchedule = mode === 'schedule'
  const needsCustomDate = liveUntil === 'custom'
  const isIncomplete = (needsSchedule && !scheduledAt) || (needsCustomDate && !customEndsAt)

  function handleConfirm() {
    onConfirm({
      status: needsSchedule ? 'scheduled' : 'live',
      scheduledDate: needsSchedule ? new Date(scheduledAt).toISOString() : undefined,
      expiryDate: expiryDateFor(liveUntil, customEndsAt),
    })
  }

  return (
    <div className="flex flex-col gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-6">
      <Tabs items={[...PUBLISH_TABS]} value={mode} onChange={setMode} />

      {needsSchedule && (
        <Input
          label="Publish On"
          type="datetime-local"
          value={scheduledAt}
          onChange={(event) => setScheduledAt(event.target.value)}
          className="max-w-sm"
        />
      )}

      <div>
        <h3 className="text-base font-semibold text-ink-900">Live Until</h3>
        <p className="mt-1 text-sm text-ink-500">
          Choose how long this test should remain available on the platform.
        </p>
        {hasExistingExpiry && liveUntil === 'always' && (
          <p className="mt-2 text-sm text-accent-amber">
            This test already has an end date. Publishing cannot remove it — pick a custom duration
            to change it instead.
          </p>
        )}

        <fieldset className="mt-4 grid gap-3 sm:grid-cols-2">
          {LIVE_UNTIL_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center gap-2 text-sm',
                liveUntil === option.value ? 'text-ink-900' : 'text-ink-700',
              )}
            >
              <input
                type="radio"
                name="live-until"
                value={option.value}
                checked={liveUntil === option.value}
                onChange={() => setLiveUntil(option.value)}
                className="size-4 accent-brand-600"
              />
              {option.label}
            </label>
          ))}
        </fieldset>

        {needsCustomDate && (
          <Input
            label="Select End Date"
            type="datetime-local"
            value={customEndsAt}
            onChange={(event) => setCustomEndsAt(event.target.value)}
            className="mt-4 max-w-sm"
          />
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} isLoading={isPublishing} disabled={isIncomplete}>
          Confirm
        </Button>
      </div>
    </div>
  )
}
