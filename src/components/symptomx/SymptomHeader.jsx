import React from 'react';

const SymptomHeader = () => {
  return (
    <section className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="flex flex-col gap-6 w-full max-w-2xl">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-200 drop-shadow-sm">
          A Smarter Way to Understand Your Symptoms
        </h1>
        <p className="text-lg md:text-xl text-indigo-200/80 font-light leading-relaxed max-w-xl">
          Experience the next generation of AI-driven symptom analysis. Get precise, personalized insights with clinical-grade accuracy in seconds.
        </p>
      </div>

      <div className="relative w-full aspect-square md:aspect-video lg:aspect-square max-w-lg mx-auto lg:ml-auto">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-[20px] border border-white/10 shadow-2xl shadow-indigo-500/20 transform transition-transform duration-500 hover:-translate-y-2 p-3">
          <div className="w-full h-full relative rounded-2xl overflow-hidden bg-slate-800">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent mix-blend-overlay z-10 pointer-events-none" />
            <img 
              src="/symptx.jpeg" 
              alt="Symptom Analysis Interface" 
              className="w-full h-full object-cover rounded-xl transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[24px] blur-2xl -z-10" />
      </div>
    </section>
  );
};

export default SymptomHeader;
