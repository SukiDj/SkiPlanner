import { useField } from "formik";
import { Form, Select } from "semantic-ui-react";

interface Props{
    placeholder : string;
    name : string;
    options: any;
    label?:string;
    type?:string;
}
export default function SelectInput(props:Props) {
    const [field, meta, helpers] = useField(props);
    return (
      <Form.Field error={meta.touched && !!meta.error}>
        <label>{props.label}</label>
        <Select 
            clearable
            options={props.options}
            value={field.value || null}
            onChange={(_,d)=> helpers.setValue(d.value)}
            onBlur={()=>helpers.setTouched(true)}
            placeholder={props.placeholder}
         />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </Form.Field>
    );
}
