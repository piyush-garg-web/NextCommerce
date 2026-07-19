import GlobalProvider from "@/components/application/GlobalProvider";
import "./globals.css";
import { Assistant } from "next/font/google";
import { ToastContainer } from "react-toastify";

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://e-commerce-gilt-seven-85.vercel.app"),

  title: {
    default: "NextCommerce | Modern Full-Stack E-Commerce Platform",
    template: "%s | NextCommerce",
  },

  description:
    "NextCommerce is a modern full-stack e-commerce platform built with Next.js, React, Node.js, MongoDB, Redux Toolkit, Tailwind CSS, Cloudinary, and Razorpay. It features secure authentication, product management, shopping cart, secure online payments, and an intuitive admin dashboard.",

  keywords: [
    "NextCommerce",
    "Next.js",
    "React",
    "Node.js",
    "MongoDB",
    "Redux Toolkit",
    "Tailwind CSS",
    "Cloudinary",
    "Razorpay",
    "E-Commerce",
    "Shopping Cart",
    "Online Store",
    "Admin Dashboard",
    "Full Stack",
    "JavaScript",
  ],

  authors: [
    {
      name: "Piyush Garg",
      url: "https://portfolio-one-livid-15.vercel.app/",
    },
  ],

  creator: "Piyush Garg",
  publisher: "Piyush Garg",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "NextCommerce | Modern Full-Stack E-Commerce Platform",
    description:
      "A modern full-stack e-commerce platform featuring secure authentication, product management, shopping cart, online payments, and an admin dashboard.",
    url: "https://e-commerce-gilt-seven-85.vercel.app/",
    siteName: "NextCommerce",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "NextCommerce | Modern Full-Stack E-Commerce Platform",
    description:
      "Modern full-stack e-commerce platform built with Next.js, MongoDB, Redux Toolkit, Tailwind CSS, Cloudinary, and Razorpay.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${assistant.className} antialiased`}>
        <GlobalProvider>
          <ToastContainer />
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}