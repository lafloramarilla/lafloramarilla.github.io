import React from 'react';
import Carousel from './components/Carousel';

const App: React.FC = () => {
  return (
    <main className="w-screen h-[100dvh] bg-stone-900 text-stone-100 overflow-hidden flex flex-col">
      {/* 
        Background Texture Layer
        We use a subtle noise or leather-like dark color to simulate the table 
        the program might be sitting on.
      */}
      <div className="flex-1 relative">
        <Carousel />
      </div>
    </main>
  );
};

export default App;