import { FaCheckCircle } from 'react-icons/fa';
import { IoWarningOutline } from 'react-icons/io5';

function Alert({
  testId,
  children,
  type,
}: {
  testId?: string;
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'error' | 'success';
}) {
  const alertTypeClass = {
    info: 'alert alert-info',
    warning: 'alert alert-warning',
    error: 'alert alert-error text-stone-300 bg-red-800',
    success: 'alert alert-success',
  }[type || 'info'];

  return (
    <div data-testid={testId || 'alert'} role="alert" className={`${alertTypeClass} mb-6`}>
      {type === 'success' ? <FaCheckCircle /> : <IoWarningOutline />}
      <span>{children}</span>
    </div>
  );
}
export default Alert;
