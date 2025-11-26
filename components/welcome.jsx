import Image from "next/image";

export default function WelcomeBanner({
  title = "WELCOME BACK!",
  description = "Always stay up-to-date with student registrations and activities.",
  showDecorations = true,
}) {
  return (
    // Height remains fixed, ensuring content spacing is preserved
    <div className="bg-gradient-to-r from-green-600 h-60 to-emerald-500 text-white p-6 rounded-xl mb-6 shadow-xl relative overflow-hidden">
      <h2 className="text-3xl font-bold">{title}</h2>
      {/* Reduced font size slightly on mobile for better fit */}
      <p className="text-base sm:text-lg opacity-90 mt-4">{description}</p>

      {showDecorations && (
        <>
          {/* Decorative Elements and Character: HIDDEN ON SMALL SCREENS (md:block) */}

          {/* 1. Decorative Props (Confetti/Background Art) */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
            <Image
              src="/props.png"
              alt=""
              fill
              className="object-contain"
              // 💡 Image is 50% width on md screens and above
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>

          {/* 2. Character Illustration */}
          <div className="absolute right-8 bottom-0 w-64 h-full hidden md:block">
            <Image
              src="/artboard.png"
              alt="Student"
              fill
              className="object-contain object-bottom"
              // 💡 Image is fixed w-64 (approx 256px) on md screens and above
              sizes="(min-width: 768px) 256px, 100vw"
            />
          </div>

          {/* 3. Simple graphic element (Hidden on mobile) - No sizes needed for non-filling element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 hidden md:block"></div>
        </>
      )}
    </div>
  );
}
