import { Header } from '@/components/Header/Header';
import { SearchPanel } from '@/components/SearchPanel/SearchPanel';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <SearchPanel />
      </main>
    </>
  );
}
