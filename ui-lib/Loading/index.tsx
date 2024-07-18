function Loading({
  fullscreen,
  children,
  customClasses,
}: {
  fullscreen?: boolean;
  children?: React.ReactNode;
  customClasses?: string;
}) {
  return (
    <>
      {fullscreen ? (
        <div
          data-testid="loading-ui-component"
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75"
        >
          <span className="loading loading-ring loading-lg"></span>
        </div>
      ) : (
        <div data-testid="loading-ui-component" className={`loading loading-lg ${customClasses}`}>
          {children}
        </div>
      )}
    </>
  );
}
export default Loading;
