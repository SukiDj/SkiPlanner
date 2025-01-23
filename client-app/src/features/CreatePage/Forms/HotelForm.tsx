import React, { useEffect } from 'react'
import { useStore } from '../../../stores/store';
import * as Yup from 'yup';
import {v4 as uuid} from "uuid";
import { Hotel } from '../../../modules/Hotel';
import { Form, Formik } from 'formik';
import { Button, Divider, Grid, GridColumn, Segment } from 'semantic-ui-react';
import TextInput from '../../../common/TextInput';
import Map from '../../Map/Map';



export default function HotelForm() {

  const{hotelStore:{createHotel}, mapStore:{setIsCreating}} =useStore();
  
    useEffect(()=>{
      setIsCreating(true);
    },[setIsCreating])

    const validation = Yup.object({
        ime: Yup.string().required('Unesite ime hotela'),
        ocena: Yup.number().required('Unesite ocenu'),
        udaljenost : Yup.number().required('Unesite udaljenost hotela od skijalista'),
        cenaDvokrevetneSobe: Yup.number().required('Unesite cenu dvokrevetne sobe'),
        cenaTrokrevetneSobe: Yup.number().required('Unesite cenu trokrevetne sobe'),
        cenaCetvorokrevetneSobe: Yup.number().required('Unesite cenu cetvorokrevetne sobe'),
        cenaPetokrevetneSobe: Yup.number().required('Unesite cenu petokrevetne sobe'),
        lat: Yup.number().required('Obelezite skijaliste na mapi'),
        lng: Yup.number().required('Obelezite skijaliste na mapi'),
      });
      const handleFormSubmit = (values: Hotel) => {
          const formattedValues: Hotel = {
            ...values,
            id: uuid()
          };
          console.log('Submitted values:', formattedValues);
          createHotel(formattedValues);
        };
      
  return (
    <Formik
      initialValues={{
        ime: '',
        ocena: 0,
        udaljenost: 0,
        cenaDvokrevetneSobe: 0,
        cenaTrokrevetneSobe: 0,
        cenaCetvorokrevetneSobe: 0,
        cenaPetokrevetneSobe: 0,
        lat: 0,
        lng: 0,
      }}
      validationSchema={validation}
      onSubmit={values => handleFormSubmit(values)}
    >
      {({ handleSubmit, setFieldValue, isValid, dirty, values }) => (
        <Form className="ui form" onSubmit={handleSubmit}>
          <Segment>
            <Grid columns={2}>
              <GridColumn>
              <TextInput name="ime" placeholder="Naziv" />
              <TextInput name="ocena" placeholder="Ocena" type="number" />
              <TextInput name="udaljenost" placeholder="Udaljenost" type="number" />
              <TextInput name="cenaDvokrevetneSobe" placeholder="Udaljenost" type="number" />
              <TextInput name="cenaTrokrevetneSobe" placeholder="Udaljenost" type="number" />
              <TextInput name="cenaCetvorokrevetneSobe" placeholder="Udaljenost" type="number" />
              <TextInput name="cenaPetokrevetneSobe" placeholder="Udaljenost" type="number" />
              </GridColumn>
              <Divider vertical></Divider>

              <Grid.Column>
                <Map
                  onLocationSelect={(lat, lng) => {
                    setFieldValue('lat', lat);
                    setFieldValue('lng', lng);
                  }}
                />
                <Button
              disabled={!isValid || !dirty || values.lat === 0 || values.lng === 0}
              positive
              type="submit"
              content="Create"
            />
              </Grid.Column>

            </Grid>
           

            
          </Segment>
        </Form>
      )}
    </Formik>
  )
}
