export default function MobileFrame({ children, fullScreenOnMobile = true }) {
  if (fullScreenOnMobile) {
    return (
      <div className="min-h-screen md:py-10 md:bg-gradient-to-br md:from-primary-50 md:via-white md:to-accent-50">
        <div className="md:max-w-md md:mx-auto md:rounded-[2.5rem] md:overflow-hidden md:shadow-2xl md:border md:border-gray-200/70 md:bg-white">
          <div className="bg-white min-h-screen md:min-h-[760px] md:max-h-[760px] md:overflow-y-auto scrollbar-thin">
            {children}
          </div>
        </div>
      </div>
    );
  }
  return <div className="min-h-screen bg-white">{children}</div>;
}
