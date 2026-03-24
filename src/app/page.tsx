export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center font-sans">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-16">
        <h1 className="text-4xl font-semibold tracking-tight">Trip Split</h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Split trip expenses with friends.
        </p>
      </main>
    </div>
  );
}
