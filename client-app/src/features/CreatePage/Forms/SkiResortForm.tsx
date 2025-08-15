import React, { useEffect } from 'react';
import { Grid, Segment, Button, Divider, GridColumn } from 'semantic-ui-react';
import Map from '../../Map/Map';
import TextInput from '../../../common/TextInput';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { SkiResort } from '../../../modules/SkiResort';
import { useStore } from '../../../stores/store';

interface Props {
  initialSkiResort?: SkiResort;
  onFormSubmit: (skiResort: SkiResort) => void;
}

export default function SkiResortForm({ initialSkiResort, onFormSubmit }: Props) {
  const { mapStore: { setIsCreating } } = useStore();
  const {skiResortStore:{loading}} = useStore();
  useEffect(() => {
    setIsCreating(true);
  }, [setIsCreating]);

  const validation = Yup.object({
    ime: Yup.string().required('Unesite ime skijališta'),
    popularnost: Yup.number().required('Unesite popularnost').min(1, 'Popularnost mora da bude minimum 1'),
    cenaSkiPasa: Yup.number().required('Unesite cenu ski pasa').min(500, 'Cena ski pasa mora da bude veća od 500din'),
    brojStaza: Yup.number().required('Unesite broj staza').min(1, 'Broj staza mora da bude minimum 1'),
    lat: Yup.number().required('Obeležite skijalište na mapi'),
    lng: Yup.number().required('Obeležite skijalište na mapi'),
  });

  const initialValues: SkiResort = initialSkiResort ?? {
    id: '',
    ime: '',
    popularnost: 0,
    cenaSkiPasa: 0,
    brojStaza: 0,
    lat: 0,
    lng: 0,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validation}
      onSubmit={(values) => onFormSubmit(values)}
      enableReinitialize
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
                  disabled={!isValid  || values.lat === 0 || values.lng === 0}
                  positive
                  type="submit"
                  content={initialSkiResort ? "Izmeni" : "Kreiraj"}
                  loading={loading}
                />
              </Grid.Column>
            </Grid>
          </Segment>
        </Form>
      )}
    </Formik>
  );
}
