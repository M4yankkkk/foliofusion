'use client'

export default function ScoreGauge({ scores }) {
  const getColor = (score) => {
    if (score >= 80) return '#16a34a'
    if (score >= 60) return '#ca8a04'
    return '#dc2626'
  }

  const segment = (label, value, color, bg) => (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-36 h-2 rounded-full overflow-hidden" style={{ backgroundColor: bg }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${value}%`, backgroundColor: color }}
          />
        </div>
        <span className="w-10 text-right font-medium" style={{ color: getColor(value) }}>
          {value}%
        </span>
      </div>
    </div>
  )

  const ringColor = getColor(scores.overall)
  const ringStyle = {
    background: `conic-gradient(${ringColor} ${scores.overall}%, #e5e7eb ${scores.overall}% 100%)`,
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Match Score</p>
          <p className="text-sm text-gray-600">Higher is better alignment</p>
        </div>
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full" style={ringStyle} />
          <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center shadow-inner">
            <span className="text-xl font-bold" style={{ color: ringColor }}>
              {scores.overall}%
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {segment('Skills Match', scores.skillsMatch, '#2563eb', '#e0e7ff')}
        {segment('Experience Match', scores.experienceMatch, '#7c3aed', '#ede9fe')}
        {segment('Keywords Coverage', scores.keywordsCoverage, '#ea580c', '#ffedd5')}
      </div>

      {scores.missingKeywords && scores.missingKeywords.length > 0 && (
        <div className="mt-2 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600 font-medium mb-2">Add these keywords:</p>
          <div className="flex flex-wrap gap-2">
            {scores.missingKeywords.slice(0, 6).map((keyword, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
