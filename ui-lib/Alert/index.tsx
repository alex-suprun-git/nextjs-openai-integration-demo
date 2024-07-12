import { FaCheckCircle } from 'react-icons/fa';
import { IoWarningOutline } from 'react-icons/io5';

function Alert({
  children,
  type,
}: {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'error' | 'success';
}) {
  const alertTypeClass = {
    info: 'alert alert-info',
    warning: 'alert alert-warning',
    error: 'alert alert-error text-white bg-red-800',
    success: 'alert alert-success',
  }[type || 'info'];

  return (
    <div role="alert" className={`${alertTypeClass} mb-6`}>
      {type === 'success' ? <FaCheckCircle /> : <IoWarningOutline />}
      <span>{children}</span>
    </div>
  );
}
export default Alert;
