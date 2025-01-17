import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Verduleria Filsinger",
  description: "Control Stock",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}
