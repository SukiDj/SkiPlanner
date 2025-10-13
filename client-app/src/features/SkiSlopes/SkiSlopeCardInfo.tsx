import { Button, Card, CardContent, CardDescription, CardHeader, CardMeta, Modal } from "semantic-ui-react";
import { SkiSlope } from "../../modules/SkiSlope";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import SkiSlopeForm from "../CreatePage/Forms/SkiSlopeForm";
import { v4 as uuid } from 'uuid';

interface SkiSlopeCardInfoProps {
    index : number;
    skiSlope: SkiSlope;
  }

function SkiSlopeCardInfo({index, skiSlope}:SkiSlopeCardInfoProps) {
  const { skiSlopeStore, userStore } = useStore();
  const { setSelectedSlope, openForm, update, closeForm, deleteSkiSlope } = skiSlopeStore;
  const {isEmploye} = userStore;

  const handleSlopeSubmit = (slope: SkiSlope) => {
  
    update(slope.id, slope);
  
  closeForm();  
};

  return (
    <>
    <Card>
        <CardContent index={index}>
        <CardHeader>{skiSlope.naziv}</CardHeader>
        <CardMeta>{skiSlope.duzina}</CardMeta>
        <CardDescription>
            Matthew is a pianist living in Nashville.
        </CardDescription>
        {isEmploye &&<>
        <Button
          onClick={() => {
            setSelectedSlope(skiSlope);
            openForm();
          }}
        >
          Izmeni
        </Button>
        <Button
          size="small"
          color="red"
          content="Obrisi"
          onClick={() => deleteSkiSlope(skiSlope)}
          />
        </>}
        
        </CardContent>
    </Card>
    {skiSlopeStore.editMode && (
  <Modal open={skiSlopeStore.editMode} onClose={skiSlopeStore.closeForm} size="small" dimmer="blurring">
    <Modal.Content>
      <SkiSlopeForm 
        initialSkiSlope={skiSlopeStore.selectedSlope} 
        onFormSubmit={handleSlopeSubmit} 
      />
    </Modal.Content>
  </Modal>
)}
    </>
  )
}
export default observer(SkiSlopeCardInfo);