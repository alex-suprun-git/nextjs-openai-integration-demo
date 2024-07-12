function Loading({
  children,
  customClasses,
}: {
  children?: React.ReactNode;
  customClasses?: string;
}) {
  return (
    <div data-testid="loading-ui-component" className={`loading loading-lg ${customClasses}`}>
      {children}
    </div>
  );
}
export default Loading;
