"use client"

import type React from "react"

import { createContext, useState, useContext } from "react"

type User = {
  id: string
  name: string
  email: string
  avatar: string | null
}

type UserContextType = {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    id: "1",
    name: "Alaa",
    email: "alaa@example.com",
    avatar: null,
  })

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
