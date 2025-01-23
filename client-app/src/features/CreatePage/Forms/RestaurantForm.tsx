import React, { useEffect } from 'react'
import { useStore } from '../../../stores/store';
import {v4 as uuid} from "uuid";
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Button, Divider, Grid, GridColumn, Segment } from 'semantic-ui-react';
import TextInput from '../../../common/TextInput';
import Map from '../../Map/Map';
import { Restaurant } from '../../../modules/Restaurant';
import SelectInput from '../../../common/SelectInput';



export default function RestaurantForm() {
  const{restaurantStore:{createRestaurant}, mapStore:{setIsCreating}, skiResortStore:{getSkiResortOptions}} =useStore();

    useEffect(()=>{
      setIsCreating(true);
    },[setIsCreating])

    const validation = Yup.object({
        naziv: Yup.string().required('Unesite naziv restorana'),
        tipKuhinje: Yup.string().required('Unesite tip kuhinje'),
        ocena: Yup.number().required('Unesite ocenu'),
        prosecnaCena : Yup.number().required('Unesite prosecnu cenu'),
        lat: Yup.number().required('Obelezite skijaliste na mapi'),
        lng: Yup.number().required('Obelezite skijaliste na mapi'),
        skijaliste: Yup.string().required('Izaberite skijaliste')
      });
      const handleFormSubmit = (values: Restaurant) => {
          const formattedValues: Restaurant = {
            ...values,
            id: uuid()
          };
          console.log('Submitted values:', formattedValues);
          createRestaurant(values.skijaliste!,formattedValues);
        };
      
  return (
    <Formik
      initialValues={{
        naziv: '',
        tipKuhinje: '',
        ocena: 0,
        prosecnaCena: 0,
        lat: 0,
        lng: 0,
        skijaliste: ''
      }}
      validationSchema={validation}
      onSubmit={values => handleFormSubmit(values)}
    >
      {({ handleSubmit, setFieldValue, isValid, dirty, values }) => (
        <Form className="ui form" onSubmit={handleSubmit}>
          <Segment>
            <Grid columns={2}>
              <GridColumn>
              <TextInput name="naziv" placeholder="Naziv" />
              <TextInput name="tipKuhinje" placeholder="Tip kuhinje"  />
              <TextInput name="ocena" placeholder="Ocena" type="number" />
              <TextInput name="prosecnaCena" placeholder="Prosecna cena" type="number" />
              <SelectInput options={getSkiResortOptions} placeholder="Skijalista" name='skijaliste'/>
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
