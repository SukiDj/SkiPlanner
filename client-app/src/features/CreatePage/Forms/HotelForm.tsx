import { useEffect } from 'react';
import { useStore } from '../../../stores/store';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Button, Divider, Grid, GridColumn, Segment } from 'semantic-ui-react';
import TextInput from '../../../common/TextInput';
import Map from '../../Map/Map';
import SelectInput from '../../../common/SelectInput';
import { Hotel } from '../../../modules/Hotel';

interface Props {
  initialHotel?: Hotel;
  onFormSubmit: (hotel: Hotel) => void;
}

export default function HotelForm({ initialHotel, onFormSubmit }: Props) {
  const { mapStore: { setIsCreating }, skiResortStore: { getSkiResortOptions } } = useStore();

  useEffect(() => {
    setIsCreating(true);
  }, [setIsCreating]);

  const validation = Yup.object({
    ime: Yup.string().required('Unesite ime hotela'),
    ocena: Yup.number().required('Unesite ocenu').min(1, 'Ocena nije pravilno unesena'),
    udaljenost: Yup.number().required('Unesite udaljenost hotela od skijališta').min(10, 'Udaljenost mora da bude minimum 10m'),
    cenaDvokrevetneSobe: Yup.number().required('Unesite cenu dvokrevetne sobe').min(1000, 'Cena mora da bude minimum 1000 din'),
    cenaTrokrevetneSobe: Yup.number().required('Unesite cenu trokrevetne sobe').min(1000, 'Cena mora da bude minimum 1000 din'),
    cenaCetvorokrevetneSobe: Yup.number().required('Unesite cenu četvorokrevetne sobe').min(1000, 'Cena mora da bude minimum 1000 din'),
    cenaPetokrevetneSobe: Yup.number().required('Unesite cenu petokrevetne sobe').min(1000, 'Cena mora da bude minimum 1000 din'),
    lat: Yup.number().required('Obeležite hotel na mapi'),
    lng: Yup.number().required('Obeležite hotel na mapi'),
    skijaliste: Yup.lazy(() =>
    initialHotel !== undefined ? Yup.string() : Yup.string().required('Izaberite skijalište')
  )
  });

  const initialValues: Hotel = initialHotel ?? {
    id: '',  
    ime: '',
    ocena: 0,
    udaljenost: 0,
    cenaDvokrevetneSobe: 0,
    cenaTrokrevetneSobe: 0,
    cenaCetvorokrevetneSobe: 0,
    cenaPetokrevetneSobe: 0,
    lat: 0,
    lng: 0,
    skijaliste: ''
  };
  console.log(initialValues.skijaliste)
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validation}
      onSubmit={(values) => onFormSubmit(values)}
      enableReinitialize
    >
      {({ handleSubmit, setFieldValue, isValid, dirty, values, resetForm }) => (
        <Form className="ui form" onSubmit={handleSubmit}>
          <Segment>
            <Grid columns={2}>
              <GridColumn>
                <TextInput name="ime" placeholder="Naziv" />
                <TextInput name="ocena" placeholder="Ocena" type="number" />
                <TextInput name="udaljenost" placeholder="Udaljenost" type="number" />
                <TextInput name="cenaDvokrevetneSobe" placeholder="Cena dvokrevetne sobe" type="number" />
                <TextInput name="cenaTrokrevetneSobe" placeholder="Cena trokrevetne sobe" type="number" />
                <TextInput name="cenaCetvorokrevetneSobe" placeholder="Cena četvorokrevetne sobe" type="number" />
                <TextInput name="cenaPetokrevetneSobe" placeholder="Cena petokrevetne sobe" type="number" />
                {initialHotel === undefined && (
<SelectInput options={getSkiResortOptions} placeholder="Skijališta" name='skijaliste' />
                )}
                
              </GridColumn>
              <Divider vertical></Divider>
              <Grid.Column>
                <Map
                  onLocationSelect={(lat, lng) => {
                    setFieldValue('lat', lat);
                    setFieldValue('lng', lng);
                  }}
                  
                />
              </Grid.Column>
              <div style={{width:"100%", display:'flex', justifyContent:"right", marginBottom:'5px'}}>
                <Button
                  disabled={!isValid || !dirty || values.lat === 0 || values.lng === 0}
                  positive
                  type="submit"
                  content={initialHotel != undefined ? "Izmeni" : "Kreiraj"}
                />
              </div>
            </Grid>
          </Segment>
        </Form>
      )}
    </Formik>
  );
}
