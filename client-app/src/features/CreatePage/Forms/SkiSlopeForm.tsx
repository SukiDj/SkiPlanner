import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { SkiSlope } from "../../../modules/SkiSlope";
import TextInput from "../../../common/TextInput";
import SelectInput from "../../../common/SelectInput";
import { Button } from "semantic-ui-react";
import { useStore } from "../../../stores/store";
import { SkiResort } from "../../../modules/SkiResort";
import { text } from "motion/react-client";

export default function SkiSlopeForm() {

    const {skiResortStore:{getAllResorts}} = useStore();

    const validation = Yup.object({
        naziv: Yup.string().required('Required'),
        duzina: Yup.number().required('Required'),
        tezina: Yup.string().required('Required'),
        skijaliste: Yup.string().required('Required')
})

    const skiResortOptions = Array.from(getAllResorts.values()).map((skiResort : SkiResort) =>({
        key : skiResort.id,
        text : skiResort.ime,
        value : skiResort.id
    }))

    function hangleFormSubmit(skiSlope: SkiSlope){
        console.log(skiSlope)
    }
    const tezine : string[] = [ "plava", "crvena", "zelena", "crna"]
    
    const options = tezine.map((value) => ({
        key: value, // unique key for React
        text: value, // text displayed in the dropdown
        value: value, // value for selection
      }));

  return (
    <Formik
        initialValues={{
            id: '',
            naziv: '',
            tezina: '',
            duzina: 0,
            skijaliste: ''
        }}
        validationSchema={validation}
        onSubmit={values=>hangleFormSubmit(values)}
    >
    {({handleSubmit, isSubmitting, isValid, dirty})=>(
        <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
            <TextInput name='naziv' placeholder="Naziv"/>
            <SelectInput options={options} placeholder="Tezina" name='tezina'/>
            <TextInput name='duzina' placeholder="Duzina" type="number"/>
            <SelectInput options={skiResortOptions} placeholder="Skijalista" name='skijaliste'/>
            <Button
                disabled={isSubmitting || !dirty || !isValid}
                floated='right'
                positive
                type="submit"
                content='Submit'
            />
        </Form>
    )}
    </Formik>
  )
}
