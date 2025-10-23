
import Footer from "@/components/Footer/Footer";
import "./globals.css";
import Header from "@/components/Header/Header";
import TanstackProvider from "@/components/TanStackProvider/TanStackProvider";

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal:React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TanstackProvider>
        <Header></Header>
          {modal}
          {children}
          <Footer></Footer>
          </TanstackProvider>
      </body>
    </html>
  );
}