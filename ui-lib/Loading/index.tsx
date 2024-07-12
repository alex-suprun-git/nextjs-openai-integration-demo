function Loading({
  children,
  customClasses,
}: {
  children?: React.ReactNode;
  customClasses?: string;
}) {
  return <div className={`loading loading-lg ${customClasses}`}>{children}</div>;
}
export default Loading;
