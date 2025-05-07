import Banner from "../component/Banner";
import CategoryButtons from "../component/CategoryButtons";
import Header from "../component/Header";
import Footer from "../component/Footer";
import LogoClound from "../component/logoCloud";

export default function Home() {
  return (
    <div>
      <Header />
      <Banner />
      <CategoryButtons />
      <LogoClound />
      <Footer />
    </div>
  );
}
