import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface Base {
  etiqueta: string;
  error?: string;
  ayuda?: string;
}

export const FormField = forwardRef<HTMLInputElement, Base & InputHTMLAttributes<HTMLInputElement>>(
  ({ etiqueta, error, ayuda, id, ...resto }, ref) => {
    const campoId = id ?? `campo-${resto.name}`;
    return (
      <div className="campo">
        <label htmlFor={campoId}>{etiqueta}</label>
        <input id={campoId} ref={ref} aria-invalid={!!error} {...resto} />
        {ayuda && !error && <span className="ayuda">{ayuda}</span>}
        {error && <span className="error" role="alert">{error}</span>}
      </div>
    );
  },
);
FormField.displayName = 'FormField';

export const FormSelect = forwardRef<HTMLSelectElement, Base & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }>(
  ({ etiqueta, error, ayuda, id, children, ...resto }, ref) => {
    const campoId = id ?? `campo-${resto.name}`;
    return (
      <div className="campo">
        <label htmlFor={campoId}>{etiqueta}</label>
        <select id={campoId} ref={ref} aria-invalid={!!error} {...resto}>{children}</select>
        {ayuda && !error && <span className="ayuda">{ayuda}</span>}
        {error && <span className="error" role="alert">{error}</span>}
      </div>
    );
  },
);
FormSelect.displayName = 'FormSelect';

export const FormTextarea = forwardRef<HTMLTextAreaElement, Base & TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ etiqueta, error, ayuda, id, ...resto }, ref) => {
    const campoId = id ?? `campo-${resto.name}`;
    return (
      <div className="campo">
        <label htmlFor={campoId}>{etiqueta}</label>
        <textarea id={campoId} ref={ref} aria-invalid={!!error} {...resto} />
        {ayuda && !error && <span className="ayuda">{ayuda}</span>}
        {error && <span className="error" role="alert">{error}</span>}
      </div>
    );
  },
);
FormTextarea.displayName = 'FormTextarea';
