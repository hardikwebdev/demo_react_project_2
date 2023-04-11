import React from "react";
import { Form } from "react-bootstrap";
import { Field } from "formik";

const FormSelectField = ({
  as,
  md,
  controlId,
  label,
  name,
  type,
  inputGroupPrepend,
  children,
  style,
  onChange
}) => {
  return (
    <Field
      name={name}
      render={({ field, form }) => {
        const isValid = !form.errors[field.name];
        const isInvalid = form.touched[field.name] && !isValid;
        return (
          <Form.Group as={as} md={md} controlId={controlId}>
            <Form.Label style={{fontWeight: 600}}>{label}</Form.Label>
            {/* <InputGroup>
              {inputGroupPrepend} */}
              <Form.Control
                {...field}
                onChange={onChange}
                style={isValid ? style : {...style, appearance: "none"}}
                type={type}
                // isValid={form.touched[field.name] && isValid}
                isInvalid={isInvalid}
                feedback={form.errors[field.name]}
                as="select"
                multiple={field.multiple}
              >
                {children}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {form.errors[field.name]}
              </Form.Control.Feedback>
            {/* </InputGroup> */}
          </Form.Group>
        );
      }}
    />
  );
};

FormSelectField.defaultProps = {
  type: "select",
  inputGroupPrepend: null
};

export default FormSelectField;
