'use client'

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "../ui/button"
import { SignInButton, useAuth } from "@clerk/nextjs"
import { AUTH_ERROR_STORAGE_KEY } from "@/contexts/AppUserContext"

const Login: React.FC = () => {
  const { isLoaded } = useAuth()
  const [error, setError] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null
    }
    return localStorage.getItem(AUTH_ERROR_STORAGE_KEY)
  })

  const clearError = useCallback(() => {
    setError(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_ERROR_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 10000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const buttonDisabled = useMemo(() => !isLoaded, [isLoaded])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Layered gradient background with subtle grid */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-purple-600/5"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 animate-gradient"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 p-4 mx-auto flex flex-col items-center justify-center min-h-screen">
        {/* Branding */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/10 mx-auto">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <div className="text-blue-500 text-sm sm:text-base flex items-center justify-center gap-2 group">
            <span>SST Announcement System</span>
          </div>
        </div>

        {/* Glowing glass panel with button */}
        <div className="relative group w-[520px] max-w-full">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800/50 space-y-6 w-full">
            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                <div className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="font-medium">Access Restricted</p>
                    <p className="text-red-300/80 mt-1">{error}</p>
                  </div>
                  <button
                    onClick={clearError}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Dismiss error"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            <div className="relative flex items-center gap-2">
              <SignInButton mode="modal">
                <Button
                  type="button"
                  disabled={buttonDisabled}
                  className="relative overflow-hidden group inline-flex items-center justify-center gap-2 w-full text-xs md:text-sm font-medium h-11 md:h-12 px-5 md:px-6 rounded-xl [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 bg-gradient-to-tr from-slate-950/85 to-gray-900/85 text-white/90 border border-white/12 hover:border-white/25 backdrop-blur-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 disabled:pointer-events-none disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                  </div>
                  <div className="relative z-10 flex items-center justify-center">
                    {buttonDisabled ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span className="text-white/80">Preparing...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          className="mr-2 size-5"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                          ></path>
                        </svg>
                        <span className="text-white/80">
                          Continue with Scaler ID
                        </span>
                      </>
                    )}
                  </div>
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="text-violet-400 hover:text-violet-300 transition-colors duration-300"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-violet-400 hover:text-violet-300 transition-colors duration-300"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
