import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { SkiSlope } from "../../../modules/SkiSlope";
import TextInput from "../../../common/TextInput";
import SelectInput from "../../../common/SelectInput";
import { Button } from "semantic-ui-react";
import { useStore } from "../../../stores/store";
import { v4 as uuid } from "uuid";

interface Props {
  initialSkiSlope?: SkiSlope;
  onFormSubmit: (skiSlope: SkiSlope) => void;
}

export default function SkiSlopeForm({ initialSkiSlope, onFormSubmit }: Props) {
  const { skiResortStore: { getSkiResortOptions }, skiSlopeStore: { getSkiSlopeColor } } = useStore();

  const validation = Yup.object({
    naziv: Yup.string().required('Required'),
    duzina: Yup.number().required('Required').min(100, 'Duzina mora da bude minimum 100m'),
    tezina: Yup.string().required('Required'),
    skijaliste: Yup.lazy(() =>
      initialSkiSlope === undefined ? Yup.string() : Yup.string().required('Required')
    )
  });

  const initialValues: SkiSlope = initialSkiSlope ?? {
    id: '',
    naziv: '',
    tezina: '',
    duzina: 0,
    skijaliste: ''
  };

  const handleFormSubmit = (skiSlope: SkiSlope) => {
    if (!skiSlope.id) {
      const newSlope: SkiSlope = {
        ...skiSlope,
        id: uuid()
      };
      onFormSubmit(newSlope);
    } else {
      onFormSubmit(skiSlope);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validation}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {({ handleSubmit, isSubmitting, isValid, dirty, values }) => (
        <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
          <TextInput name='naziv' placeholder="Naziv" />
          <SelectInput 
            options={getSkiSlopeColor} 
            placeholder="Tezina" 
            name='tezina' 
          />
          <TextInput name='duzina' placeholder="Duzina" type="number" />
          
            <SelectInput 
              options={getSkiResortOptions} 
              placeholder="Skijalista" 
              name='skijaliste' 
            />
          <Button
            disabled={isSubmitting || !dirty || !isValid}
            floated='right'
            positive
            type="submit"
            content={initialSkiSlope ? 'Update' : 'Create'}
          />
        </Form>
      )}
    </Formik>
  );
}
