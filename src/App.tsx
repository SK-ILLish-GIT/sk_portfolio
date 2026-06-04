import { useState } from 'react';
import Experience from './scene/Experience';
import Overlay from './ui/Overlay';
import Nav from './ui/Nav';
import { stations } from './data/portfolio';

export default function App() {
  const [active, setActive] = useState(0);
  // Imperative scroll target set by Nav; consumed inside the Canvas/ScrollControls.
  const [scrollTo, setScrollTo] = useState<{ index: number; nonce: number }>({
    index: 0,
    nonce: 0,
  });

  const goTo = (index: number) =>
    setScrollTo((s) => ({ index, nonce: s.nonce + 1 }));

  return (
    <>
      <Experience active={active} setActive={setActive} scrollTo={scrollTo} />
      <Overlay active={active} />
      <Nav active={active} count={stations.length} onGoTo={goTo} />
    </>
  );
}
