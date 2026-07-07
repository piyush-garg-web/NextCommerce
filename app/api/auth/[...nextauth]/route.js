import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import UserModel from "@/models/UserModel"
import { connectToDB } from "@/lib/dbConnection"
import { SignJWT } from "jose"
import { cookies } from "next/headers"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectToDB();
        const email = user.email;
        let dbUser = await UserModel.findOne({ email, deletedAt: null });

        if (!dbUser) {
          // Store Name, Email, Profile Picture, Provider = Google, CreatedAt (auto timestamps).
          // Password is optional.
          dbUser = new UserModel({
            name: user.name,
            email: email,
            avatar: {
              url: user.image || "",
              public_id: ""
            },
            role: "user",
            isEmailVerified: true,
            provider: "google",
          });
          await dbUser.save();
        } else {
          // If email exists, do NOT create another user.
          // Reuse the same account and ensure provider is set to google if not set.
          if (!dbUser.provider) {
            dbUser.provider = "google";
          }
          // If the existing user has no avatar, populate it with Google's avatar
          if (!dbUser.avatar || !dbUser.avatar.url) {
            dbUser.avatar = {
              url: user.image || "",
              public_id: ""
            };
          }
          await dbUser.save();
        }

        // Generate custom JWT access_token
        const loggedInUserData = {
          _id: dbUser._id.toString(),
          name: dbUser.name,
          role: dbUser.role,
          avatar: dbUser.avatar
        };

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT(loggedInUserData)
          .setIssuedAt()
          .setExpirationTime("24h")
          .setProtectedHeader({ alg: "HS256" })
          .sign(secret);

        const cookieStore = await cookies();
        cookieStore.set({
          name: "access_token",
          value: token,
          httpOnly: process.env.NODE_ENV === "production",
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        return true;
      } catch (error) {
        console.error("Error in NextAuth signIn callback:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Redirect to home page after successful sign-in
      return `${baseUrl}`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.SECRET_KEY,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
