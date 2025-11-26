import Image from "next/image";

export default function WelcomeBanner({
  title = "WELCOME BACK!",
  description = "Always stay up-to-date with student registrations and activities.",
  showDecorations = true,
}) {
  return (
    <div className="bg-gradient-to-r from-green-600 h-60 to-emerald-500 text-white p-6 rounded-xl mb-6 shadow-xl relative overflow-hidden">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-lg opacity-90 mt-4">{description}</p>

      {showDecorations && (
        <>
          {/* Decorative Elements and Character */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2">
            <Image src="/props.png" alt="" fill className="object-contain" />
          </div>

          {/* Character Illustration */}
          <div className="absolute right-8 bottom-0 w-64 h-full">
            <Image
              src="/artboard.png"
              alt="Student"
              fill
              className="object-contain object-bottom"
            />
          </div>

          {/* Simple graphic element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </>
      )}
    </div>
  );
}
