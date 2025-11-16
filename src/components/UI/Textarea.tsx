import './Textarea.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className="textarea-group">
      {label && <label className="textarea-label">{label}</label>}
      <textarea
        className={`textarea ${error ? 'textarea-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="textarea-error-message">{error}</span>}
    </div>
  );
}

