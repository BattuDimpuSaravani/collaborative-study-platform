function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-emerald-700 text-white items-center justify-center p-12">
        <div>
          <h1 className="text-5xl font-bold">
            StudySync
          </h1>

          <p className="mt-4 text-xl">
            Study together.
            Stay focused.
            Achieve more.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;