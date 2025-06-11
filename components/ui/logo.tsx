interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function ClinicaLogo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Fondo circular */}
        <circle cx="50" cy="50" r="48" fill="url(#gradient)" stroke="#1e40af" strokeWidth="2" />

        {/* Cruz médica */}
        <rect x="45" y="25" width="10" height="50" fill="white" rx="2" />
        <rect x="25" y="45" width="50" height="10" fill="white" rx="2" />

        {/* Corazón pequeño en el centro */}
        <path d="M50 55c-3-3-8-3-8 1s5 7 8 9c3-2 8-5 8-9s-5-4-8-1z" fill="#ef4444" />

        {/* Gradiente */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export function ClinicaLogoText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <ClinicaLogo size="lg" />
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Clínica San Martín
        </h1>
        <p className="text-sm text-gray-600 font-medium">Centro Médico Integral</p>
      </div>
    </div>
  )
}
