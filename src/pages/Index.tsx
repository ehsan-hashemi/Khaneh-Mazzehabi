import { useEffect } from "react";
import Header from "@/components/Header";
import Portfolio from "@/components/Portfolio";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Load Google Translate script
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "fa",
          includedLanguages: "fa,en,ar",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Portfolio />
        <OrderForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
