import { Suspense } from 'react';
import { SearchPanel } from '@/components/SearchPanel/SearchPanel';

export default function Home() {
  return (
    <Suspense>
      <SearchPanel />
    </Suspense>
  );
}
