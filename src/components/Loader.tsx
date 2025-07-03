'use client'

import React, { useEffect } from 'react'

interface Props {
  isLoading: boolean
}

const Loader: React.FC<Props> = ({ isLoading }) => {
  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[1600] flex items-center justify-center bg-[rgba(15,23,42,0.5)]">
      <div className="relative h-10 w-10">
        <svg className="absolute inset-0 h-10 w-10 text-white/15" viewBox="22 22 44 44">
          <circle
            cx="44"
            cy="44"
            r="20.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="4.5"
          />
        </svg>

        <svg className="h-10 w-10 animate-spin text-white" viewBox="22 22 44 44">
          <circle
            cx="44"
            cy="44"
            r="20.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="80"
            strokeDashoffset="60"
          />
        </svg>
      </div>
    </div>
  )
}

export default Loader
