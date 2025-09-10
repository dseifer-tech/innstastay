export default function ThemeBackground() {
  return (
    <div
      aria-hidden
      className="
        pointer-events-none fixed inset-0 -z-10
        bg-[radial-gradient(1100px_700px_at_-10%_-10%,#eef5ff_0%,transparent_60%),
           radial-gradient(900px_600px_at_110%_-20%,#f4f1ff_0%,transparent_55%),
           linear-gradient(to_bottom,#ffffff_0%,#ffffff_100%)]
      "
    />
  );
}
