import { useQuery } from '@tanstack/react-query'

interface Profile {
  id: number
  public_id: string
  name: string
  gender: 'male' | 'female'
  location: string
  birth_date: string | null
  avatar: string | null
}

async function fetchProfiles(): Promise<Profile[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/test`, {
    headers: { 'Accept': 'application/json', 'ngrok-skip-browser-warning': '1' },
  })
  if (!res.ok) throw new Error(await res.text())
  const json = await res.json()
  return Array.isArray(json) ? json : (json.data ?? json.profiles ?? Object.values(json)[0])
}

function getAge(birthDate: string | null): string {
  if (!birthDate) return ''
  const diff = Date.now() - new Date(birthDate).getTime()
  const age = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
  return `, ${age} лет`
}

function App() {
  window.Telegram?.WebApp?.ready()

  const theme = window.Telegram?.WebApp?.themeParams
  const bgColor = theme?.bg_color || '#0a0a0a'
  const textColor = theme?.text_color || '#ffffff'
  const buttonColor = theme?.button_color || '#3b82f6'
  const linkColor = theme?.link_color || '#06b6d4'
  const hintColor = theme?.hint_color || '#6b7280'

  const contentInset = window.Telegram?.WebApp?.contentSafeAreaInset
  const safeInset = window.Telegram?.WebApp?.safeAreaInset
  const paddingTop = (contentInset?.top ?? 0) + (safeInset?.top ?? 0)
  const paddingBottom = (contentInset?.bottom ?? 0) + (safeInset?.bottom ?? 0)
  const paddingLeft = (contentInset?.left ?? 0) + (safeInset?.left ?? 0)
  const paddingRight = (contentInset?.right ?? 0) + (safeInset?.right ?? 0)

  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
  })

  return (
    <div style={{
           backgroundColor: bgColor,
           color: textColor,
           minHeight: '100vh',
           paddingTop: `${paddingTop + 16}px`,
           paddingBottom: `${paddingBottom + 16}px`,
           paddingLeft: `${paddingLeft + 16}px`,
           paddingRight: `${paddingRight + 16}px`,
         }}>

      <div className="mb-6">
        <h1 className="text-xl font-bold font-mono tracking-wider" style={{ color: linkColor }}>
          PROFILES
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: linkColor }}></div>
          <span className="text-xs font-mono" style={{ color: hintColor }}>
            {profiles ? `${profiles.length} записей` : 'загрузка...'}
          </span>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-xl p-4 border animate-pulse"
                 style={{ backgroundColor: `${bgColor}cc`, borderColor: `${hintColor}20` }}>
              <div className="h-4 w-32 rounded mb-2" style={{ backgroundColor: `${hintColor}40` }}></div>
              <div className="h-3 w-20 rounded" style={{ backgroundColor: `${hintColor}20` }}></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl p-4 border text-sm font-mono"
             style={{ borderColor: '#ef444450', backgroundColor: '#ef444420', color: '#ef4444' }}>
          Ошибка загрузки: {(error as Error).message}
        </div>
      )}

      {profiles && (
        <div className="flex flex-col gap-3">
          {profiles.map((profile) => (
            <div key={profile.public_id}
                 className="rounded-xl p-4 border"
                 style={{ backgroundColor: `${bgColor}cc`, borderColor: `${linkColor}30` }}>
              <div className="flex items-center gap-3">
                {/* Аватар */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                     style={{
                       background: `linear-gradient(135deg, ${linkColor}, ${buttonColor})`,
                       boxShadow: `0 4px 12px ${linkColor}30`,
                     }}>
                  <span className="text-lg font-bold text-white">
                    {profile.name.charAt(0)}
                  </span>
                </div>

                {/* Инфо */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate" style={{ color: textColor }}>
                    {profile.name}
                  </div>
                  <div className="text-sm mt-0.5" style={{ color: hintColor }}>
                    {profile.location}{getAge(profile.birth_date)}
                  </div>
                </div>

                {/* Пол */}
                <div className="text-xs font-mono px-2 py-1 rounded-full shrink-0"
                     style={{
                       backgroundColor: profile.gender === 'male' ? `${buttonColor}30` : `${linkColor}30`,
                       color: profile.gender === 'male' ? buttonColor : linkColor,
                     }}>
                  {profile.gender === 'male' ? 'М' : 'Ж'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
