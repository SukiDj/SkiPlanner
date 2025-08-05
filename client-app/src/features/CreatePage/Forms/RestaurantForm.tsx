import React, { useEffect } from 'react';
import { useStore } from '../../../stores/store';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Button, Divider, Grid, GridColumn, Segment } from 'semantic-ui-react';
import TextInput from '../../../common/TextInput';
import Map from '../../Map/Map';
import SelectInput from '../../../common/SelectInput';
import { Restaurant } from '../../../modules/Restaurant';

interface Props {
  initialRestaurant?: Restaurant;
  onFormSubmit: (restaurant: Restaurant) => void;
}

export default function RestaurantForm({ initialRestaurant, onFormSubmit }: Props) {
  const { mapStore: { setIsCreating }, skiResortStore: { getSkiResortOptions } } = useStore();

  useEffect(() => {
    setIsCreating(true);
  }, [setIsCreating]);

  const validation = Yup.object({
    naziv: Yup.string().required('Unesite naziv restorana'),
    tipKuhinje: Yup.string().required('Unesite tip kuhinje'),
    ocena: Yup.number().required('Unesite ocenu').min(1, 'Ocena nije ispravna'),
    prosecnaCena: Yup.number().required('Unesite prosečnu cenu').min(500, 'Prosečna cena mora da bude minimum 500din'),
    lat: Yup.number().required('Obeležite restoran na mapi'),
    lng: Yup.number().required('Obeležite restoran na mapi'),
    // Ako je create, skijaliste je obavezno, ako je edit - ne mora jer je već postavljeno
    skijaliste: initialRestaurant === undefined
      ? Yup.string().required('Izaberite skijalište')
      : Yup.string()
  });

  const initialValues: Restaurant = initialRestaurant ?? {
    id: '',
    naziv: '',
    tipKuhinje: '',
    ocena: 0,
    prosecnaCena: 0,
    lat: 0,
    lng: 0,
    skijaliste: ''
  };

  
  const handleFormSubmit = (values: Restaurant) => {
    const formattedValues: Restaurant = {
      ...values,
      id: values.id || uuid()
    };
    onFormSubmit(formattedValues);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validation}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {({ handleSubmit, setFieldValue, isValid, dirty, values }) => (
        <Form className="ui form" onSubmit={handleSubmit}>
          <Segment>
            <Grid columns={2}>
              <GridColumn>
                <TextInput name="naziv" placeholder="Naziv" />
                <TextInput name="tipKuhinje" placeholder="Tip kuhinje" />
                <TextInput name="ocena" placeholder="Ocena" type="number" />
                <TextInput name="prosecnaCena" placeholder="Prosečna cena" type="number" />
                  <SelectInput
                    options={getSkiResortOptions}
                    placeholder="Skijališta"
                    name="skijaliste"
                    
                  />
              </GridColumn>
              <Divider vertical />
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
                  content={initialRestaurant ? "Update" : "Create"}
                  style={{ marginTop: "1rem" }}
                />
              </Grid.Column>
            </Grid>
          </Segment>
        </Form>
      )}
    </Formik>
  );
}
