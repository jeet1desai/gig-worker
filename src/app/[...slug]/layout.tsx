import Header from '../../components/Header';
import Footer from '@/components/Footer';

function LandingPage({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={`min-h-screen w-full overflow-x-hidden bg-[#111111] font-sans text-white`}>
      <Header />
      <div className="min-h-[80vh]">{children}</div>
      <Footer />
    </main>
  );
}

export default LandingPage;
