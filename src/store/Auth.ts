import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { persist } from "zustand/middleware"
import { AppwriteException, ID, Models } from "appwrite"
import { account } from "@/models/client/config"

export interface UserPrefs {
  reputation: number
}

// 🔥 Unified AuthResponse type
export type AuthResponse =
  | { success: true }
  | { success: false; error: { message: string } }

interface IAuthStore {
  session: Models.Session | null
  jwt: string | null
  user: Models.User<UserPrefs> | null
  hydrated: boolean

  setHydrated(): void
  verifySession(): Promise<void>
  login(email: string, password: string): Promise<AuthResponse>
  createAccount(name: string, email: string, password: string): Promise<AuthResponse>
  logout(): Promise<void>
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true })
      },

      async verifySession() {
        try {
          const session = await account.getSession("current")
          set({ session })
        } catch (error) {
          console.log(error)
        }
      },

      async login(email: string, password: string): Promise<AuthResponse> {
        try {
          const session = await account.createEmailPasswordSession(email, password)
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ])

          if (!user.prefs?.reputation) {
            await account.updatePrefs<UserPrefs>({ reputation: 0 })
          }

          set({ session, user, jwt })
          return { success: true }
        } catch (error) {
          console.log(error)
          if (error instanceof AppwriteException) {
            return { success: false, error: { message: error.message } }
          }
          return {
            success: false,
            error: { message: "Unknown error occurred. Please try again." },
          }
        }
      },

      async createAccount(
        name: string,
        email: string,
        password: string
      ): Promise<AuthResponse> {
        try {
          await account.create(ID.unique(), email, password, name)
          return { success: true }
        } catch (error) {
          console.log(error)
          if (error instanceof AppwriteException) {
            return { success: false, error: { message: error.message } }
          }
          return {
            success: false,
            error: { message: "Unknown error occurred. Please try again." },
          }
        }
      },

      async logout() {
        try {
          await account.deleteSessions()
          set({ session: null, jwt: null, user: null })
        } catch (error) {
          console.log(error)
        }
      },
    })),

    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated()
        }
      },
    }
  )
)
