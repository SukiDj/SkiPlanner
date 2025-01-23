import React, { useEffect, useState } from 'react';
import { Grid, Segment, Button, Divider, GridColumn } from 'semantic-ui-react';
import Map from '../../Map/Map';
import TextInput from '../../../common/TextInput';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SkiResort } from '../../../modules/SkiResort';
import { useStore } from '../../../stores/store';
import {v4 as uuid} from "uuid";


export default function SkiResortForm() {
  const{skiResortStore:{createSkiResort}, mapStore:{setIsCreating}} =useStore();

  useEffect(()=>{
    setIsCreating(true);
  },[setIsCreating])

  
  const validation = Yup.object({
    ime: Yup.string().required('Unesite ime skijalista'),
    popularnost: Yup.number().required('Unesite popularnost'),
    cenaSkiPasa: Yup.number().required('Unesite cenu ski pasa'),
    brojStaza: Yup.number().required('Unesite broj staza'),
    lat: Yup.number().required('Obelezite skijaliste na mapi'),
    lng: Yup.number().required('Obelezite skijaliste na mapi'),
  });

  const handleFormSubmit = (values: SkiResort) => {
    const formattedValues: SkiResort = {
      ...values,
      id: uuid()
    };
    console.log('Submitted values:', formattedValues);
    createSkiResort(formattedValues);
  };

  return (
    <Formik
      initialValues={{
        ime: '',
        popularnost: 0,
        cenaSkiPasa: 0,
        brojStaza: 0,
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
              <TextInput name="ime" placeholder="Ime" />
              <TextInput name="popularnost" placeholder="Popularnost" type="number" />
              <TextInput name="cenaSkiPasa" placeholder="Cena ski pasa" type="number" />
              <TextInput name="brojStaza" placeholder="Broj staza" type="number" />
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
  );
}
