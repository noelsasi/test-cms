/**
 * Decorative half of the login screen. A simplified stand-in for the Figma
 * artwork — swap in the exported asset when it is available; the layout does
 * not depend on this file's contents.
 */
export function LoginIllustration() {
  return (
    <svg
      viewBox="0 0 620 520"
      role="presentation"
      aria-hidden="true"
      className="h-auto w-full max-w-lg"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* seated figure */}
      <circle cx="290" cy="150" r="42" stroke="#1f2937" strokeWidth="3" />
      <path
        d="M290 192c-52 0-92 34-98 88h196c-6-54-46-88-98-88Z"
        stroke="#1f2937"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* laptop on the desk */}
      <path d="M196 340 236 268h116l40 72z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="3" />
      <rect x="180" y="340" width="228" height="12" rx="6" fill="#9ca3af" />

      {/* desk */}
      <rect x="60" y="360" width="500" height="26" rx="13" fill="#6b7280" />
      <g stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
        <path d="M110 386v104M170 386v104M450 386v104M510 386v104" />
      </g>

      {/* sparkles */}
      <g stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
        <path d="M92 150v26M79 163h26M486 96v20M476 106h20" />
      </g>
      <circle cx="452" cy="196" r="9" stroke="#1f2937" strokeWidth="3" />
      <rect x="86" y="240" width="34" height="34" rx="8" fill="#c7d2fe" />
      <rect x="500" y="252" width="34" height="34" rx="8" fill="#c7d2fe" />
    </svg>
  )
}
