export default function MobileFrame({ children, fullScreenOnMobile = true }) {
  if (fullScreenOnMobile) {
    return (
      <div className="min-h-screen md:py-12 bg-paper">
        <div className="md:max-w-[420px] md:mx-auto md:border-2 md:border-ink md:shadow-petrol relative">
          <div className="bg-paper-light min-h-screen md:min-h-[760px] md:max-h-[760px] md:overflow-y-auto scrollbar-thin">
            <div className="hidden md:flex items-center justify-between absolute top-0 inset-x-0 px-5 py-2 border-b border-ink-line text-[10px] tracking-wider2 uppercase text-ink-mute z-10 bg-paper-light/95 backdrop-blur-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-petrol" />
                Personal · Confidential
              </span>
              <span className="num text-petrol">Vol. 01</span>
            </div>
            <div className="md:pt-8">{children}</div>
          </div>
        </div>
      </div>
    );
  }
  return <div className="min-h-screen bg-paper-light">{children}</div>;
}
