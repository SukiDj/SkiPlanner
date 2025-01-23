import { useField } from "formik";

interface Props {
    name: string; // Name for form field binding
    label?: string; // Optional label for the checkbox
    
}

export default function CheckBox(props:Props) {
    const [field, meta] = useField({ ...props, type: 'checkbox' });
    return (
      <div>
        <label>
          <input type="checkbox" {...field} {...props} />
        </label>
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    );
}
