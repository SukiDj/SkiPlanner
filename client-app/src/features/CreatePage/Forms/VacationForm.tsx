import { Form, Formik } from "formik";
import { Button, Grid, GridColumn, Segment } from "semantic-ui-react";
import SelectInput from "../../../common/SelectInput";
import TextInput from "../../../common/TextInput";
import { useStore } from "../../../stores/store";
import * as Yup from 'yup';
import { Vacation } from "../../../modules/Vacation";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

const VacationForm = () =>{
    const {skiResortStore, skiSlopeStore, vacationStore} = useStore();
    const {getSkiResortOptions} = skiResortStore;
    const {getSkiSlopeColor} = skiSlopeStore;
    const {filterAllVacations, deleteAllVacations, loadingVacations} = vacationStore;

    const location = useLocation();

    useEffect(() => {
        deleteAllVacations();
    }, [location.pathname]); 

    const onFormSubmit = (values: Vacation) =>{
        filterAllVacations(values);
    }


      const initialValues : Vacation = {
        idSkijalista : "",
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
console.log(loadingVacations)
     const validationScheme = Yup.object({
  brojDana: Yup.number()
    .moreThan(0, "Unesite broj dana veći od nule")
    .required("Unesite broj dana"),
  brojOsoba: Yup.number()
    .moreThan(0, "Unesite broj osoba veći od nule")
    .required("Unesite broj osoba"),
  maxBudzet: Yup.number()
    .moreThan(0, "Unesite budzet veći od nule")
    .required("Unesite budzet"),
});

    return(
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onFormSubmit(values)}
      enableReinitialize
      validationSchema={validationScheme}
    >
      {({ handleSubmit, setFieldValue, isValid, dirty, values }) => (
        <Form className="ui form" onSubmit={handleSubmit}>
          <Segment>
            <Grid columns={3}>
              <GridColumn>
                <SelectInput options={getSkiResortOptions} placeholder="Naziv skijalista" name='idSkijalista' />
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
                  disabled={!isValid || !dirty}
                  loading={loadingVacations}
                />
                </Grid>
          </Segment>
        </Form>
      )}
    </Formik>
    );
}

export default observer(VacationForm);