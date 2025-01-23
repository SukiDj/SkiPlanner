import { Form, Formik } from "formik";
import * as Yup from 'yup';
import { SkiSlope } from "../../../modules/SkiSlope";
import TextInput from "../../../common/TextInput";
import SelectInput from "../../../common/SelectInput";
import { Button } from "semantic-ui-react";
import { useStore } from "../../../stores/store";
import {v4 as uuid} from "uuid";


export default function SkiSlopeForm() {

    const {skiResortStore:{getSkiResortOptions}, skiSlopeStore:{getSkiSlopeColor, create}} = useStore();

    const validation = Yup.object({
        naziv: Yup.string().required('Required'),
        duzina: Yup.number().required('Required'),
        tezina: Yup.string().required('Required'),
        skijaliste: Yup.string().required('Required')
})



    function hangleFormSubmit(skiSlope: SkiSlope){
        const newSlope : SkiSlope = {
            ...skiSlope,
            id : uuid()
        }
        create(skiSlope.skijaliste!,newSlope);
    }
   
    
   

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
            <SelectInput options={getSkiSlopeColor} placeholder="Tezina" name='tezina'/>
            <TextInput name='duzina' placeholder="Duzina" type="number"/>
            <SelectInput options={getSkiResortOptions} placeholder="Skijalista" name='skijaliste'/>
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
