import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { SkiSlope } from "../../../modules/SkiSlope";
import TextInput from "../../../common/TextInput";
import SelectInput from "../../../common/SelectInput";
import { Button, Segment } from "semantic-ui-react";
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
  initialSkiSlope === undefined
    ? Yup.string().required("Required") // obavezno samo kod kreiranja
    : Yup.string() // nije obavezno u edit modu
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
    console.log("cao")
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
      {({  isSubmitting,  values }) => (
        <Form className='ui form'  autoComplete='off'>
            <Segment>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              {/* Leva kolona */}
              <div>
                <TextInput name="naziv" placeholder="Naziv" />
                <SelectInput
                  options={getSkiSlopeColor}
                  placeholder="Težina"
                  name="tezina"
                />
              </div>

              {/* Desna kolona */}
              <div>
                <TextInput
                  name="duzina"
                  placeholder="Dužina (u metrima)"
                  type="number"
                />
                {initialSkiSlope === undefined && (
                  <SelectInput
                    options={getSkiResortOptions}
                    placeholder="Skijalište"
                    name="skijaliste"
                  />
                )}
              </div>
            </div>
            <div style={{width:"100%", display:'flex', justifyContent:"right", marginTop:'5px'}}>
              <Button
                disabled={isSubmitting }
                positive
                type="submit"
                content={initialSkiSlope ? "Izmeni" : "Kreiraj"}
              />
            </div>
          </Segment>
        </Form>
      )}
    </Formik>
  );
}
