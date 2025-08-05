import { Form, Formik } from "formik";
import { Button, Grid, GridColumn, Segment } from "semantic-ui-react";
import SelectInput from "../../../common/SelectInput";
import TextInput from "../../../common/TextInput";
import { useStore } from "../../../stores/store";
import * as Yup from 'yup';
import { Vacation } from "../../../modules/Vacation";

const VacationForm = () =>{

    

    const {skiResortStore, skiSlopeStore, vacationStore} = useStore();
    const {getSkiResortOptions} = skiResortStore;
    const {getSkiSlopeColor} = skiSlopeStore;
    const {filterAllVacations} = vacationStore;

    const onFormSubmit = (values: Vacation) =>{
        filterAllVacations(values);
    }


      const initialValues : Vacation = {
        nazivSkijalista : "",
        minBrojStaza : 0,
        tezina: "",
        minDuzinaStaze: 0,
        maxDuzinaStaze: 0,
        minOcenaHotela: 0,
        maxUdaljenostHotela: 0,
        brojDana: 0,
        brojOsoba: 0,
        maxBudzet: 0
      }

    return(
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onFormSubmit(values)}
      enableReinitialize
    >
      {({ handleSubmit, setFieldValue, isValid, dirty, values }) => (
        <Form className="ui form" onSubmit={handleSubmit}>
          <Segment>
            <Grid columns={3}>
              <GridColumn>
                <SelectInput options={getSkiResortOptions} placeholder="Naziv skijalista" name='nazivSkijalista' />
                <TextInput name="minBrojStaza" placeholder="Minimalni broj staza" type="number" />
                <SelectInput options={getSkiSlopeColor} placeholder="Tezina" name='tezina' />
              </GridColumn>
              <GridColumn>
                <TextInput name="minDuzinaStaze" placeholder="Minimalna duzina staze" type="number"/>
                <TextInput name="maxDuzinaStaze" placeholder="Maximalna duzina staze" type="number" />
                <TextInput name="minOcenaHotela" placeholder="Minimalna ocena hotela" type="number" />
              </GridColumn>
              <GridColumn>
                <TextInput name="maxUdaljenostHotela" placeholder="Maximalna udaljenost hotela" type="number" />
                <TextInput name="brojDana" placeholder="Broj dana" type="number" />
                <TextInput name="brojOsoba" placeholder="Broj osoba" type="number" />
                <TextInput name="maxBudzet" placeholder="Budzet" type="number" />
              </GridColumn>
              
                
            </Grid>
            <Grid style={{justifyContent: "center"}}>
                <Button
                  positive
                  type="submit"
                  content="Isplaniraj"
                />
                </Grid>
          </Segment>
        </Form>
      )}
    </Formik>
    );
}

export default VacationForm;